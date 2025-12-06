'use client';

import { Download, Play, Plus, Timer, Square, Pause } from 'lucide-react';
import { useCallback, useState } from 'react';
import posthog from 'posthog-js';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateTimeEntryDialog } from './CreateTimeEntryDialog';
import type { Project } from '@/lib/dashboard/data';
import { useTimer } from '@/components/TimerProvider';
import { toast } from 'sonner';

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
  const tTimer = useTranslations('Dashboard.timer');
  const locale = useLocale();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {
    isRunning,
    isPaused,
    start,
    stop,
    pause,
    resume,
    projectId,
    startTime,
    description,
    id,
  } = useTimer();

  const handleExport = useCallback(() => {
    if (hasPosthog) {
      posthog.capture('dashboard_export_clicked', {
        format: 'csv',
      });
    }
    router.push(`/${locale}/export`);
  }, [locale, router]);

  const handleStartTimer = useCallback(async () => {
    if (hasPosthog) {
      posthog.capture('dashboard_timer_started');
    }

    if (projects.length === 0) {
      toast.error(t('createProjectRequired'));
      return;
    }

    setIsDialogOpen(true);
  }, [projects, t]);

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
            'flex items-center gap-2 rounded-lg border border-border cursor-pointer bg-card px-4 py-2 text-xs font-bold text-foreground shadow-sm transition hover:border-input hover:bg-accent hover:text-accent-foreground',
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
                'flex items-center gap-2 cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background shadow-md shadow-border transition hover:bg-foreground/90',
                layout === 'stacked' &&
                  'w-full justify-center rounded-full text-sm',
                (isRunning || isPaused) &&
                  'bg-red-600 hover:bg-red-700 text-white'
              )}
              type="button"
              onClick={() => {
                if (isPaused) {
                  resume();
                }
              }}
            >
              {isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5 fill-current" />
                  {tTimer('resume')}
                </>
              ) : isRunning ? (
                <>
                  <Square className="h-3.5 w-3.5 fill-current" />
                  {tTimer('stop')}
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  {startLabel}
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {isPaused && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => resume()}
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                <span>{tTimer('resume')}</span>
              </DropdownMenuItem>
            )}
            {isRunning && (
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => pause()}
              >
                <Pause className="mr-2 h-4 w-4 fill-current" />
                <span>{tTimer('pause')}</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleStartTimer}
            >
              {isRunning || isPaused ? (
                <>
                  <Square className="mr-2 h-4 w-4 fill-current text-red-500" />
                  <span>{tTimer('stop')}</span>
                </>
              ) : (
                <>
                  <Timer className="mr-2 h-4 w-4" />
                  <span>{t('start')}</span>
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>{t('addEntry')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CreateTimeEntryDialog
        projects={projects}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStart={!isRunning && !isPaused ? start : undefined}
        onStop={isRunning || isPaused ? stop : undefined}
        initialData={
          (isRunning || isPaused) && (id || projectId)
            ? {
                id: id ?? undefined,
                projectId: projectId ?? 0,
                startTime: startTime ?? new Date(),
                endTime: new Date(), // Pause timer in dialog
                description: description ?? '',
              }
            : undefined
        }
      />
    </>
  );
}
