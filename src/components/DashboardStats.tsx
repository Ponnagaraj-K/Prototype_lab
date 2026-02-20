import { Clock, Flame, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import type { StudySession } from "@/hooks/useStudySessions";
import type { Profile } from "@/hooks/useProfile";

interface Props {
  sessions: StudySession[];
  profile: Profile | null;
}

const DashboardStats = ({ sessions, profile }: Props) => {
  const today = new Date().toDateString();
  const todayMinutes = sessions
    .filter((s) => new Date(s.start_time).toDateString() === today && !s.is_active)
    .reduce((sum, s) => sum + s.duration_minutes, 0);

  const todayHours = (todayMinutes / 60).toFixed(1);

  // Weekly total
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyMinutes = sessions
    .filter((s) => new Date(s.start_time) >= weekAgo && !s.is_active)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
  const weeklyHours = (weeklyMinutes / 60).toFixed(1);

  // Streak calculation
  let streak = 0;
  const dateSet = new Set(
    sessions.filter((s) => !s.is_active).map((s) => new Date(s.start_time).toDateString())
  );
  const d = new Date();
  while (dateSet.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  // Goal progress
  const goalMinutes = profile?.daily_goal_minutes ?? 300;
  const goalPercent = Math.min((todayMinutes / goalMinutes) * 100, 100);

  const stats = [
    { label: "Today", value: `${todayHours}h`, icon: Clock, color: "text-primary" },
    { label: "This Week", value: `${weeklyHours}h`, icon: TrendingUp, color: "text-accent" },
    { label: "Streak", value: `${streak}d`, icon: Flame, color: "text-destructive" },
    { label: "Goal", value: `${Math.round(goalPercent)}%`, icon: Target, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
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
