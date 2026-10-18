import { Component, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { Home, LayoutGrid } from 'lucide-react';
import catBob from './assets/cat-bob.png';
import { InstallProvider } from './state/InstallContext';
import { UserProvider, useUser } from './state/UserContext';
import { BottomNav, Header, SiteFooter } from './components/Header';
import { InstallBanner } from './components/InstallBanner';
import { StreakPopup } from './components/Modals';
import { Seo } from './lib/seo';
import { HomePage, CatalogPage } from './pages/HomePage';
import { SectionPage } from './pages/SectionPage';
import { DashboardPage } from './pages/DashboardPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { AboutPage } from './pages/AboutPage';
import { SECTIONS_NAV } from './data/site';

// ------------------------------ Обработка ошибок ------------------------------

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#fafaf9]">
          <div className="text-5xl mb-4">🙈</div>
          <h1 className="text-xl font-black text-stone-900 mb-2">Что-то пошло не так</h1>
          <p className="text-sm text-stone-500 mb-6 max-w-sm">
            Попробуй обновить страницу — скорее всего, всё заработает. Прогресс никуда не пропал.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl bg-violet-600 text-white font-bold"
          >
            Обновить страницу
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// --------------------------------- Каркас ---------------------------------

// --------------------------------- 404 ---------------------------------
// Та же стилистика, что и у всего приложения (кот Боб, фиолетовые акценты).

export function NotFoundPage() {
  return (
    <>
      <Seo
        seo={{
          path: '/404',
          title: 'Страница не найдена | BEMAT',
          description: 'Такой страницы нет. Загляни в каталог ресурсов для изучения английского.',
          noindex: true,
        }}
      />
      <div className="px-4 pt-10 pb-16 text-center">
        {/* Кот Боб потерялся */}
        <div className="relative inline-block mb-6">
          <img
            src={catBob}
            alt='Кот Боб ничего не нашёл'
            width={128}
            height={128}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl animate-breathe"
          />
          <span className="absolute -top-2 -right-3 text-3xl rotate-12" aria-hidden="true">🔍</span>
        </div>

        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-violet-500 mb-2">Ошибка 404</p>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">Мяу… такой страницы нет</h1>
        <p className="text-sm text-stone-500 mb-8 max-w-sm mx-auto">
          Боб прошёлся по всем полкам — этой ссылки здесь нет. Возможно, она устарела или в ней опечатка.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl grad-violet text-white text-sm font-bold no-underline shadow-lg shadow-violet-600/20"
          >
            <LayoutGrid size={16} aria-hidden="true" /> Каталог ресурсов
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-stone-200 text-stone-700 text-sm font-bold no-underline hover:border-violet-200"
          >
            <Home size={16} aria-hidden="true" /> Мой план занятий
          </Link>
        </div>

        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">Или загляни в разделы:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SECTIONS_NAV.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-sm font-bold no-underline hover:border-violet-200 hover:text-violet-700 transition-colors"
            >
              {s.emoji} {s.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

function Shell() {
  const { user, newDayReached, dismissNewDay } = useUser();
  const location = useLocation();
  // Лендинг (главная) — витрина: на ней нижней панели приложения нет.
  // Со страницы /catalog и всех разделов можно вернуться на лендинг
  // через меню («О проекте» и т.п.), поэтому нижняя панель есть везде.
  const isLanding = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div
      className={
        'body-app min-h-screen bg-[#fafaf9] font-sans text-stone-900 selection:bg-violet-200 ' +
        (isLanding ? '' : 'pb-24 lg:pb-0')
      }
    >
      <Header />

      <main className="mx-auto w-full max-w-3xl lg:max-w-5xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Каталог — отдельная страница приложения (вкладка «Каталог» внизу) */}
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/books" element={<SectionPage section="books" />} />
          <Route path="/video" element={<SectionPage section="video" />} />
          <Route path="/practice" element={<SectionPage section="practice" />} />
          <Route path="/speak" element={<SectionPage section="speak" />} />
          <Route path="/courses" element={<SectionPage section="courses" />} />
          <Route path="/bots" element={<SectionPage section="bots" />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />
      {!isLanding && <BottomNav />}
      <InstallBanner />

      {user.isOnboarded && <StreakPopup isOpen={newDayReached} onClose={dismissNewDay} />}
    </div>
  );
}

// В автономном превью (scripts/preview.mjs) путь в адресной строке произвольный,
// поэтому там включается memory-роутер. На сайте всегда работает BrowserRouter.
const Router: typeof BrowserRouter =
  typeof window !== 'undefined' && (window as unknown as { __BEMAT_PREVIEW__?: boolean }).__BEMAT_PREVIEW__
    ? (MemoryRouter as unknown as typeof BrowserRouter)
    : BrowserRouter;

export function App() {
  return (
    <ErrorBoundary>
      <InstallProvider>
        <Router>
          <UserProvider>
            <Shell />
          </UserProvider>
        </Router>
      </InstallProvider>
    </ErrorBoundary>
  );
}
