import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { InvoicesTable } from '@/components/dashboard/InvoicesTable';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  getInvoiceSummaries,
  getUserOrganization,
} from '@/lib/dashboard/queries';

export default async function InvoicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await currentUser();
  const t = await getTranslations({ locale, namespace: 'Dashboard' });

  if (!user?.id) {
    return null;
  }

  const organization = await getUserOrganization(user.id);

  const localePrefix = `/${locale}`;

  if (!organization) {
    return (
      <div className="grid w-full flex-1 grid-cols-1 gap-6">
        <PageHeader title="Reikningar" subtitle="Samantekt reikninga" />
        <EmptyState
          title={t('cta.title')}
          description={t('cta.description')}
          primaryAction={{
            href: `${localePrefix}/verkefni`,
            label: t('cta.create'),
          }}
          secondaryAction={{
            href: `${localePrefix}/timaskraningar`,
            label: t('cta.track'),
          }}
        />
      </div>
    );
  }

  const [invoices] = await Promise.all([
    getInvoiceSummaries(organization.organizationId),
  ]);

  return (
    <div className="grid w-full flex-1 grid-cols gap-6">
      <PageHeader title="Reikningar" subtitle="Samantekt reikninga" />
      {invoices.length ? (
        <InvoicesTable rows={invoices} title="Reikningar" />
      ) : (
        <EmptyState
          title="Engir reikningar til"
          description="Bættu við tímaskráningum eða verkefnum til að búa til reikninga."
          primaryAction={{
            href: `${localePrefix}/timaskraningar`,
            label: 'Skrá tíma',
          }}
          secondaryAction={{
            href: `${localePrefix}/verkefni`,
            label: 'Stofna verkefni',
          }}
        />
      )}
    </div>
  );
}
