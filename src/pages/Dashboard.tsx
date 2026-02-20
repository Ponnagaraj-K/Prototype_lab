import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useStudySessions } from "@/hooks/useStudySessions";
import { useProfile } from "@/hooks/useProfile";
import AppHeader from "@/components/AppHeader";
import DashboardStats from "@/components/DashboardStats";
import StudyTimer from "@/components/StudyTimer";
import WeeklyChart from "@/components/WeeklyChart";
import GoalSetting from "@/components/GoalSetting";
import RecentSessions from "@/components/RecentSessions";
import ProductivityInsight from "@/components/ProductivityInsight";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { sessions, activeSession, loading: sessionsLoading, startSession, stopSession } = useStudySessions();
  const { profile, updateGoal } = useProfile();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">
            Welcome back{profile?.name ? `, ${profile.name}` : ""} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's your study overview</p>
        </div>

        <DashboardStats sessions={sessions} profile={profile} />

        <div className="grid lg:grid-cols-2 gap-6">
          <StudyTimer
            activeSession={activeSession}
            onStart={startSession}
            onStop={stopSession}
          />
          <WeeklyChart sessions={sessions} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <GoalSetting
            currentGoal={profile?.daily_goal_minutes ?? 300}
            onUpdate={updateGoal}
          />
          <ProductivityInsight sessions={sessions} />
          <RecentSessions sessions={sessions} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
