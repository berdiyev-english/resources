import { Component, useEffect, type ReactNode } from 'react';
import { BrowserRouter, Link, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { InstallProvider } from './state/InstallContext';
import { UserProvider, useUser } from './state/UserContext';
import { BottomNav, Header, SiteFooter } from './components/Header';
import { InstallBanner } from './components/InstallBanner';
import { StreakPopup } from './components/Modals';
import { Seo } from './lib/seo';
import { HomePage } from './pages/HomePage';
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

function NotFoundPage() {
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
      <div className="px-4 py-16 text-center">
        <div className="text-6xl mb-4">🧭</div>
        <h1 className="text-2xl font-black text-stone-900 mb-2">Страница не найдена</h1>
        <p className="text-sm text-stone-500 mb-6">Возможно, ссылка устарела. Попробуй один из разделов:</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-bold no-underline"
          >
            Каталог ресурсов
          </Link>
          {SECTIONS_NAV.map((s) => (
            <Link
              key={s.path}
              to={s.path}
              className="px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-sm font-bold no-underline"
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
  // Первая страница — лендинг: на ней нет нижней панели,
  // зато нет и повторов «Каталог» в навигации.
  const isLanding = location.pathname === '/';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname]);

  return (
    <div
      className={
        'min-h-screen bg-[#fafaf9] font-sans text-stone-900 selection:bg-violet-200 ' +
        (isLanding ? '' : 'pb-24 lg:pb-0')
      }
    >
      <Header />

      <main className="mx-auto w-full max-w-3xl lg:max-w-5xl">
        <Routes>
          <Route path="/" element={<HomePage />} />
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
