import { Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { StudySession } from "@/hooks/useStudySessions";

interface Props {
  sessions: StudySession[];
}

const ProductivityInsight = ({ sessions }: Props) => {
  const completed = sessions.filter((s) => !s.is_active && s.duration_minutes > 0);

  if (completed.length < 3) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="glass-card rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-display text-lg font-semibold">AI Insights</h3>
        </div>
        <p className="text-sm text-muted-foreground">Complete at least 3 study sessions to unlock personalized insights.</p>
      </motion.div>
    );
  }

  // Find most productive hour
  const hourCounts: Record<number, { total: number; count: number }> = {};
  completed.forEach((s) => {
    const hour = new Date(s.start_time).getHours();
    if (!hourCounts[hour]) hourCounts[hour] = { total: 0, count: 0 };
    hourCounts[hour].total += s.duration_minutes;
    hourCounts[hour].count++;
  });

  let bestHour = 0;
  let bestAvg = 0;
  Object.entries(hourCounts).forEach(([h, data]) => {
    const avg = data.total / data.count;
    if (avg > bestAvg) {
      bestAvg = avg;
      bestHour = Number(h);
    }
  });

  const formatHour = (h: number) => {
    const ampm = h >= 12 ? "PM" : "AM";
    const hr = h % 12 || 12;
    return `${hr} ${ampm}`;
  };

  // Top subject
  const subjectTotals: Record<string, number> = {};
  completed.forEach((s) => {
    subjectTotals[s.subject] = (subjectTotals[s.subject] || 0) + s.duration_minutes;
  });
  const topSubject = Object.entries(subjectTotals).sort((a, b) => b[1] - a[1])[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h3 className="font-display text-lg font-semibold">AI Insights</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
          <Lightbulb className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <p className="text-sm">
            You focus best around <strong>{formatHour(bestHour)} – {formatHour(bestHour + 2)}</strong>. 
            Try scheduling important subjects during this window.
          </p>
        </div>
        {topSubject && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
            <Lightbulb className="h-5 w-5 text-accent mt-0.5 shrink-0" />
            <p className="text-sm">
              Your top subject is <strong>{topSubject[0]}</strong> with {(topSubject[1] / 60).toFixed(1)} hours total.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductivityInsight;
