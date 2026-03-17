import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Pencil, Trash2, Loader2, X, Code2 } from 'lucide-react';
import apiClient from '../../../lib/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from '../../../components/Toast';
import type { Skill, CreateSkillDto } from './../../../core/models';

const emptyForm = { name: '', description: '' };

export const SkillsTab = () => {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    apiClient.get<Skill[]>(`/api/Skills?userId=${user.id}`)
      .then((r) => setSkills(r.data))
      .catch(() => toast.error(t('skills.errorLoad')))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, description: s.description }); setShowForm(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error(t('skills.errorName')); return; }
    if (!user) return;
    setSaving(true);
    try {
      if (editing) {
        const r = await apiClient.put<Skill>(`/api/Skills/${editing.id}`, form);
        setSkills((prev) => prev.map((s) => (s.id === r.data.id ? r.data : s)));
        toast.success(t('skills.updated'));
      } else {
        const r = await apiClient.post<Skill>('/api/Skills', { ...form, userId: user.id } as CreateSkillDto);
        setSkills((prev) => [...prev, r.data]);
        toast.success(t('skills.created'));
      }
      setShowForm(false);
    } catch {
      toast.error(t('skills.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('skills.confirmDelete'))) return;
    setDeleting(id);
    try {
      await apiClient.delete(`/api/Skills/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      toast.success(t('skills.deleted'));
    } catch {
      toast.error(t('skills.errorDelete'));
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('skills.title')}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('skills.subtitle')}</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('skills.addSkill')}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-[#161b22] rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-xl font-bold dark:text-white">
                {editing ? t('skills.editSkill') : t('skills.newSkill')}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('skills.form.name')} *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
                  placeholder={t('skills.form.namePlaceholder')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium dark:text-gray-300 mb-1">{t('skills.form.description')}</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white resize-none"
                  placeholder={t('skills.form.descriptionPlaceholder')}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 bg-[#2da44e] hover:bg-[#2c974b] disabled:opacity-60 text-white py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#2da44e]" /></div>
      ) : skills.length === 0 ? (
        <div className="bg-white dark:bg-[#161b22] border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-12 text-center">
          <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-700 dark:text-gray-300">{t('skills.empty')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('skills.emptyHint')}</p>
          <button onClick={openCreate} className="mt-4 bg-[#2da44e] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[#2c974b] transition-colors">
            {t('skills.addSkill')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skills.map((s) => (
            <div key={s.id} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-[#2da44e]/40 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-[#2da44e]/10 text-[#2da44e] dark:text-[#3fb950] px-3 py-1 rounded-full text-sm font-semibold">
                  <Code2 className="w-3.5 h-3.5" />
                  {s.name}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(s)} className="p-1 text-gray-400 hover:text-[#2da44e] hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded">
                    {deleting === s.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              {s.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{s.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
