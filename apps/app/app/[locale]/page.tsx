import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import {
  getDashboardData,
  getSidebarSections,
  getUserOrganization,
} from '@/lib/dashboard/queries';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/Header';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { BillableChart } from '@/components/dashboard/BillableChart';
import { ActivityTimeline } from '@/components/dashboard/ActivityTimeline';
import { EntriesTable } from '@/components/dashboard/EntriesTable';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { Activity } from 'react';

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

  if (!user?.id) {
    return null;
  }

  const organization = await getUserOrganization(user.id);
  const localePrefix = `/${locale}`;

  const [navSections, dashboardData] = await Promise.all([
    getSidebarSections(locale, 'dashboard'),
    organization ? getDashboardData(organization.organizationId) : null,
  ]);

  const hasData = Boolean(dashboardData);

  return (
    <>
      {/* Empty state */}
      <Activity mode={hasData ? 'hidden' : 'visible'}>
              <EmptyState
                title={t('greeting.title', { name })}
                description={t.rich('cta.description', {
                  strong: (chunks) => <strong>{chunks}</strong>,
                })}
                primaryAction={{
                  label: t('cta.create'),
                  href: `${localePrefix}/verkefni`,
                }}
                secondaryAction={{
                  label: t('cta.track'),
                  href: `${localePrefix}/timaskraningar`,
                  variant: 'outline',
                }}
                tertiaryAction={{
                  label: 'Populate Demo Data',
                  href: '/api/seed',
                  variant: 'ghost',
                }}
              />
      </Activity>

      {/* Main content */}
      <Activity mode={hasData ? 'visible' : 'hidden'}>
        {dashboardData ? (
              <>
                <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {t('greeting.title', { name })}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                      {t('greeting.subtitle', {
                    hours: dashboardData.greetingHours ?? '0',
                      })}
                    </h2>
                  </div>
                  <DashboardActions
                    exportLabel={t('actions.export')}
                startLabel={t('actions.addEntry')}
                projects={dashboardData.projects}
                  />
                </section>

            <div className="grid gap-4">
              <StatsGrid stats={dashboardData.stats} />

              <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:min-h-[360px]">
                <BillableChart
                  monthlyData={dashboardData.chartStack.monthly}
                  weeklyData={dashboardData.chartStack.weekly}
                  config={dashboardData.chartStack.config}
                />
                <ActivityTimeline activities={dashboardData.activities} />
                </section>

              <EntriesTable entries={dashboardData.entries} />
          </div>
          </>
        ) : null}
      </Activity>
    </>
  );
}
