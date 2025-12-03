'use client';

type LandingCtaProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

export function LandingCta({ t }: LandingCtaProps) {
  return (
    <section className="mx-auto mb-20 max-w-7xl px-6">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-purple-600 to-indigo-600 p-12 text-center text-white md:p-20">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <h2 className="relative z-10 mb-6 text-3xl font-bold tracking-tight md:text-5xl">
          {t('cta.title')}
        </h2>
        <p className="relative z-10 mx-auto mb-10 max-w-xl text-lg text-purple-100">
          {t('cta.subtitle')}
        </p>
        <a
          href="https://app.timagatt.is"
          className="relative z-10 inline-flex rounded-full bg-white px-8 py-4 font-bold text-purple-600 shadow-lg shadow-purple-900/20 transition hover:bg-purple-50"
        >
          {t('cta.button')}
        </a>
      </div>
    </section>
  );
}

