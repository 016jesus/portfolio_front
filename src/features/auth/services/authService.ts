import apiClient from '../../../lib/apiClient';

interface LoginCredentials {
  username: string;
  password: string;
}

interface OAuthLoginPayload {
  provider: string;
  code: string;
}

interface AuthResponse {
  token: string;
  expiresAt: string;
}

interface UserProfile {
  id: string;
  username: string;
  email: string;
  // Agrega más campos según lo que devuelva tu API
}

/**
 * Login tradicional con username/password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/Auth/login', credentials);
  return response.data;
};

/**
 * Login con OAuth (GitHub/Google)
 */
export const oauthLogin = async (payload: OAuthLoginPayload): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>('/api/Auth/oauth-login', payload);
  return response.data;
};

/**
 * Verificar si el token sigue válido (GET /api/auth/me)
 */
export const verifySession = async (): Promise<UserProfile> => {
  const response = await apiClient.get<UserProfile>('/api/Auth/me');
  return response.data;
};

/**
 * Logout (si tienes un endpoint para invalidar el token)
 */
export const logout = async (): Promise<void> => {
  await apiClient.post('/api/Auth/logout');
};
