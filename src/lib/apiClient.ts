import axios from 'axios';
import Cookies from 'js-cookie';
import { useAuthStore } from '../store/useAuthStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5291',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para enviar cookies HttpOnly si el backend las maneja
});

// Interceptor de Petición: Inyectar el Token desde la cookie
apiClient.interceptors.request.use(
  (config) => {
    // Si el backend no usa HttpOnly y tú manejas la cookie en el frontend:
    const token = Cookies.get('jwt_token');
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
      Cookies.remove('jwt_token');
      useAuthStore.getState().logout();
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default apiClient;
