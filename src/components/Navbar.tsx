import { Link } from 'react-router-dom';
import { Github, ChevronDown, Search, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { LoginDrawer } from './LoginDrawer';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <>
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
            {/* Language Selector */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-gray-300 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="uppercase text-xs">{i18n.language}</span>
              </button>
              <div className="absolute right-0 mt-2 w-32 bg-white text-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                <button
                  onClick={() => changeLanguage('es')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-md"
                >
                  🇪🇸 Español
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-b-md"
                >
                  🇬🇧 English
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsLoginDrawerOpen(true)}
              className="hover:text-gray-300 transition-colors"
            >
              {t('nav.login')}
            </button>
            <Link to="/signup" className="border border-gray-500 rounded-md px-2 py-1 hover:border-white transition-colors">{t('nav.signup')}</Link>
          </div>
        </div>
      </header>
      
      <LoginDrawer 
        isOpen={isLoginDrawerOpen} 
        onClose={() => setIsLoginDrawerOpen(false)} 
      />
    </>
  );
};
