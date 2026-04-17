import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5291',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor de Petición: Inyectar el Token desde la cookie y el tenant header
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('jwt_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const tenantId = useAuthStore.getState().user?.tenantId;
    if (tenantId && config.headers) {
      config.headers['X-Tenant-Id'] = tenantId;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Flag para evitar múltiples redirects simultáneos
let isLoggingOut = false;

// Interceptor de Respuesta: Manejar expiración de Token (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?._skipAuthInterceptor) {
      Cookies.remove('jwt_token');
      useAuthStore.getState().logout();
      if (!isLoggingOut) {
        isLoggingOut = true;
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
