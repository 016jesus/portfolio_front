import apiClient from '../../../lib/apiClient';
import type { GitHubRepo } from '../../../core/models';

export const getMyRepos = async (page = 1, perPage = 30): Promise<GitHubRepo[]> => {
  const response = await apiClient.get<GitHubRepo[]>(
    `/api/GitHub/repos?page=${page}&perPage=${perPage}`
  );
  return response.data;
};

export const getGitHubOAuthUrl = (redirectUri: string): string => {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  const scope = 'read:user user:email repo';
  const state = `github_${Date.now()}`;
  sessionStorage.setItem('oauth_state', state);
  return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
};

export const getGoogleOAuthUrl = (redirectUri: string): string => {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const scope = 'openid email profile';
  const state = `google_${Date.now()}`;
  sessionStorage.setItem('oauth_state', state);
  return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}&access_type=offline`;
};
