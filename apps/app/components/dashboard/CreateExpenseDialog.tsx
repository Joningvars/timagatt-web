'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createExpense } from '@/lib/actions';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import type { Project } from '@/lib/dashboard/data';

type CreateExpenseDialogProps = {
  projects: Project[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function CreateExpenseDialog({
  projects,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CreateExpenseDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const t = useTranslations('Dashboard.expenses');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const date = formData.get('date') as string;
    const amount = formData.get('amount') as string;
    const description = formData.get('description') as string;

    if (!date) {
      toast.error(t('dateRequired'));
      setIsLoading(false);
      return;
    }

    if (!selectedProject) {
      toast.error(t('projectRequired'));
      setIsLoading(false);
      return;
    }

    const result = await createExpense({
      projectId: Number(selectedProject),
      description,
      amount,
      date,
    });

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('createSuccess'));
      setOpen(false);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background shadow-md shadow-border transition hover:bg-foreground/90">
            <Plus className="h-3.5 w-3.5" />
            {t('create')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('new')}</DialogTitle>
            <DialogDescription>{t('newDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">{t('project')}</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger className="cursor-pointer">
                  <SelectValue placeholder={t('selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('projects')}</SelectLabel>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
                        className="cursor-pointer"
                      >
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('description')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('descriptionPlaceholder')}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date">{t('date')}</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="cursor-pointer"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">{t('amount')}</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading} className="cursor-pointer">
              {isLoading ? t('creating') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

