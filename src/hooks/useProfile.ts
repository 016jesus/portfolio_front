import { useState, useEffect } from 'react';
import type { User } from '../core/models';
import apiClient from '../lib/apiClient';

export const useProfile = (username?: string) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) { setLoading(false); return; }
    setLoading(true);
    getPublicProfile(username)
      .then((data) => { setProfile(data); setError(null); })
      .catch((err) => setError(err instanceof Error ? err : new Error('Error desconocido')))
      .finally(() => setLoading(false));
  }, [username]);

  return { profile, loading, error };
};

export const getPublicProfile = async (username: string): Promise<User> => {
  const response = await apiClient.get<User>(`/api/Users/public/${username}`);
  return response.data;
};
