'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ChartStackConfig, ChartStackPoint } from '@/lib/dashboard/data';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from '@/components/ui/chart';

type BillableChartProps = {
  monthlyData: ChartStackPoint[];
  weeklyData: ChartStackPoint[];
  config: ChartStackConfig;
};

const MODES = [
  { key: 'monthly', label: 'chart.monthly' },
  { key: 'weekly', label: 'chart.weekly' },
];

export function BillableChart({
  monthlyData,
  weeklyData,
  config,
}: BillableChartProps) {
  const t = useTranslations('Dashboard');
  const [mode, setMode] = useState<'monthly' | 'weekly'>('monthly');

  const chartData = useMemo(() => {
    return mode === 'monthly' ? monthlyData : weeklyData;
  }, [mode, monthlyData, weeklyData]);

  const seriesKeys = useMemo(() => Object.keys(config ?? {}), [config]);

  return (
    <div className="lg:col-span-2 min-w-0 rounded-2xl border border-border bg-card p-6 shadow-sm dark:bg-zinc-900/20">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-card-foreground">
            {t('chart.title')}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {t('chart.subtitle')}
          </p>
        </div>
        <div className="flex items-center rounded-lg bg-muted p-1 text-[10px] font-bold">
          {MODES.map((m) => {
            const active = mode === m.key;
            return (
              <button
                key={m.key}
                onClick={() => setMode(m.key as 'monthly' | 'weekly')}
                className={`rounded-md px-3 py-1 transition-all cursor-pointer ${
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t(m.label)}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[320px]">
        <ChartContainer config={config} className="h-full w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(148,163,184,0.08)' }}
              content={<ChartTooltipContent />}
            />
            <Legend content={<ChartLegendContent />} />
            {seriesKeys.map((key, idx) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="hours"
                name={config[key]?.label ?? key}
                fill={config[key]?.color ?? '#7c3aed'}
                radius={idx === seriesKeys.length - 1 ? [6, 6, 0, 0] : 0}
              />
            ))}
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}
