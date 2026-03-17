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
}

export interface CreateProjectDto {
  title: string;
  description: string;
  url: string;
  image: string;
  userId: string;
  userName: string;
}

export interface UpdateProjectDto {
  title: string;
  description: string;
  url: string;
  image: string;
  endDate?: string;
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
