import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTranslations } from 'next-intl';

type ProjectExpensesProps = {
  expenses: {
    id: number;
    description: string;
    formattedDate: string;
    formattedAmount: string;
    userName: string | null;
  }[];
};

export function ProjectExpenses({ expenses }: ProjectExpensesProps) {
  const t = useTranslations('Projects.expenses');

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead className="text-right">{t('amount')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {t('noExpenses')}
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>
                  <span className="text-sm font-medium">
                    {expense.userName || '—'}
                  </span>
                </TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell>{expense.formattedDate}</TableCell>
                <TableCell className="text-right font-mono">
                  {expense.formattedAmount}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
