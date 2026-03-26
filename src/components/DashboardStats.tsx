import { Clock, Flame, Target, TrendingUp, Sparkles } from "lucide-react";
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
    { 
      label: "Today", 
      value: `${todayHours}h`, 
      icon: Clock, 
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-100"
    },
    { 
      label: "This Week", 
      value: `${weeklyHours}h`, 
      icon: TrendingUp, 
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-100"
    },
    { 
      label: "Streak", 
      value: `${stats.streak}d`, 
      icon: Flame, 
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-100"
    },
    { 
      label: "Goal", 
      value: `${Math.round(goalPercent)}%`, 
      icon: Target, 
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05, y: -5 }}
          className="relative group"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} rounded-2xl opacity-50 group-hover:opacity-70 transition-opacity blur-xl`}></div>
          <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full -mr-16 -mt-16"></div>
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                <h3 className={`text-4xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </h3>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-xl`}>
                <stat.icon className={`h-6 w-6 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', WebkitBackgroundClip: 'text' }} />
              </div>
            </div>
            
            {stat.label === "Goal" && (
              <div className="mt-4">
                <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${goalPercent}%` }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
            
            {stat.label === "Streak" && stats.streak > 0 && (
              <div className="mt-2 flex items-center gap-1">
                {[...Array(Math.min(stats.streak, 7))].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Sparkles className="h-3 w-3 text-orange-500" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;
