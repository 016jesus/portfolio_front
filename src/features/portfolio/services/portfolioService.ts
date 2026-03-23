import apiClient from '../../../lib/apiClient';
import type { PortfolioProject, CreateProjectFromRepoDto, ProjectVisibilityDto, ReorderProjectDto, Project } from '../../../core/models';

export const getPublicPortfolio = async (username: string): Promise<PortfolioProject[]> => {
  const response = await apiClient.get<PortfolioProject[]>(`/api/Users/public/${username}/portfolio`);
  return response.data;
};

export const createProjectFromRepo = async (data: CreateProjectFromRepoDto): Promise<Project> => {
  const response = await apiClient.post<Project>('/api/Projects/from-repo', data);
  return response.data;
};

export const updateProjectVisibility = async (id: string, data: ProjectVisibilityDto): Promise<Project> => {
  const response = await apiClient.put<Project>(`/api/Projects/${id}/visibility`, data);
  return response.data;
};

export const reorderProjects = async (items: ReorderProjectDto[]): Promise<void> => {
  await apiClient.put('/api/Projects/reorder', items);
};

export const hideGitHubRepo = async (repoId: number): Promise<void> => {
  await apiClient.post('/api/Users/me/hidden-repos', { repoId });
};

export const unhideGitHubRepo = async (repoId: number): Promise<void> => {
  await apiClient.delete(`/api/Users/me/hidden-repos/${repoId}`);
};
