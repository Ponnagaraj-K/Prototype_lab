import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, TrendingUp, Flame } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';

interface Insight {
  type: 'info' | 'warning' | 'danger' | 'success';
  message: string;
}

export const AIInsights = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const data = await apiClient.get('/academic/insights');
      setInsights(data.insights);
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'danger': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'success': return <Flame className="h-5 w-5 text-green-500" />;
      default: return <TrendingUp className="h-5 w-5 text-blue-500" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'danger': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <p className="text-muted-foreground text-center py-4">Loading insights...</p>
        ) : insights.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Complete your academic setup to get personalized insights
          </p>
        ) : (
          insights.map((insight, index) => (
            <div
              key={index}
              className={`flex gap-3 p-3 rounded-lg border ${getColor(insight.type)}`}
            >
              {getIcon(insight.type)}
              <p className="text-sm flex-1">{insight.message}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
