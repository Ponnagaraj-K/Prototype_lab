import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "./useAuth";

export interface StudySession {
  _id: string;
  subject: string;
  start_time: string;
  duration_minutes: number;
  is_active: boolean;
}

export function useStudySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      console.log('Fetching sessions...');
      const data = await apiClient.get('/sessions');
      console.log('Sessions fetched:', data);
      setSessions(data);
      const active = data.find((s: StudySession) => s.is_active);
      setActiveSession(active || null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const startSession = async (subject: string) => {
    try {
      const newSession: StudySession = {
        _id: Date.now().toString(),
        subject,
        start_time: new Date().toISOString(),
        duration_minutes: 0,
        is_active: true
      };
      setActiveSession(newSession);
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const stopSession = async () => {
    if (!activeSession) return;
    setActiveSession(null);
    fetchSessions();
  };

  return { 
    sessions, 
    loading, 
    activeSession,
    startSession,
    stopSession,
    fetchSessions 
  };
}

export type { StudySession };
