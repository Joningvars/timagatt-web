'use client';

type FeatureHighlightsProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

export function FeatureHighlights({ t }: FeatureHighlightsProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <FeatureCard
          title={t('features.analytics_title')}
          description={t('features.analytics_desc')}
          variant="analytics"
        />
        <FeatureCard
          title={t('features.calendar_title')}
          description={t('features.calendar_desc')}
          variant="calendar"
        />
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  variant,
}: {
  title: string;
  description: string;
  variant: 'analytics' | 'calendar';
}) {
  return (
    <div className="flex h-[500px] flex-col items-center rounded-[2.5rem] border border-slate-100 bg-white p-10 pb-0 text-center shadow-sm transition-shadow hover:shadow-lg">
      <h3 className="mb-2 text-2xl font-bold text-slate-900 whitespace-pre-line">{title}</h3>
      <p className="mb-8 max-w-sm text-sm text-slate-500">{description}</p>
      {variant === 'analytics' ? <AnalyticsMockup /> : <CalendarMockup />}
    </div>
  );
}

function AnalyticsMockup() {
  return (
    <div className="relative h-full w-full rounded-t-3xl border border-slate-100 bg-slate-50 p-6 shadow-inner">
      <div className="mb-4 text-left">
        <div className="text-xs font-bold text-slate-900">Project Analytics</div>
        <div className="text-[10px] text-slate-400">100k data points</div>
      </div>
      <div className="flex h-32 items-end gap-2 px-4">
        {[40, 70, 50, 80, 60].map((height, idx) => (
          <div
            key={idx}
            className="w-full rounded-t"
            style={{
              height: `${height}%`,
              backgroundColor: ['#E9D5FF', '#D8B4FE', '#A855F7', '#C084FC', '#E9D5FF'][idx],
            }}
          />
        ))}
      </div>
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-2 text-left shadow-lg">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Total Growth</div>
          <div className="text-sm font-bold text-slate-900">+24.5%</div>
        </div>
      </div>
    </div>
  );
}

function CalendarMockup() {
  return (
    <div className="h-full w-full rounded-t-3xl border border-slate-100 bg-slate-50 p-6 text-left shadow-inner">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-900">Design System</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-slate-400"
        >
          <circle cx="12" cy="12" r="1"></circle>
          <circle cx="12" cy="5" r="1"></circle>
          <circle cx="12" cy="19" r="1"></circle>
        </svg>
      </div>
      <div className="mb-6 flex gap-2">
        <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">
          High Priority
        </span>
        <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-600">
          2 Days Left
        </span>
      </div>
      <div className="grid grid-cols-7 gap-y-4 text-center">
        <div className="col-span-7 mb-2 h-px bg-slate-200" />
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
          <div key={day} className="text-xs font-bold text-slate-400">
            {day}
          </div>
        ))}
        {[1, 2, 3, 4, 5].map((day) => (
          <div
            key={day}
            className={`text-sm font-medium ${
              day === 3 ? 'text-purple-600 relative' : 'text-slate-400'
            }`}
          >
            {day}
            {day === 3 && (
              <div className="absolute left-1/2 top-6 h-1 w-1 -translate-x-1/2 rounded-full bg-purple-600" />
            )}
          </div>
        ))}
        <div className="col-span-3 mx-2 flex items-center justify-center rounded-lg bg-purple-100 p-1 text-xs font-bold text-purple-700">
          Sprint Planning
        </div>
      </div>
    </div>
  );
}

