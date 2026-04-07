import apiClient from '../../../lib/apiClient';
import type { User } from '../../../core/models';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  name: string;
  password: string;
}

interface OAuthLoginPayload {
  provider: string;
  code: string;
  redirectUri?: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: User;
  isNewUser?: boolean;
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/Auth/login', credentials);
  return response.data;
};

export const register = async (credentials: RegisterCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/Auth/register', credentials);
  return response.data;
};

export const oauthLogin = async (payload: OAuthLoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/Auth/oauth-login', payload);
  return response.data;
};

export const verifySession = async (): Promise<User> => {
  const response = await apiClient.get<User>('/api/Auth/me', {
    _skipAuthInterceptor: true,
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/api/Auth/logout');
};
