'use client';

export function ProductShowcase() {
  return (
    <section className="relative mx-auto max-w-7xl px-4">
      <div className="group relative w-full overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_40px_100px_-20px_rgba(139,92,246,0.15)]">
        <div className="flex h-12 items-center gap-4 border-b border-slate-50 bg-slate-50/50 px-6">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full bg-red-400/80" />
            <div className="h-3 w-3 rounded-full bg-amber-400/80" />
            <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="hidden flex-1 justify-center gap-2 opacity-0 transition-opacity md:flex md:opacity-100">
            <div className="flex w-64 items-center justify-center gap-2 rounded-lg border border-slate-100 bg-white px-3 py-1.5 text-xs text-slate-400 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              app.timagatt.com
            </div>
          </div>
          <div className="flex gap-4 text-slate-400">
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
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" x2="12" y1="2" y2="15"></line>
            </svg>
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
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
          </div>
        </div>
        <div className="flex h-full bg-[#fcfcfd]">
          <div className="hidden w-60 flex-col gap-8 border-r border-slate-100 bg-white p-6 md:flex">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600">
                TL
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Timagatt LLC</div>
                <div className="text-[10px] text-slate-500">admin@timagatt.com</div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="mb-3 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Main Menu
              </div>
              <MenuLink active label="Home" icon="layout-grid" />
              <MenuLink label="Inbox" icon="inbox" />
              <MenuLink label="My Tasks" icon="check-square" />
            </div>
            <div className="mt-auto">
              <div className="mb-2 flex items-center justify-between px-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  My Projects
                </span>
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
                  <path d="M5 12h14"></path>
                  <path d="M12 5v14"></path>
                </svg>
              </div>
              <div className="space-y-1">
                <ProjectRow label="Marketing Update" badge="20" color="bg-red-500" />
                <ProjectRow label="Web Development" badge="2" color="bg-emerald-500" />
              </div>
            </div>
          </div>
          <div className="relative flex-1 overflow-hidden p-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Sunday, March 25</h2>
                <p className="mt-1 text-xs text-slate-500">Welcome back to your dashboard</p>
              </div>
              <button className="rounded-full bg-slate-900 px-5 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-lg shadow-slate-900/20">
                Start Focus
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                        Week Progress
                      </p>
                      <h3 className="text-2xl font-extrabold text-slate-900">82%</h3>
                    </div>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-bold text-slate-500">
                      Adjust
                    </button>
                  </div>
                  <div className="mt-6 h-2 rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: '82%' }} />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricCard title="Tasks Completed" value="45" badge="+12%" />
                  <MetricCard title="Avg. Session" value="2h 18m" badge="+18%" />
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Active Projects</h3>
                    <button className="text-xs font-bold text-purple-600">View All</button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {['Brand Refresh', 'Mobile App', 'Research Sprint'].map((project) => (
                      <div key={project} className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{project}</p>
                          <p className="text-xs text-slate-500">Due in 3 days</p>
                        </div>
                        <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-600">
                          72%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Team Availability</h3>
                  <div className="mt-4 space-y-4">
                    {['Sarah', 'Alex', 'Tom'].map((member, index) => (
                      <div key={member} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-slate-100" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{member}</p>
                            <p className="text-xs text-slate-500">Product Designer</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-500">
                          {['Available', 'In Focus', 'Offline'][index]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900">Upcoming Review</h3>
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      March 28 · 9:30 AM
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      UX Research Sprint Review
                    </p>
                    <p className="text-xs text-slate-500">Hosted by Timagatt Ops</p>
                    <button className="mt-4 w-full rounded-full bg-slate-900 py-2 text-xs font-semibold uppercase tracking-wider text-white">
                      Join Session
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuLink({
  label,
  icon,
  active,
}: {
  label: string;
  icon: 'layout-grid' | 'inbox' | 'check-square';
  active?: boolean;
}) {
  const baseClasses =
    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors';
  return (
    <a
      href="#"
      className={
        active
          ? `${baseClasses} bg-purple-50 text-purple-600`
          : `${baseClasses} text-slate-500 hover:bg-slate-50 hover:text-slate-900`
      }
    >
      <span className="text-slate-500">{renderIcon(icon)}</span>
      {label}
    </a>
  );
}

function renderIcon(icon: 'layout-grid' | 'inbox' | 'check-square') {
  switch (icon) {
    case 'layout-grid':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="7" height="7" x="3" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="3" rx="1"></rect>
          <rect width="7" height="7" x="14" y="14" rx="1"></rect>
          <rect width="7" height="7" x="3" y="14" rx="1"></rect>
        </svg>
      );
    case 'inbox':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
        </svg>
      );
    case 'check-square':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
      );
  }
}

function ProjectRow({
  label,
  badge,
  color,
}: {
  label: string;
  badge: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600">
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-1.5 rounded-full ${color}`} />
        {label}
      </div>
      <span className="rounded px-1.5 py-0.5 text-[10px] text-slate-500">{badge}</span>
    </div>
  );
}

function MetricCard({ title, value, badge }: { title: string; value: string; badge: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{title}</p>
      <div className="mt-3 flex items-center justify-between">
        <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-bold text-emerald-600">
          {badge}
        </span>
      </div>
    </div>
  );
}

