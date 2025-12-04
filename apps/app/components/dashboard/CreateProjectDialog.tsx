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
import { createJob } from '@/lib/actions';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Dashboard.projects');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(event.currentTarget);
    const result = await createJob(formData);

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
      <DialogTrigger asChild>
        <Button size="sm" className="h-9 gap-2">
          <Plus className="h-4 w-4" />
          {t('newProject')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('newProject')}</DialogTitle>
            <DialogDescription>
              {t('newProjectDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">{t('projectName')}</Label>
              <Input
                id="name"
                name="name"
                placeholder={t('projectNamePlaceholder')}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">{t('projectDescription')}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder={t('projectDescriptionPlaceholder')}
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
                        <input type="radio" name="color" value={colorClass} className="peer sr-only" />
                        <div className={`h-6 w-6 rounded-full ${colorClass} ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus:ring-2 peer-focus:ring-slate-900`}></div>
                    </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
                {isLoading ? t('creating') : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

