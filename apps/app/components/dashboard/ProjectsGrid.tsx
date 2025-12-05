'use client';

import { useState, useMemo, ReactNode } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';

type ProjectRow = {
  id: number;
  name: string;
  description: string;
  totalEntries: number;
  totalHours: string;
  totalExpenses: string;
};

type ProjectsGridProps = {
  rows: ProjectRow[];
  title: string;
  actions?: ReactNode;
};

export function ProjectsGrid({ rows, title, actions }: ProjectsGridProps) {
  const t = useTranslations('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return (
        searchQuery === '' ||
        row.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (row.description && row.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [rows, searchQuery]);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-48">
            <Search className="pointer-events-none absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('table.filterPlaceholder')}
              className="h-8 bg-muted/50 pl-8 pr-3 text-xs border-input focus:bg-background"
            />
          </div>
          {actions}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {filteredRows.length > 0 ? (
          filteredRows.map((project) => (
            <div
              key={project.id}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-zinc-900/20"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-card-foreground">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.description || 'Engin lýsing'}
                  </p>
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-bold text-muted-foreground">
                  {project.totalEntries} færslur
                </span>
              </div>
              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/70">
                    Klukkustundir
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {project.totalHours}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground/70">
                    Útgjöld
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {project.totalExpenses}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-xs text-muted-foreground">
            No projects found matching filters.
          </div>
        )}
      </div>
    </section>
  );
}
