import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import apiClient from '../../../lib/apiClient';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  
  // useRef para evitar doble ejecución en React Strict Mode (desarrollo)
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider') || 'github'; // ej: ?code=123&provider=github

    if (code && !hasFetched.current) {
      hasFetched.current = true;
      
      // Llamada a tu API .NET para intercambiar el code por el JWT
      apiClient.post(`/api/Auth/oauth-login`, { provider, code })
        .then((response) => {
          // Según tu Swagger, la respuesta exitosa devuelve { token, expiresAt }
          const { token } = response.data;
          setToken(token);
          
          // Redirigir al dashboard protegido
          navigate('/admin/dashboard', { replace: true });
        })
        .catch((error) => {
          console.error('Error en autenticación OAuth:', error);
          navigate('/login?error=auth_failed', { replace: true });
        });
    } else if (!code) {
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate, setToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner minimalista con Tailwind */}
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Autenticando de forma segura...
        </p>
      </div>
    </div>
  );
};
