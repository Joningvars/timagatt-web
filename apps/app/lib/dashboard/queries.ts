import { format, formatDistanceToNow, subMonths, subWeeks, startOfWeek, endOfWeek, subDays, addDays } from "date-fns";
import { eq, desc, sql, and, gte } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  expenses,
  organizationMembers,
  organizations,
  projects,
  timeEntries,
  users,
} from "@/lib/db/schema";
import {
  ActivityItem,
  ChartMonth,
  ChartStackPoint,
  ChartStackConfig,
  Client,
  RecentEntry,
  SidebarNavSection,
  StatCard,
  CLIENT_COLOR_CLASSES,
  NAV_LINKS,
  STAT_CARD_STYLES,
  DASHBOARD_RECENT_ENTRIES_LIMIT,
} from "@/lib/dashboard/data";
import { defaultLocale } from "@/src/i18n/config";

const DEFAULT_RATE = 20000;

const STATUS_COLORS = {
  billed: {
    labelKey: "table.statuses.billed",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    dot: "bg-emerald-500",
  },
  unbilled: {
    labelKey: "table.statuses.unbilled",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    dot: "bg-amber-500",
  },
  nonBillable: {
    labelKey: "table.statuses.nonBillable",
    color: "bg-slate-100 text-slate-600 border-slate-200",
    dot: "bg-slate-400",
  },
} as const;

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

function durationSeconds(row: {
  duration: number | null;
  startTime: Date;
  endTime: Date | null;
}) {
  if (row.duration != null) return Math.max(0, row.duration);
  if (row.endTime) {
    return Math.max(
      0,
      Math.floor((row.endTime.getTime() - row.startTime.getTime()) / 1000),
    );
  }
  return 0;
}

function initialsFrom(value: string) {
  const parts = value.split(" ").filter(Boolean);
  if (!parts.length) return value.slice(0, 2).toUpperCase();
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? parts[0]?.[1] ?? "");
}

function formatDate(date: Date) {
  return format(date, "dd MMM");
}

function localeHref(locale: string, segment: string) {
  const normalizedSegment = segment.startsWith("/") ? segment : `/${segment}`;
  return `/${locale}${normalizedSegment}`.replace(/\/{2,}/g, "/");
}

export async function getSidebarSections(locale: string, activeKey: string): Promise<SidebarNavSection[]> {
  return [
    {
      titleKey: "sidebar.tracking",
      items: NAV_LINKS.map((item) => ({
        ...item,
        href: localeHref(locale, item.segment),
        active: item.key === activeKey,
      })),
    },
  ];
}

export async function getUserOrganization(userId: string) {
  const [membership] = await db
    .select({
      organizationId: organizationMembers.organizationId,
      organizationName: organizations.name,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
    .where(eq(organizationMembers.userId, userId))
    .limit(1);

  return membership ?? null;
}

export async function getProjectsForOrganization(organizationId: number) {
  const rows = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      totalEntries: sql<number>`COUNT(${timeEntries.id})`,
      totalSeconds: sql<number>`COALESCE(SUM(${timeEntries.duration}),0)`,
      totalExpenses: sql<number>`COALESCE(SUM(${expenses.amount}),0)`,
    })
    .from(projects)
    .leftJoin(timeEntries, eq(timeEntries.projectId, projects.id))
    .leftJoin(expenses, eq(expenses.projectId, projects.id))
    .where(eq(projects.organizationId, organizationId))
    .groupBy(projects.id)
    .orderBy(desc(projects.id));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    totalEntries: Number(row.totalEntries ?? 0),
    totalHours: hoursFormatter.format(secondsToHours(Number(row.totalSeconds ?? 0))),
    totalExpenses: currencyFormatter.format(Number(row.totalExpenses ?? 0)),
  }));
}

export async function getSidebarClients(organizationId: number): Promise<Client[]> {
  const rows = await db
    .select({
      name: projects.name,
    })
    .from(projects)
    .where(eq(projects.organizationId, organizationId))
    .limit(CLIENT_COLOR_CLASSES.length);

  return rows.map((project, index) => ({
    name: project.name,
    color: CLIENT_COLOR_CLASSES[index % CLIENT_COLOR_CLASSES.length],
  }));
}

