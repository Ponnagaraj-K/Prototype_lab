import { useState, useEffect } from 'react';
import { LeaderboardEntry } from '@/types/academic';
import apiClient from '@/lib/apiClient';
import { usePointsSystem } from '@/contexts/PointsContext';

export const useLeaderboard = (period: 'weekly' | 'monthly' | 'all' = 'all') => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState<number | null>(null);
  const { userPoints } = usePointsSystem();

  const fetchLeaderboard = async () => {
    try {
      const data = await apiClient.get(`/academic/leaderboard?period=${period}`);
      setLeaderboard(data.leaderboard);
      setMyRank(data.myRank);
    } catch (error) {
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period, userPoints.totalPoints]);

  return {
    leaderboard,
    myRank,
    loading,
    refetch: fetchLeaderboard
  };
};