import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Github,
  FolderOpen,
  Pin,
  Eye,
  EyeOff,
  Pencil,
  ExternalLink,
  Star,
  ArrowRightCircle,
  ChevronDown,
  Calendar,
  Link as LinkIcon,
} from 'lucide-react';

interface ProjectCardProps {
  // Data
  title: string;
  description?: string | null;
  url?: string | null;
  image?: string | null;
  role?: string | null;
  language?: string | null;
  stars?: number | null;
  technologies?: string[];
  source: 'manual' | 'github' | 'github-custom';
  isPinned?: boolean;
  isVisible?: boolean;
  gitHubRepoName?: string | null;
  startDate?: string | null;
  endDate?: string | null;

  // Mode
  mode?: 'dashboard' | 'public';

  // Dashboard callbacks (only used when mode='dashboard')
  onEdit?: () => void;
  onTogglePin?: () => void;
  onToggleVisibility?: () => void;
  onConvert?: () => void;
}

export const ProjectCard = ({
  title,
  description,
  url,
  image,
  role,
  language,
  stars,
  technologies,
  source,
  isPinned = false,
  isVisible = true,
  gitHubRepoName,
  startDate,
  endDate,
  mode = 'public',
  onEdit,
  onTogglePin,
  onToggleVisibility,
  onConvert,
}: ProjectCardProps) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const isDashboard = mode === 'dashboard';
  const isPublic = mode === 'public';

  const hasDetails = isPublic && (url || gitHubRepoName || startDate || endDate || role || (description && description.length > 100));

  const pinnedStyles = isPinned
    ? 'border-[#2da44e]/30 bg-green-50/5'
    : 'border-gray-200 dark:border-gray-800';

  const hiddenStyles = !isVisible ? 'opacity-60' : '';

  const SourceIcon = source === 'manual' ? FolderOpen : Github;

  const formatDate = (d: string) => {
    try { return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }); }
    catch { return d; }
  };

  return (
    <div
      className={`bg-white dark:bg-[#161b22] border rounded-xl hover:border-[#2da44e]/40 transition-all group flex flex-col ${pinnedStyles} ${hiddenStyles}`}
    >
      {/* Image */}
      {image && (
        <img
          src={image}
          alt={title}
          className="h-36 w-full object-cover rounded-t-xl"
        />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Title row */}
        <div className="flex items-center gap-2 mb-1">
          <SourceIcon className="w-4 h-4 text-gray-400 shrink-0" />
          <h3 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-[#2da44e] transition-colors">
            {title}
          </h3>
          {source === 'github-custom' && (
            <span className="shrink-0 text-[10px] font-medium bg-[#2da44e]/10 text-[#2da44e] px-1.5 py-0.5 rounded-full">
              {t('repos.customized', 'Customized')}
            </span>
          )}
          {isPublic && url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto shrink-0 text-gray-400 hover:text-[#2da44e] transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Description */}
        {description && (
          <p className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${!expanded ? 'line-clamp-2' : ''}`}>
            {description}
          </p>
        )}

        {/* Role badge */}
        {role && (
          <span className="self-start text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full mb-2">
            {role}
          </span>
        )}

        {/* Technologies */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {(expanded ? technologies : technologies.slice(0, 6)).map((tech) => (
              <span
                key={tech}
                className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
            {!expanded && technologies.length > 6 && (
              <span className="text-xs text-gray-400 px-1">+{technologies.length - 6}</span>
            )}
          </div>
        )}

        {/* Language + stars footer */}
        {(language || (stars != null && stars > 0)) && (
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-2">
            {language && (
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2da44e]" />
                {language}
              </span>
            )}
            {stars != null && stars > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5" /> {stars}
              </span>
            )}
          </div>
        )}

        {/* Expanded details (public mode) */}
        {isPublic && expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {(startDate || endDate) && (
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {startDate ? formatDate(startDate) : '—'}
                  {' → '}
                  {endDate ? formatDate(endDate) : t('publicProfile.present', 'Presente')}
                </span>
              </div>
            )}
            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
              </a>
            )}
            {gitHubRepoName && (
              <a
                href={`https://github.com/${gitHubRepoName}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 hover:text-[#2da44e] transition-colors"
              >
                <Github className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{gitHubRepoName}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            )}
          </div>
        )}

        {/* Expand/collapse toggle (public mode) */}
        {hasDetails && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 mt-3 pt-2 text-xs font-medium text-gray-400 hover:text-[#2da44e] transition-colors w-full"
          >
            <span>{expanded ? t('publicProfile.showLess', 'Ver menos') : t('publicProfile.showMore', 'Ver más')}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        )}

        {/* Dashboard action buttons */}
        {isDashboard && (
          <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            {/* Pin toggle */}
            <button
              onClick={onTogglePin}
              title={isPinned ? t('repos.unpin', 'Unpin') : t('repos.pin', 'Pin')}
              className={`p-1.5 rounded-md transition-colors ${
                isPinned
                  ? 'text-[#2da44e] bg-[#2da44e]/10'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Pin className="w-4 h-4" fill={isPinned ? 'currentColor' : 'none'} />
            </button>

            {/* Visibility toggle */}
            <button
              onClick={onToggleVisibility}
              title={isVisible ? t('repos.hide', 'Hide') : t('repos.show', 'Show')}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            {/* Edit button - only for github-custom and manual */}
            {(source === 'github-custom' || source === 'manual') && (
              <button
                onClick={onEdit}
                title={t('repos.edit', 'Edit')}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}

            {/* Convert to project - only for github source */}
            {source === 'github' && (
              <button
                onClick={onConvert}
                title={t('repos.convertToProject', 'Convert to project')}
                className="ml-auto flex items-center gap-1 text-xs text-[#2da44e] hover:bg-[#2da44e]/10 px-2 py-1.5 rounded-md transition-colors font-medium"
              >
                <ArrowRightCircle className="w-3.5 h-3.5" />
                {t('repos.convert', 'Convert')}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
