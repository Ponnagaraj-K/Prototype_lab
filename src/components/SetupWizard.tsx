import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useSubjects } from '@/hooks/useSubjects';
import { useCGPAPlanner } from '@/hooks/useCGPAPlanner';
import { calculateRequiredGrades, calculatePriorityScores } from '@/lib/cgpaCalculator';
import apiClient from '@/lib/apiClient';

interface SubjectInput {
  name: string;
  credits: number;
}

export const SetupWizard = ({ onComplete }: { onComplete: () => void }) => {
  const { createProfile } = useSubjects();
  const [step, setStep] = useState(1);
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [subjects, setSubjects] = useState<SubjectInput[]>([]);
  const [currentCGPA, setCurrentCGPA] = useState('');
  const [targetCGPA, setTargetCGPA] = useState('');
  const [examDate, setExamDate] = useState<Date>();
  const [dailyStudyHours, setDailyStudyHours] = useState('2.5');
  const [loading, setLoading] = useState(false);

  const addSubject = () => {
    setSubjects([...subjects, { name: '', credits: 0 }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (index: number, field: keyof SubjectInput, value: string | number) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const handleSubmit = async () => {
    if (!examDate) return;
    
    setLoading(true);
    try {
      const subjectsWithGrades = [];
      
      // Create subjects via API
      for (const subject of subjects) {
        const created = await apiClient.post('/subjects', {
          name: subject.name,
          credits: subject.credits,
          targetGrade: 'A',
          examDate: examDate,
          priorityScore: 50
        });
        subjectsWithGrades.push(created);
      }

      // Calculate required grades and priority scores
      const requiredGrades = calculateRequiredGrades(
        subjectsWithGrades,
        0, // No current CGPA needed for SGPA
        parseFloat(targetCGPA)
      );
      
      const subjectsWithPriority = calculatePriorityScores(
        requiredGrades,
        examDate
      );

      // Update subjects with priority scores
      for (const subject of subjectsWithPriority) {
        await apiClient.patch(`/subjects/${subject._id}`, {
          priorityScore: subject.priorityScore
        });
      }

      // Save to academic profile
      await apiClient.post('/academic/profile', {
        subjects: subjectsWithPriority.map(s => ({ ...s, _id: s._id || s.id })),
        currentCGPA: 0,
        targetCGPA: parseFloat(targetCGPA),
        semesterExamDate: examDate,
        setupCompleted: true
      });

      // Generate tasks
      await apiClient.post('/tasks/generate', {});

      // Mark setup as completed and save study hours
      await apiClient.post('/setup/complete', {
        dailyStudyHours: parseFloat(dailyStudyHours)
      });

      onComplete();
    } catch (error) {
      console.error('Setup failed:', error);
      alert('Setup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Academic Setup Wizard - Step {step} of 4</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>Number of Subjects</Label>
                  <Input
                    type="number"
                    value={totalSubjects}
                    onChange={(e) => {
                      const num = parseInt(e.target.value) || 0;
                      setTotalSubjects(num);
                      setSubjects(Array(num).fill({ name: '', credits: 0 }));
                    }}
                    min="1"
                    max="15"
                  />
                </div>

                {subjects.map((subject, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Label>Subject {index + 1} Name</Label>
                      <Input
                        value={subject.name}
                        onChange={(e) => updateSubject(index, 'name', e.target.value)}
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="w-32">
                      <Label>Credits</Label>
                      <Input
                        type="number"
                        value={subject.credits}
                        onChange={(e) => updateSubject(index, 'credits', parseInt(e.target.value) || 0)}
                        min="1"
                        max="4"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeSubject(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button onClick={addSubject} variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Subject
                </Button>
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={subjects.length === 0 || subjects.some(s => !s.name || s.credits === 0)}
                className="w-full"
              >
                Next
              </Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-4">
                <div>
                  <Label>Target SGPA</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={targetCGPA}
                    onChange={(e) => setTargetCGPA(e.target.value)}
                    min="5"
                    max="10"
                    placeholder="e.g., 8.5"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    What SGPA do you want to achieve this semester?
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!targetCGPA || parseFloat(targetCGPA) < 5}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <Label>Daily Study Hours</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={dailyStudyHours}
                  onChange={(e) => setDailyStudyHours(e.target.value)}
                  min="1"
                  max="8"
                  placeholder="e.g., 2.5"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  How many hours can you study daily? (Recommended: 2.5-3 hours)
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={() => setStep(4)}
                  disabled={!dailyStudyHours || parseFloat(dailyStudyHours) < 1}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <Label>Semester Exam Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {examDate ? format(examDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={examDate}
                      onSelect={setExamDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(3)} variant="outline" className="flex-1">
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!examDate || loading}
                  className="flex-1"
                >
                  {loading ? 'Setting up...' : 'Complete Setup'}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
