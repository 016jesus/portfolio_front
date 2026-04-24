import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col text-[#24292f] dark:text-[#c9d1d9]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
