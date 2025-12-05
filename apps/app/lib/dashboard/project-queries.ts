import { eq, and, desc, sql } from 'drizzle-orm';
import { db } from '@/lib/db';
import { projects, timeEntries, expenses, users, organizationMembers } from '@/lib/db/schema';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { is } from 'date-fns/locale';

// Reuse formatters
const currencyFormatter = new Intl.NumberFormat("is-IS", {
  style: "currency",
  currency: "ISK",
  maximumFractionDigits: 0,
});

const hoursFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function secondsToHours(seconds: number) {
  return seconds / 3600;
}

export async function getProjectDetails(projectId: number, userId: string) {
  // 1. Verify access
  const membership = await db
    .select({ organizationId: organizationMembers.organizationId })
    .from(organizationMembers)
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  if (!membership[0]) return null;

  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.organizationId, membership[0].organizationId)
    ),
    with: {
      organization: true,
    }
  });

  if (!project) return null;

  // 2. Get Aggregates
  const [aggregates] = await db
    .select({
      totalSeconds: sql<number>`COALESCE(SUM(${timeEntries.duration}), 0)`,
      totalExpenses: sql<number>`COALESCE(SUM(${expenses.amount}), 0)`,
      totalEntries: sql<number>`COUNT(${timeEntries.id})`,
    })
    .from(timeEntries)
    .leftJoin(expenses, eq(expenses.projectId, projectId)) // This join is wrong for sums, need separate queries
    .where(eq(timeEntries.projectId, projectId));
    
  // Correct approach for aggregates: separate queries
  const [timeAgg] = await db
    .select({ totalSeconds: sql<number>`COALESCE(SUM(${timeEntries.duration}), 0)` })
    .from(timeEntries)
    .where(eq(timeEntries.projectId, projectId));

  const [expenseAgg] = await db
    .select({ totalAmount: sql<number>`COALESCE(SUM(${expenses.amount}), 0)` })
    .from(expenses)
    .where(eq(expenses.projectId, projectId));

  // 3. Get Recent Time Entries
  const entries = await db
    .select({
      id: timeEntries.id,
      description: timeEntries.description,
      startTime: timeEntries.startTime,
      endTime: timeEntries.endTime,
      duration: timeEntries.duration,
      userName: users.name,
      userAvatar: users.imageUrl,
    })
    .from(timeEntries)
    .leftJoin(users, eq(users.id, timeEntries.userId))
    .where(eq(timeEntries.projectId, projectId))
    .orderBy(desc(timeEntries.startTime))
    .limit(20);

  // 4. Get Expenses
  const projectExpenses = await db
    .select({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      date: expenses.date,
      userName: users.name,
    })
    .from(expenses)
    .leftJoin(users, eq(users.id, expenses.userId))
    .where(eq(expenses.projectId, projectId))
    .orderBy(desc(expenses.date))
    .limit(20);

  return {
    ...project,
    stats: {
      totalHours: hoursFormatter.format(secondsToHours(Number(timeAgg?.totalSeconds ?? 0))),
      totalExpenses: currencyFormatter.format(Number(expenseAgg?.totalAmount ?? 0)),
      billableAmount: currencyFormatter.format(secondsToHours(Number(timeAgg?.totalSeconds ?? 0)) * 20000), // Default rate
    },
    entries: entries.map(e => ({
      ...e,
      formattedDate: format(e.startTime, 'd. MMM yyyy', { locale: is }),
      formattedDuration: hoursFormatter.format(secondsToHours(e.duration ?? 0)) + ' klst',
    })),
    expenses: projectExpenses.map(e => ({
      ...e,
      formattedDate: format(e.date, 'd. MMM yyyy', { locale: is }),
      formattedAmount: currencyFormatter.format(Number(e.amount)),
    }))
  };
}

