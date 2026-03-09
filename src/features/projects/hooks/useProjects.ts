import { useState, useEffect } from 'react';
import { getProjectsByUsername } from '../services/projectService';
import type { Project } from '../../../core/models';
import { getPublicProfile } from '../../../hooks/useProfile';

/**
 * Custom Hook para obtener proyectos de un usuario
 */
export const useProjects = (username: string) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }



    const fetchProjects = async () => {
      try {
        setLoading(true);
        const user = await getPublicProfile(username);
        console.log('Perfil del usuario para proyectos:', user);
        const data = await getProjectsByUsername(username, user.tenantId);
        console.log('Proyectos obtenidos:', data);
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('❌ Error al obtener proyectos:', err);
        setError(err instanceof Error ? err : new Error('Error desconocido'));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [username]);

  return { projects, loading, error };
};
function setUser(data: any) {
  throw new Error('Function not implemented.');
}

