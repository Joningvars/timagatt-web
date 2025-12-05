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

type ProjectTimeEntriesProps = {
  entries: {
    id: number;
    description: string | null;
    formattedDate: string;
    formattedDuration: string;
    userName: string | null;
    userAvatar: string | null;
  }[];
};

export function ProjectTimeEntries({ entries }: ProjectTimeEntriesProps) {
  const t = useTranslations('Projects.entries');

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('user')}</TableHead>
            <TableHead>{t('description')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead className="text-right">{t('duration')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                {t('noEntries')}
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={entry.userAvatar || ''} />
                      <AvatarFallback>
                        {entry.userName?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">
                      {entry.userName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{entry.description || '—'}</TableCell>
                <TableCell>{entry.formattedDate}</TableCell>
                <TableCell className="text-right font-mono">
                  {entry.formattedDuration}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

