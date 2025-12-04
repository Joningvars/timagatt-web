'use client';

import { useTranslations } from 'next-intl';
import { ICONS, type StatCard } from '@/lib/dashboard/data';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

type StatsGridProps = {
  stats: StatCard[];
};

const StatTrendIcon = ({ trend }: { trend: 'up' | 'down' }) =>
  trend === 'up' ? (
    <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={3} />
  ) : (
    <ArrowDownRight className="h-2.5 w-2.5" strokeWidth={3} />
  );

export function StatsGrid({ stats }: StatsGridProps) {
  const t = useTranslations('Dashboard');

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = ICONS[stat.iconKey];
        return (
          <div
            key={stat.titleKey}
            className={`group rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition hover:shadow-lg ${stat.cardHoverClass}`}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110 ${stat.iconClass}`}
              >
                {Icon && <Icon className="h-5 w-5" strokeWidth={1.5} />}
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                  stat.trend === 'up'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-red-50 text-red-600'
                }`}
              >
                <StatTrendIcon trend={stat.trend} />
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500">
              {t(stat.titleKey)}
            </p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </div>
        );
      })}
    </section>
  );
}
