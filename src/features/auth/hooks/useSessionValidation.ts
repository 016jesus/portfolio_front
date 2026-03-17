import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { verifySession } from '../services/authService';
import Cookies from 'js-cookie';

/**
 * Hook para validar la sesión del usuario al cargar la aplicación.
 * Llamar este hook en el componente raíz (App.tsx o AppRouter).
 */
export const useSessionValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const { setToken, logout } = useAuthStore();

  useEffect(() => {
    const validateSession = async () => {
      const token = Cookies.get('jwt_token');

      if (!token) {
        setIsValidating(false);
        return;
      }

      try {
        // Verificar si el token sigue siendo válido
        const userProfile = await verifySession();
        setToken(token, userProfile); // Actualizar el estado global
      } catch (error) {
        console.error('❌ Token inválido o expirado, limpiando sesión:', error);
        logout();
        Cookies.remove('jwt_token');
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [setToken, logout]);

  return { isValidating };
};
