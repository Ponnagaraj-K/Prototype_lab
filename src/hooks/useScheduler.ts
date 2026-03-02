import { useState, useEffect } from 'react';
import { StudyTask, DailySchedule, TaskStatus, Subject } from '@/types/academic';
import apiClient from '@/lib/apiClient';
import { getPointsPerMinute } from '@/lib/cgpaCalculator';
import { usePointsSystem } from '@/contexts/PointsContext';
import { useAuth } from './useAuth';

interface SchedulerState {
  tasks: StudyTask[];
  lastGeneratedDate: string;
}

export const useScheduler = (subjects?: Subject[]) => {
  const { user } = useAuth();
  const STORAGE_KEY = `scheduler_state_${user?.id || 'guest'}`;
  const [schedules, setSchedules] = useState<DailySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [localState, setLocalState] = useState<SchedulerState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { tasks: [], lastGeneratedDate: '' };
  });
  const { addPoints } = usePointsSystem();

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localState));
    }
  }, [localState, user, STORAGE_KEY]);

  useEffect(() => {
    if (!subjects || subjects.length === 0) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const shouldGenerate = localState.lastGeneratedDate !== today || localState.tasks.length === 0;

    if (shouldGenerate) {
      const taskTypes: Array<'study' | 'practice' | 'revision'> = ['study', 'practice', 'revision'];
      
      const newTasks: StudyTask[] = subjects.flatMap(subject => {
        const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];
        const duration = Math.round((subject.priorityScore / 100) * 60) || 30;
        
        return {
          id: crypto.randomUUID(),
          subjectId: subject.id,
          subjectName: subject.name,
          type: taskType,
          title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} - ${subject.name}`,
          duration,
          remainingTime: duration,
          scheduledDate: new Date(),
          status: 'not_started' as TaskStatus,
          pointsAwarded: false,
          completed: false,
          priority: subject.priorityScore >= 70 ? 'high' : subject.priorityScore >= 40 ? 'medium' : 'low'
        };
      });

      setLocalState({
        tasks: newTasks,
        lastGeneratedDate: today
      });
    }

    setLoading(false);
  }, [subjects]);

  const updateTaskStatus = async (
    taskId: string, 
    status: TaskStatus, 
    updates?: { completedTime?: number; remainingTime?: number; pointsAwarded?: boolean }
  ) => {
    setLocalState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId ? { ...t, status, ...updates } : t
      )
    }));
  };

  const completeTask = async (taskId: string, duration: number, priority: 'high' | 'medium' | 'low') => {
    const task = localState.tasks.find(t => t.id === taskId);
    
    if (!task) return { pointsEarned: 0, task: null };
    
    const actualDuration = Math.max(1, duration);
    const pointsEarned = Math.round(actualDuration * getPointsPerMinute(priority));
    
    setLocalState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => 
        t.id === taskId 
          ? { ...t, status: 'completed' as TaskStatus, completed: true, pointsAwarded: true, pointsEarned } 
          : t
      )
    }));
    
    addPoints(pointsEarned);
    
    try {
      console.log('Creating session:', { subject: task.subjectName, duration_minutes: actualDuration, points: pointsEarned });
      const response = await apiClient.post('/sessions', {
        subject: task.subjectName,
        duration_minutes: actualDuration,
        points: pointsEarned
      });
      console.log('Session created:', response);
    } catch (error) {
      console.error('Failed to create session:', error);
    }
    
    return { pointsEarned, task };
  };

  const getTodayTasks = (): StudyTask[] => {
    return localState.tasks;
  };

  return {
    schedules,
    loading,
    updateTaskStatus,
    completeTask,
    getTodayTasks,
    tasks: localState.tasks,
    refetch: () => {}
  };
};