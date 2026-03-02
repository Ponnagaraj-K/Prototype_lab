import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserPoints {
  totalPoints: number;
  weeklyPoints: number;
  monthlyPoints: number;
}

interface PointsContextType {
  userPoints: UserPoints;
  addPoints: (points: number) => void;
  resetWeekly: () => void;
  resetMonthly: () => void;
}

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [userPoints, setUserPoints] = useState<UserPoints>(() => {
    const saved = localStorage.getItem('userPoints');
    return saved ? JSON.parse(saved) : { totalPoints: 0, weeklyPoints: 0, monthlyPoints: 0 };
  });

  useEffect(() => {
    localStorage.setItem('userPoints', JSON.stringify(userPoints));
  }, [userPoints]);

  const addPoints = (points: number) => {
    setUserPoints(prev => ({
      totalPoints: prev.totalPoints + points,
      weeklyPoints: prev.weeklyPoints + points,
      monthlyPoints: prev.monthlyPoints + points
    }));
  };

  const resetWeekly = () => {
    setUserPoints(prev => ({ ...prev, weeklyPoints: 0 }));
  };

  const resetMonthly = () => {
    setUserPoints(prev => ({ ...prev, monthlyPoints: 0 }));
  };

  return (
    <PointsContext.Provider value={{ userPoints, addPoints, resetWeekly, resetMonthly }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePointsSystem() {
  const context = useContext(PointsContext);
  if (!context) throw new Error('usePointsSystem must be used within PointsProvider');
  return context;
}