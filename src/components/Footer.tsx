import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="mt-16 py-10 px-4 md:px-8 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Github className="w-6 h-6 text-gray-400" />
          <span>© {new Date().getFullYear()} GitHub, Inc. (Clone)</span>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Terms</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Security</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Status</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Docs</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Contact</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Manage cookies</Link>
          <Link to="#" className="hover:text-blue-600 dark:hover:text-blue-400">Do not share my personal information</Link>
        </nav>
      </div>
    </footer>
  );
};
