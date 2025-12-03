import Image from 'next/image';
import type { RecentEntry } from '@/lib/dashboard/data';

type EntriesTableProps = {
  entries: RecentEntry[];
  t: (key: string, values?: Record<string, any>) => string;
};

export function EntriesTable({ entries, t }: EntriesTableProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm min-w-0">
      <div className="flex items-center justify-between border-b border-slate-100 p-6">
        <h3 className="text-sm font-bold text-slate-900">{t('table.title')}</h3>
        <div className="relative">
          <input
            type="text"
            placeholder={t('table.filterPlaceholder')}
            className="w-40 rounded-md border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-[11px] font-medium focus:border-purple-300 focus:outline-none"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">{t('table.columns.clientProject')}</th>
              <th className="px-6 py-3">{t('table.columns.description')}</th>
              <th className="px-6 py-3">{t('table.columns.user')}</th>
              <th className="px-6 py-3">{t('table.columns.date')}</th>
              <th className="px-6 py-3">{t('table.columns.duration')}</th>
              <th className="px-6 py-3">{t('table.columns.amount')}</th>
              <th className="px-6 py-3">{t('table.columns.status')}</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <tr
                key={`${entry.client}-${entry.project}`}
                className="group transition hover:bg-slate-50/80"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold ${entry.color}`}
                    >
                      {entry.initials}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {entry.client}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {entry.project}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="max-w-[220px] px-6 py-4">
                  <p className="truncate text-xs font-medium text-slate-700">
                    {entry.description}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={entry.user.avatar}
                      alt={entry.user.name}
                      width={24}
                      height={24}
                      className="rounded-full border border-slate-100"
                    />
                    <span className="text-xs font-medium text-slate-700">
                      {entry.user.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-medium text-slate-600">
                    {entry.date}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-bold text-slate-900">
                    {entry.duration}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs font-medium text-slate-600">
                    {entry.amount}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold ${entry.status.color}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${entry.status.dot}`} />
                    {t(entry.status.labelKey)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-slate-400 transition hover:text-purple-600">
                    •••
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

