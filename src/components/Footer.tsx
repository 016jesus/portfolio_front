import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { AppLogo } from './Logo';

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const links = {
    product: [
      { label: t('footer.links.features'), to: '#features' },
      { label: t('footer.links.howItWorks'), to: '#howItWorks' },
      { label: t('footer.links.pricing'), to: '/pricing' },
    ],
    resources: [
      { label: t('footer.links.docs'), to: '#' },
      { label: t('footer.links.api'), to: '#' },
      { label: t('footer.links.blog'), to: '#' },
    ],
    legal: [
      { label: t('footer.links.privacy'), to: '#' },
      { label: t('footer.links.terms'), to: '#' },
      { label: t('footer.links.cookies'), to: '#' },
    ],
  };

  return (
    <footer className="glass-nav border-t border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <AppLogo size={32} showText={true} className="text-slate-900 dark:text-white mb-4" />
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:hola@portfoilio.app"
                className="w-9 h-9 rounded-lg bg-slate-100/70 dark:bg-slate-800/60 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              {t('footer.col.product')}
            </h4>
            <ul className="space-y-3">
              {links.product.map((l) => (
                <li key={l.label}>
                  <a href={l.to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              {t('footer.col.resources')}
            </h4>
            <ul className="space-y-3">
              {links.resources.map((l) => (
                <li key={l.label}>
                  <a href={l.to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">
              {t('footer.col.legal')}
            </h4>
            <ul className="space-y-3">
              {links.legal.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>© {year} portfólio. {t('footer.rights')}</span>
          <span className="flex items-center gap-1">
            {t('footer.madeWith')} <span className="text-red-400">♥</span>
          </span>
        </div>
      </div>
    </footer>
  );
};
