import { useParams } from 'react-router-dom';
import { useProjects } from '../features/projects/hooks/useProjects';

export const PublicProfile = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading, error } = useProjects(slug || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Perfil Público</h1>
        <p className="mt-2 text-xl text-gray-600 dark:text-gray-400">
          Viendo el portafolio de: <span className="font-semibold text-blue-600">{slug}</span>
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Proyectos</h2>
        {projects.length === 0 ? (
          <p className="text-gray-500">No hay proyectos para mostrar.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-gray-50 dark:bg-[#161b22]"
              >
                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-40 object-cover rounded mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Ver proyecto →
                  </a>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
