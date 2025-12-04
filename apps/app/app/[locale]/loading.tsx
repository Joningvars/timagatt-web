function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
      <div className="mb-4 flex items-start justify-between">
        <div className="h-10 w-10 rounded-xl bg-slate-100" />
        <div className="h-5 w-14 rounded-full bg-slate-100" />
      </div>
      <div className="mb-2 h-3 w-28 rounded bg-slate-100" />
      <div className="h-6 w-16 rounded bg-slate-100" />
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-32 rounded bg-slate-100" />
      <div className="h-4 w-48 rounded bg-slate-100" />
      <div className="mt-6 flex h-48 items-end gap-2">
        {Array.from({ length: 10 }).map((_, idx) => (
          <div
            key={idx}
            className="w-full max-w-[18px] rounded bg-slate-100"
            style={{ height: `${30 + (idx % 5) * 10}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function SkeletonActivity() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-4 h-4 w-28 rounded bg-slate-100" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="flex gap-3">
            <div className="mt-1 h-5 w-5 rounded-full border-2 border-slate-100 bg-white" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded bg-slate-100" />
              <div className="h-3 w-48 rounded bg-slate-100" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-4 w-32 rounded bg-slate-100" />
        <div className="h-9 w-64 rounded bg-slate-100" />
      </div>
      <div className="overflow-x-auto">
        <div className="space-y-0.5 p-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 rounded-lg border border-slate-100 bg-white px-4 py-3"
            >
              <div className="h-8 w-8 rounded-lg bg-slate-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-32 rounded bg-slate-100" />
                <div className="h-2.5 w-24 rounded bg-slate-100" />
              </div>
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-12 rounded bg-slate-100" />
              <div className="h-3 w-16 rounded bg-slate-100" />
              <div className="h-3 w-10 rounded bg-slate-100" />
              <div className="h-3 w-6 rounded bg-slate-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="flex h-screen w-full bg-slate-50">
      {/* Sidebar skeleton (visible on md+) */}
      <aside className="hidden h-full w-64 shrink-0 flex-col border-r border-slate-100 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] md:flex">
        <div className="flex h-16 items-center gap-3 border-b border-slate-50 px-6">
          <div className="h-4 w-24 rounded bg-slate-100" />
        </div>
        <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-4 py-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="space-y-2">
              <div className="h-3 w-20 rounded bg-slate-100" />
              {Array.from({ length: 4 }).map((__, j) => (
                <div
                  key={j}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                >
                  <div className="h-4 w-4 rounded bg-slate-100" />
                  <div className="h-3 w-24 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-lg p-2">
            <div className="h-9 w-9 rounded-full bg-slate-100" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-24 rounded bg-slate-100" />
              <div className="h-2.5 w-20 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {/* Header skeleton */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-4 w-24 rounded bg-slate-100" />
            <div className="h-4 w-12 rounded bg-slate-100" />
          </div>
          <div className="h-9 w-32 rounded-full bg-slate-100" />
        </header>

        {/* Body scroll area */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-4 md:px-6">
          <div className="space-y-8">
            {/* Stats skeletons */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>

            {/* Chart + Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:min-h-[400px]">
              <SkeletonChart />
              <SkeletonActivity />
            </div>

            {/* Table */}
            <SkeletonTable />
          </div>
        </div>
      </div>
    </div>
  );
}
