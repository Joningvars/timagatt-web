'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, Menu, PanelsTopLeft, Search } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { ICONS, type SidebarNavSection } from '@/lib/dashboard/data';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { LanguageSelector } from '@/components/dashboard/LanguageSelector';
import { performGlobalSearch } from '@/lib/actions';
import { SearchResults } from '@/components/dashboard/SearchResults';
import { ModeToggle } from '@/components/mode-toggle';

type DashboardHeaderProps = {
  navSections: SidebarNavSection[];
  currentDate?: string;
};

export function DashboardHeader({
  navSections,
  currentDate,
}: DashboardHeaderProps) {
  const t = useTranslations('Dashboard');
  const navItems = navSections.flatMap((section) => section.items);
  const dateDisplay = currentDate ?? '';

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    projects: any[];
    entries: any[];
    expenses: any[];
    features: any[];
  } | null>(null);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults(null);
        return;
      }

      // Search features (client-side)
      const matchedFeatures = navItems
        .filter((item) =>
          t(item.labelKey).toLowerCase().includes(query.toLowerCase())
        )
        .map((item) => ({
          ...item,
          label: t(item.labelKey),
        }));

      // Search data (server-side)
      const data = await performGlobalSearch(query);
      if ('error' in data) {
        console.error(data.error);
        return;
      }
      setResults({ ...data, features: matchedFeatures });
      setShowResults(true);
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md dark:bg-background/95">
      <div className="flex items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger className="rounded-lg border border-border p-2 text-muted-foreground transition hover:border-input hover:text-foreground md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-r border-border p-0">
            <div className="flex h-16 items-center gap-3 border-b border-border px-5">
              <PanelsTopLeft className="h-5 w-5 text-purple-600" />
              <span className="text-base font-semibold text-foreground">
                Timagatt
              </span>
            </div>
            <nav className="space-y-1 px-4 py-4">
              {navItems.map((item) => {
                const Icon = ICONS[item.iconKey];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      item.active
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="hidden items-center gap-3 md:flex">
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            {t('header.title')}
          </h1>
          <span className="text-muted">|</span>
          <span className="text-sm font-medium text-muted-foreground">
            {dateDisplay}
          </span>
        </div>
      </div>

      <div className="hidden flex-1 px-8 md:flex justify-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => {
              if (results) setShowResults(true);
            }}
            onBlur={() => {
              // Delay hiding to allow click events on results
              setTimeout(() => setShowResults(false), 200);
            }}
            placeholder={t('header.searchPlaceholder')}
            className="h-9 w-full rounded-lg border border-input bg-secondary/50 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100 dark:focus:ring-purple-900"
          />
          <div className="absolute right-2 top-2 hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground lg:flex">
            <span>⌘</span>
            <span>K</span>
          </div>
          <SearchResults
            results={results}
            visible={showResults}
            onSelect={() => {
              setShowResults(false);
              setQuery('');
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-1 justify-end">
        <ModeToggle />
        <LanguageSelector />
        <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground cursor-pointer">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2 h-2 w-2 rounded-full border border-background bg-red-500" />
          <span className="sr-only">Notifications</span>
        </button>
      </div>
    </header>
  );
}
