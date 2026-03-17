import apiClient from '../../../lib/apiClient';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models';

/**
 * Obtener todos los proyectos de un usuario por su username
 */
export const getProjectsByUsername = async (username: string, tenantID: string): Promise<Project[]> => {
  try {
    const response = await apiClient.get<Project[]>(`/api/Projects?username=${username}&tenantID=${tenantID}`);
    return response.data || [];
  } catch (error: any) {
    // Si es un 404, retornar array vacío en lugar de error (el usuario existe pero no tiene proyectos)
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

/**
 * Obtener un proyecto por ID
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const response = await apiClient.get<Project>(`/api/Projects/${id}`);
  return response.data;
};

/**
 * Crear un nuevo proyecto (requiere autenticación)
 */
export const createProject = async (project: CreateProjectDto): Promise<Project> => {
  const response = await apiClient.post<Project>('/api/Projects', project);
  return response.data;
};

/**
 * Actualizar un proyecto existente
 */
export const updateProject = async (id: string, project: UpdateProjectDto): Promise<Project> => {
  const response = await apiClient.put<Project>(`/api/Projects/${id}`, project);
  return response.data;
};

/**
 * Eliminar un proyecto
 */
export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Projects/${id}`);
};
