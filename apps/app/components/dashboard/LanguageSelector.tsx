'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/src/i18n/routing';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600 cursor-pointer">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleLocaleChange('en')}
          className={`cursor-pointer ${locale === 'en' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          🇺🇸 English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleLocaleChange('is')}
          className={`cursor-pointer ${locale === 'is' ? 'bg-accent text-accent-foreground' : ''}`}
        >
          🇮🇸 Íslenska
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

