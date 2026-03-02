import { useTranslation } from 'react-i18next';

export const Signup = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-sm mx-auto mt-16 p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22]">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-center">{t('signup.title')}</h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">{t('signup.subtitle')}</p>
      </header>
      <div className="space-y-4">
        <button className="w-full bg-[#24292f] text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors font-semibold">
          {t('signup.signUpWithGithub')}
        </button>
      </div>
    </section>
  );
};