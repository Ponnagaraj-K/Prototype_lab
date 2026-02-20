import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "./useAuth";

export interface StudySession {
  _id: string;
  user_id: string;
  subject: string;
  duration_minutes: number;
  start_time: string;
  end_time: string | null;
  is_active: boolean;
  createdAt: string;
}

export function useStudySessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    if (!user) return;
    try {
      const data = await apiClient.get('/sessions');
      setSessions(data);
      const active = data.find((s: StudySession) => s.is_active);
      setActiveSession(active || null);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const startSession = async (subject: string) => {
    if (!user) return;
    try {
      const data = await apiClient.post('/sessions', { subject });
      setActiveSession(data);
      await fetchSessions();
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const stopSession = async () => {
    if (!activeSession || !user) return;
    try {
      const now = new Date();
      const start = new Date(activeSession.start_time);
      const durationMinutes = Math.round((now.getTime() - start.getTime()) / 60000);
      await apiClient.patch(`/sessions/${activeSession._id}`, {
        is_active: false,
        end_time: now.toISOString(),
        duration_minutes: durationMinutes
      });
      setActiveSession(null);
      await fetchSessions();
    } catch (error) {
      console.error('Error stopping session:', error);
    }
  };

  return { sessions, activeSession, loading, startSession, stopSession, fetchSessions };
}
