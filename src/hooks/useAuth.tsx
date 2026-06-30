import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import apiClient from "@/lib/apiClient";

interface User {
  id: string;
  email: string;
  name: string;
  setupCompleted: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Initial token check:', token ? 'Token exists' : 'No token');
    
    if (token) {
      apiClient.get('/auth/me')
        .then(userData => {
          console.log('User data loaded:', userData);
          setUser(userData);
        })
        .catch((error) => {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const data = await apiClient.post('/auth/signup', { email, password, name });
      console.log('SignUp response:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored after signup:', data.token);
      }
      
      if (data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await apiClient.post('/auth/signin', { email, password });
      console.log('SignIn response:', data);
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored after signin:', data.token);
      }
      
      if (data.user) {
        console.log('Setting user data:', data.user);
        setUser(data.user);
      }
      
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message } };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
