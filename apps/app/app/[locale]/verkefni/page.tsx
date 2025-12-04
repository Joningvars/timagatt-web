import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { ProjectsGrid } from '@/components/dashboard/ProjectsGrid';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { CreateProjectDialog } from '@/components/dashboard/CreateProjectDialog';
import {
  getProjectsForOrganization,
  getUserOrganization,
} from '@/lib/dashboard/queries';

export default async function ProjectsPage({
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
        <PageHeader title="Verkefni" subtitle="Yfirlit yfir öll verkefni" />
        <EmptyState
          title={t('cta.title')}
          description={t('cta.description')}
          primaryAction={{
            href: `${localePrefix}/timaskraningar`,
            label: t('cta.track'),
          }}
          secondaryAction={{
            href: `${localePrefix}/utgjold`,
            label: t('cta.create'),
          }}
        />
      </div>
    );
  }

  const [projects] = await Promise.all([
    getProjectsForOrganization(organization.organizationId),
  ]);

  return (
    <div className="grid w-full flex-1 grid-cols-1 gap-6">
      <PageHeader
        title="Verkefni"
        subtitle="Yfirlit yfir öll verkefni"
        actions={<CreateProjectDialog />}
      />
      {projects.length ? (
        <ProjectsGrid rows={projects} title="Verkefnasafn" />
      ) : (
        <EmptyState
          title="Engin verkefni til"
          description="Stofna ný verkefni til að hefja samstarf."
          primaryAction={{
            href: `${localePrefix}/timaskraningar`,
            label: 'Skrá tíma',
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
