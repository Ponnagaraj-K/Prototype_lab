import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { SetupWizard } from "@/components/SetupWizard";
import AppHeader from "@/components/AppHeader";
import DashboardStats from "@/components/DashboardStats";
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
  const { startSession, stopSession, activeSession, fetchSessions } = useStudySessions();
  const { profile } = useProfile();
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Check if exam date has passed - reset setup for new semester
  useEffect(() => {
    const checkExamDate = async () => {
      if (user?.setupCompleted) {
        try {
          const profile = await apiClient.get('/academic/profile');
          if (profile?.semesterExamDate) {
            const examDate = new Date(profile.semesterExamDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (examDate < today) {
              await apiClient.post('/auth/reset-setup');
              window.location.reload();
            }
          }
        } catch (error) {
          console.error('Error checking exam date:', error);
        }
      }
    };
    checkExamDate();
  }, [user]);

  useEffect(() => {
    if (user && user.setupCompleted) {
      fetchRecentSessions();
      fetchSessions();
    } else if (user) {
      setLoading(false);
    }
  }, [user, location]);

  // Listen for storage events to refresh
  useEffect(() => {
    const handleStorage = () => {
      fetchSessions();
      fetchRecentSessions();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const data = await apiClient.get('/sessions/recent');
      setRecentSessions(data);
    } catch (error) {
      console.error('Error fetching recent sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
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
        
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <DashboardStats profile={profile} />
            
            <div className="grid lg:grid-cols-2 gap-6">
              <StudyTimer activeSession={activeSession} onStart={startSession} onStop={stopSession} />
              <Leaderboard />
            </div>
            
            <div className="grid lg:grid-cols-2 gap-6">
              <WeeklyChart />
              <ProductivityInsight sessions={recentSessions} />
            </div>
            
            <RecentSessions sessions={recentSessions} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;