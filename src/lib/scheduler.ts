import { Subject, StudyTask, DailySchedule } from '@/types/academic';
import { getPriorityLevel } from './cgpaCalculator';

const DAILY_STUDY_HOURS = 2.5;
const STUDY_DAYS = [1, 2, 3, 4, 5, 6]; // Monday to Saturday

export const generateStudySchedule = (
  subjects: Subject[],
  examDate: Date
): DailySchedule[] => {
  const schedules: DailySchedule[] = [];
  const totalPriority = subjects.reduce((sum, s) => sum + s.priorityScore, 0);
  
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(examDate);
  endDate.setHours(0, 0, 0, 0);

  while (currentDate < endDate) {
    const dayOfWeek = currentDate.getDay();
    
    if (STUDY_DAYS.includes(dayOfWeek)) {
      const dailyMinutes = DAILY_STUDY_HOURS * 60;
      const tasks: StudyTask[] = [];

      subjects.forEach(subject => {
        const timeAllocation = (subject.priorityScore / totalPriority) * dailyMinutes;
        const priority = getPriorityLevel(subject.priorityScore);

        if (timeAllocation >= 15) {
          const taskTypes: Array<'study' | 'practice' | 'revision'> = ['study', 'practice', 'revision'];
          const taskType = taskTypes[Math.floor(Math.random() * taskTypes.length)];

          tasks.push({
            id: `${subject.id}-${currentDate.getTime()}-${taskType}`,
            subjectId: subject.id,
            subjectName: subject.name,
            type: taskType,
            title: `${taskType.charAt(0).toUpperCase() + taskType.slice(1)} - ${subject.name}`,
            duration: Math.round(timeAllocation),
            scheduledDate: new Date(currentDate),
            completed: false,
            priority
          });
        }
      });

      schedules.push({
        date: new Date(currentDate),
        tasks,
        totalMinutes: dailyMinutes
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};
