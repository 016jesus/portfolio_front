import { create } from 'zustand';
import type { PortfolioProject, Project, GitHubRepo, Skill, CreateProjectFromRepoDto, ProjectVisibilityDto, ReorderProjectDto } from '../core/models';
import * as portfolioService from '../features/portfolio/services/portfolioService';
import { getMyRepos } from '../features/github/services/githubService';
import { getProjectsByUsername } from '../features/projects/services/projectService';

interface PortfolioState {
  projects: Project[];
  githubRepos: GitHubRepo[];
  publicPortfolio: PortfolioProject[];
  publicSkills: Skill[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchProjects: (username: string, tenantId: string) => Promise<void>;
  fetchGitHubRepos: () => Promise<void>;
  fetchPublicPortfolio: (username: string) => Promise<void>;
  fetchPublicSkills: (username: string) => Promise<void>;
  convertRepo: (data: CreateProjectFromRepoDto) => Promise<Project>;
  updateVisibility: (id: string, data: ProjectVisibilityDto) => Promise<void>;
  reorderProjects: (items: ReorderProjectDto[]) => Promise<void>;
  hideRepo: (repoId: number) => Promise<void>;
  unhideRepo: (repoId: number) => Promise<void>;
  reset: () => void;
}

export const usePortfolioStore = create<PortfolioState>()((set, get) => ({
  projects: [],
  githubRepos: [],
  publicPortfolio: [],
  publicSkills: [],
  loading: false,
  error: null,

  fetchProjects: async (username, tenantId) => {
    set({ loading: true, error: null });
    try {
      const projects = await getProjectsByUsername(username, tenantId);
      set({ projects, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchGitHubRepos: async () => {
    set({ loading: true, error: null });
    try {
      const repos = await getMyRepos(1, 100);
      set({ githubRepos: repos, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPublicPortfolio: async (username) => {
    set({ loading: true, error: null });
    try {
      const portfolio = await portfolioService.getPublicPortfolio(username);
      set({ publicPortfolio: portfolio, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchPublicSkills: async (username) => {
    try {
      const skills = await portfolioService.getPublicSkills(username);
      set({ publicSkills: skills });
    } catch {
      set({ publicSkills: [] });
    }
  },

  convertRepo: async (data) => {
    const project = await portfolioService.createProjectFromRepo(data);
    const { projects } = get();
    set({ projects: [...projects, project] });
    return project;
  },

  updateVisibility: async (id, data) => {
    await portfolioService.updateProjectVisibility(id, data);
    const { projects } = get();
    set({
      projects: projects.map(p =>
        p.id === id ? { ...p, isPinned: data.isPinned, isVisible: data.isVisible, displayOrder: data.displayOrder } : p
      ),
    });
  },

  reorderProjects: async (items) => {
    await portfolioService.reorderProjects(items);
    const { projects } = get();
    set({
      projects: projects.map(p => {
        const item = items.find(i => i.id === p.id);
        return item ? { ...p, displayOrder: item.displayOrder } : p;
      }),
    });
  },

  hideRepo: async (repoId) => {
    await portfolioService.hideGitHubRepo(repoId);
    const { githubRepos } = get();
    set({ githubRepos: githubRepos.filter(r => r.id !== repoId) });
  },

  unhideRepo: async (repoId) => {
    await portfolioService.unhideGitHubRepo(repoId);
  },

  reset: () => set({ projects: [], githubRepos: [], publicPortfolio: [], publicSkills: [], loading: false, error: null }),
}));
