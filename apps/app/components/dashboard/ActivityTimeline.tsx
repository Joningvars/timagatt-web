import type { ActivityItem } from '@/lib/dashboard/data';

type ActivityTimelineProps = {
  activities: ActivityItem[];
  t: (key: string, values?: Record<string, any>) => string;
};

export function ActivityTimeline({ activities, t }: ActivityTimelineProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm min-w-0">
      <h3 className="text-sm font-bold text-slate-900">{t('activity.title')}</h3>
      <div className="relative mt-6 flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="absolute left-2.5 top-0 bottom-0 w-px bg-slate-100" />
        {activities.map((activity) => (
          <div className="relative flex gap-4" key={activity.title}>
            <div
              className={`mt-0.5 h-5 w-5 rounded-full border-2 bg-white ${activity.color}`}
            />
            <div>
              <p className="text-xs font-bold text-slate-800">
                {activity.title}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {activity.description}
              </p>
              <p className="mt-1 text-[10px] font-medium text-slate-400">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 w-full rounded-lg border border-slate-200 py-2 text-xs font-bold text-slate-500 transition hover:bg-slate-50">
        {t('activity.viewAll')}
      </button>
    </div>
  );
}

