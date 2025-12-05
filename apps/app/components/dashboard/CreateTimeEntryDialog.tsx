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
  onStart?: (
    projectId: number,
    description?: string,
    startTime?: Date
  ) => Promise<void>;
  onStop?: (data?: {
    description?: string;
    projectId?: number;
    endTime?: Date;
  }) => void;
};

export function CreateTimeEntryDialog({
  projects = [],
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  initialData,
  onStart,
  onStop,
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
      if (initialData?.projectId) {
        setSelectedProject(initialData.projectId.toString());
      } else if (projects.length > 0) {
        setSelectedProject(projects[0].id.toString());
      } else {
        setSelectedProject('');
      }
    }
  }, [open, initialData, projects]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const date = formData.get('date') as string;
    const startTimeInput = formData.get('startTime') as string;
    const endTimeInput = formData.get('endTime') as string;
    const description = formData.get('description') as string;

    if (!isStartingTimer && (!date || !startTimeInput)) {
      toast.error(t('dateRequired'));
      setIsLoading(false);
      return;
    }

    const startDateTimeString =
      date && startTimeInput ? `${date}T${startTimeInput}` : undefined;
    const endDateTimeString = endTimeInput
      ? `${date}T${endTimeInput}`
      : undefined;

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

    // If onStart is provided, we are starting a timer
    if (onStart) {
      await onStart(
        data.projectId,
        data.description,
        data.startTime ? new Date(data.startTime) : undefined
      );
      setOpen(false);
      setIsLoading(false);
      return;
    }

    const payload = {
      ...data,
      startTime: new Date(data.startTime!),
      endTime: data.endTime ? new Date(data.endTime) : undefined,
    };

    // If onStop is provided, we are stopping the timer
    if (onStop) {
      // Pass the data to stopTimer via onStop
      await onStop({
        description: payload.description,
        projectId: payload.projectId,
        endTime: payload.endTime || new Date(),
      });
      setOpen(false);
      setIsLoading(false);
      return;
    }

    let result;
    if (initialData?.id) {
      // If we are editing (or stopping) a running entry, we expect endTime to be set (or defaulted to now if empty?)
      // Actually, the form input for endTime might be empty if the user didn't fill it.
      // If stopping, we usually want to set it to now if not specified.
      // BUT here we just take what the form gave us.
      // If onStop is provided, it means we want to stop the timer.

      // If onStop is passed and endTime is missing, should we default it to NOW?
      // The user might want to "save changes" without stopping if they didn't click "Stop Timer".
      // But the main action when running is usually "Stop".
      // Let's assume standard update behavior: if endTime is provided, it stops.

      // If onStop is provided, we enforce stopping?
      // No, let's let the user decide via the endTime field.
      // However, if the user clicks "Stop Timer" (the main button), they expect it to stop.

      // For now, standard update.
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
  const isStartingTimer = !!onStart;
  const isStoppingTimer = !!onStop;

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
            <DialogTitle>
              {isStartingTimer
                ? t('startTimerTitle')
                : isStoppingTimer
                ? t('stopTimerTitle')
                : isEditing
                ? t('edit')
                : t('newEntry')}
            </DialogTitle>
            <DialogDescription>
              {isStartingTimer
                ? t('startTimerDescription')
                : isStoppingTimer
                ? t('stopTimerDescription')
                : isEditing
                ? t('editDescription')
                : t('newEntryDescription')}
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
            {!isStartingTimer && (
              <>
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
              </>
            )}
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
                  : isStartingTimer
                  ? t('starting')
                  : t('creating')
                : isStartingTimer
                ? t('startTimerTitle')
                : isStoppingTimer
                ? t('stopTimerTitle')
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
