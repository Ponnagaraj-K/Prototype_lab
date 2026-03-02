import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "./useAuth";

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    apiClient.get('/stats')
      .then(data => setProfile(data))
      .catch(error => console.error('Error fetching profile:', error))
      .finally(() => setLoading(false));
  }, [user]);

  return { profile, loading };
}
