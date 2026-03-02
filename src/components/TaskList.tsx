import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Play } from 'lucide-react';
import { StudyTask } from '@/types/academic';
import { useNavigate } from 'react-router-dom';

interface TaskListProps {
  tasks: StudyTask[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const navigate = useNavigate();
  const incompleteTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const handleStartTask = (task: StudyTask) => {
    navigate('/focus-session', { state: { task } });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks ({incompleteTasks.length} remaining)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {incompleteTasks.length === 0 && completedTasks.length === 0 && (
          <p className="text-muted-foreground text-center py-8">
            No tasks scheduled for today
          </p>
        )}

        {incompleteTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{task.title}</h4>
                <Badge variant={getPriorityColor(task.priority)}>
                  {task.priority}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {task.duration} min
                </span>
                <span className="capitalize">{task.type}</span>
              </div>
            </div>
            <Button onClick={() => handleStartTask(task)} size="sm">
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          </div>
        ))}

        {completedTasks.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Completed ({completedTasks.length})
            </h4>
            {completedTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 mb-2"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="flex-1 text-sm">{task.title}</span>
                <span className="text-sm text-muted-foreground">
                  +{task.pointsEarned || 0} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};