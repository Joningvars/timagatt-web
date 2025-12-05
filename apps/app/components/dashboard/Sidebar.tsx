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

type SidebarProps = {
  navSections: SidebarNavSection[];
  clients: Client[];
  avatar: string;
  name: string;
  email: string;
};

export function Sidebar({
  navSections,
  clients,
  avatar,
  name,
  email,
}: SidebarProps) {
  const t = useTranslations('Dashboard');
  const { openUserProfile } = useClerk();

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
            <button
              className="text-muted-foreground transition-colors hover:text-purple-600 cursor-pointer"
              type="button"
            >
              +
            </button>
          </div>
          {clients.map((client) => (
            <button
              key={client.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer"
            >
              <span className={`h-2 w-2 rounded-full ${client.color}`} />
              {client.name}
            </button>
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
            <p className="truncate text-xs font-bold text-sidebar-foreground">{name}</p>
            <p className="truncate text-[10px] text-muted-foreground">{email}</p>
          </div>
        </button>
      </div>
    </aside>
  );
}
