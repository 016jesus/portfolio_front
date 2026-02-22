import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0d1117] text-[#24292f] dark:text-[#c9d1d9]">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
