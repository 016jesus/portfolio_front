import apiClient from '../../../lib/apiClient';
import type { Project, CreateProjectDto } from '../../../core/models';

/**
 * Obtener todos los proyectos de un usuario por su username
 */
export const getProjectsByUsername = async (username: string): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>(`/api/Projects?username=${username}`);
  return response.data;
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
export const updateProject = async (id: string, project: Partial<CreateProjectDto>): Promise<Project> => {
  const response = await apiClient.put<Project>(`/api/Projects/${id}`, project);
  return response.data;
};

/**
 * Eliminar un proyecto
 */
export const deleteProject = async (id: string): Promise<void> => {
  await apiClient.delete(`/api/Projects/${id}`);
};
