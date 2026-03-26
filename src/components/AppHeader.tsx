import { useAuth } from "@/hooks/useAuth";
import { BookOpen, LogOut, Target, BarChart3, CheckSquare, Library, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/60 backdrop-blur-3xl shadow-lg">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 360, scale: 1.15 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 flex items-center justify-center shadow-2xl neon-border"
            >
              <BookOpen className="h-7 w-7 text-white" />
            </motion.div>
            <div>
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">StudyMate Pro</span>
              <p className="text-xs text-gray-500 font-medium">Your Study Companion</p>
            </div>
          </Link>
          
          {user && (
            <nav className="hidden md:flex items-center gap-2">
              <Link to="/dashboard">
                <Button 
                  variant={location.pathname === '/dashboard' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/dashboard' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/tasks">
                <Button 
                  variant={location.pathname === '/tasks' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/tasks' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <CheckSquare className="h-4 w-4" />
                  Tasks
                </Button>
              </Link>
              <Link to="/ai-assistant">
                <Button 
                  variant={location.pathname === '/ai-assistant' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/ai-assistant' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <Brain className="h-4 w-4" />
                  AI Assistant
                </Button>
              </Link>
              <Link to="/books">
                <Button 
                  variant={location.pathname === '/books' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/books' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <Library className="h-4 w-4" />
                  Books
                </Button>
              </Link>
              <Link to="/knowledge-check">
                <Button 
                  variant={location.pathname === '/knowledge-check' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/knowledge-check' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <GraduationCap className="h-4 w-4" />
                  Knowledge Check
                </Button>
              </Link>
              <Link to="/sgpa-planning">
                <Button 
                  variant={location.pathname === '/sgpa-planning' ? 'default' : 'ghost'} 
                  size="sm"
                  className={`gap-2 rounded-xl ${location.pathname === '/sgpa-planning' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : ''}`}
                >
                  <Target className="h-4 w-4" />
                  SGPA Planning
                </Button>
              </Link>
            </nav>
          )}
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">{user.email}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut} className="rounded-xl hover:bg-red-50 hover:text-red-600">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
