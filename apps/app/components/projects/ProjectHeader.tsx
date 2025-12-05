import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  MoreVertical,
  Pencil,
  Plus,
  Settings,
  Trash2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/lib/dashboard/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProjectHeaderProps = {
  project: {
    id: number;
    name: string;
    description: string | null;
    color?: string | null;
  };
  locale: string;
};

export function ProjectHeader({ project, locale }: ProjectHeaderProps) {
  const t = useTranslations('Projects.details');

  return (
    <div className="flex flex-col gap-6 pb-6 border-b border-border">
      <div className="flex items-center gap-2">
        <Link
          href={`/${locale}/verkefni`}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm font-medium text-foreground">
          {project.name}
        </span>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-sm"
            style={{
              backgroundColor: project.color ? `${project.color}20` : undefined,
              borderColor: project.color ? `${project.color}40` : undefined,
            }}
          >
            <span
              className="text-2xl font-bold"
              style={{ color: project.color || 'currentColor' }}
            >
              {project.name.substring(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {project.description || t('noDescription')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-3.5 w-3.5" />
            {t('edit')}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-red-600 focus:text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                {t('delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

