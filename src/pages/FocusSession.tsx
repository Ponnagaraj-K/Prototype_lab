import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Pause, Play, MessageCircle, Send } from 'lucide-react';
import { CelebrationPopup } from '@/components/CelebrationPopup';
import apiClient from '@/lib/apiClient';
import { usePointsSystem } from '@/contexts/PointsContext';
import { useAuth } from '@/hooks/useAuth';

export const FocusSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  const mode = location.state?.mode || 'timer';
  const book = location.state?.book;
  const { addPoints } = usePointsSystem();
  const { user } = useAuth();

  const [timeLeft, setTimeLeft] = useState(task?.duration * 60 || 0);
  const [totalTime, setTotalTime] = useState(0);
  const [isExtraMode, setIsExtraMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [points, setPoints] = useState(0);
  const [bonusPoints, setBonusPoints] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setTotalTime(prev => prev + 1);

      if (timeLeft > 0) {
        setTimeLeft(prev => prev - 1);
      } else if (!isExtraMode) {
        setIsExtraMode(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isExtraMode, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = async () => {
    const minutesStudied = Math.max(1, Math.floor(totalTime / 60));
    const taskDuration = task.duration;
    const completionRatio = Math.min(1, minutesStudied / taskDuration);
    const maxPoints = 10;
    const pointsEarned = Math.round(maxPoints * completionRatio);

    console.log('Completing task:', { minutesStudied, taskDuration, completionRatio, pointsEarned, subject: task.subjectName });

    setPoints(pointsEarned);
    setBonusPoints(0);
    
    try {
      const response = await apiClient.post('/sessions', {
        subject: task.subjectName,
        duration_minutes: minutesStudied,
        points: pointsEarned
      });
      console.log('Session created:', response);
      
      addPoints(pointsEarned);
      
      const STORAGE_KEY = `scheduler_state_${user?.id || 'guest'}`;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        state.tasks = state.tasks.map((t: any) => 
          t.id === task.id ? { ...t, completed: true, status: 'completed', pointsEarned } : t
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
      
      setShowCelebration(true);
    } catch (error) {
      console.error('Failed to complete task:', error);
      setShowCelebration(true);
    }
  };

  const handleCelebrationClose = async () => {
    setShowCelebration(false);
    await new Promise(resolve => setTimeout(resolve, 100));
    window.dispatchEvent(new Event('storage'));
    navigate('/dashboard');
  };

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', {
        subjectId: task.subjectId,
        message: input,
        history: messages
      });

      const aiMsg = { role: 'assistant', content: response.answer };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!task) {
    navigate('/dashboard');
    return null;
  }

  const progress = Math.min(100, (totalTime / (task.duration * 60)) * 100);

  if (mode === 'book' && book) {
    return (
      <div className="fixed inset-0 bg-background flex flex-col">
        <div className="absolute top-4 right-4 flex gap-2 z-50">
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background"
            onClick={() => setChatOpen(!chatOpen)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-background/80 hover:bg-background"
            onClick={handleComplete}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {isPaused && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
            <div className="text-4xl font-bold text-yellow-600 bg-background/90 p-6 rounded-lg">
              PAUSED
            </div>
          </div>
        )}

        <iframe
          src={`http://localhost:5000${book.url}`}
          className="w-full h-full"
          title={book.name}
        />

        {chatOpen && (
          <div className="fixed bottom-4 right-4 w-96 bg-background border rounded-lg shadow-lg z-50">
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /><span className="font-medium text-sm">{task.subjectName} AI</span></div>
              <Button size="sm" variant="ghost" onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="h-64 overflow-y-auto p-3 space-y-2 bg-background">
              {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Ask about {task.subjectName}!</p>}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{msg.content}</div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-muted text-foreground rounded-lg p-2 text-sm">Thinking...</div></div>}
            </div>
            <div className="p-3 border-t bg-background"><div className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." disabled={loading} className="text-sm" />
              <Button onClick={handleSendMessage} disabled={loading || !input.trim()} size="sm"><Send className="h-4 w-4" /></Button>
            </div></div>
          </div>
        )}

        {showCelebration && (
          <CelebrationPopup
            points={points}
            bonusPoints={bonusPoints}
            onClose={handleCelebrationClose}
          />
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setChatOpen(!chatOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
          onClick={handleComplete}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="text-center space-y-8 max-w-2xl px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">{task.subjectName}</h1>
          <p className="text-xl text-white/80 capitalize">{task.type} Session</p>
        </div>

        <div className="space-y-4">
          {isPaused && (
            <div className="text-4xl font-bold text-yellow-400 mb-4">
              PAUSED
            </div>
          )}
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

      {chatOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-background border rounded-lg shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4" /><span className="font-medium text-sm">{task.subjectName} AI</span></div>
            <Button size="sm" variant="ghost" onClick={() => setChatOpen(false)}><X className="h-4 w-4" /></Button>
          </div>
          <div className="h-64 overflow-y-auto p-3 space-y-2 bg-background">
            {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Ask about {task.subjectName}!</p>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{msg.content}</div>
              </div>
            ))}
            {loading && <div className="flex justify-start"><div className="bg-muted text-foreground rounded-lg p-2 text-sm">Thinking...</div></div>}
          </div>
          <div className="p-3 border-t bg-background"><div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask..." disabled={loading} className="text-sm" />
            <Button onClick={handleSendMessage} disabled={loading || !input.trim()} size="sm"><Send className="h-4 w-4" /></Button>
          </div></div>
        </div>
      )}

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