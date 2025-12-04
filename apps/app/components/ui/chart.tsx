// Shadcn chart helpers adapted for Recharts
'use client';

import * as React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
  type LegendProps,
} from 'recharts';

type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
  }
>;

type ChartContainerProps = {
  config: ChartConfig;
  children: React.ReactNode;
  className?: string;
};

const ChartContext = React.createContext<{ config: ChartConfig } | null>(null);

function ChartContainer({ config, children, className }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={{ config }}>
      <div className={className} data-chart="chart">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

function ChartTooltipContent(props: TooltipProps<number, string>) {
  const { active, payload, label } = props;
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-sm">
      <div className="mb-1 font-semibold text-slate-900">{label}</div>
      <div className="space-y-1">
        {payload.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-slate-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color ?? '#94a3b8' }}
            />
            <span className="font-medium">{item.name}</span>
            <span className="text-slate-500">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartLegendContent({ payload }: LegendProps) {
  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="font-medium text-slate-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export {
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
};
export type { ChartConfig };
