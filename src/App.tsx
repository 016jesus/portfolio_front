import { AppRouter } from './router';
import { ToastContainer } from './components/Toast';
import { GlassBackground } from './components/GlassBackground';
import { useSessionValidation } from './features/auth/hooks/useSessionValidation';

function App() {
  const { isValidating } = useSessionValidation();

  if (isValidating) {
    return (
      <>
        <GlassBackground />
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2da44e] border-t-transparent" />
        </div>
      </>
    );
  }

  return (
    <>
      <GlassBackground />
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
