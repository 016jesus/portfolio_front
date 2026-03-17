import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight, Github, Globe, Layers, Lock,
  CheckCircle, ChevronRight, Sparkles, Code2, Share2
} from 'lucide-react';
import { AppLogo } from '../components/Logo';

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4">
        {/* Glow de fondo */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-gradient-to-br from-green-400/15 via-emerald-500/8 to-transparent blur-3xl" />
          <div className="absolute top-20 right-0 w-72 h-72 rounded-full bg-green-500/5 blur-2xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full border border-green-500/30 bg-green-500/8 text-green-600 dark:text-green-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {t('home.hero.badge')}
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
            {t('home.hero.titleLine1')}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400">
              {t('home.hero.titleLine2')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            {t('home.hero.description')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-green-500/25 hover:shadow-green-500/40 text-base"
            >
              {t('home.hero.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#howItWorks"
              className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium py-3.5 px-8 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all text-base"
            >
              {t('home.hero.secondaryCta')}
            </a>
          </div>
        </div>

        {/* Preview card */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden">
            {/* Barra del browser */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <div className="ml-3 flex-1 bg-slate-100 dark:bg-slate-800 rounded-md px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
                portf.io/p/tu-usuario
              </div>
            </div>
            {/* Mock de perfil */}
            <div className="p-6">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
                  J
                </div>
                <div>
                  <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded-md mb-2" />
                  <div className="h-3.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-md" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3.5">
                    <div className="h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 mb-3" />
                    <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-600 rounded mb-1.5" />
                    <div className="h-2.5 w-1/2 bg-slate-100 dark:bg-slate-700 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-500 dark:text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
              {t('home.features.eyebrow')}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Github className="w-6 h-6" />,
                color: 'bg-slate-800 text-white',
                title: t('home.features.github.title'),
                desc: t('home.features.github.description'),
              },
              {
                icon: <Globe className="w-6 h-6" />,
                color: 'bg-green-500 text-white',
                title: t('home.features.url.title'),
                desc: t('home.features.url.description'),
              },
              {
                icon: <Layers className="w-6 h-6" />,
                color: 'bg-blue-500 text-white',
                title: t('home.features.projects.title'),
                desc: t('home.features.projects.description'),
              },
              {
                icon: <Lock className="w-6 h-6" />,
                color: 'bg-purple-500 text-white',
                title: t('home.features.security.title'),
                desc: t('home.features.security.description'),
              },
              {
                icon: <Code2 className="w-6 h-6" />,
                color: 'bg-orange-500 text-white',
                title: t('home.features.skills.title'),
                desc: t('home.features.skills.description'),
              },
              {
                icon: <Share2 className="w-6 h-6" />,
                color: 'bg-pink-500 text-white',
                title: t('home.features.share.title'),
                desc: t('home.features.share.description'),
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/5 transition-all group"
              >
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4 shadow-sm`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-lg mb-2 group-hover:text-green-500 transition-colors">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ────────────────────────────────────────── */}
      <section id="howItWorks" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-500 dark:text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
              {t('home.howItWorks.eyebrow')}
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {t('home.howItWorks.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Línea conectora desktop */}
            <div aria-hidden className="hidden md:block absolute top-8 left-1/3 right-1/3 h-px bg-gradient-to-r from-slate-200 via-green-300 to-slate-200 dark:from-slate-700 dark:via-green-700 dark:to-slate-700" />

            {[
              {
                step: '01',
                title: t('home.howItWorks.step1.title'),
                desc: t('home.howItWorks.step1.description'),
                color: 'from-green-400 to-emerald-600',
              },
              {
                step: '02',
                title: t('home.howItWorks.step2.title'),
                desc: t('home.howItWorks.step2.description'),
                color: 'from-blue-400 to-blue-600',
              },
              {
                step: '03',
                title: t('home.howItWorks.step3.title'),
                desc: t('home.howItWorks.step3.description'),
                color: 'from-purple-400 to-purple-600',
              },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-extrabold text-xl mb-4 shadow-lg relative z-10`}>
                  {s.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFICIOS / WHY ─────────────────────────────────────── */}
      <section className="py-24 px-4 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-green-500 dark:text-green-400 text-sm font-semibold uppercase tracking-widest mb-3">
              {t('home.why.eyebrow')}
            </p>
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">
              {t('home.why.title')}
            </h2>
            <div className="space-y-4">
              {[
                t('home.why.point1'),
                t('home.why.point2'),
                t('home.why.point3'),
                t('home.why.point4'),
              ].map((p) => (
                <div key={p} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-7 rounded-xl transition-colors shadow-md shadow-green-500/20"
            >
              {t('home.why.cta')} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats / highlights */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { value: '< 5 min', label: t('home.why.stat1') },
              { value: '100%', label: t('home.why.stat2') },
              { value: 'OAuth', label: t('home.why.stat3') },
              { value: 'URL propia', label: t('home.why.stat4') },
            ].map((s) => (
              <div key={s.label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 text-center">
                <p className="text-2xl font-extrabold text-green-500 dark:text-green-400 mb-1">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <AppLogo size={48} showText={false} />
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            {t('home.cta.title')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-10 max-w-lg mx-auto">
            {t('home.cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="group inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-green-500/25 text-base"
            >
              {t('home.cta.button')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <p className="text-sm text-slate-400">{t('home.cta.noCard')}</p>
          </div>
        </div>
      </section>

    </div>
  );
};