export async function getTimeEntriesForOrganization(organizationId: number, limit?: number) {
  const rows = await db
    .select({
      id: timeEntries.id,
      description: timeEntries.description,
      startTime: timeEntries.startTime,
      endTime: timeEntries.endTime,
      duration: timeEntries.duration,
      projectName: projects.name,
      userName: users.name,
      userEmail: users.email,
      userAvatar: users.imageUrl,
    })
    .from(timeEntries)
    .innerJoin(projects, eq(projects.id, timeEntries.projectId))
    .innerJoin(users, eq(users.id, timeEntries.userId))
    .where(eq(projects.organizationId, organizationId))
    .orderBy(desc(timeEntries.startTime))
    .limit(limit ?? 50);

  return rows;
}

type TimeEntryRow = Awaited<ReturnType<typeof getTimeEntriesForOrganization>>[number];

function buildRecentEntries(rows: TimeEntryRow[], colorOffset = 0): RecentEntry[] {
  return rows.map((entry, index) => {
    const seconds = durationSeconds(entry);
    const amountValue = secondsToHours(seconds) * DEFAULT_RATE;
    const statusKey = seconds === 0 ? "nonBillable" : "unbilled";

    return {
      id: entry.id,
      client: entry.projectName ?? "—",
      project: entry.projectName ?? "—",
      initials: initialsFrom(entry.projectName ?? "??"),
      color: CLIENT_COLOR_CLASSES[(colorOffset + index) % CLIENT_COLOR_CLASSES.length],
      description: entry.description ?? "—",
      user: {
        name: entry.userName ?? entry.userEmail ?? "Unknown",
        avatar: entry.userAvatar ?? "https://i.pravatar.cc/100?img=33",
      },
      date: formatDate(entry.startTime),
      duration: `${hoursFormatter.format(secondsToHours(seconds))}klst`,
      amount: currencyFormatter.format(amountValue),
      status: STATUS_COLORS[statusKey],
    };
  });
}

export async function getExpensesForOrganization(organizationId: number) {
  const rows = await db
    .select({
      id: expenses.id,
      description: expenses.description,
      amount: expenses.amount,
      date: expenses.date,
      projectName: projects.name,
      userName: users.name,
    })
    .from(expenses)
    .innerJoin(projects, eq(projects.id, expenses.projectId))
    .innerJoin(users, eq(users.id, expenses.userId))
    .where(eq(projects.organizationId, organizationId))
    .orderBy(desc(expenses.date));

  return rows;
}

