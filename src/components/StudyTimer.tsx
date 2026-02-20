import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import type { StudySession } from "@/hooks/useStudySessions";

interface Props {
  activeSession: StudySession | null;
  onStart: (subject: string) => void;
  onStop: () => void;
}

const StudyTimer = ({ activeSession, onStart, onStop }: Props) => {
  const [subject, setSubject] = useState("General");
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (activeSession && !isPaused) {
      const update = () => {
        const start = new Date(activeSession.start_time).getTime();
        setElapsed(Math.floor((Date.now() - start) / 1000));
      };
      update();
      intervalRef.current = setInterval(update, 1000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [activeSession, isPaused]);

  useEffect(() => {
    if (!activeSession) { setElapsed(0); setIsPaused(false); }
  }, [activeSession]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Study Timer</h3>

      {!activeSession ? (
        <div className="space-y-4">
          <Input
            placeholder="Subject (e.g. Mathematics)"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <Button
            onClick={() => onStart(subject)}
            className="w-full gradient-warm-bg text-primary-foreground h-12 text-base"
          >
            <Play className="mr-2 h-5 w-5" /> Start Studying
          </Button>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
            {activeSession.subject}
          </div>
          <div className={`text-5xl font-display font-bold tabular-nums ${activeSession ? "text-primary" : ""} ${isPaused ? "opacity-50" : ""}`}>
            {formatTime(elapsed)}
          </div>
          {activeSession && (
            <div className="h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full gradient-warm-bg animate-pulse-glow" style={{ width: "100%" }} />
            </div>
          )}
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
            </Button>
            <Button
              variant="destructive"
              size="lg"
              onClick={onStop}
            >
              <Square className="h-5 w-5 mr-2" /> Stop
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StudyTimer;
