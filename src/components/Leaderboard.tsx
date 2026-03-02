import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Award } from 'lucide-react';
import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';
import { useAuth } from '@/hooks/useAuth';

export const Leaderboard = () => {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'all'>('all');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await apiClient.get('/leaderboard');
        setLeaderboard(response.leaderboard);
        setMyRank(response.myRank);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-muted-foreground">#{rank}</span>;
    }
  };

  const myData = leaderboard.find(u => u.userId === user?.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={period} className="space-y-2 mt-4">
            {leaderboard.slice(0, 5).map((entry) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <div 
                  key={entry.userId} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    isCurrentUser ? 'bg-accent border-2 border-primary' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(entry.rank)}
                    </div>
                    <span className={isCurrentUser ? 'font-bold' : ''}>
                      {isCurrentUser ? 'You' : entry.userName}
                    </span>
                  </div>
                  <span className={`font-medium ${isCurrentUser ? 'text-primary font-bold' : ''}`}>
                    {entry.points.toLocaleString()} pts
                  </span>
                </div>
              );
            })}
            
            {myRank && myRank > 5 && (
              <>
                <div className="text-center text-muted-foreground py-2">...</div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-accent border-2 border-primary">
                  <div className="flex items-center gap-3">
                    <div className="w-8 flex justify-center">
                      <span className="text-muted-foreground">#{myRank}</span>
                    </div>
                    <span className="font-bold">You</span>
                  </div>
                  <span className="font-bold text-primary">
                    {myData?.points.toLocaleString()} pts
                  </span>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};