export async function getDashboardData(organizationId: number) {
  const [entries, expenseRows, projectRows] = await Promise.all([
    getTimeEntriesForOrganization(organizationId, DASHBOARD_RECENT_ENTRIES_LIMIT),
    getExpensesForOrganization(organizationId),
    db
      .select({
        id: projects.id,
        name: projects.name,
      })
      .from(projects)
      .where(eq(projects.organizationId, organizationId)),
  ]);

  // Calculate total seconds using entries from database, not just the limited ones we fetched
  // Fetch all time entries for accurate total calculation if needed, 
  // or if we want to stick to efficient queries, we should do an aggregation query.
  
  // Let's do a proper aggregation for total seconds across ALL time entries for the org
  const [totalSecondsResult] = await db
    .select({
        totalDuration: sql<number>`COALESCE(SUM(${timeEntries.duration}), 0)`
    })
    .from(timeEntries)
    .innerJoin(projects, eq(projects.id, timeEntries.projectId))
    .where(eq(projects.organizationId, organizationId));

  const totalSeconds = Number(totalSecondsResult?.totalDuration ?? 0);

  const monthKey = sql<string>`DATE_FORMAT(${timeEntries.startTime}, '%Y-%m')`;
  const monthLabel = sql<string>`DATE_FORMAT(${timeEntries.startTime}, '%b')`;

  const chartRows = await db
    .select({
      key: monthKey,
      label: monthLabel,
      // We need to calculate duration on the fly if it's null
      // But doing that in SQL across different DB engines is tricky (TIMESTAMPDIFF vs DATEDIFF etc)
      // For now, we'll trust that entries with duration are what we chart, 
      // OR we fetch all and aggregate in code for the chart too.
      // Given the complexity, let's try to use a raw SQL snippet that attempts to calc duration if null.
      // Assuming MySQL since we saw mysql2 in package.json
      seconds: sql<number>`COALESCE(SUM(
        CASE 
          WHEN ${timeEntries.duration} IS NOT NULL THEN ${timeEntries.duration}
          WHEN ${timeEntries.endTime} IS NOT NULL THEN TIMESTAMPDIFF(SECOND, ${timeEntries.startTime}, ${timeEntries.endTime})
          ELSE 0 
        END
      ), 0)`,
    })
    .from(timeEntries)
    .innerJoin(projects, eq(projects.id, timeEntries.projectId))
    .where(and(eq(projects.organizationId, organizationId)))
    .groupBy(monthKey, monthLabel)
    .orderBy(monthKey)
    .limit(12);

  // Stacked chart by PROJECT per month (last 12 months) and week (last 12 weeks)
  const twelveMonthsAgo = subMonths(new Date(), 11);
  const twelveWeeksAgo = subWeeks(new Date(), 11);

  // Fetch all entries for the last 12 months to process in JS
  const rawStackRows = await db
    .select({
      projectName: projects.name,
      startTime: timeEntries.startTime,
      duration: timeEntries.duration,
      endTime: timeEntries.endTime,
    })
    .from(timeEntries)
    .innerJoin(projects, eq(projects.id, timeEntries.projectId))
    .where(
      and(
        eq(projects.organizationId, organizationId),
        gte(timeEntries.startTime, twelveMonthsAgo),
      ),
    );

  const projectSet = new Set<string>();

  // Helper to process data
  const processStackData = (
    rows: typeof rawStackRows,
    periodType: 'month' | 'week'
  ) => {
    const map = new Map<string, Record<string, any>>();

    // 1. Pre-populate the last 12 periods (or 7 days) to ensure we have a full chart
    const now = new Date();
    
    if (periodType === 'month') {
      for (let i = 11; i >= 0; i--) {
        const d = subMonths(now, i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const label = format(d, "MMM");
        map.set(key, { key, label });
      }
    } else {
      // For weekly view: show current week (Mon-Sun)
      const startOfCurrentWeek = startOfWeek(now, { weekStartsOn: 1 });
      for (let i = 0; i < 7; i++) {
        const d = addDays(startOfCurrentWeek, i);
        const key = format(d, "yyyy-MM-dd");
        const label = format(d, "EEE"); // Mon, Tue, etc.
        map.set(key, { key, label });
      }
    }
    
    // 2. Fill in actual data
    rows.forEach((row) => {
      const d = row.startTime;
      
      let key: string;

      if (periodType === 'month') {
        key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      } else {
        // Daily grouping
        key = format(d, "yyyy-MM-dd");
      }

      // Only add if within our window
      if (map.has(key)) {
        const entry = map.get(key)!;
        const hrs = secondsToHours(durationSeconds(row));
        const pName = row.projectName ?? "Unknown";
        
        entry[pName] = (entry[pName] ?? 0) + hrs;
        projectSet.add(pName);
      }
    });

    const sortedKeys = Array.from(map.keys()).sort();
    
    return sortedKeys.map((key) => {
      const { label, key: _k, ...rest } = map.get(key)!;
      return { label, ...rest };
    });
  };

  const monthlyData = processStackData(rawStackRows, 'month');
  const weeklyData = processStackData(rawStackRows, 'week');

  const STACK_COLORS = [
    "#7c3aed",
    "#22c55e",
    "#f59e0b",
    "#0ea5e9",
    "#a855f7",
    "#f97316",
    "#06b6d4",
    "#f43f5e",
  ];

  const chartStackConfig: ChartStackConfig = {};
  Array.from(projectSet).forEach((name, idx) => {
    chartStackConfig[name] = {
      label: name,
      color: STACK_COLORS[idx % STACK_COLORS.length],
    };
  });

  const chartMaxSeconds = Math.max(
    1,
    ...chartRows.map((row) => Number(row.seconds ?? 0)),
  );

  const chart: ChartMonth[] = chartRows.map((row, index) => {
    const seconds = Number(row.seconds ?? 0);
    return {
      label: row.label,
      value: Math.round((seconds / chartMaxSeconds) * 100),
      tooltip: `${hoursFormatter.format(secondsToHours(seconds))}h`,
      highlight: index === chartRows.length - 1,
    };
  });

  const previousSeconds = chartRows.at(-2)?.seconds ?? chartRows.at(-1)?.seconds ?? 0;
  const latestSeconds = chartRows.at(-1)?.seconds ?? 0;
  const percentChange =
    previousSeconds === 0 ? 100 : Math.round(((Number(latestSeconds) - Number(previousSeconds)) / Number(previousSeconds)) * 100);

  const expensesThisMonth = expenseRows
    .filter((expense) => {
      const now = new Date();
      return expense.date && expense.date.getMonth() === now.getMonth() && expense.date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);

  const totalProjects = projectRows.length || 1;
  const utilization = Math.min(100, Math.round((secondsToHours(totalSeconds) / (totalProjects * 40)) * 100));

  const stats: StatCard[] = [
    {
      titleKey: "stats.billable",
      value: `${hoursFormatter.format(secondsToHours(totalSeconds))}klst`,
      change: `${percentChange > 0 ? "+" : ""}${percentChange}%`,
      trend: percentChange >= 0 ? "up" : "down",
      ...STAT_CARD_STYLES.billable,
    },
    {
      titleKey: "stats.unbilled",
      value: currencyFormatter.format(secondsToHours(totalSeconds) * DEFAULT_RATE),
      change: "+5%",
      trend: "up",
      ...STAT_CARD_STYLES.unbilled,
    },
    {
      titleKey: "stats.expenses",
      value: currencyFormatter.format(expensesThisMonth),
      change: "-3%",
      trend: expensesThisMonth >= 0 ? "down" : "up",
      ...STAT_CARD_STYLES.expenses,
    },
    {
      titleKey: "stats.utilization",
      value: `${utilization}%`,
      change: "+2%",
      trend: "up",
      ...STAT_CARD_STYLES.utilization,
    },
  ];

  const clients: Client[] = projectRows.slice(0, CLIENT_COLOR_CLASSES.length).map((project, index) => ({
    name: project.name,
    color: CLIENT_COLOR_CLASSES[index % CLIENT_COLOR_CLASSES.length],
  }));

  const recentEntries = buildRecentEntries(entries);

  const activityColors = ["border-purple-500", "border-blue-400", "border-emerald-400", "border-slate-200"];

  const activities: ActivityItem[] = [
    ...entries.slice(0, 3).map((entry, index) => ({
      id: `entry-${entry.id}`,
      title: `Time Logged: ${hoursFormatter.format(secondsToHours(durationSeconds(entry)))}klst`,
      description: `${entry.projectName ?? "Project"} — ${entry.description ?? "Details added"}`,
      time: formatDistanceToNow(entry.startTime, { addSuffix: true }),
      color: activityColors[index % activityColors.length],
    })),
    ...expenseRows.slice(0, 2).map((expense, index) => ({
      id: `expense-${expense.id}`,
      title: "Expense Recorded",
      description: `${expense.description} (${currencyFormatter.format(Number(expense.amount ?? 0))})`,
      time: expense.date ? formatDistanceToNow(expense.date, { addSuffix: true }) : "",
      color: activityColors[(index + 2) % activityColors.length],
    })),
  ];

  return {
    stats,
    chart,
    chartStack: {
      monthly: monthlyData,
      weekly: weeklyData,
      config: chartStackConfig,
    },
    activities,
    entries: recentEntries,
    clients,
    greetingHours: hoursFormatter.format(secondsToHours(totalSeconds)),
  };
}

export async function getInvoiceSummaries(organizationId: number) {
  const rows = await db
    .select({
      projectId: projects.id,
      projectName: projects.name,
      totalSeconds: sql<number>`COALESCE(SUM(${timeEntries.duration}),0)`,
    })
    .from(projects)
    .leftJoin(timeEntries, eq(timeEntries.projectId, projects.id))
    .where(eq(projects.organizationId, organizationId))
    .groupBy(projects.id);

  return rows.map((row, index) => ({
    id: row.projectId,
    project: row.projectName,
    amount: currencyFormatter.format(secondsToHours(Number(row.totalSeconds ?? 0)) * DEFAULT_RATE),
    status: index % 2 === 0 ? "sent" : "draft",
    updatedAt: format(new Date(), "dd MMM"),
  }));
}

export async function getRecentEntriesForOrganization(organizationId: number) {
  const rows = await getTimeEntriesForOrganization(organizationId);
  return buildRecentEntries(rows);
}
