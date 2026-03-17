import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { OAuthCallback } from '../features/auth/components/OAuthCallback';
import { useAuthStore } from '../store/useAuthStore';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { PublicProfile } from '../pages/PublicProfile';
import { ErrorPage } from '../pages/ErrorPage';
import { Signup } from '../pages/Signup';
import { SetupPage } from '../pages/SetupPage';
import { DashboardLayout } from '../pages/dashboard/DashboardLayout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: 'p/:slug', element: <PublicProfile /> },
      { path: 'login', element: <Home /> },        // login abre el drawer desde Navbar
      { path: 'signup', element: <Signup /> },
      { path: 'auth/callback', element: <OAuthCallback /> },
      {
        path: 'setup',
        element: (
          <ProtectedRoute>
            <SetupPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export const AppRouter = () => <RouterProvider router={router} />;
