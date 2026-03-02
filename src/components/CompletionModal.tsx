import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  earnedPoints: number;
}

export function CompletionModal({ open, onOpenChange, taskTitle, earnedPoints }: CompletionModalProps) {
  useEffect(() => {
    if (open) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const timer = setTimeout(() => onOpenChange(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-center">
        <div className="space-y-4 py-4">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold">Congratulations!</h2>
          <p className="text-muted-foreground">You completed: {taskTitle}</p>
          <div className="text-3xl font-bold text-primary">+{earnedPoints} Points</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}