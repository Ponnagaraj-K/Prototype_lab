import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles } from 'lucide-react';

interface CelebrationPopupProps {
  points: number;
  bonusPoints?: number;
  onClose: () => void;
}

export const CelebrationPopup = ({ points, bonusPoints, onClose }: CelebrationPopupProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5
    }));
    setConfetti(pieces);

    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-confetti"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            top: '-10px'
          }}
        />
      ))}

      <Card className="p-8 text-center space-y-6 max-w-md mx-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10" />
        
        <div className="relative">
          <Trophy className="h-20 w-20 mx-auto text-yellow-500 animate-bounce" />
          
          <h2 className="text-3xl font-bold mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Task Completed!
          </h2>
          
          <div className="mt-6 space-y-2">
            <div className="text-5xl font-bold text-primary">
              +{points}
            </div>
            <div className="text-muted-foreground">Points Earned</div>
          </div>

          {bonusPoints && bonusPoints > 0 && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
              <Sparkles className="h-6 w-6 mx-auto text-purple-500 mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                +{bonusPoints} Bonus!
              </div>
              <div className="text-sm text-muted-foreground">Extra Study Reward</div>
            </div>
          )}

          <Button onClick={onClose} className="mt-6 w-full">
            Continue
          </Button>
        </div>
      </Card>

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s linear forwards;
        }
      `}</style>
    </div>
  );
};
