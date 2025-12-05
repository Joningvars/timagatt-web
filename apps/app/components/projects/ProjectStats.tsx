import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, CreditCard, DollarSign } from 'lucide-react';
import { useTranslations } from 'next-intl';

type ProjectStatsProps = {
  stats: {
    totalHours: string;
    totalExpenses: string;
    billableAmount: string;
  };
};

export function ProjectStats({ stats }: ProjectStatsProps) {
  const t = useTranslations('Projects.stats');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('totalHours')}
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalHours}</div>
          <p className="text-xs text-muted-foreground">
            {t('hoursLogged')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('expenses')}
          </CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalExpenses}</div>
          <p className="text-xs text-muted-foreground">
            {t('expensesLogged')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {t('billableAmount')}
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.billableAmount}</div>
          <p className="text-xs text-muted-foreground">
            {t('estimatedValue')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

