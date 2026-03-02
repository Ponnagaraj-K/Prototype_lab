import { Subject } from '@/types/academic';

export const calculateRequiredGrades = (
  subjects: Omit<Subject, 'requiredGrade' | 'priorityScore'>[],
  currentCGPA: number,
  targetCGPA: number
): Subject[] => {
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);
  const currentPoints = currentCGPA * totalCredits;
  const targetPoints = targetCGPA * totalCredits;
  const requiredPoints = targetPoints - currentPoints;

  return subjects.map(subject => {
    const creditWeight = subject.credits / totalCredits;
    const requiredGrade = Math.min(10, Math.max(0, 
      (requiredPoints * creditWeight) / subject.credits + currentCGPA
    ));

    return {
      ...subject,
      requiredGrade: Number(requiredGrade.toFixed(2)),
      priorityScore: 0
    };
  });
};

export const calculatePriorityScores = (
  subjects: Subject[],
  examDate: Date
): Subject[] => {
  const daysLeft = Math.max(1, Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const totalCredits = subjects.reduce((sum, s) => sum + s.credits, 0);

  return subjects.map(subject => {
    const creditWeight = (subject.credits / totalCredits) * 40;
    const gradeWeight = (subject.requiredGrade / 10) * 40;
    const urgencyWeight = (1 / daysLeft) * 20;

    const priorityScore = creditWeight + gradeWeight + urgencyWeight;

    return {
      ...subject,
      priorityScore: Number(priorityScore.toFixed(2))
    };
  });
};

export const getPriorityLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 70) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

export const getPointsPerMinute = (priority: 'high' | 'medium' | 'low'): number => {
  switch (priority) {
    case 'high': return 2;
    case 'medium': return 1.5;
    case 'low': return 1;
  }
};
