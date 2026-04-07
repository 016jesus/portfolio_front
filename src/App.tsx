import { AppRouter } from './router';
import { ToastContainer } from './components/Toast';
import { useSessionValidation } from './features/auth/hooks/useSessionValidation';

function App() {
  const { isValidating } = useSessionValidation();

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#0d1117]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2da44e] border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
