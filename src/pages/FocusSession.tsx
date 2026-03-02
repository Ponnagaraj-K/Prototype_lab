import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CelebrationPopup } from '@/components/CelebrationPopup';
import apiClient from '@/lib/apiClient';

export const FocusSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;

  const [timeLeft, setTimeLeft] = useState(task?.duration * 60 || 0);
  const [totalTime, setTotalTime] = useState(0);
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [points, setPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleComplete();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [totalTime, isExtraMode]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(prev => prev + 1);

      if (timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      } else if (!isExtraMode) {
        setIsExtraMode(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isExtraMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    const minutesStudied = Math.max(1, Math.floor(totalTime / 60));

    try {
      const response = await apiClient.patch(`/tasks/${task.id}/complete`, {
        duration: minutesStudied
      });
      
      setPoints(response.points);
      setBonusPoints(0);
      setShowCelebration(true);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setShowCelebration(true);
    }
  };

  const handleCelebrationClose = () => {
    setShowCelebration(false);
    navigate('/dashboard');
  };

  if (!task) {
    navigate('/dashboard');
    return null;
  }

  const progress = Math.min(100, (totalTime / (task.duration * 60)) * 100);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 text-white hover:bg-white/20"
        onClick={handleComplete}
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="text-center space-y-8 max-w-2xl px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">{task.subjectName}</h1>
          <p className="text-xl text-white/80 capitalize">{task.type} Session</p>
        </div>

        <div className="space-y-4">
          {!isExtraMode ? (
            <>
              <div className="text-8xl font-mono font-bold">
                {formatTime(timeLeft)}
              </div>
              <p className="text-2xl text-white/60">Time Remaining</p>
            </>
          ) : (
            <>
              <div className="text-6xl font-mono font-bold text-green-400">
                Extra Study Mode
              </div>
              <div className="text-4xl font-mono">
                +{Math.floor((totalTime - task.duration * 60) / 60 / 3)} Bonus Points
              </div>
              <p className="text-xl text-white/60">Keep going to earn more!</p>
            </>
          )}
        </div>

        <div className="w-full max-w-md mx-auto space-y-2">
          <Progress value={progress} className="h-4" />
          <p className="text-sm text-white/60">
            {Math.floor(totalTime / 60)} / {task.duration} minutes
          </p>
        </div>

        <p className="text-sm text-white/40">Press ESC to finish</p>
      </div>

      {showCelebration && (
        <CelebrationPopup
          points={points}
          bonusPoints={bonusPoints}
          onClose={handleCelebrationClose}
        />
      )}
    </div>
  );
};

export default FocusSession;