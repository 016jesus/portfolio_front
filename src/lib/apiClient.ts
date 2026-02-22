import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5291',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Petición: Inyectar el Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Manejar expiración de Token (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Limpiar estado y redirigir al login
      useAuthStore.getState().logout();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
