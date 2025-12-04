'use client';

import { Download, Play } from 'lucide-react';
import { useCallback } from 'react';
import posthog from 'posthog-js';
import { cn } from '@/lib/utils';

type DashboardActionsProps = {
  exportLabel: string;
  startLabel: string;
  className?: string;
  layout?: 'horizontal' | 'stacked';
};

const hasPosthog = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function DashboardActions({
  exportLabel,
  startLabel,
  className,
  layout = 'horizontal',
}: DashboardActionsProps) {
  const handleExport = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture('dashboard_export_clicked', {
      format: 'csv',
    });
  }, []);

  const handleStart = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture('dashboard_timer_started');
  }, []);

  return (
    <div
      className={cn(
        'flex gap-3',
        layout === 'stacked' && 'w-full flex-col gap-2',
        className
      )}
    >
      <button
        className={cn(
          'flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50',
          layout === 'stacked' && 'w-full justify-center rounded-full text-sm'
        )}
        onClick={handleExport}
        type="button"
      >
        <Download className="h-3.5 w-3.5" />
        {exportLabel}
      </button>
      <button
        className={cn(
          'flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-slate-200 transition hover:bg-slate-800',
          layout === 'stacked' && 'w-full justify-center rounded-full text-sm'
        )}
        onClick={handleStart}
        type="button"
      >
        <Play className="h-3.5 w-3.5" />
        {startLabel}
      </button>
    </div>
  );
}
