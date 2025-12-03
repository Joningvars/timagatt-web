import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  FileText,
  LayoutDashboard,
  Receipt,
  Settings2,
  Timer,
  Clock,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type StatCard = {
  titleKey: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  iconClass: string;
  cardHoverClass: string;
};

export type NavItem = {
  labelKey: string;
  icon: LucideIcon;
  active?: boolean;
  badge?: string;
};

export type NavSection = {
  titleKey: string;
  items: NavItem[];
};

export type Client = {
  name: string;
  color: string;
};

export type ActivityItem = {
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

export type RecentEntry = {
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

export const DASHBOARD_STAT_CARDS: StatCard[] = [
  {
    titleKey: 'stats.billable',
    value: '142.5h',
    change: '12.5%',
    trend: 'up',
    icon: Clock,
    iconClass: 'bg-purple-50 text-purple-600',
    cardHoverClass: 'hover:shadow-purple-500/5',
  },
  {
    titleKey: 'stats.unbilled',
    value: '$12,450',
    change: '8.2%',
    trend: 'up',
    icon: DollarSign,
    iconClass: 'bg-blue-50 text-blue-600',
    cardHoverClass: 'hover:shadow-blue-500/5',
  },
  {
    titleKey: 'stats.expenses',
    value: '$842.00',
    change: '1.5%',
    trend: 'down',
    icon: CreditCard,
    iconClass: 'bg-amber-50 text-amber-600',
    cardHoverClass: 'hover:shadow-amber-500/5',
  },
  {
    titleKey: 'stats.utilization',
    value: '92%',
    change: '92%',
    trend: 'up',
    icon: Activity,
    iconClass: 'bg-indigo-50 text-indigo-600',
    cardHoverClass: 'hover:shadow-indigo-500/5',
  },
];

export const DASHBOARD_NAV_SECTIONS: NavSection[] = [
  {
    titleKey: 'sidebar.tracking',
    items: [
      { labelKey: 'sidebar.items.dashboard', icon: LayoutDashboard, active: true },
      { labelKey: 'sidebar.items.timesheets', icon: Timer },
      { labelKey: 'sidebar.items.expenses', icon: Receipt, badge: '3' },
      { labelKey: 'sidebar.items.invoices', icon: FileText },
    ],
  },
];

export const DASHBOARD_CLIENTS: Client[] = [
  { name: 'Acme Corp', color: 'bg-purple-500' },
  { name: 'Globex Inc', color: 'bg-emerald-500' },
  { name: 'Stark Ind', color: 'bg-amber-500' },
];

export const DASHBOARD_ACTIVITIES: ActivityItem[] = [
  {
    title: 'Time Logged: 4h 30m',
    description: 'Logged for Acme Corp / UX Research.',
    time: '10 min ago',
    color: 'border-purple-500',
  },
  {
    title: 'Expense Approved',
    description: 'Travel expense ($450.00) approved by Mark.',
    time: '2 hours ago',
    color: 'border-blue-400',
  },
  {
    title: 'Invoice Sent #1024',
    description: 'Sent to Globex Inc for August Services.',
    time: 'Yesterday',
    color: 'border-emerald-400',
  },
  {
    title: 'New Client Added',
    description: 'Stark Industries added to workspace.',
    time: '2 days ago',
    color: 'border-slate-200',
  },
];

export const DASHBOARD_CHART_DATA: ChartMonth[] = [
  { label: 'Jan', value: 40, tooltip: '120h' },
  { label: 'Feb', value: 65, tooltip: '145h' },
  { label: 'Mar', value: 45, tooltip: '130h' },
  { label: 'Apr', value: 80, tooltip: '165h' },
  { label: 'May', value: 55, tooltip: '140h' },
  { label: 'Jun', value: 35, tooltip: '110h' },
  { label: 'Jul', value: 70, tooltip: '158h' },
  { label: 'Aug', value: 90, tooltip: '182h', highlight: true },
  { label: 'Sep', value: 60, tooltip: '150h' },
  { label: 'Oct', value: 75, tooltip: '168h' },
  { label: 'Nov', value: 50, tooltip: '138h' },
  { label: 'Dec', value: 65, tooltip: '146h' },
];

export const DASHBOARD_RECENT_ENTRIES: RecentEntry[] = [
  {
    client: 'Acme Corp',
    project: 'UX Research',
    initials: 'AC',
    color: 'bg-purple-100 text-purple-600',
    description: 'Conducted user interviews and updated personas',
    user: { name: 'Tom Cook', avatar: 'https://i.pravatar.cc/100?img=12' },
    date: 'Today',
    duration: '4h 30m',
    amount: '$675.00',
    status: {
      labelKey: 'table.statuses.unbilled',
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      dot: 'bg-amber-500',
    },
  },
  {
    client: 'Globex Inc',
    project: 'Server Setup',
    initials: 'GL',
    color: 'bg-emerald-100 text-emerald-600',
    description: 'Configuring AWS instances for staging',
    user: { name: 'Jane Cooper', avatar: 'https://i.pravatar.cc/100?img=5' },
    date: 'Yesterday',
    duration: '2h 00m',
    amount: '—',
    status: {
      labelKey: 'table.statuses.nonBillable',
      color: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
    },
  },
  {
    client: 'Stark Ind',
    project: 'Logo Concepts',
    initials: 'ST',
    color: 'bg-blue-100 text-blue-600',
    description: 'Designing initial logo concepts vector',
    user: { name: 'Wade Warren', avatar: 'https://i.pravatar.cc/100?img=8' },
    date: 'Sep 28',
    duration: '6h 15m',
    amount: '$937.50',
    status: {
      labelKey: 'table.statuses.billed',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      dot: 'bg-emerald-500',
    },
  },
];

export const DASHBOARD_GREETING_HOURS = '32.5';

