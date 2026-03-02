export interface Subject {
  id: string;
  name: string;
  credits: number;
  currentGrade?: number;
  requiredGrade: number;
  priorityScore: number;
}

export interface AcademicProfile {
  totalSubjects: number;
  subjects: Subject[];
  currentCGPA: number;
  targetCGPA: number;
  semesterExamDate: Date;
  setupCompleted: boolean;
}

export type TaskStatus = 'not_started' | 'in_progress' | 'paused' | 'completed';

export interface StudyTask {
  id: string;
  subjectId: string;
  subjectName: string;
  type: 'study' | 'practice' | 'revision';
  title: string;
  duration: number;
  remainingTime: number;
  scheduledDate: Date;
  status: TaskStatus;
  pointsAwarded: boolean;
  pointsEarned?: number;
  priority: 'high' | 'medium' | 'low';
  completedTime?: number;
}

export interface DailySchedule {
  date: Date;
  tasks: StudyTask[];
  totalMinutes: number;
}

export interface UserPoints {
  userId: string;
  userName: string;
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
  rank?: number;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  points: number;
  rank: number;
}

export interface TimerState {
  elapsed: number;
  isPaused: boolean;
  isRunning: boolean;
}
