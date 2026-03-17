import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Loader2, User, MapPin, Link2, FileText, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../lib/apiClient';

export const SetupPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [form, setForm] = useState({
    username: user?.username || '',
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.put(`/api/Users/${user.id}/profile`, {
        name: form.name,
        bio: form.bio,
        location: form.location,
        website: form.website,
        displayName: form.name,
      });
      setUser({ ...user, ...response.data });
      navigate('/admin/dashboard', { replace: true });
    } catch {
      setError(t('setup.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/admin/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d1117] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#2da44e]/10 mb-4">
            <Sparkles className="w-8 h-8 text-[#2da44e]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('setup.title')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('setup.subtitle')}
          </p>
        </div>

        {/* Avatar preview */}
        {user?.avatarUrl && (
          <div className="flex justify-center mb-6">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 shadow-md"
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-8 space-y-5 shadow-sm"
        >
          {/* Username (read-only) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('setup.username')}
            </label>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5">
              <User className="w-4 h-4 text-gray-400 shrink-0" />
              <span className="text-gray-500 dark:text-gray-400 text-sm select-none">
                {form.username}
              </span>
              <CheckCircle2 className="w-4 h-4 text-[#2da44e] ml-auto shrink-0" />
            </div>
            <p className="text-xs text-gray-400 mt-1">{t('setup.usernameHint')}</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t('setup.displayName')}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder={t('setup.displayNamePlaceholder')}
              className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2da44e]/40 focus:border-[#2da44e]"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                {t('setup.bio')}
              </span>
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              value={form.bio}
              onChange={handleChange}
              placeholder={t('setup.bioPlaceholder')}
              className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2da44e]/40 focus:border-[#2da44e] resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                {t('setup.location')}
              </span>
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder={t('setup.locationPlaceholder')}
              className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2da44e]/40 focus:border-[#2da44e]"
            />
          </div>

          {/* Website */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5" />
                {t('setup.website')}
              </span>
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://tu-web.com"
              className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2da44e]/40 focus:border-[#2da44e]"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {t('setup.skip')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#2da44e] hover:bg-[#2c974b] disabled:opacity-60 text-white text-sm font-semibold transition-colors"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('setup.save')
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {t('setup.editLater')}
        </p>
      </div>
    </div>
  );
};
