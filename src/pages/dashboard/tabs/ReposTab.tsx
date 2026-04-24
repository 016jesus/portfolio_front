import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Github, Loader2, ExternalLink } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import { ProjectCard } from '../../../components/ProjectCard';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { toast } from '../../../components/Toast';
import type { GitHubRepo } from '../../../core/models';

export const ReposTab = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const {
    githubRepos: repos,
    projects,
    loading,
    error,
    fetchGitHubRepos,
    fetchProjects,
    convertRepo,
    hideRepo,
    updateVisibility,
  } = usePortfolioStore();

  const isGitHubUser = user?.provider === 'github';

  useEffect(() => {
    if (!isGitHubUser || !user) return;
    fetchGitHubRepos();
    fetchProjects(user.username, user.tenantId);
  }, [isGitHubUser]);

  // Build a map of repoId -> project for converted repos
  const convertedMap = new Map(
    projects
      .filter((p) => p.gitHubRepoId != null)
      .map((p) => [p.gitHubRepoId!, p]),
  );

  const customizedCount = repos.filter((r) => convertedMap.has(r.id)).length;

  const [confirmRepo, setConfirmRepo] = useState<GitHubRepo | null>(null);
  const [converting, setConverting] = useState(false);

  const handleConvert = (repo: GitHubRepo) => {
    setConfirmRepo(repo);
  };

  const doConvert = async () => {
    if (!confirmRepo) return;
    const repo = confirmRepo;
    setConverting(true);
    try {
      await convertRepo({
        gitHubRepoId: repo.id,
        gitHubRepoName: repo.fullName,
        title: repo.name,
        description: repo.description ?? undefined,
      });
      toast.success(t('repos.convertSuccess', 'Repo converted to project'));
      setConfirmRepo(null);
    } catch (err: any) {
      if (err?.response?.status === 409) {
        toast.success(t('repos.alreadyConverted', 'Este repo ya es un proyecto. Actualizando lista...'));
        if (user) await fetchProjects(user.username, user.tenantId);
        setConfirmRepo(null);
      } else {
        toast.error(t('repos.convertError', 'Failed to convert repo'));
      }
    } finally {
      setConverting(false);
    }
  };

  const handleHide = async (repo: GitHubRepo) => {
    try {
      await hideRepo(repo.id);
      toast.success(t('repos.hidden', 'Repo hidden'));
    } catch {
      toast.error(t('repos.hideError', 'Failed to hide repo'));
    }
  };

  const handleTogglePin = async (projectId: string, current: { isPinned: boolean; isVisible: boolean; displayOrder: number }) => {
    try {
      await updateVisibility(projectId, {
        ...current,
        isPinned: !current.isPinned,
      });
    } catch {
      toast.error(t('repos.pinError', 'Failed to update pin'));
    }
  };

  const handleToggleVisibility = async (projectId: string, current: { isPinned: boolean; isVisible: boolean; displayOrder: number }) => {
    try {
      await updateVisibility(projectId, {
        ...current,
        isVisible: !current.isVisible,
      });
    } catch {
      toast.error(t('repos.visibilityError', 'Failed to update visibility'));
    }
  };

  if (!isGitHubUser) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('repos.title')}</h2>
        </div>
        <div className="glass-surface rounded-2xl p-12 text-center">
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
      {/* Header */}
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

      {/* Count badges */}
      {!loading && !error && repos.length > 0 && (
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full font-medium">
            {repos.length} {t('repos.repos', 'repos')}
          </span>
          {customizedCount > 0 && (
            <span className="bg-[#2da44e]/10 text-[#2da44e] px-2.5 py-0.5 rounded-full font-medium">
              {customizedCount} {t('repos.customized', 'customized')}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-[#2da44e]" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="glass-surface border-dashed rounded-2xl p-12 text-center">
          <Github className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('repos.empty')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {repos.map((repo) => {
            const project = convertedMap.get(repo.id);
            const isConverted = !!project;

            return (
              <ProjectCard
                key={repo.id}
                title={isConverted ? project.title : repo.name}
                description={isConverted ? project.description : repo.description}
                url={repo.url}
                image={isConverted ? project.image : undefined}
                role={isConverted ? project.role : undefined}
                language={repo.language}
                stars={repo.stars}
                technologies={isConverted ? project.technologies : repo.topics}
                source={isConverted ? 'github-custom' : 'github'}
                isPinned={isConverted ? project.isPinned : false}
                isVisible={isConverted ? project.isVisible : true}
                gitHubRepoName={repo.fullName}
                mode="dashboard"
                onEdit={isConverted ? () => {/* TODO: open edit modal */} : undefined}
                onConvert={!isConverted ? () => handleConvert(repo) : undefined}
                onTogglePin={
                  isConverted
                    ? () => handleTogglePin(project.id, {
                        isPinned: project.isPinned,
                        isVisible: project.isVisible,
                        displayOrder: project.displayOrder,
                      })
                    : undefined
                }
                onToggleVisibility={
                  isConverted
                    ? () => handleToggleVisibility(project.id, {
                        isPinned: project.isPinned,
                        isVisible: project.isVisible,
                        displayOrder: project.displayOrder,
                      })
                    : () => handleHide(repo)
                }
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmRepo}
        title={t('repos.confirmConvertTitle', 'Convertir a proyecto')}
        message={t('repos.confirmConvert', {
          name: confirmRepo?.name ?? '',
          defaultValue: `¿Convertir "${confirmRepo?.name ?? ''}" en un proyecto? Podrás personalizarlo después.`,
        })}
        confirmLabel={t('repos.convert', 'Convertir')}
        cancelLabel={t('common.cancel', 'Cancelar')}
        loading={converting}
        onConfirm={doConvert}
        onCancel={() => !converting && setConfirmRepo(null)}
      />
    </div>
  );
};
