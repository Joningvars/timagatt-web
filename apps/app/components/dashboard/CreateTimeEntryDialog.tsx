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
import { createTimeEntry } from '@/lib/actions';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

type Project = {
  id: number;
  name: string;
};

export function CreateTimeEntryDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Dashboard.entries');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const description = formData.get('description') as string;

    const data = {
      projectId: Number(selectedProject),
      description,
      startTime,
      endTime: endTime || undefined,
    };

    if (!data.projectId) {
      toast.error(t('projectRequired'));
      setIsLoading(false);
      return;
    }

    // I need to adjust the action to parse strings to dates or do it here.
    // The schema expects string for dates and transforms them.
    // But the action expects the inferred type which has Date.
    // Wait, the schema `z.string().transform(...)` results in a Date type.
    // So passing strings to the action might fail if the action argument type is the OUTPUT of the schema (Date), not the INPUT (string).
    // Let's check the action definition again.

    // The action signature: export async function createTimeEntry(data: z.infer<typeof createTimeEntrySchema>)
    // `z.infer<typeof createTimeEntrySchema>` infers the OUTPUT type of the transform, which is Date.
    // So I must pass Date objects to the action.

    const payload = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };

    const result = await createTimeEntry(payload);

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
          {t('newEntry')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{t('newEntry')}</DialogTitle>
            <DialogDescription>{t('newEntryDescription')}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="project">{t('project')}</Label>
              <Select
                value={selectedProject}
                onValueChange={setSelectedProject}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('selectProject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t('projects')}</SelectLabel>
                    {projects.map((project) => (
                      <SelectItem
                        key={project.id}
                        value={project.id.toString()}
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
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">{t('startTime')}</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  required
                  defaultValue={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{t('endTime')}</Label>
                <Input id="endTime" name="endTime" type="datetime-local" />
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
