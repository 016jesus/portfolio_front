import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader2, Globe, MapPin, Github, User, Mail } from 'lucide-react';
import apiClient from '../../../lib/apiClient';
import { useAuthStore } from '../../../store/useAuthStore';
import { toast } from '../../../components/Toast';
import type { User as UserType } from '../../../core/models';

export const ProfileTab = () => {
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();

  const [form, setForm] = useState({
    username: user?.username ?? '',
    name: user?.name ?? '',
    displayName: user?.displayName ?? '',
    bio: user?.bio ?? '',
    website: user?.website ?? '',
    location: user?.location ?? '',
    avatarUrl: user?.avatarUrl ?? '',
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!form.username.trim() || !form.name.trim()) {
      toast.error(t('profile.errorRequired'));
      return;
    }
    setSaving(true);
    try {
      const response = await apiClient.put<UserType>(`/api/Users/${user.id}/profile`, form);
      setUser({ ...user, ...response.data });
      toast.success(t('profile.saved'));
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data;
      toast.error(typeof msg === 'string' ? msg : t('profile.errorSave'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('profile.title')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{t('profile.subtitle')}</p>
      </div>

      {/* Avatar preview */}
      <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex items-center gap-5">
        {form.avatarUrl ? (
          <img src={form.avatarUrl} alt={form.displayName || form.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#2da44e]/30" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2da44e] to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {(form.name || form.username || 'U').charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <p className="font-semibold text-gray-900 dark:text-white">{form.displayName || form.name}</p>
          <p className="text-sm text-gray-500">@{form.username}</p>
          {user?.provider && user.provider !== 'local' && (
            <span className="inline-flex items-center gap-1 mt-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              {user.provider === 'github' ? <Github className="w-3 h-3" /> : null}
              {t('profile.connectedVia', { provider: user.provider })}
            </span>
          )}
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1"><User className="w-4 h-4" /> {t('profile.username')} *</span>
            </label>
            <input
              value={form.username}
              onChange={handleChange('username')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
            />
          </div>

          {/* Full name */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              {t('profile.fullName')} *
            </label>
            <input
              value={form.name}
              onChange={handleChange('name')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
            />
          </div>

          {/* Display name */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              {t('profile.displayName')}
            </label>
            <input
              value={form.displayName}
              onChange={handleChange('displayName')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
              placeholder={t('profile.displayNamePlaceholder')}
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {t('profile.email')}</span>
            </label>
            <input
              value={user?.email ?? ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {t('profile.location')}</span>
            </label>
            <input
              value={form.location}
              onChange={handleChange('location')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
              placeholder={t('profile.locationPlaceholder')}
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-1">
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> {t('profile.website')}</span>
            </label>
            <input
              type="url"
              value={form.website}
              onChange={handleChange('website')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Avatar URL */}
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">
            {t('profile.avatarUrl')}
          </label>
          <input
            type="url"
            value={form.avatarUrl}
            onChange={handleChange('avatarUrl')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white"
            placeholder="https://..."
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-1">
            {t('profile.bio')}
          </label>
          <textarea
            value={form.bio}
            onChange={handleChange('bio')}
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2da44e] dark:bg-[#0d1117] dark:text-white resize-none"
            placeholder={t('profile.bioPlaceholder')}
          />
          <p className="text-xs text-gray-400 text-right mt-1">{form.bio.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-[#2da44e] hover:bg-[#2c974b] disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-semibold transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {t('profile.saveChanges')}
        </button>
      </form>
    </div>
  );
};
