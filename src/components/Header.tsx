import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowRight,
  Bot,
  Download,
  ExternalLink,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Info,
  LayoutGrid,
  Menu,
  Mic,
  PenTool,
  RotateCcw,
  Star,
  X,
} from 'lucide-react';
import { AI_BOTS, CONTACTS, SECTIONS_NAV } from '../data/site';
import { useUser } from '../state/UserContext';
import { useMediaQuery } from '../lib/useMediaQuery';
import { cn } from '../lib/utils';
import { Modal } from './UI';
import { InstallModal } from './InstallBanner';
import { SECTION_ICONS } from './icons';

/** Разделы, которые всегда доступны снизу на телефоне — в меню их не дублируем */
const BOTTOM_NAV_SECTIONS = ['/books', '/video', '/practice', '/speak'];
const DESKTOP_LINK = 'px-3 py-2 rounded-xl text-[13px] font-bold transition-colors whitespace-nowrap';

const MOBILE_NAV = [
  { path: '/dashboard', label: 'Кабинет', icon: Home },
  { path: '/books', label: 'Книги', icon: SECTION_ICONS.books },
  { path: '/video', label: 'Видео', icon: SECTION_ICONS.video },
  { path: '/practice', label: 'Практика', icon: SECTION_ICONS.practice },
  { path: '/speak', label: 'Разговор', icon: SECTION_ICONS.speak },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const { user, reset } = useUser();
  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // В меню показываем только то, чего нет в других местах:
  // на телефоне — разделы, которых нет в нижней панели; на десктопе — только действия.
  const extraSections = SECTIONS_NAV.filter((s) => !BOTTOM_NAV_SECTIONS.includes(s.path));

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fafaf9]/95 backdrop-blur-md border-b border-stone-100">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2 no-underline shrink-0">
            <img
              src="/icophot/favicon-96x96.png"
              alt="BEMAT — кот Боб"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full border border-stone-200 shadow-sm bg-white"
            />
            <span className="font-black text-xl tracking-tight text-stone-800">BEMAT</span>
          </Link>

          {/* Desktop: полная навигация. На телефоне её заменяет нижняя панель. */}
          <nav aria-label="Основная навигация" className="hidden lg:flex items-center gap-0.5 flex-1 justify-center overflow-x-auto no-scrollbar">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                cn(DESKTOP_LINK, isActive ? 'bg-violet-50 text-violet-700' : 'text-stone-600 hover:bg-stone-100')
              }
            >
              Каталог
            </NavLink>
            {SECTIONS_NAV.map((s) => {
              const Icon = SECTION_ICONS[s.id];
              return (
                <NavLink
                  key={s.path}
                  to={s.path}
                  className={({ isActive }) =>
                    cn(
                      DESKTOP_LINK,
                      'inline-flex items-center gap-1.5',
                      isActive ? 'bg-violet-50 text-violet-700' : 'text-stone-600 hover:bg-stone-100'
                    )
                  }
                >
                  <Icon size={15} aria-hidden="true" /> {s.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/favorites"
              aria-label="Избранные сайты"
              className="relative w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100 no-underline"
            >
              <Star size={18} className={cn(user.favorites.length > 0 && 'fill-amber-400')} />
              {user.favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {user.favorites.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setSupportOpen(true)}
              aria-label="Поддержать проект"
              className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-rose-50 text-rose-500 border border-rose-100"
            >
              <Heart size={18} />
            </button>
            <Link
              to="/dashboard"
              className="hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-[13px] font-bold no-underline hover:bg-violet-700"
            >
              <Home size={15} /> Мой план
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Открыть меню"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 text-white lg:bg-stone-100 lg:text-stone-700"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Дровер */}
      {menuOpen && (
        <div className="fixed inset-0 z-[90] bg-stone-900/30 backdrop-blur-sm flex justify-end" onClick={() => setMenuOpen(false)}>
          <div
            className="w-[88%] max-w-sm h-full bg-[#fafaf9] p-5 shadow-2xl overflow-y-auto pb-safe"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Меню"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-stone-900">Меню</h3>
              <button onClick={() => setMenuOpen(false)} aria-label="Закрыть меню" className="p-2 bg-stone-100 rounded-full">
                <X size={20} />
              </button>
            </div>

            {/* На телефоне: разделы, которых нет в нижней панели */}
            {!isDesktop && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-stone-100 font-bold text-sm text-stone-700 no-underline hover:border-violet-200"
                >
                  <Home size={16} className="text-violet-600" /> Мой план
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-stone-100 font-bold text-sm text-stone-700 no-underline hover:border-violet-200"
                >
                  <LayoutGrid size={16} className="text-violet-600" /> Каталог
                </Link>
                {extraSections.map((s) => {
                  const Icon = SECTION_ICONS[s.id];
                  return (
                    <Link
                      key={s.path}
                      to={s.path}
                      className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-stone-100 font-bold text-sm text-stone-700 no-underline hover:border-violet-200"
                    >
                      <Icon size={16} className="text-violet-600" /> {s.label}
                    </Link>
                  );
                })}
                <Link
                  to="/favorites"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-amber-50 border border-amber-100 font-bold text-sm text-amber-700 no-underline"
                >
                  <Star size={16} /> Избранное
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-stone-100 font-bold text-sm text-stone-700 no-underline hover:border-violet-200"
                >
                  <Info size={16} /> О проекте
                </Link>
              </div>
            )}

            {/* На десктопе разделы уже в шапке — оставляем только действия */}
            {isDesktop && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-violet-50 border border-violet-100 font-bold text-sm text-violet-700 no-underline"
                >
                  <Home size={16} /> Мой план
                </Link>
                <Link
                  to="/about"
                  className="flex items-center gap-2 px-3 py-3 rounded-xl bg-white border border-stone-100 font-bold text-sm text-stone-700 no-underline hover:border-violet-200"
                >
                  <Info size={16} /> О проекте
                </Link>
              </div>
            )}

            <p className="px-2 mb-2 text-xs font-bold text-stone-400 uppercase">ИИ-помощники</p>
            <div className="space-y-1 mb-5">
              {AI_BOTS.map((b) => (
                <a
                  key={b.url}
                  href={b.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-violet-50 group no-underline border border-transparent hover:border-violet-100"
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Bot size={16} className="text-violet-500 shrink-0" />
                    <span className="min-w-0">
                      <span className="block font-bold text-stone-800 text-sm group-hover:text-violet-700 truncate">{b.label}</span>
                      <span className="block text-xs text-stone-500">{b.desc}</span>
                    </span>
                  </span>
                  <ExternalLink size={16} className="text-stone-300 group-hover:text-violet-500 shrink-0" />
                </a>
              ))}
            </div>

            <div className="h-px bg-stone-200 my-4" />

            <div className="space-y-2">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setInstallOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm text-left"
              >
                <Download size={18} /> Установить приложение
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSupportOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm text-left"
              >
                <Gift size={18} /> Поддержать проект
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setResetOpen(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-500 text-sm text-left"
              >
                <RotateCcw size={18} /> Сбросить прогресс
              </button>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl grad-violet text-white font-bold text-sm no-underline"
              >
                <GraduationCap size={18} /> Telegram-канал BEMAT
              </a>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={supportOpen} onClose={() => setSupportOpen(false)} title="Поддержать проект">
        <div className="text-center">
          <div className="w-20 h-20 grad-violet rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart size={40} className="text-white fill-white" />
          </div>
          <p className="text-stone-600 mb-6 text-sm">
            BEMAT — бесплатный проект, я делаю его в одиночку. Поддержка помогает развивать приложение и покупать
            корм коту Бобу!
          </p>
          <div className="space-y-3">
            <a
              href={CONTACTS.donate}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center py-3 rounded-2xl bg-violet-600 text-white font-bold no-underline"
            >
              Поддержать
            </a>
            <a
              href={CONTACTS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 py-3 rounded-2xl border border-stone-200 text-stone-600 font-bold no-underline"
            >
              Telegram-канал <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </Modal>

      <InstallModal isOpen={installOpen} onClose={() => setInstallOpen(false)} />

      <Modal isOpen={resetOpen} onClose={() => setResetOpen(false)} title="Сбросить прогресс?">
        <div className="text-center space-y-4">
          <p className="text-stone-600">Все данные будут удалены: план на день, стрик, избранное и свои задания.</p>
          <button
            onClick={() => {
              reset();
              setResetOpen(false);
            }}
            className="w-full py-3 rounded-2xl bg-red-500 text-white font-bold"
          >
            Сбросить
          </button>
          <button
            onClick={() => setResetOpen(false)}
            className="w-full py-3 rounded-2xl border border-stone-200 text-stone-600 font-bold"
          >
            Отмена
          </button>
        </div>
      </Modal>
    </>
  );
}

// ------------------------------ Нижняя навигация (только телефон) ------------------------------

export function BottomNav() {
  return (
    <nav
      aria-label="Навигация по приложению"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)] pb-safe"
    >
      <div className="flex justify-between items-center max-w-lg mx-auto h-[62px] px-2">
        {MOBILE_NAV.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn('flex flex-col items-center gap-1 no-underline px-2 py-1 min-w-[52px]', isActive ? 'text-violet-600' : 'text-stone-400')
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={21} strokeWidth={isActive ? 2.5 : 2} className={cn('transition-transform', isActive && 'scale-110')} />
                <span className="text-[10px] font-bold">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------- Футер ----------------------------------

export function SiteFooter() {
  return (
    <footer className="border-t border-stone-200 mt-12 py-10">
      <div className="mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/icophot/favicon-96x96.png" alt="" width={32} height={32} className="w-8 h-8 rounded-full border border-stone-200" />
              <span className="font-black text-stone-800">BEMAT</span>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Бесплатные ресурсы для изучения английского: фильмы и сериалы с субтитрами, книги с переводом, мемы,
              грамматика, разговорная практика и подготовка к ЕГЭ, ОГЭ, IELTS и TOEFL.
            </p>
          </div>

          <nav aria-label="Разделы сайта">
            <p className="text-xs font-bold uppercase text-stone-400 mb-3">Разделы</p>
            <ul className="space-y-1.5 text-sm list-none p-0 m-0">
              {SECTIONS_NAV.map((s) => (
                <li key={s.path}>
                  <Link to={s.path} className="text-stone-600 no-underline hover:text-violet-600 inline-flex items-center gap-1.5">
                    <Star size={11} className="text-stone-300" aria-hidden="true" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Проект">
            <p className="text-xs font-bold uppercase text-stone-400 mb-3">Проект</p>
            <ul className="space-y-1.5 text-sm list-none p-0 m-0">
              <li>
                <Link to="/dashboard" className="text-stone-600 no-underline hover:text-violet-600">
                  Мой план занятий
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-stone-600 no-underline hover:text-violet-600">
                  Избранные сайты
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-600 no-underline hover:text-violet-600">
                  О проекте и автор
                </Link>
              </li>
              <li>
                <a href={CONTACTS.telegram} target="_blank" rel="noopener noreferrer" className="text-stone-600 no-underline hover:text-violet-600">
                  Telegram-канал
                </a>
              </li>
              <li>
                <a href={CONTACTS.author} target="_blank" rel="noopener noreferrer" className="text-stone-600 no-underline hover:text-violet-600">
                  Сайт автора
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-stone-100">
          <p className="text-[11px] text-stone-400">
            © {new Date().getFullYear()} BEMAT. Материалы принадлежат их правообладателям.
          </p>
          <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
            <Bot size={13} /> Сделано с котом Бобом
          </p>
        </div>
      </div>
    </footer>
  );
}
