import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import {
  DASHBOARD_ACTIVITIES,
  DASHBOARD_CHART_DATA,
  DASHBOARD_CLIENTS,
  DASHBOARD_GREETING_HOURS,
  DASHBOARD_NAV_SECTIONS,
  DASHBOARD_RECENT_ENTRIES,
  DASHBOARD_STAT_CARDS,
} from '@/lib/dashboard/data';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { BillableChart } from '@/components/dashboard/BillableChart';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { EntriesTable } from '@/components/dashboard/EntriesTable';
import { DashboardCta } from '@/components/dashboard/DashboardCta';
import { Download, Play } from 'lucide-react';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await currentUser();
  const t = await getTranslations({ locale, namespace: 'Dashboard' });
  const name = user?.firstName ?? t('fallbackName');
  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    'jonjonsson@timagatt.is';
  const avatar = user?.imageUrl ?? 'https://i.pravatar.cc/100?img=33';

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <Sidebar
        navSections={DASHBOARD_NAV_SECTIONS}
        clients={DASHBOARD_CLIENTS}
        avatar={avatar}
        name={name}
        email={email}
        t={t}
      />
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <DashboardHeader name={name} t={t} />
        <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  {t('greeting.title', { name })}
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  {t('greeting.subtitle', { hours: DASHBOARD_GREETING_HOURS })}
                </h2>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">
                  <Download className="h-3.5 w-3.5" />
                  {t('actions.export')}
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-slate-200 transition hover:bg-slate-800">
                  <Play className="h-3.5 w-3.5" />
                  {t('actions.start')}
                </button>
              </div>
            </section>
            <StatsGrid stats={DASHBOARD_STAT_CARDS} t={t} />
            <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:h-[400px]">
              <BillableChart data={DASHBOARD_CHART_DATA} t={t} />
              <ActivityTimeline activities={DASHBOARD_ACTIVITIES} t={t} />
            </section>
            <EntriesTable entries={DASHBOARD_RECENT_ENTRIES} t={t} />
            {/* <DashboardCta locale={locale} t={t} /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
