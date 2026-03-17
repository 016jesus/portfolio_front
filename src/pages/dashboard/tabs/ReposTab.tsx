import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Star, GitFork, Loader2, ExternalLink, Globe, Lock } from 'lucide-react';
import { getMyRepos } from '../../../features/github/services/githubService';
import { useAuthStore } from '../../../store/useAuthStore';
import type { GitHubRepo } from '../../../core/models';

export const ReposTab = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isGitHubUser = user?.provider === 'github';

  useEffect(() => {
    if (!isGitHubUser) return;
    setLoading(true);
    setError('');
    getMyRepos()
      .then(setRepos)
      .catch((err) => {
        const msg = err?.response?.data?.message || t('repos.errorLoad');
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [isGitHubUser]);

  if (!isGitHubUser) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('repos.title')}</h2>
        </div>
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-12 text-center">
          <Github className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('repos.notConnected')}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {t('repos.notConnectedHint')}
          </p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#24292f] hover:bg-[#2c3237] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Github className="w-5 h-5" />
            {t('repos.connectGitHub')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('repos.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {t('repos.subtitle', { username: user?.githubUsername || user?.username })}
          </p>
        </div>
        {user?.githubUsername && (
          <a
            href={`https://github.com/${user.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 transition-colors"
          >
            <Github className="w-4 h-4" />
            @{user.githubUsername}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#2da44e]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <Github className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('repos.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-[#2da44e]/50 hover:shadow-md transition-all group block"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  {repo.isPrivate ? (
                    <Lock className="w-4 h-4 text-gray-400 shrink-0" />
                  ) : (
                    <Globe className="w-4 h-4 text-gray-400 shrink-0" />
                  )}
                  <span className="font-semibold text-gray-900 dark:text-white group-hover:text-[#2da44e] transition-colors truncate">
                    {repo.name}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0 group-hover:text-[#2da44e]" />
              </div>

              {repo.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{repo.description}</p>
              )}

              <div className="flex items-center gap-4 text-xs text-gray-500">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2da44e]"></span>
                    {repo.language}
                  </span>
                )}
                {repo.stars > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" /> {repo.stars}
                  </span>
                )}
                {repo.forks > 0 && (
                  <span className="flex items-center gap-1">
                    <GitFork className="w-3.5 h-3.5" /> {repo.forks}
                  </span>
                )}
                {repo.isPrivate && (
                  <span className="ml-auto bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full text-gray-500 dark:text-gray-400">
                    Private
                  </span>
                )}
              </div>

              {repo.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {repo.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full">
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
