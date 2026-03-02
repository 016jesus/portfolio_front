import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ErrorPage = () => {
  const error = useRouteError();
  const { t } = useTranslation();

  const title = isRouteErrorResponse(error)
    ? `${error.status} - ${error.statusText}`
    : t('error.title');

  const message = isRouteErrorResponse(error)
    ? error.data?.message || t('error.description')
    : error instanceof Error
      ? error.message
      : t('error.description');

  return (
    <section className="max-w-xl mx-auto mt-16 p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm bg-gray-50 dark:bg-[#161b22] text-center space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-gray-600 dark:text-gray-400">{message}</p>
      <Link
        to="/"
        className="inline-block mt-2 bg-[#24292f] text-white rounded-md py-2 px-4 hover:bg-gray-800 transition-colors font-semibold"
      >
        {t('error.backHome')}
      </Link>
    </section>
  );
};