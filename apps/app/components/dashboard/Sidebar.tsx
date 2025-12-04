'use client';
import Image from 'next/image';
import Link from 'next/link';
import {
  ICONS,
  type Client,
  type SidebarNavSection,
} from '@/lib/dashboard/data';
import { useTranslations } from 'next-intl';
import { SidebarSettingsButton } from '@/components/dashboard/SidebarSettingsButton';

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
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)] md:flex">
      <div className="flex h-16 shrink-0 items-center border-b border-slate-50 px-6">
        <div className="flex items-center gap-2.5">
          <div className="grid grid-cols-2 gap-1">
            <div className="h-2.5 w-2.5 rounded-full bg-purple-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-purple-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-purple-400/60" />
            <div className="h-2.5 w-2.5 rounded-full bg-purple-300/40" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Timagatt
          </span>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {navSections.map((section) => (
          <div className="space-y-1" key={section.titleKey}>
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                      ? 'bg-purple-50 text-purple-700 shadow-inner shadow-purple-100'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" strokeWidth={1.5} />}
                  <span>{t(item.labelKey)}</span>
                  {item.badge ? (
                    <span className="ml-auto rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
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
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {t('sidebar.clientsHeading')}
            </span>
            <button
              className="text-slate-400 transition-colors hover:text-purple-600"
              type="button"
            >
              +
            </button>
          </div>
          {clients.map((client) => (
            <button
              key={client.name}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-500 transition-all hover:bg-slate-50 hover:text-slate-900"
            >
              <span className={`h-2 w-2 rounded-full ${client.color}`} />
              {client.name}
            </button>
          ))}
        </div>

        <div className="space-y-1 border-t border-slate-50 pt-4">
          <SidebarSettingsButton label={t('sidebar.settings')} />
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-slate-50">
          <Image
            src={avatar}
            alt={name}
            width={36}
            height={36}
            className="rounded-full border border-slate-200 object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-slate-900">{name}</p>
            <p className="truncate text-[10px] text-slate-500">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
