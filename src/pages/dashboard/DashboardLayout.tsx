import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, Briefcase, Code2, User, Github, LogOut,
  ChevronRight, ExternalLink, Menu
} from 'lucide-react';
import type { User as UserModel } from '../../core/models';
import Cookies from 'js-cookie';
import { useAuthStore } from '../../store/useAuthStore';
import { logout } from '../../features/auth/services/authService';
import { toast } from '../../components/Toast';
import { ProjectsTab } from './tabs/ProjectsTab';
import { ProfileTab } from './tabs/ProfileTab';
import { SkillsTab } from './tabs/SkillsTab';
import { ReposTab } from './tabs/ReposTab';

type Tab = 'overview' | 'projects' | 'skills' | 'profile' | 'repos';

export const DashboardLayout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout: logoutStore } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch { /* JWT stateless, always ok */ }
    Cookies.remove('jwt_token');
    logoutStore();
    toast.info(t('dashboard.loggedOut'));
    navigate('/');
  };

  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: t('dashboard.nav.overview'), icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'projects', label: t('dashboard.nav.projects'), icon: <Briefcase className="w-5 h-5" /> },
    { id: 'skills', label: t('dashboard.nav.skills'), icon: <Code2 className="w-5 h-5" /> },
    { id: 'repos', label: t('dashboard.nav.repos'), icon: <Github className="w-5 h-5" /> },
    { id: 'profile', label: t('dashboard.nav.profile'), icon: <User className="w-5 h-5" /> },
  ];

  const avatarUrl = user?.avatarUrl;
  const displayName = user?.displayName || user?.name || user?.username;

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white dark:bg-[#0d1117] border-r border-gray-200 dark:border-gray-800
        z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:top-auto md:translate-x-0 md:z-auto
        flex flex-col
      `}>
        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2da44e] to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                {(displayName || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{user?.username}</p>
            </div>
          </div>
          {user?.username && (
            <Link
              to={`/p/${user.username}`}
              target="_blank"
              className="mt-3 flex items-center gap-1 text-xs text-[#2da44e] hover:underline"
            >
              <ExternalLink className="w-3 h-3" />
              {t('dashboard.viewPublicProfile')}
            </Link>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                activeTab === item.id
                  ? 'bg-[#2da44e]/10 text-[#2da44e] dark:text-[#3fb950]'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {item.icon}
              {item.label}
              {activeTab === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 bg-gray-50 dark:bg-gray-950">
        {/* Mobile header */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="p-1">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-semibold text-gray-900 dark:text-white">
            {navItems.find((n) => n.id === activeTab)?.label}
          </span>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab user={user} onNavigate={setActiveTab} t={t} />}
          {activeTab === 'projects' && <ProjectsTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'repos' && <ReposTab />}
          {activeTab === 'profile' && <ProfileTab />}
        </div>
      </main>
    </div>
  );
};

const OverviewTab = ({ user, onNavigate, t }: {
  user: UserModel | null;
  onNavigate: (tab: Tab) => void;
  t: (key: string) => string;
}) => (
  <div className="space-y-6">
    <header>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t('dashboard.welcome')}, {user?.displayName || user?.name || user?.username}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.welcomeSubtitle')}</p>
    </header>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { label: t('dashboard.nav.projects'), tab: 'projects', icon: <Briefcase className="w-6 h-6 text-blue-500" /> },
        { label: t('dashboard.nav.skills'), tab: 'skills', icon: <Code2 className="w-6 h-6 text-purple-500" /> },
        { label: t('dashboard.nav.repos'), tab: 'repos', icon: <Github className="w-6 h-6 text-gray-600 dark:text-gray-300" /> },
        { label: t('dashboard.nav.profile'), tab: 'profile', icon: <User className="w-6 h-6 text-green-500" /> },
      ].map((card) => (
        <button
          key={card.tab}
          onClick={() => onNavigate(card.tab as Tab)}
          className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5 text-left hover:border-[#2da44e]/50 hover:shadow-md transition-all group"
        >
          <div className="mb-3">{card.icon}</div>
          <p className="font-semibold text-gray-900 dark:text-white group-hover:text-[#2da44e] transition-colors">
            {card.label}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            <ChevronRight className="w-3 h-3 inline" /> {t('dashboard.manage')}
          </p>
        </button>
      ))}
    </div>

    {!user?.bio && !user?.avatarUrl && (
      <div className="bg-[#2da44e]/5 border border-[#2da44e]/20 rounded-xl p-5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-[#2da44e]/10 flex items-center justify-center">
          <User className="w-5 h-5 text-[#2da44e]" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white">{t('dashboard.completeProfile')}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.completeProfileHint')}</p>
        </div>
        <button
          onClick={() => onNavigate('profile')}
          className="shrink-0 bg-[#2da44e] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2c974b] transition-colors"
        >
          {t('dashboard.complete')}
        </button>
      </div>
    )}
  </div>
);
