'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import {
  ICONS,
  type Client,
  type SidebarNavSection,
} from '@/lib/dashboard/data';
import { useTranslations } from 'next-intl';
import { useTimer } from '@/components/TimerProvider';
import { Timer, Square, Pause, Play } from 'lucide-react';

type SidebarProps = {
  navSections: SidebarNavSection[];
  clients: Client[];
  avatar: string;
  name: string;
  email: string;
};

import { useLocale } from 'next-intl';

export function Sidebar({
  navSections,
  clients,
  avatar,
  name,
  email,
}: SidebarProps) {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const { openUserProfile } = useClerk();
  const { isRunning, isPaused, elapsed, projectName, stop, pause, resume } =
    useTimer();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m
      .toString()
      .padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] md:flex dark:shadow-none">
      <div className="flex h-16 shrink-0 items-center border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8">
            <Image
              src="/logos/logo.png"
              alt="Timagatt Logo"
              fill
              className="object-contain dark:hidden"
            />
            <Image
              src="/logos/logo-darkmode.png"
              alt="Timagatt Logo"
              fill
              className="object-contain hidden dark:block"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-sidebar-foreground">
            Timagatt
          </span>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {(isRunning || isPaused) && (
          <div className="mb-6 rounded-xl border border-border bg-background p-4 shadow-sm dark:bg-zinc-900/20">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-foreground">
                <div className="relative flex h-2 w-2">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isPaused ? 'bg-yellow-400' : 'animate-ping bg-purple-400'
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isPaused ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}
                  ></span>
                </div>
                {isPaused ? t('timer.paused') : t('timer.running')}
              </span>
              <div className="flex items-center gap-1">
                {isPaused ? (
                  <button
                    onClick={() => resume()}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
                    title={t('timer.resume')}
                  >
                    <Play className="h-3 w-3 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => pause()}
                    className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1"
                    title={t('timer.pause')}
                  >
                    <Pause className="h-3 w-3 fill-current" />
                  </button>
                )}
              </div>
            </div>
            <div className="text-2xl font-mono font-bold text-foreground tabular-nums tracking-tight">
              {formatTime(elapsed)}
            </div>
            <div className="mt-1 text-[10px] font-medium text-muted-foreground truncate">
              {projectName || t('timer.noProject')}
            </div>
          </div>
        )}

        {navSections.map((section) => (
          <div className="space-y-1" key={section.titleKey}>
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {t(section.titleKey)}
            </div>
            {section.items.map((item) => {
              const Icon = ICONS[item.iconKey];
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-purple-50 text-purple-700 dark:bg-white/5 dark:text-white'
                      : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
                  <span>{t(item.labelKey)}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-md bg-sidebar-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}

        <div className="space-y-1">
          <div className="mb-2 flex items-center justify-between px-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">
              {t('sidebar.clientsHeading')}
            </span>
            <Link
              href={`/${locale}/verkefni`}
              className="text-muted-foreground transition-colors hover:text-purple-600 cursor-pointer"
            >
              +
            </Link>
          </div>
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/${locale}/verkefni/${client.id}`}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer"
            >
              <span className={`h-2 w-2 rounded-full ${client.color}`} />
              {client.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-sidebar-border p-4">
        <button
          type="button"
          onClick={() => openUserProfile()}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-sidebar-accent cursor-pointer"
        >
          <Image
            src={avatar}
            alt={name}
            width={36}
            height={36}
            className="rounded-full border border-sidebar-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-sidebar-foreground">
              {name}
            </p>
            <p className="truncate text-[10px] text-muted-foreground">
              {email}
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
}
