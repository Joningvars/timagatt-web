import { getProjectDetails } from '@/lib/dashboard/project-queries';
import { auth } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectStats } from '@/components/projects/ProjectStats';
import { ProjectTimeEntries } from '@/components/projects/ProjectTimeEntries';
import { ProjectExpenses } from '@/components/projects/ProjectExpenses';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTranslations } from 'next-intl/server';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const projectId = parseInt(id);
  if (isNaN(projectId)) {
    notFound();
  }

  const project = await getProjectDetails(projectId, userId);

  if (!project) {
    notFound();
  }

  const t = await getTranslations('Projects');

  return (
    <div className="flex-1 space-y-6 p-6">
      <ProjectHeader project={project} locale={locale} />
      
      <ProjectStats stats={project.stats} />

      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">{t('tabs.entries')}</TabsTrigger>
          <TabsTrigger value="expenses">{t('tabs.expenses')}</TabsTrigger>
          {/* <TabsTrigger value="settings">{t('tabs.settings')}</TabsTrigger> */}
        </TabsList>
        <TabsContent value="entries" className="space-y-4">
          <ProjectTimeEntries entries={project.entries} />
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <ProjectExpenses expenses={project.expenses} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

