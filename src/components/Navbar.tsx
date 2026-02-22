import { Link } from 'react-router-dom';
import { Github, ChevronDown, Search } from 'lucide-react';

export const Navbar = () => {
  return (
    <header className="bg-[#24292f] text-white py-4 px-4 md:px-8 flex items-center justify-between text-sm">
      <div className="flex items-center gap-4 flex-1">
        <Link to="/" className="text-white hover:text-gray-300 transition-colors">
          <Github className="w-8 h-8" />
        </Link>
        
        <nav className="hidden md:flex items-center gap-4 font-semibold">
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
              Product <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
              Solutions <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
              Open Source <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <Link to="/pricing" className="hover:text-gray-300 transition-colors">Pricing</Link>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or jump to..."
            className="bg-transparent border border-gray-500 rounded-md py-1 pl-9 pr-3 text-sm focus:outline-none focus:border-white focus:bg-white focus:text-gray-900 transition-all w-64 placeholder-gray-400"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-gray-400 border border-gray-500 rounded px-1 text-xs">/</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hover:text-gray-300 transition-colors">Sign in</Link>
          <Link to="/signup" className="border border-gray-500 rounded-md px-2 py-1 hover:border-white transition-colors">Sign up</Link>
        </div>
      </div>
    </header>
  );
};
