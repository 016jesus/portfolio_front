import { useState, useEffect } from 'react';
import { verifySession } from '../features/auth/services/authService';
import type { User } from '../core/models';
import apiClient from '../lib/apiClient';

/**
 * Custom Hook para obtener el perfil de un usuario
 * Si se llama sin parámetro, retorna el perfil del usuario autenticado (api/auth/me)
 * Si se le pasa un username, puedes adaptarlo para obtener perfiles públicos
 */
export const useProfile = (username?: string) => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        if (!username) {
          // Si no hay username, obtener el perfil del usuario autenticado
          const data = await verifySession();
          console.log('Perfil del usuario autenticado:', data);
          setProfile(data as unknown as User);
        } else {
          // Aquí puedes implementar una llamada a un endpoint público
          // como GET /api/Users/{username} si lo tienes en tu API
          console.log(`Obtener perfil público de: ${username}`);
          const data = await getPublicProfile(username);
          // setProfile(data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error al obtener perfil:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  return { profile, loading, error };
};


export const getPublicProfile = async (username: string): Promise<User> => {
  const response = await apiClient.get<User>(`/api/Users/public/${username}`);
  return response.data;
}