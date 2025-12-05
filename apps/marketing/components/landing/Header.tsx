'use client';

import { Link } from '@/src/i18n/routing';
import { Button } from '@/components/ui/button';

type LandingHeaderProps = {
  isScrolled: boolean;
  t: (key: string, values?: Record<string, any>) => string;
};

export function LandingHeader({ isScrolled, t }: LandingHeaderProps) {
  return (
    <header
      className={`fixed top-0 z-50 w-full border-b border-transparent transition-all duration-300 ${
        isScrolled ? 'bg-white/95 shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex cursor-pointer items-center gap-2.5">
          <img
            src="/logos/logo.png"
            alt="Timagatt Logo"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Tímagátt
          </span>
        </div>
        <nav className="hidden items-center gap-10 md:flex">
          {['home', 'features', 'customers', 'pricing', 'blog'].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-purple-600"
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
        </nav>
        <Button variant="outline" className="rounded-full" asChild>
          <a href="https://app.timagatt.is">{t('nav.login')}</a>
        </Button>
      </div>
    </header>
  );
}
