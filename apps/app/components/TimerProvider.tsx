'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useTranslations } from 'next-intl';
import {
  stopTimer,
  createTimeEntry,
  resumeTimeEntry,
  updateTimeEntry,
} from '@/lib/actions';
import { getRunningTimeEntry } from '@/lib/dashboard/queries';
import { toast } from 'sonner';
import { differenceInSeconds } from 'date-fns';

type TimerContextType = {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  elapsed: number;
  id: number | null;
  projectId: number | null;
  projectName: string | null;
  description: string | null;
  start: (
    projectId: number,
    description?: string,
    startTime?: Date
  ) => Promise<void>;
  stop: (data?: {
    description?: string;
    projectId?: number;
    endTime?: Date;
  }) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  reset: () => void;
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({
  children,
  initialRunningEntry,
  serverTime,
}: {
  children: React.ReactNode;
  initialRunningEntry?: any;
  serverTime?: string;
}) {
  const t = useTranslations('Dashboard.timer');
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pausedEntry, setPausedEntry] = useState<{
    projectId: number;
    description: string;
    projectName?: string;
    accumulatedTime?: number;
    id?: number | null;
  } | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [accumulatedTime, setAccumulatedTime] = useState(0);
  const [id, setId] = useState<number | null>(null);
  const [projectId, setProjectId] = useState<number | null>(null);
  const [projectName, setProjectName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [offset, setOffset] = useState(0);

  // Calculate clock skew between client and server
  useEffect(() => {
    if (serverTime) {
      const server = new Date(serverTime);
      const client = new Date();
      // If client is ahead, diff is positive.
      // If client is behind, diff is negative.
      const diff = differenceInSeconds(client, server);
      setOffset(diff);
    }
  }, [serverTime]);

  // Initialize from server data and localStorage
  useEffect(() => {
    if (initialRunningEntry) {
      setIsRunning(true);
      const serverStart = new Date(initialRunningEntry.startTime);
      // Adjust start time to match client clock
      const start = new Date(serverStart.getTime() + offset * 1000);

      setStartTime(start);
      setId(initialRunningEntry.id);
      setProjectId(initialRunningEntry.projectId);
      setProjectName(initialRunningEntry.project?.name ?? '');
      setDescription(initialRunningEntry.description);

      const storedActive = localStorage.getItem('timer_active_session');

      // If we have initialRunningEntry from server, we should prioritize it.
      // But if we JUST resumed, initialRunningEntry might be the shifted one.
      // If the server time is shifted, (now - start) ALREADY includes the history.
      // So we should NOT add accumulatedTime if initialRunningEntry is present.
      // UNLESS the initialRunningEntry is NOT shifted yet?
      // No, resumeTimeEntry shifts it immediately in DB.

      // So, if initialRunningEntry is present, we should set accumulatedTime to 0
      // because the start time is already "accumulated" backwards.

      // However, if we are in a "paused" state locally but server says running?
      // That would mean we resumed elsewhere? Or state mismatch.
      // Let's trust server running state.

      setAccumulatedTime(0); // Reset accumulated time as server has the correct shifted start time
      setElapsed(differenceInSeconds(new Date(), start));
    } else {
      // Check for paused state in localStorage
      const storedPaused = localStorage.getItem('timer_paused_entry');
      if (storedPaused) {
        try {
          const parsed = JSON.parse(storedPaused);
          setPausedEntry(parsed);
          setIsPaused(true);
          setProjectId(parsed.projectId);
          setDescription(parsed.description);
          setProjectName(parsed.projectName);
          setAccumulatedTime(parsed.accumulatedTime || 0);
          setElapsed(parsed.accumulatedTime || 0);
        } catch (e) {
          console.error('Failed to parse paused timer', e);
        }
      }
    }
  }, [initialRunningEntry, offset]);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        setElapsed(
          differenceInSeconds(new Date(), startTime) + accumulatedTime
        );
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, startTime, accumulatedTime]);

  const start = useCallback(
    async (pid: number, desc?: string, startTime?: Date) => {
      // Optimistic update
      const now = startTime || new Date();
      setIsRunning(true);
      setIsPaused(false);
      setPausedEntry(null);
      localStorage.removeItem('timer_paused_entry');
      localStorage.removeItem('timer_active_session');

      setStartTime(now);
      // If we are starting fresh (not via resume which sets accumulatedTime separately), reset it?
      // The resume function calls start, so we need to be careful.
      // We'll handle accumulatedTime resetting in stop/reset, and setting in resume.
      // If this is a NEW start (not resume), accumulatedTime should probably be 0.
      // But we can't distinguish easily unless we pass a flag or rely on state.
      // Let's assume start() always resets accumulatedTime UNLESS called from resume...
      // OR we make resume handle the state setting *after* start?
      // No, start sets state.

      // Better: start() resets accumulatedTime by default.
      // If resuming, we need a way to preserve it.
      // Let's add an optional param to start? Or handle it in resume by updating state after start?
      // Updating state after start is risky due to async/batching.

      // Let's just check if we are "resuming" based on pausedEntry matching?
      // No, pausedEntry is cleared.

      // Let's assume start resets elapsed to 0.
      // We will fix `resume` to set accumulatedTime explicitly.
      // But `start` sets `elapsed` to 0 which might flicker.
      // Let's modify start signature or logic.

      // Actually, if we just don't reset `accumulatedTime` here, it persists.
      // But if I start a completely NEW project, I want it to be 0.
      // So I should reset it here.
      setAccumulatedTime(0);
      setElapsed(0);

      setProjectId(pid);
      setDescription(desc ?? null);

      const result = await createTimeEntry({
        projectId: pid,
        description: desc,
        startTime: now,
      });

      if (result.error) {
        setIsRunning(false);
        setStartTime(null);
        setProjectId(null);
        setDescription(null);
        setId(null);
        toast.error(result.error);
      } else {
        if (result.id) {
          setId(result.id);
        }
        // If we were resuming, show different message?
        // But start is start.
        toast.success(t('started'));
      }
    },
    [t]
  );

  const reset = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    setPausedEntry(null);
    localStorage.removeItem('timer_paused_entry');
    localStorage.removeItem('timer_active_session');
    setStartTime(null);
    setElapsed(0);
    setAccumulatedTime(0);
    setProjectId(null);
    setDescription(null);
    setProjectName(null);
    setId(null);
  }, []);

  const stop = useCallback(
    async (data?: {
      description?: string;
      projectId?: number;
      endTime?: Date;
    }) => {
      const wasPaused = isPaused;
      const entryId = wasPaused ? pausedEntry?.id : null;

      reset();

      if (wasPaused) {
        if (
          data &&
          entryId &&
          (data.description !== undefined || data.projectId !== undefined)
        ) {
          const updateData: any = {};
          if (data.description !== undefined)
            updateData.description = data.description;
          if (data.projectId !== undefined)
            updateData.projectId = data.projectId;
          // endTime is ignored for paused entries as they are already stopped

          if (Object.keys(updateData).length > 0) {
            const result = await updateTimeEntry(entryId, updateData);
            if (result.error) {
              toast.error(result.error);
            }
          }
        }
        toast.success(t('stopped'));
        return;
      }

      const result = await stopTimer(data);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('stopped'));
      }
    },
    [reset, t, isPaused, pausedEntry]
  );

  const pause = useCallback(async () => {
    if (!projectId) return;

    const entryToPause = {
      id: id, // We must have an ID if running
      projectId,
      description: description ?? '',
      projectName: projectName ?? '',
      accumulatedTime: elapsed, // Store current total elapsed
    };

    // Save to localStorage first
    localStorage.setItem('timer_paused_entry', JSON.stringify(entryToPause));
    localStorage.removeItem('timer_active_session');

    // Stop the timer on server (pausing)
    // Pass explicit pause data if needed, or just let stopTimer handle it as a pause
    // But pause just stops it on DB side.
    // We do NOT clear the timer from DB if we are just pausing?
    // No, standard "stopTimer" updates endTime.
    // The "Pause" concept is purely client-side "intent" + server-side "stop".
    // Resuming shifts the start time.
    const result = await stopTimer();

    if (result.error) {
      toast.error(result.error);
      localStorage.removeItem('timer_paused_entry');
    } else {
      setIsRunning(false);
      setIsPaused(true);
      setPausedEntry(entryToPause);
      setStartTime(null);
      setElapsed(entryToPause.accumulatedTime); // Show total time while paused
      setAccumulatedTime(entryToPause.accumulatedTime);
      setId(null);
      toast.success(t('pausedToast'));
    }
  }, [projectId, description, projectName, t, elapsed]);

  const resume = useCallback(async () => {
    if (!pausedEntry) return;

    // We need to keep the accumulated time
    const prevAccumulated = pausedEntry.accumulatedTime || 0;

    // Resume existing entry if we have an ID
    if (pausedEntry.id) {
      const now = new Date();
      setIsRunning(true);
      setIsPaused(false);
      setPausedEntry(null);
      localStorage.removeItem('timer_paused_entry');

      // Store active session info for page reloads (accumulated time + current run)
      localStorage.setItem(
        'timer_active_session',
        JSON.stringify({
          projectId: pausedEntry.projectId,
          accumulatedTime: prevAccumulated,
        })
      );

      setStartTime(now);
      setAccumulatedTime(prevAccumulated);
      setElapsed(prevAccumulated);
      setProjectId(pausedEntry.projectId);
      setDescription(pausedEntry.description);

      // Use resumeTimeEntry which shifts the start time instead of creating new entry
      const result = await resumeTimeEntry(pausedEntry.id);

      if (result.error) {
        setIsRunning(false);
        setStartTime(null);
        setProjectId(null);
        setDescription(null);
        setId(null);
        setAccumulatedTime(0);
        toast.error(result.error);
      } else {
        if (result.id) {
          setId(result.id);
        }
        toast.success(t('resumedToast'));
      }
      return;
    }

    // Fallback to new entry if no ID found (shouldn't happen with new logic)
    const now = new Date();
    setIsRunning(true);
    setIsPaused(false);
    setPausedEntry(null);
    localStorage.removeItem('timer_paused_entry');

    // Store active session info for page reloads
    localStorage.setItem(
      'timer_active_session',
      JSON.stringify({
        projectId: pausedEntry.projectId,
        accumulatedTime: prevAccumulated,
      })
    );

    setStartTime(now);
    setAccumulatedTime(prevAccumulated);
    setElapsed(prevAccumulated);
    setProjectId(pausedEntry.projectId);
    setDescription(pausedEntry.description);

    const result = await createTimeEntry({
      projectId: pausedEntry.projectId,
      description: pausedEntry.description,
      startTime: now,
    });

    if (result.error) {
      setIsRunning(false);
      setStartTime(null);
      setProjectId(null);
      setDescription(null);
      setId(null);
      setAccumulatedTime(0);
      toast.error(result.error);
    } else {
      if (result.id) {
        setId(result.id);
      }
      toast.success(t('resumedToast'));
    }
  }, [pausedEntry, t]);

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        isPaused,
        startTime,
        elapsed,
        id: id || pausedEntry?.id || null,
        projectId,
        projectName,
        description,
        start,
        stop,
        pause,
        resume,
        reset,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
