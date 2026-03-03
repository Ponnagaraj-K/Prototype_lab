import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LogOut, Target, BarChart3, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg gradient-warm-bg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold">StudyMate Pro</span>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/dashboard">
                <Button 
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/tasks">
                <Button 
                  variant={location.pathname === '/tasks' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <CheckSquare className="h-4 w-4" />
                  Tasks
                </Button>
              </Link>
              <Link to="/sgpa-planning">
                <Button 
                  variant={location.pathname === '/sgpa-planning' ? 'default' : 'ghost'} 
                  size="sm"
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  SGPA Planning
                </Button>
              </Link>
            </nav>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {user.email}
            </span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
