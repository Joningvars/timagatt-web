'use client';

type TrustedCompaniesProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

export function TrustedCompanies({ t }: TrustedCompaniesProps) {
  return (
    <section className="py-16 text-center">
      <p className="mb-8 text-sm font-medium text-slate-400">{t('trusted_by')}</p>
      <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 transition-all duration-500 hover:grayscale-0 hover:opacity-70 grayscale">
        <span className="font-serif text-2xl font-bold text-slate-800">Forbes</span>
        <BrandBadge label="CNBC" />
        <span className="font-sans text-xl font-bold text-slate-800">Bloomberg</span>
        <span className="font-serif text-2xl font-black italic tracking-tight text-slate-800">
          Inc.
        </span>
        <BrandBadge label="CNBC" />
      </div>
    </section>
  );
}

function BrandBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1 text-xl font-bold tracking-tighter text-slate-800">
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
      {label}
    </div>
  );
}

