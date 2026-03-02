import { useMemo } from 'react';
import { Subject } from '@/types/academic';
import { calculateRequiredGrades, calculatePriorityScores } from '@/lib/cgpaCalculator';

export const useCGPAPlanner = (
  subjects: Omit<Subject, 'requiredGrade' | 'priorityScore'>[],
  currentCGPA: number,
  targetCGPA: number,
  examDate: Date
) => {
  const plannedSubjects = useMemo(() => {
    if (!subjects.length) return [];
    
    const withGrades = calculateRequiredGrades(subjects, currentCGPA, targetCGPA);
    const withPriorities = calculatePriorityScores(withGrades, examDate);
    
    return withPriorities.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [subjects, currentCGPA, targetCGPA, examDate]);

  const isAchievable = useMemo(() => {
    return plannedSubjects.every(s => s.requiredGrade <= 10);
  }, [plannedSubjects]);

  return {
    plannedSubjects,
    isAchievable
  };
};
