import Image from 'next/image';

type DashboardHeaderProps = {
  name: string;
  t: (key: string, values?: Record<string, any>) => string;
};

export function DashboardHeader({ name, t }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-100 bg-white/80 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button className="md:hidden">
          <span className="sr-only">Toggle menu</span>
          <Image
            src="/logos/logo.png"
            alt="Timagatt"
            width={24}
            height={24}
            className="h-6 w-6"
          />
        </button>
        <div className="flex items-center gap-3">
          <Image
            src="/logos/logo.png"
            alt="Timagatt"
            width={32}
            height={32}
            className="h-8 w-auto"
          />
          <div>
            <p className="text-xs font-medium text-slate-500">
              {t('header.subtitle')}
            </p>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              {t('header.title')}
            </h1>
          </div>
        </div>
        <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 md:inline-flex">
          {t('header.period')}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search…"
            className="h-9 w-64 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs font-medium text-slate-700 placeholder:text-slate-400 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
          />
        </div>
        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600">
          <span className="sr-only">Notifications</span>
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-white bg-red-500" />
        </button>
      </div>
    </header>
  );
}

