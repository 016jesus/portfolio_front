export interface Project {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  creationDate: string;
  endDate: string;
  userId: string;
  userName: string;
  userName_Display: string;
  gitHubRepoId?: number | null;
  gitHubRepoName?: string | null;
  role?: string | null;
  startDate?: string | null;
  isPinned: boolean;
  isVisible: boolean;
  displayOrder: number;
  technologies: string[];
}

export interface CreateProjectDto {
  title: string;
  description: string;
  url: string;
  image: string;
  userId: string;
  userName: string;
  role?: string;
  startDate?: string;
  isPinned?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
  technologyIds?: string[];
}

export interface UpdateProjectDto {
  title: string;
  description: string;
  url: string;
  image: string;
  endDate?: string;
  role?: string;
  startDate?: string;
  isPinned?: boolean;
  isVisible?: boolean;
  displayOrder?: number;
}

export interface User {
  id: string;
  tenantId: string;
  username: string;
  email: string;
  name: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  website?: string;
  location?: string;
  githubUsername?: string;
  provider?: string;
  createdAt?: string;
  projectCount?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  userId: string;
}

export interface CreateSkillDto {
  name: string;
  description: string;
  userId: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  forks: number;
  isPrivate: boolean;
  isFork: boolean;
  topics: string[];
  updatedAt: string;
  createdAt: string;
}

export interface PortfolioProject {
  id?: string | null;
  title: string;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  role?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  isPinned: boolean;
  isVisible: boolean;
  displayOrder: number;
  gitHubRepoId?: number | null;
  gitHubRepoName?: string | null;
  source: 'manual' | 'github' | 'github-custom';
  technologies: string[];
  language?: string | null;
  stars?: number | null;
}

export interface CreateProjectFromRepoDto {
  gitHubRepoId: number;
  gitHubRepoName: string;
  title?: string;
  description?: string;
  role?: string;
  image?: string;
}

export interface ProjectVisibilityDto {
  isVisible: boolean;
  isPinned: boolean;
  displayOrder: number;
}

export interface ReorderProjectDto {
  id: string;
  displayOrder: number;
}

export interface HiddenRepoDto {
  repoId: number;
}
