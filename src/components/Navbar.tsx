import { Link, useNavigate } from 'react-router-dom';
import { Globe, LayoutDashboard, LogOut, User, Menu, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { AppLogo } from './Logo';
import { LoginDrawer } from './LoginDrawer';
import { useAuthStore } from '../store/useAuthStore';
import { logout } from '../features/auth/services/authService';
import { toast } from './Toast';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout: logoutStore } = useAuthStore();
  const [isLoginDrawerOpen, setIsLoginDrawerOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lang: string) => i18n.changeLanguage(lang);

  const handleLogout = async () => {
    try { await logout(); } catch { /* ok */ }
    Cookies.remove('jwt_token');
    logoutStore();
    setUserMenuOpen(false);
    toast.info(t('dashboard.loggedOut'));
    navigate('/');
  };

  const displayName = user?.displayName || user?.name || user?.username;
  const avatarUrl = user?.avatarUrl;

  return (
    <>
      <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <AppLogo size={34} showText={true} className="text-slate-900 dark:text-white" />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-400">
            <a href="#features" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
              {t('nav.features')}
            </a>
            <Link to="/pricing" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
              {t('nav.pricing')}
            </Link>
            <a href="#howItWorks" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
              {t('nav.howItWorks')}
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Language */}
            <div className="relative group hidden md:block">
              <button className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase tracking-wide">
                <Globe className="w-3.5 h-3.5" />
                {i18n.language}
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button onClick={() => changeLanguage('es')} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  🇪🇸 Español
                </button>
                <button onClick={() => changeLanguage('en')} className="block w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  🇬🇧 English
                </button>
              </div>
            </div>

            {isAuthenticated && user ? (
              /* User dropdown */
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                      {(displayName || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-xs text-slate-500 truncate">@{user.username}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> {t('nav.dashboard')}
                        </Link>
                        {user.username && (
                          <Link to={`/p/${user.username}`} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <User className="w-4 h-4 text-slate-400" /> {t('nav.myProfile')}
                          </Link>
                        )}
                      </div>
                      <div className="py-1 border-t border-slate-100 dark:border-slate-800">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full text-left">
                          <LogOut className="w-4 h-4" /> {t('nav.logout')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => setIsLoginDrawerOpen(true)}
                  className="hidden md:block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  {t('nav.login')}
                </button>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors shadow-sm shadow-green-500/20"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
            <a href="#features" onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {t('nav.features')}
            </a>
            <a href="#howItWorks" onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {t('nav.howItWorks')}
            </a>
            <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {t('nav.pricing')}
            </Link>
            {!isAuthenticated && (
              <button onClick={() => { setMobileMenuOpen(false); setIsLoginDrawerOpen(true); }}
                className="block w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                {t('nav.login')}
              </button>
            )}
          </div>
        )}
      </header>

      <LoginDrawer isOpen={isLoginDrawerOpen} onClose={() => setIsLoginDrawerOpen(false)} />
    </>
  );
};
