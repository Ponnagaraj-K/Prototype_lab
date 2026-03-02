import { BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";
import type { StudySession } from "@/hooks/useStudySessions";
import { format } from "date-fns";

interface Props {
  sessions: StudySession[];
}

const RecentSessions = ({ sessions }: Props) => {
  const recent = sessions.filter((s) => !s.is_active && s.start_time).slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Recent Sessions</h3>
      {recent.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-40" />
          <p className="text-sm">No sessions yet. Start studying!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map((session) => {
            const startDate = session.start_time ? new Date(session.start_time) : null;
            const isValidDate = startDate && !isNaN(startDate.getTime());
            
            return (
              <div
                key={session._id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{session.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {isValidDate ? format(startDate, "MMM d, h:mm a") : 'Recent'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {session.duration_minutes || 0}m
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default RecentSessions;
