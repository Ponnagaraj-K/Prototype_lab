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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, type: "spring" }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl group-hover:blur-3xl transition-all"></div>
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Play className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Study Timer</h3>
        </div>

        {!activeSession ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Subject (e.g. Mathematics)"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="h-14 text-lg rounded-2xl border-2 focus:border-purple-500 transition-all"
              />
            </div>
            <Button
              onClick={() => onStart(subject)}
              className="w-full h-16 text-lg rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <Play className="mr-2 h-6 w-6" /> Start Studying
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200"
            >
              <div className="text-sm font-bold text-purple-700 uppercase tracking-wider">
                {activeSession.subject}
              </div>
            </motion.div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-3xl rounded-full"></div>
              <motion.div 
                animate={{ scale: isPaused ? 0.95 : 1 }}
                className={`relative text-7xl font-display font-bold tabular-nums bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent ${isPaused ? "opacity-50" : ""}`}
              >
                {formatTime(elapsed)}
              </motion.div>
            </div>
            
            {activeSession && (
              <div className="relative h-3 rounded-full bg-gray-200 overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 bg-[length:200%_100%]"
                  animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
            
            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsPaused(!isPaused)}
                className="h-14 px-8 rounded-2xl border-2 hover:border-purple-500 hover:bg-purple-50 transition-all"
              >
                {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
              </Button>
              <Button
                size="lg"
                onClick={onStop}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg"
              >
                <Square className="h-5 w-5 mr-2" /> Stop
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StudyTimer;