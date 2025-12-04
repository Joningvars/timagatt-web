import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import { EntriesTable } from '@/components/dashboard/EntriesTable';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateTimeEntryDialog } from '@/components/dashboard/CreateTimeEntryDialog';
import {
  getProjectsForOrganization,
  getRecentEntriesForOrganization,
  getUserOrganization,
} from '@/lib/dashboard/queries';

export default async function TimesheetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await currentUser();
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  if (!user?.id) {
    return null;
  }

  const organization = await getUserOrganization(user.id);

  const localePrefix = `/${locale}`;

  if (!organization) {
    return (
      <div className="grid w-full flex-1 grid-cols-1 gap-6">
        <PageHeader title="Tímaskráningar" subtitle="Allar færslur þínar" />
        <EmptyState
          title={t('cta.title')}
          description={t('cta.description')}
          primaryAction={{
            href: `${localePrefix}/verkefni`,
            label: t('cta.create'),
          }}
          secondaryAction={{
            href: `${localePrefix}/utgjold`,
            label: t('cta.track'),
          }}
        />
      </div>
    );
  }

  const [entries, projects] = await Promise.all([
    getRecentEntriesForOrganization(organization.organizationId),
    getProjectsForOrganization(organization.organizationId),
  ]);

  return (
    <div className="grid w-full flex-1 grid-cols-1 gap-6">
      <PageHeader
        title="Tímaskráningar"
        subtitle="Allar færslur þínar"
        actions={<CreateTimeEntryDialog projects={projects} />}
      />
      {entries.length ? (
        <EntriesTable
          entries={entries}
          title="Allar tímaskráningar"
          filterPlaceholder="Leita í færslum..."
        />
      ) : (
        <EmptyState
          title="Engar tímaskráningar skráðar"
          description="Skráðu fyrsta verkefnið eða tímann þinn til að sjá yfirlit."
          primaryAction={{
            href: `${localePrefix}/verkefni`,
            label: 'Stofna verkefni',
          }}
          secondaryAction={{
            href: `${localePrefix}/utgjold`,
            label: 'Fylgjast með útgjöldum',
          }}
        />
      )}
    </div>
  );
}
