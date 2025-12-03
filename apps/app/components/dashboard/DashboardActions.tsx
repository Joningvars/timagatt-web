"use client";

import { Download, Play } from "lucide-react";
import { useCallback } from "react";
import posthog from "posthog-js";

type DashboardActionsProps = {
  exportLabel: string;
  startLabel: string;
};

const hasPosthog = Boolean(process.env.NEXT_PUBLIC_POSTHOG_KEY);

export function DashboardActions({
  exportLabel,
  startLabel,
}: DashboardActionsProps) {
  const handleExport = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture("dashboard_export_clicked", {
      format: "csv",
    });
  }, []);

  const handleStart = useCallback(() => {
    if (!hasPosthog) {
      return;
    }

    posthog.capture("dashboard_timer_started");
  }, []);

  return (
    <div className="flex gap-3">
      <button
        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
        onClick={handleExport}
        type="button"
      >
        <Download className="h-3.5 w-3.5" />
        {exportLabel}
      </button>
      <button
        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-md shadow-slate-200 transition hover:bg-slate-800"
        onClick={handleStart}
        type="button"
      >
        <Play className="h-3.5 w-3.5" />
        {startLabel}
      </button>
    </div>
  );
}


