'use server';

import { auth } from '@clerk/nextjs/server';
import { eq, and, gte, lte, desc } from 'drizzle-orm';
import { db } from '@/lib/db';
import { timeEntries, expenses, projects, users } from '@/lib/db/schema';
import { getUserOrganization } from '@/lib/dashboard/queries';

export type ExportData = {
  entries: Array<{
    id: number;
    date: Date;
    description: string | null;
    duration: number | null; // seconds
    projectName: string;
    userName: string | null;
  }>;
  expenses: Array<{
    id: number;
    date: Date;
    description: string;
    amount: string;
    projectName: string;
    userName: string | null;
  }>;
  summary: {
    totalDuration: number;
    totalAmount: number;
  };
};

type ExportFilters = {
  from: Date;
  to: Date;
  projectId?: string; // 'all' or number string
};

export async function generateExportData(filters: ExportFilters): Promise<{ error?: string; data?: ExportData }> {
  const { userId } = await auth();
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const membership = await getUserOrganization(userId);
  if (!membership) {
    return { error: 'No organization found' };
  }

  try {
    // Base conditions
    const orgCondition = eq(projects.organizationId, membership.organizationId);
    const dateCondition = and(
      gte(timeEntries.startTime, filters.from),
      lte(timeEntries.startTime, filters.to)
    );
    const expenseDateCondition = and(
      gte(expenses.date, filters.from),
      lte(expenses.date, filters.to)
    );

    let projectCondition = undefined;
    if (filters.projectId && filters.projectId !== 'all') {
      projectCondition = eq(projects.id, Number(filters.projectId));
    }

    // Fetch Time Entries
    const entries = await db
      .select({
        id: timeEntries.id,
        date: timeEntries.startTime,
        description: timeEntries.description,
        duration: timeEntries.duration,
        projectName: projects.name,
        userName: users.name,
      })
      .from(timeEntries)
      .innerJoin(projects, eq(projects.id, timeEntries.projectId))
      .leftJoin(users, eq(users.id, timeEntries.userId))
      .where(
        and(
          orgCondition,
          dateCondition,
          projectCondition ? eq(timeEntries.projectId, Number(filters.projectId)) : undefined
        )
      )
      .orderBy(desc(timeEntries.startTime));

    // Fetch Expenses
    const expenseRows = await db
      .select({
        id: expenses.id,
        date: expenses.date,
        description: expenses.description,
        amount: expenses.amount,
        projectName: projects.name,
        userName: users.name,
      })
      .from(expenses)
      .innerJoin(projects, eq(projects.id, expenses.projectId))
      .leftJoin(users, eq(users.id, expenses.userId))
      .where(
        and(
          orgCondition,
          expenseDateCondition,
          projectCondition ? eq(expenses.projectId, Number(filters.projectId)) : undefined
        )
      )
      .orderBy(desc(expenses.date));

    const totalDuration = entries.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const totalAmount = expenseRows.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);

    return {
      data: {
        entries,
        expenses: expenseRows,
        summary: {
          totalDuration,
          totalAmount,
        },
      },
    };
  } catch (error) {
    console.error('Export generation failed:', error);
    return { error: 'Failed to generate export data' };
  }
}

