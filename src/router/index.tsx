import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { OAuthCallback } from '../features/auth/components/OAuthCallback';
import { useAuthStore } from '../store/useAuthStore';
import { MainLayout } from '../layouts/MainLayout';

// Componente para proteger rutas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Vistas de ejemplo con estructura semántica
const Home = () => (
  <article className="space-y-12">
    <section className="text-center py-16 border-b border-gray-200 dark:border-gray-800">
      <h1 className="text-5xl font-extrabold tracking-tight mb-4">Let's build from here</h1>
      <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        The world's leading AI-powered developer platform.
      </p>
    </section>
    
    <section className="grid md:grid-cols-2 gap-8 py-8">
      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22]">
        <h2 className="text-2xl font-bold mb-2">Productivity</h2>
        <p className="text-gray-600 dark:text-gray-400">Accelerate innovation with AI and automation.</p>
      </div>
      <div className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22]">
        <h2 className="text-2xl font-bold mb-2">Security</h2>
        <p className="text-gray-600 dark:text-gray-400">Secure your code across the entire lifecycle.</p>
      </div>
    </section>
  </article>
);

const Login = () => (
  <section className="max-w-sm mx-auto mt-16 p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22]">
    <header className="mb-6">
      <h1 className="text-2xl font-bold text-center">Sign in to GitHub</h1>
    </header>
    <div className="space-y-4">
      <button className="w-full bg-[#24292f] text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors font-semibold">
        Sign in with GitHub
      </button>
    </div>
  </section>
);

const Dashboard = () => (
  <article className="space-y-6">
    <header className="border-b border-gray-200 dark:border-gray-800 pb-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
    </header>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-2 border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-[#161b22]">
        <h2 className="font-semibold mb-4">Recent Activity</h2>
        <p className="text-sm text-gray-500">No recent activity to show.</p>
      </div>
      <aside className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-[#161b22]">
        <h2 className="font-semibold mb-4">Repositories</h2>
        <p className="text-sm text-gray-500">You don't have any repositories yet.</p>
      </aside>
    </section>
  </article>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
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
