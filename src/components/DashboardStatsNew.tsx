import { Card, CardContent } from '@/components/ui/card';
import { Clock, Calendar, Trophy, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

interface Stats {
  today: number;
  thisWeek: number;
  total: number;
  streak: number;
}

export const DashboardStats = () => {
  const [stats, setStats] = useState<Stats>({ today: 0, thisWeek: 0, total: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await apiClient.get('/academic/stats/dashboard');
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const statCards = [
    {
      title: 'Today',
      value: formatTime(stats.today),
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'This Week',
      value: formatTime(stats.thisWeek),
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Time',
      value: formatTime(stats.total),
      icon: Trophy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Streak',
      value: `${stats.streak} days`,
      icon: Flame,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
