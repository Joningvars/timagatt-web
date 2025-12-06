'use client';

import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import type { SidebarNavSection, Client } from '@/lib/dashboard/data';

type DashboardShellProps = {
  children: React.ReactNode;
  navSections: SidebarNavSection[];
  clients: Client[];
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  dashboardMessages: Record<string, string>;
  currentDate?: string;
};

export function DashboardShell({
  children,
  navSections,
  clients,
  user,
  dashboardMessages,
  currentDate,
}: DashboardShellProps) {
  const pathname = usePathname() ?? '';

  const navWithActive = useMemo(
    () =>
      navSections.map((section) => ({
        ...section,
        items: section.items.map((item) => ({
          ...item,
          active:
            item.key === 'dashboard'
              ? pathname === item.href ||
                pathname === item.href.replace(/\/$/, '')
              : pathname.startsWith(item.href),
        })),
      })),
    [navSections, pathname]
  );

  const t = useCallback(
    (key: string) => dashboardMessages?.[key] ?? key,
    [dashboardMessages]
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-foreground dark:bg-black print:h-auto print:overflow-visible print:bg-white">
      <Sidebar
        navSections={navWithActive}
        clients={clients}
        avatar={user.avatar}
        name={user.name}
        email={user.email}
        className="print:hidden"
      />
      <div className="flex w-full flex-1 flex-col overflow-hidden print:overflow-visible">
        <div className="print:hidden">
          <DashboardHeader
            navSections={navWithActive}
            currentDate={currentDate}
          />
        </div>
        <main className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 md:px-6 print:overflow-visible print:p-0">
          <div className="grid gap-6 print:block">{children}</div>
        </main>
      </div>
    </div>
  );
}
