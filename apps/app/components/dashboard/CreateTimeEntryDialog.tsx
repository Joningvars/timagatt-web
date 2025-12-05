'use client';

import { useState, useEffect } from 'react';
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
import { createTimeEntry, updateTimeEntry } from '@/lib/actions';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

type Project = {
  id: number;
  name: string;
};

export type TimeEntryData = {
  id?: number;
  projectId: number;
  description?: string;
  startTime: Date;
  endTime?: Date;
};

type CreateTimeEntryDialogProps = {
  projects: Project[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  initialData?: TimeEntryData;
};

export function CreateTimeEntryDialog({
  projects = [],
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialData,
}: CreateTimeEntryDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const t = useTranslations('Dashboard.entries');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>(
    initialData?.projectId.toString() ?? ''
  );

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  // Reset form when opening/closing or initialData changes
  useEffect(() => {
    if (open) {
      setSelectedProject(initialData?.projectId.toString() ?? '');
    }
  }, [open, initialData]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const date = formData.get('date') as string;
    const startTimeInput = formData.get('startTime') as string;
    const endTimeInput = formData.get('endTime') as string;
    const description = formData.get('description') as string;

    if (!date || !startTimeInput) {
      toast.error(t('dateRequired'));
      setIsLoading(false);
      return;
    }

    const startDateTimeString = `${date}T${startTimeInput}`;
    const endDateTimeString = endTimeInput ? `${date}T${endTimeInput}` : undefined;

    const data = {
      projectId: Number(selectedProject),
      description,
      startTime: startDateTimeString,
      endTime: endDateTimeString,
    };

    if (!data.projectId) {
      toast.error(t('projectRequired'));
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };

    let result;
    if (initialData?.id) {
      result = await updateTimeEntry(initialData.id, payload);
    } else {
      result = await createTimeEntry(payload);
    }

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(initialData ? t('updateSuccess') : t('createSuccess'));
      setOpen(false);
    }
    setIsLoading(false);
  }

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!isControlled && !isEditing && (
        <DialogTrigger asChild>
          <Button size="sm" className="h-9 gap-2">
            <Plus className="h-4 w-4" />
            {t('newEntry')}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? t('edit') : t('newEntry')}</DialogTitle>
            <DialogDescription>
              {isEditing ? t('editDescription') : t('newEntryDescription')}
            </DialogDescription>
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
                defaultValue={initialData?.description}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">{t('date')}</Label>
              <Input
                id="date"
                name="date"
                type="date"
                required
                defaultValue={
                  initialData?.startTime
                    ? initialData.startTime.toISOString().slice(0, 10)
                    : new Date().toISOString().slice(0, 10)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startTime">{t('startTime')}</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  defaultValue={
                    initialData?.startTime
                      ? initialData.startTime.toTimeString().slice(0, 5)
                      : new Date().toTimeString().slice(0, 5)
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endTime">{t('endTime')}</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  defaultValue={
                    initialData?.endTime
                      ? initialData.endTime.toTimeString().slice(0, 5)
                      : ''
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex items-center justify-center gap-2 cursor-pointer rounded-lg bg-foreground px-4 py-2 text-xs font-bold text-background shadow-md shadow-border transition hover:bg-foreground/90"
            >
              {isLoading
                ? isEditing
                  ? t('updating')
                  : t('creating')
                : isEditing
                ? t('update')
                : t('create')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
