import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "./useAuth";

export interface Profile {
  _id: string;
  email: string;
  name: string | null;
  daily_goal_minutes: number;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    apiClient.get('/profile')
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error));
  }, [user]);

  const updateGoal = async (minutes: number) => {
    if (!user) return;
    try {
      const data = await apiClient.patch('/profile', { daily_goal_minutes: minutes });
      setProfile(data);
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return { profile, updateGoal };
}
