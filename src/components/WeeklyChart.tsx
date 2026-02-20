import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import type { StudySession } from "@/hooks/useStudySessions";

interface Props {
  sessions: StudySession[];
}

const WeeklyChart = ({ sessions }: Props) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();

  const data = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const minutes = sessions
      .filter((s) => new Date(s.start_time).toDateString() === dayStr && !s.is_active)
      .reduce((sum, s) => sum + s.duration_minutes, 0);
    return {
      day: days[d.getDay()],
      hours: +(minutes / 60).toFixed(1),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Weekly Overview</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="h" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "13px",
            }}
            formatter={(value: number) => [`${value}h`, "Study Time"]}
          />
          <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default WeeklyChart;
