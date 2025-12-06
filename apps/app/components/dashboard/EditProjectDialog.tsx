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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateJob } from '@/lib/actions';
import { toast } from 'sonner';
import { Pencil } from 'lucide-react';

type EditProjectDialogProps = {
  project: {
    id: number;
    name: string;
    description: string | null;
    color?: string | null;
    hourlyRate?: number | null;
  };
};

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Dashboard.projects');
  const tDetails = useTranslations('Projects.details');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await updateJob(project.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(t('updateSuccess'));
      setOpen(false);
    }
    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-3.5 w-3.5" />
          {tDetails('edit')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{tDetails('edit')}</DialogTitle>
            <DialogDescription>
              {t('editProjectDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('projectName')}</Label>
              <Input
                id="name"
                name="name"
                defaultValue={project.name}
                placeholder={t('projectNamePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('projectDescription')}</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={project.description || ''}
                placeholder={t('projectDescriptionPlaceholder')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="hourlyRate">{t('hourlyRate')}</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                defaultValue={project.hourlyRate || '20000'}
                placeholder="20000"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">{t('projectColor')}</Label>
              <div className="flex gap-2">
                {[
                    "bg-purple-500",
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                    "bg-red-500",
                    "bg-indigo-500",
                    "bg-pink-500",
                    "bg-orange-500",
                ].map((colorClass) => (
                    <label key={colorClass} className="cursor-pointer">
                        <input 
                            type="radio" 
                            name="color" 
                            value={colorClass} 
                            defaultChecked={project.color === colorClass}
                            className="peer sr-only" 
                        />
                        <div className={`h-6 w-6 rounded-full ${colorClass} ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus:ring-2 peer-focus:ring-slate-900`}></div>
                    </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? t('updating') : t('update')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

