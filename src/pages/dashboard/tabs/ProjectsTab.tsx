import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Plus, Pencil, Trash2, ExternalLink, Loader2, X, FolderOpen,
  Github, Pin, Eye, EyeOff, GripVertical,
} from 'lucide-react';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  createProject, updateProject, deleteProject,
} from '../../../features/projects/services/projectService';
import { useAuthStore } from '../../../store/useAuthStore';
import { usePortfolioStore } from '../../../store/usePortfolioStore';
import { toast } from '../../../components/Toast';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models';

/* ------------------------------------------------------------------ */
/*  Sortable card wrapper                                              */
/* ------------------------------------------------------------------ */

interface SortableProjectCardProps {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onTogglePin: (p: Project) => void;
  onToggleVisibility: (p: Project) => void;
  deleting: string | null;
  t: ReturnType<typeof import('react-i18next').useTranslation>['t'];
}

const SortableProjectCard = ({
  project: p,
  onEdit,
  onDelete,
  onTogglePin,
  onToggleVisibility,
  deleting,
  t,
}: SortableProjectCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: p.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  const isGitHub = !!p.gitHubRepoId;
  const SourceIcon = isGitHub ? Github : FolderOpen;
  const source: 'github' | 'manual' = isGitHub ? 'github' : 'manual';

  const pinnedBorder = p.isPinned
    ? 'border-[#2da44e]/30 bg-green-50/5'
    : 'border-gray-200 dark:border-gray-800';
  const hiddenOpacity = !p.isVisible ? 'opacity-60' : '';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white dark:bg-[#161b22] border rounded-xl hover:border-[#2da44e]/40 transition-all flex ${pinnedBorder} ${hiddenOpacity}`}
    >
      {/* Drag handle */}
      <div
        {...listeners}
        className="flex items-center justify-center px-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 shrink-0"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Card content */}
      <div className="flex-1 p-4 flex flex-col gap-2 min-w-0">
        {/* Image */}
        {p.image && (
          <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-lg" />
        )}

        {/* Title row */}
        <div className="flex items-center gap-2">
          <SourceIcon className="w-4 h-4 text-gray-400 shrink-0" />
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{p.title}</h3>
          {source === 'github' && p.gitHubRepoName && (
            <span className="shrink-0 text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
              {p.gitHubRepoName}
            </span>
          )}
        </div>

        {/* Description */}
        {p.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{p.description}</p>
        )}

        {/* Role badge */}
        {p.role && (
          <span className="self-start text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {p.role}
          </span>
        )}

        {/* Technologies */}
        {p.technologies && p.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {p.technologies.slice(0, 6).map((tech) => (
              <span
                key={tech}
                className="text-xs bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Actions footer */}
        <div className="flex items-center gap-1 mt-1 pt-2 border-t border-gray-100 dark:border-gray-800">
          {/* Pin toggle */}
          <button
            onClick={() => onTogglePin(p)}
            title={p.isPinned ? t('repos.unpin', 'Unpin') : t('repos.pin', 'Pin')}
            className={`p-1.5 rounded-md transition-colors ${
              p.isPinned
                ? 'text-[#2da44e] bg-[#2da44e]/10'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Pin className="w-4 h-4" fill={p.isPinned ? 'currentColor' : 'none'} />
          </button>

          {/* Visibility toggle */}
          <button
            onClick={() => onToggleVisibility(p)}
            title={p.isVisible ? t('repos.hide', 'Hide') : t('repos.show', 'Show')}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {p.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          {/* URL link */}
          {p.url && (
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
              title={t('projects.visit')}
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}

          <div className="ml-auto flex items-center gap-1">
            {/* Edit */}
            <button
              onClick={() => onEdit(p)}
              className="p-1.5 text-gray-500 hover:text-[#2da44e] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              title={t('repos.edit', 'Edit')}
            >
              <Pencil className="w-4 h-4" />
            </button>

            {/* Delete */}
            <button
              onClick={() => onDelete(p.id)}
              disabled={deleting === p.id}
              className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
              title={t('projects.delete', 'Delete')}
            >
              {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  ProjectsTab                                                        */
/* ------------------------------------------------------------------ */

const emptyForm = { title: '', description: '', url: '', image: '', role: '', startDate: '' };

export const ProjectsTab = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  // Store-driven state
  const { projects, fetchProjects, reorderProjects, updateVisibility } = usePortfolioStore();

  // Local UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState<string | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // Sorted projects
  const sortedProjects = useMemo(
    () => [...projects].sort((a, b) => a.displayOrder - b.displayOrder),
    [projects],
  );

  // Fetch on mount
  useEffect(() => {
    if (!user?.username) return;
    setLoading(true);
    fetchProjects(user.username, user.tenantId).finally(() => setLoading(false));
  }, [user?.username]);

  /* ---- Form handlers ---- */

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      url: p.url,
      image: p.image,
      role: p.role ?? '',
      startDate: p.startDate ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error(t('projects.errorTitle')); return; }
    if (!user) return;
    setSaving(true);
    try {
      if (editing) {
        await updateProject(editing.id, {
          title: form.title,
          description: form.description,
          url: form.url,
          image: form.image,
          role: form.role || undefined,
          startDate: form.startDate || undefined,
        } as UpdateProjectDto);
        toast.success(t('projects.updated'));
      } else {
        await createProject({
          title: form.title,
          description: form.description,
          url: form.url,
          image: form.image,
          userId: user.id,
          userName: user.username,
          role: form.role || undefined,
          startDate: form.startDate || undefined,
        } as CreateProjectDto);
        toast.success(t('projects.created'));
      }
      // Re-fetch to get latest state
      await fetchProjects(user.username, user.tenantId);
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data || t('projects.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('projects.confirmDelete'))) return;
    if (!user) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      toast.success(t('projects.deleted'));
      await fetchProjects(user.username, user.tenantId);
    } catch {
      toast.error(t('projects.errorDelete'));
    } finally {
      setDeleting(null);
    }
  };

  /* ---- Pin / Visibility ---- */

  const handleTogglePin = async (p: Project) => {
    await updateVisibility(p.id, {
      isPinned: !p.isPinned,
      isVisible: p.isVisible,
      displayOrder: p.displayOrder,
    });
  };

  const handleToggleVisibility = async (p: Project) => {
    await updateVisibility(p.id, {
      isPinned: p.isPinned,
      isVisible: !p.isVisible,
      displayOrder: p.displayOrder,
    });
  };

  /* ---- Drag & Drop ---- */

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = sortedProjects.findIndex((p) => p.id === active.id);
    const newIndex = sortedProjects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(sortedProjects, oldIndex, newIndex);

    const items = reordered.map((p, i) => ({ id: p.id, displayOrder: i }));
    reorderProjects(items);
  };

  /* ---- Render ---- */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('projects.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('projects.subtitle')}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('projects.addProject')}
        </button>
      </div>

      {/* Modal form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-2xl w-full max-w-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white">
                {editing ? t('projects.editProject') : t('projects.newProject')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.title')} *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder={t('projects.form.titlePlaceholder')}
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.description')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white resize-none"
                  placeholder={t('projects.form.descriptionPlaceholder')}
                />
              </div>
              {/* URL */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.url')}</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={(e) => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder="https://..."
                />
              </div>
              {/* Image */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.image')}</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder="https://..."
                />
              </div>
              {/* Role */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.role', 'Role')}</label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder={t('projects.form.rolePlaceholder', 'Creator, Contributor, Lead...')}
                />
              </div>
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.startDate', 'Start Date')}</label>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                />
              </div>
              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-[#2da44e] hover:bg-[#2c974b] disabled:opacity-60 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2da44e]" />
        </div>
      ) : sortedProjects.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('projects.empty')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('projects.emptyHint')}</p>
          <button onClick={openCreate} className="mt-4 bg-[#2da44e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#2c974b] transition-colors">
            {t('projects.addProject')}
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sortedProjects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedProjects.map((p) => (
                <SortableProjectCard
                  key={p.id}
                  project={p}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onTogglePin={handleTogglePin}
                  onToggleVisibility={handleToggleVisibility}
                  deleting={deleting}
                  t={t}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};
