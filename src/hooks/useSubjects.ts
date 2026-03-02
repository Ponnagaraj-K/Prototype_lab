import { useState, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const data = await apiClient.get('/subjects');
      setSubjects(data);
    } catch (error) {
      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    subjects,
    loading,
    refetch: fetchSubjects
  };
};
