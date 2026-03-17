import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Loader2, Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react';
import Cookies from 'js-cookie';
import { register } from '../features/auth/services/authService';
import { getGitHubOAuthUrl, getGoogleOAuthUrl } from '../features/github/services/githubService';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from '../components/Toast';

export const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setToken = useAuthStore((s) => s.setToken);

  const [form, setForm] = useState({ username: '', email: '', name: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const callbackUrl = `${window.location.origin}/auth/callback`;

  const handleGitHub = () => {
    const url = getGitHubOAuthUrl(callbackUrl);
    sessionStorage.setItem('oauth_provider', 'github');
    window.location.href = url;
  };

  const handleGoogle = () => {
    const url = getGoogleOAuthUrl(callbackUrl);
    sessionStorage.setItem('oauth_provider', 'google');
    window.location.href = url;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.username.trim()) errs.username = t('signup.errorUsername');
    else if (form.username.length < 3) errs.username = t('signup.errorUsernameMin');
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = t('signup.errorEmail');
    if (!form.name.trim()) errs.name = t('signup.errorName');
    if (form.password.length < 8) errs.password = t('signup.errorPasswordMin');
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const response = await register(form);
      Cookies.set('jwt_token', response.token, { expires: 7, secure: true, sameSite: 'strict' });
      setToken(response.token, response.user);
      toast.success(t('signup.successMessage'));
      navigate('/admin/dashboard');
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : t('signup.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      if (errors[key]) setErrors((er) => ({ ...er, [key]: '' }));
    },
  });

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8">
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('signup.title')}</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('signup.subtitle')}</p>
          </header>

          {/* OAuth buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleGitHub}
              className="w-full flex items-center justify-center gap-3 bg-[#24292f] hover:bg-[#2c3237] text-white rounded-lg py-3 px-4 font-semibold transition-colors"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t('signup.signUpWithGithub')}
            </button>

            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 bg-white dark:bg-[#0d1117] border-2 border-gray-300 dark:border-gray-700 hover:border-gray-400 text-gray-900 dark:text-white rounded-lg py-3 px-4 font-semibold transition-all hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('signup.signUpWithGoogle')}
            </button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#161b22] text-gray-500">{t('signup.or')}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('signup.username')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  {...field('username')}
                  autoComplete="username"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white ${
                    errors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder={t('signup.usernamePlaceholder')}
                />
              </div>
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('signup.fullName')}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  {...field('name')}
                  autoComplete="name"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder={t('signup.fullNamePlaceholder')}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('signup.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  {...field('email')}
                  autoComplete="email"
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white ${
                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder={t('signup.emailPlaceholder')}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('signup.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...field('password')}
                  autoComplete="new-password"
                  className={`w-full pl-9 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  }`}
                  placeholder={t('signup.passwordPlaceholder')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
              <p className="mt-1 text-xs text-gray-500">{t('signup.passwordHint')}</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] disabled:opacity-60 text-white rounded-lg py-3 px-4 font-bold transition-colors mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
              {loading ? t('signup.creating') : t('signup.createAccount')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            {t('signup.alreadyHaveAccount')}{' '}
            <button
              className="text-[#2da44e] hover:underline font-semibold"
              onClick={() => {
                // Abrir el LoginDrawer via el Navbar no es directo desde aquí,
                // así que navegamos a /login
                navigate('/login');
              }}
            >
              {t('signup.loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
