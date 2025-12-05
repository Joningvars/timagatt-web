'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, Folder, Receipt, LayoutGrid } from 'lucide-react';

type SearchResultsProps = {
  results: {
    projects: { id: number; name: string; description: string | null }[];
    entries: {
      id: number;
      description: string | null;
      projectName: string | null;
      date: Date;
    }[];
    expenses: {
      id: number;
      description: string | null;
      amount: string;
      projectName: string | null;
      date: Date;
    }[];
    features: { label: string; href: string }[];
  } | null;
  onSelect?: () => void;
  visible: boolean;
};

export function SearchResults({
  results,
  onSelect,
  visible,
}: SearchResultsProps) {
  const t = useTranslations('Dashboard');

  if (!visible || !results) return null;

  const hasResults =
    results.projects.length > 0 ||
    results.entries.length > 0 ||
    results.expenses.length > 0 ||
    results.features.length > 0;

  if (!hasResults) {
    return (
      <div className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-popover p-4 shadow-lg">
        <p className="text-center text-xs text-muted-foreground">No results found.</p>
      </div>
    );
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 max-h-[400px] overflow-y-auto rounded-lg border border-border bg-popover p-2 shadow-lg z-50">
      {results.features.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('sidebar.tracking')}
          </div>
          {results.features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary cursor-pointer"
              onClick={onSelect}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground">
                <LayoutGrid className="h-4 w-4" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {feature.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.projects.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('projects.projects')}
          </div>
          {results.projects.map((project) => (
            <Link
              key={`p-${project.id}`}
              href={`/verkefni?highlight=${project.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary cursor-pointer"
              onClick={onSelect}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Folder className="h-4 w-4" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {project.name}
                </p>
                {project.description && (
                  <p className="truncate text-xs text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.entries.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('entries.entries')}
          </div>
          {results.entries.map((entry) => (
            <Link
              key={`e-${entry.id}`}
              href={`/timaskraningar?highlight=${entry.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary cursor-pointer"
              onClick={onSelect}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {entry.description || 'No description'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {entry.projectName} •{' '}
                  {new Date(entry.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {results.expenses.length > 0 && (
        <div>
          <div className="mb-1 px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            {t('expenses.new')}{' '}
            {/* Using existing translation key for "New Expense" as label, maybe add "expenses" key later */}
          </div>
          {results.expenses.map((expense) => (
            <Link
              key={`x-${expense.id}`}
              href={`/utgjold?highlight=${expense.id}`}
              className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-secondary cursor-pointer"
              onClick={onSelect}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Receipt className="h-4 w-4" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">
                  {expense.description}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {expense.projectName} • {expense.amount} •{' '}
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
