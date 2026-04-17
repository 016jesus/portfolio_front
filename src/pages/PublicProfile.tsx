import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../hooks/useProfile';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useAuthStore } from '../store/useAuthStore';
import { ProjectCard } from '../components/ProjectCard';
import { Mail, Calendar, Pin, FolderOpen, User as UserIcon, Settings, Code2 } from 'lucide-react';

export const PublicProfile = () => {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { profile, loading: loadingProfile, error: profileError } = useProfile(slug);
  const {
    publicPortfolio,
    publicSkills,
    fetchPublicPortfolio,
    fetchPublicSkills,
    loading: loadingPortfolio,
  } = usePortfolioStore();
  const authUser = useAuthStore(s => s.user);

  const isOwner = authUser?.username === slug;

  useEffect(() => {
    if (slug) {
      fetchPublicPortfolio(slug);
      fetchPublicSkills(slug);
    }
  }, [slug]);

  const isLoading = loadingProfile || loadingPortfolio;

  const pinnedProjects = publicPortfolio.filter(p => p.isPinned);
  const otherProjects = publicPortfolio.filter(p => !p.isPinned);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <UserIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {t('publicProfile.notFound', 'Usuario no encontrado')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('publicProfile.notFoundDesc', 'El usuario')} <span className="font-semibold text-blue-600">@{slug}</span> {t('publicProfile.notFoundSuffix', 'no existe.')}
          </p>
        </div>
      </div>
    );
  }

  const renderProjectCard = (project: typeof publicPortfolio[number]) => (
    <ProjectCard
      key={project.id ?? project.title}
      title={project.title}
      description={project.description}
      url={project.url}
      image={project.image}
      role={project.role}
      language={project.language}
      stars={project.stars}
      technologies={project.technologies}
      source={project.source}
      isPinned={project.isPinned}
      gitHubRepoName={project.gitHubRepoName}
      startDate={project.startDate}
      endDate={project.endDate}
      mode="public"
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 h-48"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* User profile card */}
        <div className="relative -mt-20 mb-12">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile?.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.displayName || profile.username}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 shadow-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-5xl md:text-6xl font-bold text-white">
                      {(profile?.username || slug)?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full"></div>
              </div>

              {/* User info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {profile?.displayName || profile?.username || slug}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">@{profile?.username || slug}</p>

                {profile?.bio && (
                  <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-2xl">{profile.bio}</p>
                )}

                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {profile?.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{t('publicProfile.memberSince', 'Miembro desde 2026')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Owner banner */}
        {isOwner && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl px-5 py-3 flex items-center justify-between">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {t('publicProfile.ownerBanner', 'Este es tu perfil publico. Personaliza tu portafolio desde el panel.')}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              {t('publicProfile.goToDashboard', 'Personalizar')}
            </Link>
          </div>
        )}

        {/* Main content: projects + skills sidebar */}
        <section className="pb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Projects (main) */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {t('publicProfile.projects', 'Proyectos')}{' '}
                  <span className="text-gray-500 dark:text-gray-400 font-normal">({publicPortfolio.length})</span>
                  {pinnedProjects.length > 0 && (
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400 font-normal">
                      <Pin className="w-3.5 h-3.5 inline mb-0.5" /> {pinnedProjects.length} {t('publicProfile.pinned', 'fijados')}
                    </span>
                  )}
                </h2>
              </div>

              {publicPortfolio.length === 0 ? (
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <FolderOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('publicProfile.noProjects', 'Este usuario aun no tiene proyectos publicados.')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Pinned projects */}
                  {pinnedProjects.length > 0 && (
                    <div className="mb-8">
                      <div className="flex items-center gap-2 mb-4">
                        <Pin className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 uppercase tracking-wide">
                          {t('publicProfile.pinnedSection', 'Destacados')}
                        </h3>
                      </div>
                      <div className="bg-green-50/50 dark:bg-green-950/10 rounded-2xl p-4 border border-green-100 dark:border-green-900/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {pinnedProjects.map(renderProjectCard)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Other projects */}
                  {otherProjects.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {otherProjects.map(renderProjectCard)}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Skills sidebar */}
            {publicSkills.length > 0 && (
              <aside className="lg:w-72 xl:w-80 shrink-0">
                <div className="lg:sticky lg:top-6">
                  <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Code2 className="w-5 h-5 text-[#2da44e]" />
                        {t('publicProfile.skills', 'Skills')}
                        <span className="text-sm text-gray-400 font-normal">({publicSkills.length})</span>
                      </h3>
                    </div>
                    <div className="p-4 space-y-2">
                      {publicSkills.map((skill) => (
                        <div
                          key={skill.id}
                          className="group rounded-lg px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-[#161b22] transition-colors"
                        >
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2da44e] dark:text-[#3fb950]">
                            <Code2 className="w-3.5 h-3.5" />
                            {skill.name}
                          </span>
                          {skill.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
