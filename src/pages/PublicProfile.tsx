import { useParams } from 'react-router-dom';
import { useProjects } from '../features/projects/hooks/useProjects';
import { useProfile } from '../hooks/useProfile';
import { Mail, Link as LinkIcon, Calendar, ExternalLink, User as UserIcon } from 'lucide-react';

export const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { profile, loading: loadingProfile, error: profileError } = useProfile(slug);
  const { projects, loading: loadingProjects } = useProjects(slug || '');

  const isLoading = loadingProfile || loadingProjects;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // Solo mostrar error si el usuario NO EXISTE
  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
            <UserIcon className="w-10 h-10 text-red-600 dark:text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Usuario no encontrado</h1>
          <p className="text-gray-600 dark:text-gray-400">
            El usuario <span className="font-semibold text-blue-600">@{slug}</span> no existe.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header con foto de perfil */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 h-48"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Perfil del usuario */}
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

              {/* Información del usuario */}
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
                    <span>Miembro desde 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Proyectos */}
        <section className="pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Proyectos <span className="text-gray-500 dark:text-gray-400 font-normal">({projects.length})</span>
            </h2>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                <LinkIcon className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Este usuario aún no tiene proyectos publicados.</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500"
              >
                {project.image ? (
                  <div className="relative overflow-hidden aspect-video">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <LinkIcon className="w-12 h-12 text-white opacity-50" />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(project.creationDate).toLocaleDateString('es-ES', { year: 'numeric', month: 'short' })}
                    </span>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <span>Ver proyecto</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
          )}
        </section>
      </div>
    </div>
  );
};
