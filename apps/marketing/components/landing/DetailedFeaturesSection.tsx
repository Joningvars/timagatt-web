'use client';

type DetailedFeaturesProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

const featureKeys = [
  'detailed_features.instant_updates',
  'detailed_features.security',
  'detailed_features.collaborative',
] as const;

const featureIcons = ['zap', 'shield-check', 'users-2'] as const;

export function DetailedFeaturesSection({ t }: DetailedFeaturesProps) {
  return (
    <section className="mx-auto max-w-7xl border-t border-slate-100 px-6 py-20">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-slate-900">
          {t('detailed_features.title')}
        </h2>
        <p className="mx-auto max-w-2xl text-slate-500">{t('detailed_features.subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {featureKeys.map((key, idx) => (
          <article
            key={key}
            className="group rounded-2xl p-6 transition-colors hover:bg-slate-50"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg text-purple-600 transition-transform group-hover:scale-110"
              style={{ backgroundColor: ['#F3E8FF', '#DBEAFE', '#DCFCE7'][idx] }}>
              {renderFeatureIcon(featureIcons[idx])}
            </div>
            <h3 className="mb-2 text-lg font-bold text-slate-900">{t(`${key}.title`)}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{t(`${key}.desc`)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function renderFeatureIcon(icon: (typeof featureIcons)[number]) {
  switch (icon) {
    case 'zap':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      );
    case 'shield-check':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
          <path d="m9 12 2 2 4-4"></path>
        </svg>
      );
    case 'users-2':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 19a6 6 0 0 0-12 0"></path>
          <circle cx="8" cy="9" r="4"></circle>
          <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"></path>
        </svg>
      );
  }
}

