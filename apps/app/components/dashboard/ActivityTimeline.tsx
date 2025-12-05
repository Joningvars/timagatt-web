'use client';

import { useTranslations } from 'next-intl';
import type { ActivityItem } from '@/lib/dashboard/data';

type ActivityTimelineProps = {
  activities: ActivityItem[];
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const t = useTranslations('Dashboard');

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm min-w-0 dark:bg-zinc-900/20">
      <h3 className="text-sm font-bold text-card-foreground">{t('activity.title')}</h3>
      <div className="relative mt-6 flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-border" />
        {activities.map((activity) => (
          <div className="relative flex gap-4" key={activity.id}>
            <div
              className={`mt-0.5 h-5 w-5 rounded-full border-2 bg-card ${activity.color}`}
            />
            <div>
              <p className="text-xs font-bold text-foreground">
                {activity.title}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {activity.description}
              </p>
              <p className="mt-1 text-[10px] font-medium text-muted-foreground/70">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg border border-input py-2 text-xs font-bold text-muted-foreground transition hover:bg-accent hover:text-accent-foreground">
        {t('activity.viewAll')}
      </button>
    </div>
  );
}

