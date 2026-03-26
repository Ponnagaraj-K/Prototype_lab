import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle2, Play } from 'lucide-react';
import { StudyTask } from '@/types/academic';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { StudyModeModal } from './StudyModeModal';
import apiClient from '@/lib/apiClient';

interface TaskListProps {
  tasks: StudyTask[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<StudyTask | null>(null);
  const [books, setBooks] = useState<any[]>([]);
  
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

  const handleStartTask = async (task: StudyTask) => {
    setSelectedTask(task);
    
    try {
      console.log('Fetching books for subject:', task.subjectId);
      const subjectBooks = await apiClient.get(`/books/subject/${task.subjectId}`);
      console.log('Books found:', subjectBooks);
      
      if (subjectBooks.length > 0) {
        setBooks(subjectBooks);
        setShowModal(true);
      } else {
        navigate('/focus-session', { state: { task, mode: 'timer' } });
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      navigate('/focus-session', { state: { task, mode: 'timer' } });
    }
  };

  const handleSelectTimer = () => {
    setShowModal(false);
    navigate('/focus-session', { state: { task: selectedTask, mode: 'timer' } });
  };

  const handleSelectBook = (bookId: string) => {
    setShowModal(false);
    const book = books.find(b => b._id === bookId);
    navigate('/focus-session', { state: { task: selectedTask, mode: 'book', book } });
  };

  return (
    <>
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Today's Tasks ({incompleteTasks.length} remaining)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {incompleteTasks.length === 0 && completedTasks.length === 0 && (
            <p className="text-muted-foreground text-center py-8">
              No tasks scheduled for today
            </p>
          )}

          {incompleteTasks.map(task => (
            <div key={task.id} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
              <div className="relative flex items-center justify-between p-4 border rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-[1.01] bg-card">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{task.title}</h4>
                    <Badge variant={getPriorityColor(task.priority)}>{task.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{task.duration} min</span>
                    <span className="capitalize">{task.type}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleStartTask(task)} size="sm" className="btn-gradient text-white"><Play className="h-4 w-4 mr-1" />Start</Button>
                </div>
              </div>
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
                  className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 mb-2 hover:shadow-md transition-all"
                >
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="flex-1 text-sm font-medium">{task.title}</span>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    +{task.pointsEarned || 0} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <StudyModeModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSelectTimer={handleSelectTimer}
        onSelectBook={handleSelectBook}
        books={books}
      />
    </>
  );
};