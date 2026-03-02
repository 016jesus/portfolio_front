import { createBrowserRouter, RouterProvider, Navigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Zap, Palette, Share2, ArrowRight, Users, Briefcase, Star } from 'lucide-react';
import { OAuthCallback } from '../features/auth/components/OAuthCallback';
import { useAuthStore } from '../store/useAuthStore';
import { MainLayout } from '../layouts/MainLayout';
import { PublicProfile } from '../pages/PublicProfile';
import { ErrorPage } from '../pages/ErrorPage';
import { Signup } from '../pages/Signup';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Vistas de ejemplo con estructura semántica
const Home = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: <Users className="w-6 h-6" />, value: '12 000+', label: t('home.stats.users') },
    { icon: <Briefcase className="w-6 h-6" />, value: '38 000+', label: t('home.stats.portfolios') },
    { icon: <Star className="w-6 h-6" />, value: '94 %', label: t('home.stats.interviews') },
  ];

  const features = [
    {
      icon: <Zap className="w-7 h-7 text-yellow-400" />,
      title: t('home.features.speed.title'),
      description: t('home.features.speed.description'),
    },
    {
      icon: <Palette className="w-7 h-7 text-purple-400" />,
      title: t('home.features.design.title'),
      description: t('home.features.design.description'),
    },
    {
      icon: <Share2 className="w-7 h-7 text-blue-400" />,
      title: t('home.features.share.title'),
      description: t('home.features.share.description'),
    },
  ];

  return (
    <article className="space-y-20 pb-12">

      {/* ── Hero ── */}
      <section className="relative text-center py-20 md:py-28 overflow-hidden">
        {/* Fondo degradado decorativo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-[#2da44e]/20 via-blue-500/10 to-purple-500/10 blur-3xl" />
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-full border border-[#2da44e]/40 bg-[#2da44e]/10 text-[#2da44e] text-sm font-semibold">
          <span className="w-2 h-2 rounded-full bg-[#2da44e] animate-pulse" />
          {t('home.hero.badge')}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 max-w-3xl mx-auto">
          {t('home.hero.title')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          {t('home.hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] text-white font-semibold py-3 px-8 rounded-md transition-colors text-base shadow-lg shadow-[#2da44e]/20"
          >
            {t('home.hero.cta')} <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 hover:border-gray-500 dark:hover:border-gray-400 text-gray-700 dark:text-gray-300 font-semibold py-3 px-8 rounded-md transition-colors text-base"
          >
            {t('home.hero.secondaryCta')}
          </a>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center gap-2 p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161b22] shadow-sm"
          >
            <span className="text-[#2da44e]">{s.icon}</span>
            <span className="text-3xl font-extrabold">{s.value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400 text-center">{s.label}</span>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section id="features" className="space-y-8">
        <header className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold">{t('home.features.title')}</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{t('home.features.subtitle')}</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group p-6 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161b22] hover:border-[#2da44e]/50 hover:shadow-md transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#0d1117] flex items-center justify-center group-hover:scale-110 transition-transform">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#2da44e]/80 to-blue-600/80" />
        <div className="px-8 py-14 text-center text-white space-y-5">
          <h2 className="text-3xl md:text-4xl font-extrabold">{t('home.cta.title')}</h2>
          <p className="text-white/80 max-w-lg mx-auto">{t('home.cta.description')}</p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-white text-[#2da44e] font-bold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors shadow-lg text-base"
          >
            {t('home.cta.button')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </article>
  );
};

const Login = () => {
  const { t } = useTranslation();
  
  return (
    <section className="max-w-sm mx-auto mt-16 p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center">{t('login.title')}</h1>
      </header>
      <div className="space-y-4">
        <button className="w-full bg-[#24292f] text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors font-semibold">
          {t('login.signInWithGithub')}
        </button>
      </div>
    </section>
  );
};

const Dashboard = () => {
  const { t } = useTranslation();
  
  return (
    <article className="space-y-6">
      <header className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
      </header>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-[#161b22]">
          <h2 className="font-semibold mb-4">{t('dashboard.recentActivity')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.noActivity')}</p>
        </div>
        <aside className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-[#161b22]">
          <h2 className="font-semibold mb-4">{t('dashboard.repositories')}</h2>
          <p className="text-sm text-gray-500">{t('dashboard.noRepositories')}</p>
        </aside>
      </section>
    </article>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'p/:slug',
        element: <PublicProfile />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'auth/callback',
        element: <OAuthCallback />,
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
