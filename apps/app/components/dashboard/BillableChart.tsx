import type { ChartMonth } from '@/lib/dashboard/data';

type BillableChartProps = {
  data: ChartMonth[];
  t: (key: string, values?: Record<string, any>) => string;
};

export function BillableChart({ data, t }: BillableChartProps) {
  return (
    <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm min-w-0">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {t('chart.title')}
          </h3>
          <p className="mt-1 text-xs text-slate-400">{t('chart.subtitle')}</p>
        </div>
        <div className="flex gap-2 text-[10px] font-bold">
          <button className="rounded-md bg-slate-50 px-2.5 py-1 text-slate-500 transition hover:bg-slate-100">
            {t('chart.weekly')}
          </button>
          <button className="rounded-md bg-purple-600 px-2.5 py-1 text-white shadow-sm shadow-purple-200">
            {t('chart.monthly')}
          </button>
        </div>
      </div>
      <div className="relative flex h-[260px] items-end gap-2 px-4 pb-4 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-6 top-10 bottom-14 flex flex-col justify-between opacity-40">
          <div className="h-px w-full border-t border-dashed border-slate-200" />
          <div className="h-px w-full border-t border-dashed border-slate-200" />
          <div className="h-px w-full border-t border-dashed border-slate-200" />
          <div className="h-px w-full border-t border-dashed border-slate-200" />
        </div>
        {data.map((month) => (
          <div
            key={month.label}
            className="group z-10 flex w-full flex-col items-center gap-2"
          >
            <div
              className={`relative w-full max-w-[24px] rounded-t-sm ${
                month.highlight
                  ? 'bg-purple-500 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.4)]'
                  : 'bg-purple-100 group-hover:bg-purple-200'
              } bar-animate`}
              style={{ height: `${month.value}%` }}
            >
              <div
                className={`pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-[10px] font-bold text-white shadow transition ${
                  month.highlight
                    ? 'bg-slate-900'
                    : 'bg-slate-800 opacity-0 group-hover:opacity-100'
                }`}
              >
                {month.tooltip}
              </div>
            </div>
            <span
              className={`whitespace-nowrap text-[10px] font-bold ${
                month.highlight ? 'text-slate-800' : 'text-slate-400'
              }`}
            >
              {month.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

