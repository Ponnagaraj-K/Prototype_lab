import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

const AppHeader = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-warm-bg flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">StudyPlanner</span>
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
