import { useState, useEffect, useRef, useCallback } from 'react';

interface Task {
  id: string;
  subjectId: string;
  duration: number;
  remainingTime: number;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  pointsAwarded: boolean;
}

export function useTimerLogic(task: Task | null) {
  const [remainingTime, setRemainingTime] = useState(task?.remainingTime || 0);
  const [actualStudiedSeconds, setActualStudiedSeconds] = useState(0);
  const [status, setStatus] = useState<Task['status']>(task?.status || 'not_started');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (task) {
      setRemainingTime(task.remainingTime);
      setStatus(task.status);
    }
  }, [task?.id]);

  const tick = useCallback(() => {
    setRemainingTime(prev => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
    setActualStudiedSeconds(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (status === 'in_progress') {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [status, tick]);

  useEffect(() => {
    if (remainingTime === 0 && status === 'in_progress') {
      setStatus('completed');
    }
  }, [remainingTime, status]);

  const start = useCallback(() => {
    setStatus('in_progress');
  }, []);

  const pause = useCallback(() => {
    setStatus('paused');
  }, []);

  const reset = useCallback(() => {
    setStatus('not_started');
    setRemainingTime(task?.duration || 0);
    setActualStudiedSeconds(0);
  }, [task?.duration]);

  return {
    remainingTime,
    actualStudiedSeconds,
    status,
    start,
    pause,
    reset
  };
}