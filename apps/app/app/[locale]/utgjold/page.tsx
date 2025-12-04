import { currentUser } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';
import { format } from 'date-fns';

import { PageHeader } from '@/components/dashboard/PageHeader';
import { ExpensesTable } from '@/components/dashboard/ExpensesTable';
import { EmptyState } from '@/components/dashboard/EmptyState';
import {
  getExpensesForOrganization,
  getUserOrganization,
} from '@/lib/dashboard/queries';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default async function ExpensesPage({
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
      <div className="flex w-full flex-1 flex-col gap-6">
          <PageHeader title="Útgjöld" subtitle="Eftirlit með kostnaði" />
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

  const [expenseRows] = await Promise.all([
    getExpensesForOrganization(organization.organizationId),
  ]);

  const formattedExpenses = expenseRows.map((expense) => ({
    id: expense.id,
    description: expense.description,
    amount: currencyFormatter.format(Number(expense.amount ?? 0)),
    date: expense.date ? format(expense.date, 'dd MMM') : '—',
    project: expense.projectName ?? '—',
    user: expense.userName ?? '—',
  }));

  return (
    <div className="grid w-full flex-1 grid-cols-1 gap-6">
        <PageHeader title="Útgjöld" subtitle="Eftirlit með kostnaði" />
            {formattedExpenses.length ? (
              <ExpensesTable rows={formattedExpenses} title="Nýjustu útgjöld" />
            ) : (
              <EmptyState
                title="Engin útgjöld skráð"
                description="Bættu við útgjöldum eða stofnaðu verkefni til að byrja."
                primaryAction={{
                  href: `${localePrefix}/verkefni`,
                  label: 'Stofna verkefni',
                }}
                secondaryAction={{
                  href: `${localePrefix}/timaskraningar`,
                  label: 'Skrá tíma',
                }}
              />
            )}
    </div>
  );
}
