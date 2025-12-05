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
            className={`group rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:shadow-lg ${stat.cardHoverClass} dark:bg-zinc-900/40 dark:border-zinc-800/60`}
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
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                }`}
              >
                <StatTrendIcon trend={stat.trend} />
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-semibold text-muted-foreground">
              {t(stat.titleKey)}
            </p>
            <p className="text-2xl font-bold text-card-foreground">{stat.value}</p>
          </div>
        );
      })}
    </section>
  );
}
