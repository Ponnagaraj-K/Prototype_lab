import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useCGPAPlanner } from '@/hooks/useCGPAPlanner';
import { format } from 'date-fns';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="container py-6">
      <Card>
        <CardContent className="flex items-center gap-3 p-6">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="font-semibold">Something went wrong</h3>
            <p className="text-sm text-muted-foreground">
              Unable to load CGPA planning data. Please try refreshing the page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CGPAPlanningContent() {
  const [subjects, setSubjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.get('/academic/profile'),
      apiClient.get('/subjects')
    ])
      .then(([profileData, subjectsData]) => {
        setProfile(profileData);
        setSubjects(subjectsData);
      })
      .catch(() => {
        setProfile(null);
        setSubjects([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const { plannedSubjects, isAchievable } = useCGPAPlanner(
    subjects,
    profile?.currentCGPA || 0,
    profile?.targetCGPA || 0,
    profile?.semesterExamDate ? new Date(profile.semesterExamDate) : new Date()
  );

  if (loading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center p-8">Loading...</div>
      </div>
    );
  }

  if (!profile || !subjects || subjects.length === 0) {
    return (
      <div className="container py-6">
        <Card>
          <CardContent className="text-center p-8">
            <h3 className="font-semibold mb-2">Setup Required</h3>
            <p className="text-muted-foreground">
              Please complete your academic setup first to view CGPA planning.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const daysLeft = Math.max(0, Math.ceil((new Date(profile.semesterExamDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  const getPriorityColor = (score: number) => {
    if (score >= 70) return 'destructive';
    if (score >= 40) return 'default';
    return 'secondary';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 70) return 'High';
    if (score >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">CGPA Planning</h1>
        <p className="text-muted-foreground">Strategic planning for your academic goals</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current CGPA</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.currentCGPA}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target CGPA</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.targetCGPA}</div>
            <p className={`text-xs ${isAchievable ? 'text-green-600' : 'text-red-600'}`}>
              {isAchievable ? 'Achievable' : 'Very Challenging'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Left</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysLeft}</div>
            <p className="text-xs text-muted-foreground">
              Until {format(new Date(profile.semesterExamDate), 'MMM dd, yyyy')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Priority Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plannedSubjects.map((subject) => (
              <div key={subject.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{subject.name}</h3>
                    <Badge variant={getPriorityColor(subject.priorityScore)}>
                      {getPriorityLabel(subject.priorityScore)} Priority
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {subject.credits} credits
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-muted-foreground">Required Grade</div>
                    <div className="text-lg font-semibold">
                      {subject.requiredGrade.toFixed(2)}/10
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Priority Score</div>
                    <div className="text-lg font-semibold">
                      {subject.priorityScore.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Difficulty</div>
                    <div className={`text-lg font-semibold ${
                      subject.requiredGrade > 8.5 ? 'text-red-600' :
                      subject.requiredGrade > 7 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {subject.requiredGrade > 8.5 ? 'Very Hard' :
                       subject.requiredGrade > 7 ? 'Moderate' : 'Achievable'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Grade Progress</span>
                    <span>{subject.requiredGrade.toFixed(1)}/10</span>
                  </div>
                  <Progress value={(subject.requiredGrade / 10) * 100} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Daily Study Time</h4>
                <p className="text-sm text-muted-foreground">
                  Allocate 2.5 hours daily (Monday-Saturday) based on priority scores
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Focus Areas</h4>
                <p className="text-sm text-muted-foreground">
                  Prioritize high-priority subjects: {plannedSubjects
                    .filter(s => s.priorityScore >= 70)
                    .map(s => s.name)
                    .join(', ') || 'None currently'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Success Strategy</h4>
                <p className="text-sm text-muted-foreground">
                  {isAchievable 
                    ? 'Your target is achievable with consistent effort. Follow the daily schedule.'
                    : 'Your target is very challenging. Consider adjusting expectations or increasing study time.'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export const CGPAPlanning = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CGPAPlanningContent />
    </ErrorBoundary>
  );
};