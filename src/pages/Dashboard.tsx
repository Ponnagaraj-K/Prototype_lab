import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SetupWizard } from "@/components/SetupWizard";
import AppHeader from "@/components/AppHeader";
import DashboardStats from "@/components/DashboardStats";
import { TaskList } from "@/components/TaskList";
import WeeklyChart from "@/components/WeeklyChart";
import { Leaderboard } from "@/components/Leaderboard";
import StudyTimer from "@/components/StudyTimer";
import ProductivityInsight from "@/components/ProductivityInsight";
import RecentSessions from "@/components/RecentSessions";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useProfile } from "@/hooks/useProfile";
import apiClient from "@/lib/apiClient";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { sessions = [], loading: sessionsLoading, startSession, stopSession, activeSession } = useStudySessions();
  const { profile } = useProfile();
  const [tasks, setTasks] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  useEffect(() => {
    if (user && user.setupCompleted) {
      fetchTasks();
      fetchRecentSessions();
    } else if (user) {
      setTasksLoading(false);
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const data = await apiClient.get('/tasks/today');
      const formattedTasks = data.map((t: any) => {
        const priorityScore = t.subjectId?.priorityScore || 50;
        const priority = priorityScore >= 70 ? 'high' : priorityScore >= 40 ? 'medium' : 'low';
        
        return {
          id: t._id,
          subjectId: t.subjectId?._id,
          subjectName: t.subjectId?.name || 'Subject',
          title: `Study - ${t.subjectId?.name || 'Subject'}`,
          duration: t.duration,
          status: t.status === 'completed' ? 'completed' : 'not_started',
          completed: t.status === 'completed',
          pointsEarned: t.pointsEarned || 0,
          priority,
          type: 'study'
        };
      });
      setTasks(formattedTasks);
    } catch (error: any) {
      if (error.message?.includes('Setup expired')) {
        window.location.reload();
      }
      console.error('Error fetching tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  };

  const fetchRecentSessions = async () => {
    try {
      const data = await apiClient.get('/sessions/recent');
      setRecentSessions(data);
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    }
  };

  if (authLoading || tasksLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!user.setupCompleted) {
    return <SetupWizard onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Welcome back, {user.name} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your study overview</p>
        </div>
        
        {sessionsLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <DashboardStats sessions={sessions} profile={profile} />
            
            <div className="grid lg:grid-cols-2 gap-6">
              <StudyTimer activeSession={activeSession} onStart={startSession} onStop={stopSession} />
              <TaskList tasks={tasks} />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <WeeklyChart sessions={sessions} />
              <Leaderboard />
            </div>
            
            <ProductivityInsight sessions={recentSessions} />
            <RecentSessions sessions={recentSessions} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;