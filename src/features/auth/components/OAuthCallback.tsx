import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { oauthLogin } from '../services/authService';
import Cookies from 'js-cookie';

export const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);
  const hasFetched = useRef(false);

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state') || '';
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=auth_failed', { replace: true });
      return;
    }

    if (!code) {
      navigate('/login', { replace: true });
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    // Determinar proveedor desde el state o sessionStorage
    let provider = 'github';
    if (state.startsWith('google_')) provider = 'google';
    else if (state.startsWith('github_')) provider = 'github';
    else {
      const stored = sessionStorage.getItem('oauth_provider');
      if (stored) provider = stored;
    }
    sessionStorage.removeItem('oauth_provider');
    sessionStorage.removeItem('oauth_state');

    const redirectUri = `${window.location.origin}/auth/callback`;

    oauthLogin({ provider, code, redirectUri })
      .then((response) => {
        Cookies.set('jwt_token', response.token, { expires: 7, secure: true, sameSite: 'strict' });
        setToken(response.token, response.user);
        navigate('/admin/dashboard', { replace: true });
      })
      .catch(() => {
        navigate('/login?error=auth_failed', { replace: true });
      });
  }, [searchParams, navigate, setToken]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2da44e] border-t-transparent"></div>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200">
          Autenticando de forma segura...
        </p>
      </div>
    </div>
  );
};
