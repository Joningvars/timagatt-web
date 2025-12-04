'use client';

import { Bell, Menu, PanelsTopLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ICONS, type SidebarNavSection } from '@/lib/dashboard/data';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type DashboardHeaderProps = {
  navSections: SidebarNavSection[];
  currentDate?: string;
};

export function DashboardHeader({
  navSections,
  currentDate,
}: DashboardHeaderProps) {
  const t = useTranslations('Dashboard');
  const navItems = navSections.flatMap((section) => section.items);
  const dateDisplay = currentDate ?? '';

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 border-r border-slate-100 p-0"
          >
            <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
              <PanelsTopLeft className="h-5 w-5 text-purple-600" />
              <span className="text-base font-semibold text-slate-900">
                Timagatt
              </span>
            </div>
            <nav className="space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const Icon = ICONS[item.iconKey];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      item.active
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden items-center gap-3 md:flex">
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            {t('header.title')}
          </h1>
          <span className="text-slate-300">|</span>
          <span className="text-sm font-medium text-slate-500">
            {dateDisplay}
          </span>
        </div>
      </div>

      <div className="hidden flex-1 px-8 md:block lg:px-12">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clients, entries..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
          <div className="absolute right-2 top-2 hidden items-center gap-1 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 lg:flex">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-white bg-red-500" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  );
}
