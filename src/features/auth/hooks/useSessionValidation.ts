import { useEffect, useRef, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { verifySession } from '../services/authService';
import Cookies from 'js-cookie';

/**
 * Hook para validar la sesión del usuario al cargar la aplicación.
 * Llamar este hook en el componente raíz (App.tsx).
 */
export const useSessionValidation = () => {
  const [isValidating, setIsValidating] = useState(true);
  const { setToken, logout } = useAuthStore();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const validateSession = async () => {
      const token = Cookies.get('jwt_token');

      if (!token) {
        // Cookie expiró o no existe, pero Zustand puede seguir diciendo "autenticado"
        if (useAuthStore.getState().isAuthenticated) {
          logout();
        }
        setIsValidating(false);
        return;
      }

      try {
        const userProfile = await verifySession();
        setToken(token, userProfile);
      } catch {
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
