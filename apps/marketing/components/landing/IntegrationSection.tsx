'use client';

export function IntegrationSection() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="mb-12 text-3xl font-bold tracking-tight text-slate-900">
          Connects with your favorite tools
        </h2>
        <div className="relative flex items-center justify-center py-10">
          <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border border-slate-100 bg-white shadow-xl">
            <div className="flex gap-1">
              <div className="h-3 w-3 rounded-full bg-purple-600" />
              <div className="h-3 w-3 rounded-full bg-purple-400" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-[300px] w-[300px] rounded-full border border-dashed border-slate-300 animate-spin-slow" />
          </div>
          <OrbitBadge className="top-0 left-1/2 -translate-x-24" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg" alt="Slack" />
          <OrbitBadge className="bottom-4 right-1/4" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
          <OrbitBadge className="top-1/2 right-10" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma" />
          <OrbitBadge className="top-1/2 left-10" src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg" alt="Jira" />
        </div>
      </div>
    </section>
  );
}

function OrbitBadge({
  className,
  src,
  alt,
}: {
  className: string;
  src: string;
  alt: string;
}) {
  return (
    <div
      className={`absolute flex h-12 w-12 items-center justify-center rounded-xl border border-slate-100 bg-white p-2 shadow-md ${className}`}
    >
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
  );
}

