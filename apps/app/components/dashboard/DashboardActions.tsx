'use client';

import { Download, Play, Plus, Timer } from 'lucide-react';
import { useCallback, useState } from 'react';
import posthog from 'posthog-js';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTimeEntryDialog } from './CreateTimeEntryDialog';
import type { Project } from '@/lib/dashboard/data';

type DashboardActionsProps = {
  exportLabel: string;
  startLabel: string;
  className?: string;
  layout?: 'horizontal' | 'stacked';
  projects?: Project[];
};

const hasPosthog = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function DashboardActions({
  exportLabel,
  startLabel,
  className,
  layout = 'horizontal',
  projects = [],
}: DashboardActionsProps) {
  const t = useTranslations('Dashboard.actions');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleExport = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture('dashboard_export_clicked', {
      format: 'csv',
    });
  }, []);

  const handleStartTimer = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture('dashboard_timer_started');
  }, []);

  return (
    <>
      <div
        className={cn(
          'flex gap-3',
          layout === 'stacked' && 'w-full flex-col gap-2',
          className
        )}
      >
        <button
          className={cn(
            'flex items-center gap-2 rounded-lg border border-slate-200 cursor-pointer  bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50',
            layout === 'stacked' && 'w-full justify-center rounded-full text-sm'
          )}
          onClick={handleExport}
          type="button"
        >
          <Download className="h-3.5 w-3.5" />
          {exportLabel}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-slate-200 transition hover:bg-slate-800',
                layout === 'stacked' &&
                  'w-full justify-center rounded-full text-sm'
              )}
              type="button"
            >
              <Plus className="h-3.5 w-3.5" />
              {startLabel}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleStartTimer}
            >
              <Timer className="mr-2 h-4 w-4" />
              <span>{t('start')}</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>{t('logTime')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateTimeEntryDialog
        projects={projects}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
}
