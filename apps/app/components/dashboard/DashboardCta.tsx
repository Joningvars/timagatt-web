import { Link } from '@/src/i18n/routing';

type DashboardCtaProps = {
  locale: string;
  t: (key: string, values?: Record<string, any>) => string;
};

export function DashboardCta({ locale, t }: DashboardCtaProps) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
      <h3 className="text-xl font-semibold text-slate-900">
        {t('cta.title')}
      </h3>
      <p className="mt-2 text-slate-500">{t('cta.description')}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/${locale}`}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
        >
          {t('cta.back')}
        </Link>
        <Link
          href={`/${locale}`}
          className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-500"
        >
          {t('cta.create')}
        </Link>
      </div>
    </section>
  );
}

