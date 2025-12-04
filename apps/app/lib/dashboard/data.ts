import {
  Activity,
  Briefcase,
  Clock,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Receipt,
  Timer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type IconKey =
  | 'dashboard'
  | 'timesheets'
  | 'expenses'
  | 'invoices'
  | 'projects'
  | 'billable'
  | 'unbilled'
  | 'utilization';

export const ICONS: Record<IconKey, LucideIcon> = {
  dashboard: LayoutDashboard,
  timesheets: Timer,
  expenses: Receipt,
  invoices: FileText,
  projects: Briefcase,
  billable: Clock,
  unbilled: DollarSign,
  utilization: Activity,
};

export type StatCard = {
  titleKey: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  iconKey: IconKey;
  iconClass: string;
  cardHoverClass: string;
};

export type SidebarNavItem = {
  key: string;
  labelKey: string;
  iconKey: IconKey;
  href: string;
  badge?: string;
  active?: boolean;
};

export type SidebarNavSection = {
  titleKey: string;
  items: SidebarNavItem[];
};

export type Client = {
  name: string;
  color: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  color: string;
};

export type ChartMonth = {
  label: string;
  value: number;
  tooltip: string;
  highlight?: boolean;
};

export type ChartStackPoint = {
  label: string;
  [key: string]: string | number | undefined;
};

export type ChartStackConfig = Record<
  string,
  {
    label: string;
    color: string;
  }
>;

export type RecentEntry = {
  id: number;
  client: string;
  project: string;
  initials: string;
  color: string;
  description: string;
  user: { name: string; avatar: string };
  date: string;
  duration: string;
  amount: string;
  status: { labelKey: string; color: string; dot: string };
};

export const NAV_LINKS = [
  { key: 'dashboard', labelKey: 'sidebar.items.dashboard', iconKey: 'dashboard', segment: '/' },
  { key: 'timesheets', labelKey: 'sidebar.items.timesheets', iconKey: 'timesheets', segment: 'timaskraningar' },
  { key: 'expenses', labelKey: 'sidebar.items.expenses', iconKey: 'expenses', segment: 'utgjold' },
  { key: 'invoices', labelKey: 'sidebar.items.invoices', iconKey: 'invoices', segment: 'reikningar' },
  { key: 'projects', labelKey: 'sidebar.items.projects', iconKey: 'projects', segment: 'verkefni' },
] as const;

export const STAT_CARD_STYLES: Record<
  string,
  { iconKey: IconKey; iconClass: string; cardHoverClass: string }
> = {
  billable: { iconKey: 'billable', iconClass: 'bg-purple-50 text-purple-600', cardHoverClass: 'hover:shadow-purple-500/5' },
  unbilled: { iconKey: 'unbilled', iconClass: 'bg-blue-50 text-blue-600', cardHoverClass: 'hover:shadow-blue-500/5' },
  expenses: { iconKey: 'expenses', iconClass: 'bg-amber-50 text-amber-600', cardHoverClass: 'hover:shadow-amber-500/5' },
  utilization: { iconKey: 'utilization', iconClass: 'bg-indigo-50 text-indigo-600', cardHoverClass: 'hover:shadow-indigo-500/5' },
};

export const CLIENT_COLOR_CLASSES = [
  'bg-purple-100 text-purple-600',
  'bg-emerald-100 text-emerald-600',
  'bg-blue-100 text-blue-600',
  'bg-amber-100 text-amber-600',
  'bg-rose-100 text-rose-600',
  'bg-indigo-100 text-indigo-600',
];

export const DASHBOARD_RECENT_ENTRIES_LIMIT = 6;
