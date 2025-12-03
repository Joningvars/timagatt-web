'use client';

type HeroSectionProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

export function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="mx-auto mb-20 max-w-5xl px-6">
      <div className="flex flex-col items-center space-y-8 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-slate-100 bg-white px-2 py-2 pr-5 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex -space-x-3">
            {[5, 9, 12].map((img) => (
              <img
                key={img}
                src={`https://i.pravatar.cc/100?img=${img}`}
                className="h-8 w-8 rounded-full border-2 border-white"
                alt="User"
              />
            ))}
            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-[10px] font-bold text-purple-600">
              +2k
            </div>
          </div>
          <span className="text-sm font-medium text-slate-600">
            <span className="font-bold text-slate-900">359K+</span>{' '}
            {t('hero.social_proof', { count: '359K' })}
          </span>
        </div>
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900 md:text-7xl">
          {t('hero.headline')}
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-indigo-500 bg-clip-text text-transparent">
            {t('hero.headline_highlight')}
          </span>
        </h1>
        <p className="max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
          {t('hero.subheadline')}
        </p>
        <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
          <a
            href="https://app.timagatt.is"
            className="group flex h-14 items-center gap-2 rounded-full bg-[#8b5cf6] px-8 text-base font-bold text-white shadow-lg shadow-purple-500/30 transition hover:bg-[#7c3aed]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5v14"></path>
            </svg>
            {t('hero.join_us')}
          </a>
          <button className="h-14 rounded-full border border-purple-100 bg-purple-50 px-8 text-base font-bold text-purple-900 transition hover:bg-purple-100 hover:border-purple-200">
            {t('hero.preview_growth')}
          </button>
        </div>
      </div>
    </section>
  );
}

