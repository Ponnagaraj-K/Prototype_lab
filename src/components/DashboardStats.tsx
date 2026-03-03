import { Clock, Flame, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import type { Profile } from "@/hooks/useProfile";

interface Props {
  profile: Profile | null;
}

const DashboardStats = ({ profile }: Props) => {
  const [stats, setStats] = useState({
    todayMinutes: 0,
    weekMinutes: 0,
    streak: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.get('/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const todayHours = (stats.todayMinutes / 60).toFixed(1);
  const weeklyHours = (stats.weekMinutes / 60).toFixed(1);
  const goalMinutes = profile?.daily_goal_minutes ?? 300;
  const goalPercent = Math.min((stats.todayMinutes / goalMinutes) * 100, 100);

  const statsData = [
    { label: "Today", value: `${todayHours}h`, icon: Clock, color: "text-primary" },
    { label: "This Week", value: `${weeklyHours}h`, icon: TrendingUp, color: "text-accent" },
    { label: "Streak", value: `${stats.streak}d`, icon: Flame, color: "text-destructive" },
    { label: "Goal", value: `${Math.round(goalPercent)}%`, icon: Target, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card rounded-xl p-5 stat-card-glow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground font-medium">{stat.label}</span>
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div className="text-3xl font-display font-bold animate-count-up">{stat.value}</div>
          {stat.label === "Goal" && (
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-success"
                initial={{ width: 0 }}
                animate={{ width: `${goalPercent}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
