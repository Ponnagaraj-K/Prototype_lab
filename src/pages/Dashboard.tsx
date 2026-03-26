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
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { startSession, stopSession, activeSession, fetchSessions } = useStudySessions();
  const { profile } = useProfile();
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (user && user.setupCompleted) {
      fetchRecentSessions();
      fetchSessions();
    } else if (user) {
      setLoading(false);
    }
  }, [user, user?.setupCompleted]);

  // Listen for storage events to refresh
  useEffect(() => {
    const handleStorage = () => {
      fetchSessions();
      fetchRecentSessions();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user.setupCompleted) {
    return <SetupWizard onComplete={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30">
      <AppHeader />
      <main className="container py-8 space-y-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute -inset-8 bg-gradient-to-r from-purple-600/30 to-pink-600/30 blur-3xl rounded-full animate-pulse-glow"></div>
          <div className="relative text-center md:text-left">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-3">
              Welcome back, <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent animate-gradient">{ user.name}</span> 👋
            </h1>
            <p className="text-gray-700 text-xl font-medium">Here's your study overview for today ✨</p>
          </div>
        </motion.div>
        
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