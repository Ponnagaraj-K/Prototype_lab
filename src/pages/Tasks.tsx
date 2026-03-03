import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AppHeader from "@/components/AppHeader";
import { TaskList } from "@/components/TaskList";
import { useSubjects } from "@/hooks/useSubjects";
import { useScheduler } from "@/hooks/useScheduler";

const Tasks = () => {
  const { user, loading: authLoading } = useAuth();
  const { subjects = [], loading: subjectsLoading } = useSubjects();
  const { getTodayTasks } = useScheduler(subjects);
  const [refreshKey, setRefreshKey] = useState(0);
  const location = useLocation();
  
  const tasks = getTodayTasks ? getTodayTasks() : [];

  // Listen for storage events to refresh tasks
  useEffect(() => {
    const handleStorage = () => {
      setRefreshKey(prev => prev + 1);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (authLoading || subjectsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (!user.setupCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Today's Tasks</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your study tasks</p>
        </div>
        
        <TaskList tasks={tasks} />
      </main>
    </div>
  );
};

export default Tasks;
