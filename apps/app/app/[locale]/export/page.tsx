import { getTranslations } from 'next-intl/server';
import { ExportForm } from '@/components/export/ExportForm';
import { getProjectsForOrganization } from '@/lib/dashboard/queries';
import { auth } from '@clerk/nextjs/server';
import { getUserOrganization } from '@/lib/dashboard/queries';
import { notFound } from 'next/navigation';

export default async function ExportPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const membership = await getUserOrganization(userId);
  if (!membership) {
    notFound();
  }

  const projects = await getProjectsForOrganization(membership.organizationId);
  const t = await getTranslations('Export');

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>
      
      <ExportForm projects={projects} />
    </div>
  );
}

