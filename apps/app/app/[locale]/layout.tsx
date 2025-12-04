import type { ReactNode } from 'react';
import { Providers } from '@/app/providers';
import { Toaster } from '@/components/ui/sonner';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/src/i18n/routing';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { currentUser } from '@clerk/nextjs/server';
import {
  getSidebarClients,
  getSidebarSections,
  getUserOrganization,
} from '@/lib/dashboard/queries';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supportedLocales = routing.locales as string[];

  // Ensure that the incoming `locale` is valid
  if (!supportedLocales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  const user = await currentUser();
  const membership = user?.id ? await getUserOrganization(user.id) : null;
  const navSections = await getSidebarSections(locale, '');
  const clients =
    membership?.organizationId != null
      ? await getSidebarClients(membership.organizationId)
      : [];

  const safeName =
    user?.firstName ??
    user?.username ??
    user?.emailAddresses?.[0]?.emailAddress ??
    'Notandi';
  const safeEmail =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    '—';
  const safeAvatar = user?.imageUrl ?? 'https://i.pravatar.cc/100?img=33';

  const dashboardMessages =
    (messages as any)?.Dashboard &&
    typeof (messages as any).Dashboard === 'object'
      ? (messages as any).Dashboard
      : {};

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <DashboardShell
          navSections={navSections}
          clients={clients}
          user={{ name: safeName, email: safeEmail, avatar: safeAvatar }}
          dashboardMessages={dashboardMessages as Record<string, string>}
        >
          {children}
        </DashboardShell>
        <Toaster />
      </Providers>
    </NextIntlClientProvider>
  );
}
