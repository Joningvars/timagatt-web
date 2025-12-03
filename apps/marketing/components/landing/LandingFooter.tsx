'use client';

type LandingFooterProps = {
  t: (key: string, values?: Record<string, any>) => string;
};

const footerColumns = [
  { titleKey: 'footer.product', links: ['Features', 'Integrations', 'Pricing', 'Changelog'] },
  { titleKey: 'footer.company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
  { titleKey: 'footer.resources', links: ['Community', 'Help Center', 'API Docs', 'Status'] },
  { titleKey: 'footer.legal', links: ['Privacy Policy', 'Terms of Service'] },
] as const;

export function LandingFooter({ t }: LandingFooterProps) {
  return (
    <footer className="border-t border-slate-100 bg-white pb-8 pt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <div className="mb-6 flex items-center gap-2">
              <img src="/logos/logo.png" alt="Timagatt Logo" className="h-8 w-auto" />
              <span className="text-lg font-bold text-slate-900">Timagatt</span>
            </div>
            <p className="mb-6 max-w-xs text-sm text-slate-500">{t('footer.desc')}</p>
            <div className="flex gap-4">
              {['twitter', 'github', 'linkedin'].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="text-slate-400 transition-colors hover:text-purple-600"
                >
                  {renderSocialIcon(icon as 'twitter' | 'github' | 'linkedin')}
                </a>
              ))}
            </div>
          </div>
          {footerColumns.map((column) => (
            <div key={column.titleKey}>
              <h4 className="mb-4 text-sm font-bold text-slate-900">{t(column.titleKey)}</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="transition-colors hover:text-purple-600">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 text-xs text-slate-400 md:flex-row">
          <p>{t('footer.rights')}</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-500">{t('footer.system_status')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function renderSocialIcon(icon: 'twitter' | 'github' | 'linkedin') {
  switch (icon) {
    case 'twitter':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      );
    case 'github':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect width="4" height="12" x="2" y="9"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      );
  }
}

