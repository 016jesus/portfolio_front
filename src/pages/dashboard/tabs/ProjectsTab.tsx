import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, ExternalLink, Loader2, X, FolderOpen } from 'lucide-react';
import {
  getProjectsByUsername, createProject, updateProject, deleteProject
} from '../../../features/projects/services/projectService';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from '../../../components/Toast';
import type { Project, CreateProjectDto, UpdateProjectDto } from '../../../core/models';

const emptyForm = { title: '', description: '', url: '', image: '' };

export const ProjectsTab = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.username) return;
    setLoading(true);
    getProjectsByUsername(user.username, user.tenantId)
      .then(setProjects)
      .catch(() => toast.error(t('projects.errorLoad')))
      .finally(() => setLoading(false));
  }, [user?.username]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description, url: p.url, image: p.image });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error(t('projects.errorTitle')); return; }
    if (!user) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateProject(editing.id, form as UpdateProjectDto);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast.success(t('projects.updated'));
      } else {
        const created = await createProject({
          ...form,
          userId: user.id,
          userName: user.username,
        } as CreateProjectDto);
        setProjects((prev) => [created, ...prev]);
        toast.success(t('projects.created'));
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err?.response?.data || t('projects.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('projects.confirmDelete'))) return;
    setDeleting(id);
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success(t('projects.deleted'));
    } catch {
      toast.error(t('projects.errorDelete'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
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
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('projects.form.title')} *</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder={t('projects.form.titlePlaceholder')}
                />
              </div>
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

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#2da44e]" />
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('projects.empty')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('projects.emptyHint')}</p>
          <button onClick={openCreate} className="mt-4 bg-[#2da44e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#2c974b] transition-colors">
            {t('projects.addProject')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col gap-3 hover:border-[#2da44e]/40 transition-colors">
              {p.image && (
                <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{p.title}</h3>
                {p.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{p.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    <ExternalLink className="w-3.5 h-3.5" /> {t('projects.visit')}
                  </a>
                )}
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-gray-500 hover:text-[#2da44e] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    disabled={deleting === p.id}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                  >
                    {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
