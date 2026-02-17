import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.png';
import catHungry from './cathungry.png';
import catFedImg from './catfed.png';
import { Sponsors } from './Sponsors';
import {
  Home, PenTool, Heart, Menu, X, ChevronDown, ExternalLink,
  GraduationCap, Bot, Book, Film, CheckCircle, Mic, Gift,
  Flame, Bell, Settings, Trophy, ArrowRight, CheckCircle2,
  Edit3, Plus, Trash2, Clock, BellRing, Download, Share2,
  Smartphone, Monitor, RefreshCw
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ==============================
// УТИЛИТЫ
// ==============================

function checkIsPWA(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window.navigator as any).standalone === true) return true;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if (window.matchMedia('(display-mode: fullscreen)').matches) return true;
  if (document.referrer.startsWith('android-app://')) return true;
  // Разрешаем localhost для разработки
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return true;
  return false;
}

function getDeviceType(): 'ios' | 'android' | 'desktop' {
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

// ==============================
// ТИПЫ И КОНСТАНТЫ
// ==============================

type UserGoal = 'ege' | 'oge' | 'ielts' | 'toefl' | 'speak' | 'fun';

interface CustomTask { id: string; title: string; time: number; }

interface UserState {
  name: string; goal: UserGoal; streak: number; lastVisit: string;
  completedTasks: string[]; customTasks: CustomTask[];
  notificationsEnabled: boolean; isOnboarded: boolean;
  catFed: boolean; streakShownDate: string; notifHour: number;
}

const GOAL_OPTIONS: { id: UserGoal; label: string; icon: string }[] = [
  { id: 'ege', label: 'Сдать ЕГЭ', icon: '🔥' },
  { id: 'oge', label: 'Сдать ОГЭ', icon: '🎓' },
  { id: 'ielts', label: 'Сдать IELTS', icon: '🌍' },
  { id: 'toefl', label: 'Сдать TOEFL', icon: '🇺🇸' },
  { id: 'speak', label: 'Говорить свободно', icon: '🗣' },
  { id: 'fun', label: 'Для себя / Фильмы', icon: '🍿' },
];

const GOAL_LABELS: Record<UserGoal, string> = {
  ege: '🔥 ЕГЭ', oge: '🎓 ОГЭ', ielts: '🌍 IELTS',
  toefl: '🇺🇸 TOEFL', speak: '🗣 Разговор', fun: '🍿 Для себя',
};

const DAILY_TASKS: Record<UserGoal, { id: string; title: string; time: number; link: string; isExternal: boolean }[]> = {
  ege: [
    { id: 'ege_1', title: 'Решить 5 заданий ЕГЭ', time: 7, link: 'https://en-ege.sdamgia.ru/', isExternal: true },
    { id: 'ege_2', title: 'Повторить грамматику', time: 5, link: 'https://bewords.ru/', isExternal: true },
    { id: 'ege_3', title: 'Выучить 5 слов', time: 3, link: 'https://bewords.ru/', isExternal: true },
  ],
  oge: [
    { id: 'oge_1', title: 'Решить 5 заданий ОГЭ', time: 7, link: 'https://en-oge.sdamgia.ru/', isExternal: true },
    { id: 'oge_2', title: 'Повторить грамматику', time: 5, link: 'https://bewords.ru/', isExternal: true },
    { id: 'oge_3', title: 'Выучить 5 слов', time: 3, link: 'https://bewords.ru/', isExternal: true },
  ],
  ielts: [
    { id: 'ielts_1', title: 'IELTS бот — 1 задание', time: 7, link: 'https://t.me/IELTS_berdiyev_bot', isExternal: true },
    { id: 'ielts_2', title: 'Выучить 5 академич. слов', time: 3, link: 'https://bewords.ru/', isExternal: true },
    { id: 'ielts_3', title: 'Послушать BBC 6 min', time: 6, link: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', isExternal: true },
  ],
  toefl: [
    { id: 'toefl_1', title: 'TOEFL бот — 1 задание', time: 7, link: 'https://t.me/TOBEENG_TOEFL_IBT_BOT', isExternal: true },
    { id: 'toefl_2', title: 'Выучить 5 академич. слов', time: 3, link: 'https://bewords.ru/', isExternal: true },
    { id: 'toefl_3', title: 'Аудирование BBC (6 мин)', time: 6, link: 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english', isExternal: true },
  ],
  speak: [
    { id: 'speak_1', title: 'Поговорить с ИИ Бобом', time: 5, link: 'https://t.me/Tobeeng_GPT_bot', isExternal: true },
    { id: 'speak_2', title: 'Выучить 10 слов', time: 5, link: 'https://bewords.ru/', isExternal: true },
    { id: 'speak_3', title: 'Повторить грамматику', time: 5, link: 'https://bewords.ru/', isExternal: true },
  ],
  fun: [
    { id: 'fun_1', title: 'Посмотреть видео на EN', time: 5, link: '#video', isExternal: false },
    { id: 'fun_2', title: 'Прочитать отрывок книги', time: 5, link: '#books', isExternal: false },
    { id: 'fun_3', title: 'Выучить 5 слов', time: 5, link: 'https://bewords.ru/', isExternal: true },
  ],
};

// ==============================
// УВЕДОМЛЕНИЯ
// ==============================

let notifTimeoutId: ReturnType<typeof setTimeout> | null = null;

function scheduleNotification(notifHour: number = 19) {
  if (notifTimeoutId) clearTimeout(notifTimeoutId);
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const now = new Date();
  let target = new Date(now);
  target.setHours(notifHour, 0, 0, 0);
  if (now >= target) target.setDate(target.getDate() + 1);
  const delay = target.getTime() - now.getTime();
  notifTimeoutId = setTimeout(async () => {
    const saved = localStorage.getItem('bemat_user_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (new Date(parsed.lastVisit).toDateString() === new Date().toDateString()) {
          scheduleNotification(parsed.notifHour || 19); return;
        }
      } catch {}
    }
    const msgs = [
      { title: 'Боб проголодался! 🐱', body: 'Зайди позаниматься и покорми Боба 🔥' },
      { title: 'Не забудь про английский! 📚', body: '15 минут — и Боб будет сытым 😸' },
      { title: 'Стрик горит! 🔥', body: 'Зайди на 15 минут, чтобы сохранить серию' },
      { title: 'Боб скучает! 😿', body: 'Он ждёт тебя, чтобы поучить английский' },
    ];
    const msg = msgs[Math.floor(Math.random() * msgs.length)];
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (reg) await reg.showNotification(msg.title, { body: msg.body, icon: '/icophot/web-app-manifest-192x192.png', badge: '/icophot/web-app-manifest-192x192.png', tag: 'bemat-daily', renotify: true, vibrate: [200, 100, 200] });
      else new Notification(msg.title, { body: msg.body, icon: '/icophot/web-app-manifest-192x192.png' });
    } catch { try { new Notification(msg.title, { body: msg.body }); } catch {} }
    scheduleNotification(notifHour);
  }, delay);
}

function cancelNotification() { if (notifTimeoutId) { clearTimeout(notifTimeoutId); notifTimeoutId = null; } }

// ==============================
// UI КОМПОНЕНТЫ
// ==============================

const Button = ({ children, className, variant = 'primary', href, onClick, ...props }: any) => {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-transform no-underline cursor-pointer select-none active:scale-95";
  const v: Record<string, string> = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 border border-transparent",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 border border-stone-200",
  };
  const Comp = href ? 'a' : 'button';
  return <Comp href={href} onClick={onClick} className={cn(base, v[variant] || v.primary, className)} {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...props}>{children}</Comp>;
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  useEffect(() => { document.body.style.overflow = isOpen ? 'hidden' : 'unset'; return () => { document.body.style.overflow = 'unset'; }; }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Accordion = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 last:mb-0">
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
        <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 text-left">
          <span className="text-lg font-bold text-stone-900">{title}</span>
          <div className={cn("p-1.5 rounded-full bg-stone-100 text-stone-500", isOpen && "bg-violet-100 text-violet-600")}>
            <ChevronDown size={20} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
          </div>
        </button>
        {isOpen && <div className="p-4 pt-0 border-t border-stone-100">{children}</div>}
      </div>
    </div>
  );
};

const MediaRow = ({ title, desc, img, link, btnText = "Перейти" }: any) => (
  <div className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-stone-100 shadow-sm mb-3 last:mb-0 hover:border-violet-200 transition-colors items-start sm:items-center">
    <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 bg-stone-50 rounded-xl overflow-hidden border border-stone-100">
      <img src={img} alt={title} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/150?text=IMG'; }} />
    </div>
    <div className="flex-1 flex flex-col justify-between min-h-[5rem] py-0.5">
      <div>
        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-tight mb-1 line-clamp-2">{title}</h4>
        <p className="text-xs text-stone-500 leading-snug mb-2 line-clamp-2">{desc}</p>
      </div>
      <div><Button href={link} className="py-1.5 px-4 text-xs !bg-violet-600 !text-white shadow-sm hover:!bg-violet-700 w-auto rounded-lg">{btnText}</Button></div>
    </div>
  </div>
);

// ==============================
// 1. SPLASH SCREEN (загрузка)
// ==============================

const SplashScreen = () => (
  <div className="fixed inset-0 z-[200] bg-[#fafaf9] flex flex-col items-center justify-center">
    <div className="relative">
      {/* Пульсирующий круг */}
      <div className="absolute inset-0 w-32 h-32 rounded-full bg-violet-200 animate-ping opacity-30" />
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-breathe">
        <img src={logo} alt="BEMAT" className="w-full h-full object-cover" />
      </div>
    </div>
    <h1 className="mt-6 text-3xl font-black text-stone-800 tracking-tight">BEMAT</h1>
    <p className="text-stone-500 text-sm mt-1">Английский с котом Бобом</p>
    <div className="mt-8 flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-2.5 h-2.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
);

// ==============================
// 2. PWA LANDING PAGE (для браузера)
// ==============================

const PWALandingPage = ({ deferredPrompt, onPromptInstall }: { deferredPrompt: any; onPromptInstall: () => void }) => {
  const device = getDeviceType();

  const features = [
    { icon: '🐱', title: 'Кот Боб — твой наставник', desc: 'Покорми Боба, выполняя задания каждый день' },
    { icon: '🔥', title: 'Стрик и мотивация', desc: 'Занимайся каждый день, не теряй серию' },
    { icon: '📚', title: 'Все ресурсы в одном месте', desc: 'Книги, фильмы, грамматика, боты' },
    { icon: '🎯', title: 'Персональный план', desc: 'ЕГЭ, ОГЭ, IELTS, TOEFL или просто для себя' },
    { icon: '🤖', title: 'AI помощники', desc: 'Боты для экзаменов и разговорной практики' },
    { icon: '⏱', title: '15 минут в день', desc: 'Короткие задания, которые реально помогают' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 overflow-y-auto">
      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 pt-16 pb-10">
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6">
          <img src={logo} alt="Bob" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl font-black text-stone-900 tracking-tight mb-2">BEMAT</h1>
        <p className="text-lg text-stone-600 mb-1">Английский с котом Бобом 🐱</p>
        <p className="text-sm text-stone-400 max-w-xs">Бесплатное приложение для изучения английского. Корми Боба, учи язык, не теряй стрик!</p>
      </div>

      {/* Фичи */}
      <div className="px-5 pb-8">
        <div className="grid grid-cols-2 gap-3">
          {features.map(f => (
            <div key={f.title} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-bold text-stone-900 text-sm mb-1 leading-tight">{f.title}</h3>
              <p className="text-[11px] text-stone-500 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Установка */}
      <div className="px-5 pb-12">
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-[2rem] p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 text-8xl opacity-10 -rotate-12 translate-x-4 -translate-y-4">📲</div>
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-2 flex items-center gap-2">
              <Download size={24} /> Установи приложение
            </h2>
            <p className="text-violet-100 text-sm mb-6">BEMAT работает как приложение. Установи его на свой телефон — это бесплатно и занимает 10 секунд!</p>

            {/* Android */}
            {device === 'android' && (
              <div className="space-y-4">
                {deferredPrompt && (
                  <button onClick={onPromptInstall} className="w-full py-4 bg-white text-violet-700 font-black rounded-2xl text-base shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                    <Download size={20} /> Установить BEMAT
                  </button>
                )}
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="font-bold text-sm mb-3">Или через RuStore:</p>
                  <a href="https://www.rustore.ru/catalog/app/co.median.android.pkpxbe" target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-stone-800 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md">
                    <Smartphone size={18} /> Открыть в RuStore
                  </a>
                </div>
                {!deferredPrompt && (
                  <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                    <p className="font-bold text-sm mb-2">Установка через Chrome:</p>
                    <div className="space-y-2 text-sm text-violet-100">
                      <p>1️⃣ Нажми <strong>⋮</strong> (три точки) в правом верхнем углу</p>
                      <p>2️⃣ Выбери <strong>«Установить приложение»</strong></p>
                      <p>3️⃣ Нажми <strong>«Установить»</strong></p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* iOS */}
            {device === 'ios' && (
              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="font-bold text-sm mb-3">Как установить на iPhone/iPad:</p>
                  <div className="space-y-3 text-sm text-violet-100">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 text-base font-black">1</div>
                      <div>
                        <p className="font-bold text-white">Откройте в Safari</p>
                        <p className="text-xs text-violet-200">Если вы в Telegram/другом браузере — скопируйте ссылку и откройте в Safari</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 text-base font-black">2</div>
                      <div>
                        <p className="font-bold text-white">Нажмите кнопку «Поделиться» <span className="inline-block bg-white/20 px-1.5 py-0.5 rounded text-xs">⬆️</span></p>
                        <p className="text-xs text-violet-200">Внизу экрана (квадрат со стрелкой вверх)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 text-base font-black">3</div>
                      <div>
                        <p className="font-bold text-white">Выберите «На экран Домой» <span className="inline-block bg-white/20 px-1.5 py-0.5 rounded text-xs">➕</span></p>
                        <p className="text-xs text-violet-200">Прокрутите список вниз если не видно</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center shrink-0 text-base font-black">4</div>
                      <div>
                        <p className="font-bold text-white">Нажмите «Добавить»</p>
                        <p className="text-xs text-violet-200">Иконка BEMAT появится на рабочем столе</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop */}
            {device === 'desktop' && (
              <div className="space-y-4">
                {deferredPrompt && (
                  <button onClick={onPromptInstall} className="w-full py-4 bg-white text-violet-700 font-black rounded-2xl text-base shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2">
                    <Monitor size={20} /> Установить на компьютер
                  </button>
                )}
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="font-bold text-sm mb-2">Установка в Chrome:</p>
                  <div className="space-y-2 text-sm text-violet-100">
                    <p>1️⃣ Нажмите на иконку <strong>⊕</strong> в адресной строке</p>
                    <p>2️⃣ Или откройте меню <strong>⋮</strong> → <strong>«Установить BEMAT»</strong></p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="font-bold text-sm mb-2">Для телефона:</p>
                  <a href="https://www.rustore.ru/catalog/app/co.median.android.pkpxbe" target="_blank" rel="noopener noreferrer"
                    className="w-full py-3 bg-white text-stone-800 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-md mt-2">
                    <Smartphone size={18} /> RuStore (Android)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="px-5 pb-10 text-center">
        <p className="text-xs text-stone-400 mb-3">BEMAT — бесплатный проект для изучения английского</p>
        <div className="flex justify-center gap-4">
          <a href="https://t.me/+NvMX2DrTa3w1NTVi" target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 font-bold">Telegram</a>
          <a href="https://berdiyev-eng.ru" target="_blank" rel="noopener noreferrer" className="text-xs text-violet-600 font-bold">Автор</a>
        </div>
      </div>
    </div>
  );
};

// ==============================
// 3. UPDATE BANNER
// ==============================

const UpdateBanner = ({ onUpdate }: { onUpdate: () => void }) => (
  <div className="sticky top-[57px] z-30 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2.5 px-4 shadow-md">
    <div className="flex items-center justify-center gap-3 max-w-xl mx-auto">
      <RefreshCw size={16} className="animate-spin" />
      <span className="text-sm font-bold">Доступно обновление!</span>
      <button onClick={onUpdate} className="bg-white text-emerald-700 px-4 py-1 rounded-full font-bold text-xs hover:scale-105 transition-transform shadow">
        Обновить
      </button>
    </div>
  </div>
);

// ==============================
// ОНБОРДИНГ
// ==============================

const Onboarding = ({ onComplete }: { onComplete: (name: string, goal: UserGoal) => void }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal>('fun');

  return (
    <div className="fixed inset-0 z-[60] bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <div className="w-28 h-28 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-white">
        <img src={logo} alt="Bob" className="w-full h-full object-cover" />
      </div>
      {step === 1 && (
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black text-stone-800 mb-2">Привет! Я Боб 🐱</h1>
          <p className="text-stone-600 mb-8 text-lg">Помогу выучить английский. Как тебя зовут?</p>
          <input type="text" placeholder="Твоё имя..." className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4 shadow-sm" value={name} onChange={e => setName(e.target.value)} />
          <button disabled={!name.trim()} onClick={() => setStep(2)} className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-lg shadow-violet-200">Дальше</button>
        </div>
      )}
      {step === 2 && (
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{name}, какая у тебя цель?</h2>
          <p className="text-stone-500 mb-6">Я составлю план занятий для тебя.</p>
          <div className="space-y-3 mb-8">
            {GOAL_OPTIONS.map(opt => (
              <button key={opt.id} onClick={() => setGoal(opt.id)}
                className={cn("w-full p-4 rounded-2xl flex items-center gap-3 border-2 text-left transition-all",
                  goal === opt.id ? "border-violet-600 bg-violet-50" : "border-white bg-white shadow-sm"
                )}>
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-bold text-stone-800">{opt.label}</span>
              </button>
            ))}
          </div>
          <button onClick={() => onComplete(name, goal)} className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-violet-200">Создать план 🚀</button>
        </div>
      )}
    </div>
  );
};

// ==============================
// ПОПАПЫ
// ==============================

const StreakPopup = ({ isOpen, onClose, streak }: { isOpen: boolean; onClose: () => void; streak: number }) => {
  if (!isOpen) return null;
  const isFirst = streak <= 1;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fafaf9] rounded-[2rem] shadow-2xl p-8 border border-white text-center">
        <div className="text-7xl mb-4 animate-bounce">🔥</div>
        {isFirst ? (
          <><h3 className="text-2xl font-black text-stone-900 mb-2">Стрик зародился!</h3><p className="text-stone-500 mb-2 text-sm">Занимайся каждый день, чтобы не потерять стрик.</p><p className="text-stone-400 text-xs mb-6">Боб верит в тебя! 🐱</p></>
        ) : (
          <><h3 className="text-2xl font-black text-stone-900 mb-2">{streak} {streak < 5 ? 'дня' : 'дней'} подряд!</h3><p className="text-stone-500 mb-2 text-sm">Отличная серия! Не останавливайся!</p><p className="text-stone-400 text-xs mb-6">Боб гордится тобой 😸</p></>
        )}
        <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
          {Array.from({ length: Math.min(streak, 7) }, (_, i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-b from-orange-100 to-amber-50 flex items-center justify-center text-lg border border-orange-200 shadow-sm">🔥</div>
          ))}
          {streak > 7 && <span className="text-stone-400 font-bold text-sm ml-1.5">+{streak - 7}</span>}
        </div>
        <div className="bg-violet-50 rounded-xl p-3 mb-6 border border-violet-100">
          <p className="text-xs font-bold text-violet-700">{isFirst ? '💡 Занимайся 15 минут в день!' : streak >= 7 ? '🏆 Неделя без пропусков!' : streak >= 3 ? '💪 3+ дня подряд!' : '📈 Каждый день — +1 к уровню!'}</p>
        </div>
        <button onClick={onClose} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200">{isFirst ? 'Начнём! 🚀' : 'Продолжаем! 💪'}</button>
      </div>
    </div>
  );
};

const CatFeedPopup = ({ isOpen, onClose, user, tasks }: { isOpen: boolean; onClose: () => void; user: UserState; tasks: any[] }) => {
  if (!isOpen) return null;
  const doneCount = user.completedTasks.filter(id => tasks.some((t: any) => t.id === id)).length;
  const totalCount = tasks.length;
  const feedProgress = user.catFed ? 100 : totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const isFed = user.catFed;
  const remaining = totalCount - doneCount;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white text-center">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 text-stone-400"><X size={20} /></button>
        <div className={cn("w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-lg", isFed ? "border-green-300" : "border-orange-300")}>
          <img src={isFed ? catFedImg : catHungry} alt="Bob" className="w-full h-full object-cover" />
        </div>
        {isFed ? (
          <><div className="text-4xl mb-2">🎉</div><h3 className="text-xl font-black text-stone-900 mb-1">Боб сыт!</h3><p className="text-stone-500 text-sm mb-6">Приходи завтра 😸</p></>
        ) : (
          <><div className="text-4xl mb-2">😿</div><h3 className="text-xl font-black text-stone-900 mb-1">Боб голодный!</h3><p className="text-stone-500 text-sm mb-2">Выполни все задания</p><p className="text-xs text-stone-400 mb-6">Осталось: {remaining}</p></>
        )}
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1.5"><span>🍽️ Миска</span><span>{feedProgress}%</span></div>
          <div className="h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div className={cn("h-full rounded-full transition-all duration-1000", isFed ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-300 to-amber-400")} style={{ width: `${feedProgress}%` }} />
          </div>
        </div>
        <div className="mt-4 space-y-2 text-left max-h-40 overflow-y-auto">
          {tasks.map((t: any) => { const d = user.completedTasks.includes(t.id); return (
            <div key={t.id} className={cn("flex items-center gap-2 text-xs p-2 rounded-lg", d ? "text-stone-400 bg-stone-50" : "text-stone-700 bg-white border border-stone-100")}>
              <span>{d ? '✅' : '⬜'}</span><span className={cn("flex-1", d && "line-through")}>{t.title}</span><span className="text-stone-400">{t.time}м</span>
            </div>
          ); })}
        </div>
        <button onClick={onClose} className="mt-6 w-full py-3 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200">{isFed ? 'Отлично! 😸' : 'Пойду заниматься!'}</button>
      </div>
    </div>
  );
};

const ProfileModal = ({ isOpen, onClose, user, onSave }: { isOpen: boolean; onClose: () => void; user: UserState; onSave: (n: string, g: UserGoal) => void }) => {
  const [editName, setEditName] = useState(user.name);
  const [sel, setSel] = useState<UserGoal>(user.goal);
  useEffect(() => { if (isOpen) { setEditName(user.name); setSel(user.goal); } }, [isOpen, user]);
  if (!isOpen) return null;
  const gc = sel !== user.goal;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-stone-900">Твой профиль</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button></div>
        <div className="flex justify-center mb-6"><div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg"><img src={logo} alt="Bob" className="w-full h-full object-cover" /></div></div>
        <div className="mb-6"><label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Имя</label><input type="text" value={editName} onChange={e => setEditName(e.target.value)} className="w-full p-3.5 rounded-xl bg-white border border-stone-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm" /></div>
        <div className="mb-6"><label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Цель</label><div className="space-y-2">
          {GOAL_OPTIONS.map(o => (<button key={o.id} onClick={() => setSel(o.id)} className={cn("w-full p-3.5 rounded-xl flex items-center gap-3 border-2 text-left", sel === o.id ? "border-violet-600 bg-violet-50" : "border-stone-100 bg-white")}><span className="text-xl">{o.icon}</span><span className="font-bold text-stone-800 flex-1 text-sm">{o.label}</span>{sel === o.id && <CheckCircle2 className="w-5 h-5 text-violet-600" />}</button>))}
        </div></div>
        {gc && <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">⚠️ При смене цели план сбросится, стрик сохранится!</div>}
        <button onClick={() => { if (editName.trim()) { onSave(editName.trim(), sel); onClose(); } }} disabled={!editName.trim()} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200 disabled:opacity-50">Сохранить</button>
      </div>
    </div>
  );
};

const AddTaskModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (t: string, m: number) => void }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(5);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white">
        <div className="flex items-center justify-between mb-4"><h3 className="text-xl font-bold text-stone-900">Добавить задание</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button></div>
        <div className="space-y-4">
          <div><label className="text-xs font-bold text-stone-500 uppercase mb-1.5 block">Что делать?</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Например: Посмотреть TED Talk" className="w-full p-3.5 rounded-xl bg-white border border-stone-200 font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm" /></div>
          <div><label className="text-xs font-bold text-stone-500 uppercase mb-1.5 block">Сколько минут?</label><div className="flex gap-2">{[3,5,10,15,20].map(m => (<button key={m} onClick={() => setTime(m)} className={cn("flex-1 py-2.5 rounded-xl font-bold text-sm border-2", time === m ? "border-violet-600 bg-violet-50 text-violet-700" : "border-stone-100 bg-white text-stone-600")}>{m}</button>))}</div></div>
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100"><p className="text-xs text-stone-500">💡 Задание будет <strong>каждый день</strong>. Удалить можно в любой момент.</p></div>
          <button onClick={() => { if (title.trim()) { onAdd(title.trim(), time); setTitle(''); setTime(5); onClose(); } }} disabled={!title.trim()} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 shadow-lg shadow-violet-200">Добавить ✅</button>
        </div>
      </div>
    </div>
  );
};

const NotifSettingsModal = ({ isOpen, onClose, user, onSave }: { isOpen: boolean; onClose: () => void; user: UserState; onSave: (e: boolean, h: number) => void }) => {
  const [enabled, setEnabled] = useState(user.notificationsEnabled);
  const [hour, setHour] = useState(user.notifHour || 19);
  if (!isOpen) return null;
  const toggle = async () => {
    if (!enabled) {
      if (!("Notification" in window)) { alert("Браузер не поддерживает уведомления"); return; }
      if (Notification.permission === 'denied') { alert("Уведомления заблокированы в настройках"); return; }
    }
    setEnabled(!enabled);
  };
  const save = async () => {
    if (enabled && Notification.permission !== 'granted') { const p = await Notification.requestPermission(); if (p !== 'granted') { alert('Разреши уведомления'); return; } }
    onSave(enabled, hour); onClose();
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white">
        <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-stone-900">Напоминания</h3><button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button></div>
        <div className="text-center mb-6"><div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-3"><img src={catHungry} alt="Bob" className="w-full h-full object-cover" /></div><p className="text-sm text-stone-600">Боб напомнит заниматься</p></div>
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-100 mb-4">
          <div className="flex items-center gap-3"><BellRing size={20} className={enabled ? "text-violet-600" : "text-stone-400"} /><span className="font-bold text-stone-800">Уведомления</span></div>
          <button onClick={toggle} className={cn("w-12 h-7 rounded-full relative", enabled ? "bg-violet-600" : "bg-stone-200")}><div className={cn("w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all", enabled ? "right-1" : "left-1")} /></button>
        </div>
        {enabled && (<div className="mb-6"><label className="text-xs font-bold text-stone-500 uppercase mb-2 block">Во сколько?</label><div className="grid grid-cols-4 gap-2">{[9,12,15,17,18,19,20,21].map(h => (<button key={h} onClick={() => setHour(h)} className={cn("py-2.5 rounded-xl font-bold text-sm border-2", hour === h ? "border-violet-600 bg-violet-50 text-violet-700" : "border-stone-100 bg-white text-stone-600")}>{h}:00</button>))}</div><p className="text-[11px] text-stone-400 mt-2">⏰ Придёт если ты не заходил в этот день</p></div>)}
        <button onClick={save} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl shadow-lg shadow-violet-200">{enabled ? '✅ Сохранить' : 'Сохранить'}</button>
      </div>
    </div>
  );
};

// ==============================
// DASHBOARD
// ==============================

const Dashboard = ({ user, onUpdateUser, onNavigate }: { user: UserState; onUpdateUser: (u: UserState) => void; onNavigate: (t: string) => void }) => {
  const defaultTasks = DAILY_TASKS[user.goal] || DAILY_TASKS.fun;
  const customDailyTasks = (user.customTasks || []).map(ct => ({ ...ct, link: '', isExternal: false, isCustom: true }));
  const allTasks = [...defaultTasks, ...customDailyTasks];
  const validCompleted = user.completedTasks.filter(id => allTasks.some(t => t.id === id));
  const progress = allTasks.length > 0 ? Math.round((validCompleted.length / allTasks.length) * 100) : 0;
  const totalTime = allTasks.reduce((s, t) => s + t.time, 0);
  const doneTime = allTasks.filter(t => validCompleted.includes(t.id)).reduce((s, t) => s + t.time, 0);

  const [showCat, setShowCat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const toggle = (id: string) => {
    const done = validCompleted.includes(id);
    const nc = done ? user.completedTasks.filter(x => x !== id) : [...user.completedTasks, id];
    const nv = nc.filter(x => allTasks.some(t => t.id === x));
    const allDone = nv.length >= allTasks.length;
    if (allDone && !user.catFed) setTimeout(() => setShowCat(true), 500);
    onUpdateUser({ ...user, completedTasks: nc, catFed: user.catFed || allDone });
  };

  const taskLink = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    if (task.isExternal) { window.open(task.link, '_blank'); return; }
    const h = task.link.replace('#', '');
    if (['home','books','video','practice','speak'].includes(h)) onNavigate(h);
    else { onNavigate('home'); setTimeout(() => document.getElementById(h)?.scrollIntoView({ behavior: 'smooth' }), 300); }
  };

  const addTask = (t: string, m: number) => onUpdateUser({ ...user, customTasks: [...(user.customTasks || []), { id: `c_${Date.now()}`, title: t, time: m }] });
  const delTask = (id: string) => onUpdateUser({ ...user, customTasks: (user.customTasks || []).filter(t => t.id !== id), completedTasks: user.completedTasks.filter(x => x !== id), catFed: false });
  const saveProfile = (n: string, g: UserGoal) => { const gc = g !== user.goal; onUpdateUser({ ...user, name: n, goal: g, completedTasks: gc ? [] : user.completedTasks, catFed: gc ? false : user.catFed }); };
  const saveNotif = (en: boolean, h: number) => { onUpdateUser({ ...user, notificationsEnabled: en, notifHour: h }); if (en) { scheduleNotification(h); if (Notification.permission === 'granted') new Notification('Напоминалки включены! 🔔', { body: `Буду напоминать в ${h}:00`, icon: '/icophot/web-app-manifest-192x192.png' }); } else cancelNotification(); };

  const isFed = user.catFed; const fp = isFed ? 100 : progress;

  return (
    <div className="pb-24 pt-4 px-4 space-y-5">
      {/* Приветствие */}
      <div className="flex justify-between items-center">
        <div className="flex-1"><p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Личный кабинет</p><div className="flex items-center gap-2"><h1 className="text-2xl font-black text-stone-800">Привет, {user.name} 👋</h1><button onClick={() => setShowProfile(true)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-violet-600"><Edit3 size={16} /></button></div></div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100"><Flame className={cn("w-5 h-5", user.streak > 0 ? "text-orange-500 fill-orange-500" : "text-stone-300")} /><span className="font-bold text-stone-800">{user.streak} дн.</span></div>
      </div>

      {/* Цель */}
      <div className="flex items-center gap-3">
        <div className="bg-violet-50 rounded-2xl px-4 py-2.5 border border-violet-100 flex items-center gap-2 flex-1"><Trophy className="w-4 h-4 text-violet-600" /><span className="text-sm font-bold text-violet-800">{GOAL_LABELS[user.goal]}</span></div>
        <button onClick={() => setShowProfile(true)} className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50">Изменить</button>
      </div>

      {/* Боб */}
      <div onClick={() => setShowCat(true)} className={cn("rounded-[2rem] p-5 shadow-sm border cursor-pointer hover:shadow-md", isFed ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200")}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-full overflow-hidden border-[3px] shadow-md shrink-0", isFed ? "border-green-300" : "border-orange-300")}><img src={isFed ? catFedImg : catHungry} alt="Bob" className="w-full h-full object-cover" /></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-stone-900 text-base mb-0.5">{isFed ? 'Боб сыт! 😸' : 'Боб голодный! 😿'}</h3><p className="text-xs text-stone-500 mb-2">{isFed ? 'Приходи завтра!' : 'Выполни задания'}</p><div className="h-2.5 bg-white/70 rounded-full overflow-hidden"><div className={cn("h-full rounded-full transition-all duration-700", isFed ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-300 to-amber-400")} style={{ width: `${fp}%` }} /></div></div>
        </div>
      </div>

      {/* План */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100"><div className="h-full bg-violet-500 transition-all duration-500 rounded-r-full" style={{ width: `${progress}%` }} /></div>
        <div className="flex justify-between items-start mb-5 mt-2">
          <div><h2 className="text-lg font-bold text-stone-900">План на сегодня</h2><p className="text-stone-500 text-xs flex items-center gap-1.5"><Clock size={12} />~{totalTime} мин · {doneTime}/{totalTime} мин ({progress}%)</p></div>
        </div>
        <div className="space-y-3">
          {defaultTasks.map(t => { const d = validCompleted.includes(t.id); return (
            <div key={t.id} className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer", d ? "bg-stone-50 border-transparent opacity-60" : "bg-white border-stone-100 hover:border-violet-200 shadow-sm")} onClick={() => toggle(t.id)}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border shrink-0", d ? "bg-violet-500 border-violet-500" : "border-stone-300")}>{d && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
              <div className="flex-1 min-w-0"><span className={cn("font-bold text-sm text-stone-700 block", d && "line-through text-stone-400")}>{t.title}</span><span className="text-[11px] text-stone-400">~{t.time} мин</span></div>
              {!d && t.link && <button onClick={e => taskLink(e, t)} className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg shrink-0"><ArrowRight size={16} /></button>}
            </div>
          ); })}
          {customDailyTasks.length > 0 && (
            <div className="pt-2 border-t border-dashed border-stone-200">
              <p className="text-[10px] font-bold text-stone-400 uppercase mb-2 px-1">Мои задания</p>
              {customDailyTasks.map((t: any) => { const d = validCompleted.includes(t.id); return (
                <div key={t.id} className={cn("flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-2 last:mb-0", d ? "bg-stone-50 border-transparent opacity-60" : "bg-violet-50/50 border-violet-100 shadow-sm")} onClick={() => toggle(t.id)}>
                  <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border shrink-0", d ? "bg-violet-500 border-violet-500" : "border-violet-300")}>{d && <CheckCircle2 className="w-4 h-4 text-white" />}</div>
                  <div className="flex-1 min-w-0"><span className={cn("font-bold text-sm text-stone-700 block", d && "line-through text-stone-400")}>{t.title}</span><span className="text-[11px] text-stone-400">~{t.time} мин</span></div>
                  <button onClick={e => { e.stopPropagation(); delTask(t.id); }} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={14} /></button>
                </div>
              ); })}
            </div>
          )}
        </div>
        <button onClick={() => setShowAdd(true)} className="mt-4 w-full py-3 bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-500 hover:text-violet-600 flex items-center justify-center gap-2"><Plus size={18} /> Добавить своё задание</button>
        {progress === 100 && <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center">Все выполнено! Боб покормлен 😸🎉</div>}
      </div>

      {/* Уведомления */}
      <div onClick={() => setShowNotif(true)} className={cn("rounded-[2rem] p-5 shadow-sm border cursor-pointer hover:shadow-md", user.notificationsEnabled ? "bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200" : "bg-gradient-to-r from-violet-600 to-indigo-600 border-transparent")}>
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0", user.notificationsEnabled ? "bg-violet-100" : "bg-white/20")}>{user.notificationsEnabled ? <BellRing size={24} className="text-violet-600" /> : <Bell size={24} className="text-white" />}</div>
          <div className="flex-1">{user.notificationsEnabled ? (<><h3 className="font-bold text-violet-900 text-sm">Напоминания ✅</h3><p className="text-xs text-violet-600">Каждый день в {user.notifHour || 19}:00</p></>) : (<><h3 className="font-bold text-white text-sm">Включить напоминания</h3><p className="text-xs text-violet-100">Боб напомнит позаниматься</p></>)}</div>
        </div>
      </div>

      {/* Библиотека */}
      <div>
        <h3 className="font-bold text-stone-800 mb-3 px-1">Библиотека материалов</h3>
        <div className="grid grid-cols-2 gap-3">
          <MC icon={Home} label="Вся подборка" color="bg-slate-100 text-slate-700" onClick={() => onNavigate('home')} />
          <MC icon={Book} label="Книги" color="bg-emerald-100 text-emerald-700" onClick={() => onNavigate('books')} />
          <MC icon={Film} label="Фильмы" color="bg-rose-100 text-rose-700" onClick={() => onNavigate('video')} />
          <MC icon={PenTool} label="Грамматика" color="bg-amber-100 text-amber-700" onClick={() => onNavigate('practice')} />
          <MC icon={Mic} label="Разговор" color="bg-sky-100 text-sky-700" onClick={() => onNavigate('speak')} />
          <MC icon={Bot} label="AI Боты" color="bg-violet-100 text-violet-700" onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' }), 300); }} />
        </div>
      </div>

      <CatFeedPopup isOpen={showCat} onClose={() => setShowCat(false)} user={user} tasks={allTasks} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} onSave={saveProfile} />
      <AddTaskModal isOpen={showAdd} onClose={() => setShowAdd(false)} onAdd={addTask} />
      <NotifSettingsModal isOpen={showNotif} onClose={() => setShowNotif(false)} user={user} onSave={saveNotif} />
    </div>
  );
};

const MC = ({ icon: Icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-1", color)}><Icon size={24} /></div>
    <span className="font-bold text-stone-700 text-sm">{label}</span>
  </button>
);

// ==============================
// HEADER
// ==============================

const Header = ({ onNavigate, onOpenSettings }: any) => {
  const [menu, setMenu] = useState(false);
  const [support, setSupport] = useState(false);
  const [about, setAbout] = useState(false);
  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-stone-100">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2"><img src={logo} alt="Bob" className="w-9 h-9 rounded-full bg-stone-200 border border-white shadow-sm" /><span className="font-black text-xl tracking-tight text-stone-800">BEMAT</span></button>
        <div className="flex items-center gap-3">
          <button onClick={() => setSupport(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100"><Gift size={20} /></button>
          <button onClick={() => setMenu(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 text-white"><Menu size={20} /></button>
        </div>
      </header>
      {menu && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex justify-end" onClick={() => setMenu(false)}>
          <div className="w-80 h-full bg-[#fafaf9] p-6 shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl text-stone-900">Меню</h3><button onClick={() => setMenu(false)} className="p-2 bg-stone-100 rounded-full"><X size={20} /></button></div>
            <div className="space-y-2 mb-6"><div className="px-2 py-1 text-xs font-bold text-stone-400 uppercase">AI Помощники</div>
              {[{ l:'ЕГЭ с ИИ',u:'https://t.me/EGE_ENGLISH_GPT_bot',d:'80+ баллов' },{ l:'ОГЭ с ИИ',u:'https://t.me/OGE_ENG_HELPER_BOT',d:'ОГЭ на 5' },{ l:'IELTS Expert',u:'https://t.me/IELTS_berdiyev_bot',d:'IELTS легко' },{ l:'TOEFL Expert',u:'https://t.me/TOBEENG_TOEFL_IBT_BOT',d:'TOEFL 100+' },{ l:'Боб — ИИ',u:'https://t.me/Tobeeng_GPT_bot',d:'Говори за 3 мес.' }].map(b => (
                <a key={b.l} href={b.u} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-violet-50 group border border-transparent hover:border-violet-100"><div><div className="font-bold text-stone-800 text-sm group-hover:text-violet-700">{b.l}</div><div className="text-xs text-stone-500">{b.d}</div></div><ExternalLink size={16} className="text-stone-300 group-hover:text-violet-500 shrink-0" /></a>
              ))}
            </div>
            <div className="h-px bg-stone-200 my-4" />
            <div className="space-y-3">
              <button onClick={() => { setMenu(false); setAbout(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm">ℹ️ О приложении</button>
              <button onClick={() => { setMenu(false); onOpenSettings(); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm"><Settings size={18} /> Сбросить прогресс</button>
              <a href="https://berdiyev-eng.ru" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-violet-600 text-white font-bold text-sm"><Gift size={18} /> Бесплатный урок</a>
            </div>
          </div>
        </div>
      )}
      <Modal isOpen={about} onClose={() => setAbout(false)} title="О приложении BEMAT">
        <div className="space-y-4">
          <p className="text-stone-700"><strong>BEMAT</strong> — бесплатные ресурсы для изучения английского.</p>
          <ul className="space-y-2 text-sm text-stone-600">{['Курсы и боты для экзаменов','Книги и новости с переводом','Фильмы и аудирование','Грамматика и перевод','Разговорная практика'].map(t => <li key={t} className="flex items-start gap-2"><span className="text-violet-500">•</span><span>{t}</span></li>)}</ul>
          <Button onClick={() => setAbout(false)} className="w-full !py-3">Понятно!</Button>
        </div>
      </Modal>
      <Modal isOpen={support} onClose={() => setSupport(false)} title="Поддержать проект">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"><Heart size={40} className="text-white fill-white" /></div>
          <p className="text-stone-600 mb-6 text-sm">BEMAT — бесплатный проект. Поддержка помогает развивать приложение!</p>
          <div className="space-y-3"><Button href="https://pay.cloudtips.ru/p/8f56d7d3" className="w-full !py-3">Поддержать</Button><Button variant="ghost" href="https://t.me/+NvMX2DrTa3w1NTVi" className="w-full">Telegram канал</Button></div>
        </div>
      </Modal>
    </>
  );
};

// ==============================
// ПАНЕЛИ КОНТЕНТА
// ==============================

const HomePanel = ({ onNavigate }: { onNavigate: (t: string) => void }) => {
  const CARDS = [
    { title: "Курсы", desc: "Бесплатные курсы", icon: GraduationCap, color: "text-blue-500", action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Боты", desc: "AI для экзаменов", icon: Bot, color: "text-violet-500", action: () => document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Чтение", desc: "Книги с переводом", icon: Book, color: "text-emerald-500", action: () => onNavigate('books') },
    { title: "Видео", desc: "Фильмы и аудирование", icon: Film, color: "text-rose-500", action: () => onNavigate('video') },
    { title: "Грамматика", desc: "150+ уроков", icon: PenTool, color: "text-amber-500", action: () => onNavigate('practice') },
    { title: "Разговор", desc: "Практика с людьми", icon: Mic, color: "text-cyan-500", action: () => onNavigate('speak') },
  ];
  return (
    <div className="pb-24 space-y-8 pt-4 px-4">
      <div className="grid grid-cols-2 gap-3">{CARDS.map(c => (
        <div key={c.title} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-start gap-3">
          <div className={cn("p-2.5 rounded-xl bg-stone-50", c.color)}><c.icon size={28} /></div>
          <div className="flex-1"><h3 className="font-bold text-stone-900 text-sm leading-tight mb-1">{c.title}</h3><p className="text-xs text-stone-500 line-clamp-2">{c.desc}</p></div>
          <button onClick={c.action} className="mt-2 w-full py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 shadow-sm active:scale-95">Перейти</button>
        </div>
      ))}</div>
      <div id="courses" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1"><GraduationCap className="text-violet-600" /><h2 className="text-xl font-bold text-stone-900">Бесплатные курсы</h2></div>
        <MediaRow title="Плейлист‑курсы в TG" desc="Курсы под каждый уровень." img="https://static.tildacdn.info/tild3534-3233-4463-a134-346339623162/7A7E2857-CCF4-42C5-A.jpeg" link="https://t.me/to_be_eng/190" btnText="Открыть" />
        <MediaRow title="Lingust — с нуля" desc="Пошаговый курс с нуля." img="https://static.tildacdn.info/tild3662-6262-4237-b766-646237396666/52B5C22F-AAA2-4AF7-8.jpeg" link="https://lingust.ru/english/english-lessons" btnText="Открыть" />
      </div>
      <div id="bots" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1"><Bot className="text-violet-600" /><h2 className="text-xl font-bold text-stone-900">Боты и материалы</h2></div>
        <MediaRow title="ЕГЭ с ИИ" desc="План, стратегии, Speaking. 80+ баллов" img="https://bemat.ru/egeai.jpg" link="https://t.me/EGE_ENGLISH_GPT_bot" btnText="Попробовать" />
        <MediaRow title="ОГЭ с ИИ" desc="План, стратегии, Speaking." img="https://bemat.ru/ogeai.jpg" link="https://t.me/OGE_ENG_HELPER_BOT" btnText="Попробовать" />
        <MediaRow title="IELTS эксперт" desc="Academic/General." img="https://static.tildacdn.info/tild3532-3932-4635-a261-306563383261/11.jpg" link="https://t.me/IELTS_berdiyev_bot" btnText="Попробовать" />
        <MediaRow title="TOEFL эксперт" desc="План и критерии." img="https://static.tildacdn.info/tild3936-3366-4461-a139-656230353061/10.jpg" link="https://t.me/TOBEENG_TOEFL_IBT_BOT" btnText="Попробовать" />
        <MediaRow title="ЕГЭ материалы" desc="Лексика, шаблоны, тренажёры." img="https://bemat.ru/egemat.jpg" link="https://t.me/tobeeng_ege_bot" btnText="Открыть" />
        <MediaRow title="Боб — ИИ" desc="Заговори за 3 месяца" img="https://bemat.ru/bobai.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
      </div>
      <div className="mt-12 pt-8 border-t border-stone-200">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-md"><img src="https://static.tildacdn.info/tild6137-3239-4731-b932-343437323234/__1.jpg" alt="Автор" className="w-full h-full object-cover" /></div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">{['TEFL','C2','100+ учеников','Автор BEMAT'].map(t => <span key={t} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold border border-stone-200">{t}</span>)}</div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">Об авторе</h3>
              <p className="text-stone-600 leading-relaxed mb-4">Абдуррахим Бердиев. Помогаю заговорить на английском. ЕГЭ/ОГЭ, IELTS/TOEFL.</p>
              <ul className="space-y-2 mb-6 text-sm text-stone-600">{['Разговорная практика','Грамматика без теории','Стратегии экзаменов'].map(t => <li key={t} className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /><span>{t}</span></li>)}</ul>
              <Button href="https://berdiyev-eng.ru" className="w-full !py-3 !bg-stone-900 !text-white shadow-xl">Бесплатный урок</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BooksPanel = () => (<div className="pb-24 pt-4 px-4"><Accordion title="Читать на английском" defaultOpen={true}>
  <MediaRow title="2books.su" desc="Книги + перевод." img="https://static.tildacdn.info/tild3539-6535-4239-b735-666530633965/1.jpg" link="https://2books.su/" />
  <MediaRow title="Linguasaur" desc="Книги по уровням." img="https://optim.tildacdn.pub/tild6263-3964-4535-b234-303234656665/-/format/webp/3.png.webp" link="https://linguasaur.com/ru/en/books" />
  <MediaRow title="AnyLang" desc="Чтение + карточки." img="https://static.tildacdn.info/tild3564-3631-4036-b636-623266636266/2.png" link="https://anylang.net/ru/books/en" />
  <MediaRow title="Breaking News English" desc="Новости с заданиями." img="https://static.tildacdn.info/tild3161-3861-4234-b362-613030653564/2.jpg" link="https://breakingnewsenglish.com/" />
</Accordion></div>);

const VideoPanel = () => (<div className="pb-24 pt-4 px-4">
  <Accordion title="Фильмы и сериалы" defaultOpen={true}>
    <MediaRow title="Inoriginal" desc="Двойные субтитры." img="https://static.tildacdn.info/tild3336-3030-4964-b966-303862353932/10.jpg" link="https://inoriginal.net/" />
    <MediaRow title="Solarmovies" desc="Кино без рекламы." img="https://static.tildacdn.info/tild3036-3665-4436-b131-396638313261/ADB9F47D-E5AA-479B-A.jpeg" link="https://solarmovies.ms/home" />
    <MediaRow title="HDRezka" desc="Озвучка на EN." img="https://static.tildacdn.info/tild3639-6237-4435-b338-373633663331/IMG_7903.PNG" link="https://hdrezka.fans/" />
    <MediaRow title="Zetflix" desc="Запасной." img="https://static.tildacdn.info/tild3430-6262-4238-b332-343464626162/11.jpg" link="https://go.zetflix-online.lol/" />
  </Accordion>
  <Accordion title="Аудирование">
    <MediaRow title="Listen in English" desc="Уроки по уровням." img="https://static.tildacdn.info/tild3636-3261-4532-b231-626664646132/BA22E78D-3200-4109-8.jpeg" link="https://listeninenglish.com/index.php" />
    <MediaRow title="iSLCollective" desc="Видео по фильмам." img="https://static.tildacdn.info/tild3836-3837-4331-b162-623335363239/12.jpg" link="https://en.islcollective.com/english-esl-video-lessons/search" />
  </Accordion>
  <Accordion title="Лексика">
    <MediaRow title="TED‑Ed" desc="Уроки с лексикой." img="https://static.tildacdn.info/tild6339-3537-4662-a130-303765373530/IMG_7745.PNG" link="https://ed.ted.com/lessons" />
    <MediaRow title="6 Minute English" desc="BBC уроки." img="https://static.tildacdn.info/tild3864-3339-4639-b030-653330343666/IMG_7746.PNG" link="https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" />
  </Accordion>
</div>);

const PracticePanel = () => (<div className="pb-24 pt-4 px-4">
  <Accordion title="Грамматика" defaultOpen={true}>
    <MediaRow title="Bewords.ru" desc="150+ уроков." img="https://bemat.ru/bewordsgram.jpg" link="https://bewords.ru/" btnText="Открыть" />
    <MediaRow title="Test‑English" desc="A1–B2." img="https://static.tildacdn.info/tild3131-3437-4330-a633-393162336665/4.jpg" link="https://test-english.com/grammar-points/" />
    <MediaRow title="Lingust" desc="148 уроков." img="https://optim.tildacdn.pub/tild3062-6233-4431-b363-353163363163/-/format/webp/0D4BE37D-2FBF-4950-8.jpeg.webp" link="https://lingust.ru/english/grammar" />
  </Accordion>
  <Accordion title="Перевод предложений">
    <MediaRow title="RU → EN" desc="Грамматика через перевод." img="https://static.tildacdn.info/tild6435-3633-4265-b966-313030633165/photo.PNG" link="https://bemat.ru/collect.html" btnText="Тренажёр" />
  </Accordion>
</div>);

const SpeakPanel = () => (<div className="pb-24 pt-4 px-4">
  <Accordion title="Разговорная практика" defaultOpen={true}>
    <MediaRow title="Боб — ИИ" desc="Голосовой разговор." img="https://bemat.ru/bobai.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
    <MediaRow title="HelloTalk" desc="Носители языка." img="https://static.tildacdn.info/tild6631-3338-4435-b966-313430333161/_____2.jpg" link="https://www.hellotalk.com/ru" />
    <MediaRow title="Character.AI" desc="Разговор с ИИ." img="https://static.tildacdn.info/tild6435-6666-4139-a237-396664643764/_____3.jpg" link="https://character.ai/" />
  </Accordion>
  <Accordion title="Учить слова">
    <MediaRow title="Bewords" desc="Слова на сайте." img="https://bemat.ru/bewordswords.jpg" link="https://bewords.ru/" />
    <MediaRow title="EnglSpace" desc="Через ассоциации." img="https://static.tildacdn.info/tild3462-3164-4432-b633-316131343833/BEE2697D-A7E6-43D6-9.jpeg" link="https://t.me/English_Mnemo_Bot" />
  </Accordion>
</div>);

const NavBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={cn("flex flex-col items-center gap-1", active ? "text-violet-600" : "text-stone-400 hover:text-stone-600")}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} className={cn("transition-all", active && "scale-110")} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

// ==============================
// ГЛАВНЫЙ КОМПОНЕНТ
// ==============================

export function App() {
  // PWA проверка (синхронная для первого рендера)
  const [isPWAMode] = useState(() => checkIsPWA());
  const [isLoading, setIsLoading] = useState(() => checkIsPWA()); // Splash только для PWA
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Состояние приложения
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserState | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const streakScheduled = useRef(false);
  const swWaiting = useRef<ServiceWorker | null>(null);

  // 1. Перехват install prompt (для Android/Desktop)
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 2. Service Worker: обновления
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    const checkUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.update();

        // Проверяем waiting worker
        if (reg.waiting) {
          swWaiting.current = reg.waiting;
          setUpdateAvailable(true);
        }

        // Слушаем новые установки
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              swWaiting.current = newWorker;
              setUpdateAvailable(true);
            }
          });
        });
      } catch {}
    };

    checkUpdates();
    const interval = setInterval(checkUpdates, 60 * 1000); // Каждую минуту

    // Перезагрузка при смене контроллера
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) { refreshing = true; window.location.reload(); }
    });

    return () => clearInterval(interval);
  }, []);

  // 3. Загрузка юзера + splash
  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem('bemat_user_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const last = new Date(parsed.lastVisit);
          const today = new Date();
          const todayStr = today.toDateString();
          const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          let newStreak = parsed.streak || 1;
          let newCompleted = parsed.completedTasks || [];
          let newCatFed = parsed.catFed || false;
          if (todayStr !== last.toDateString()) { newCompleted = []; newCatFed = false; newStreak = diff <= 1 ? newStreak + 1 : 1; }
          const updated: UserState = { ...parsed, streak: newStreak, lastVisit: today.toISOString(), completedTasks: newCompleted, catFed: newCatFed, customTasks: parsed.customTasks || [], streakShownDate: parsed.streakShownDate || '', notifHour: parsed.notifHour || 19 };
          setUser(updated);
          localStorage.setItem('bemat_user_v3', JSON.stringify(updated));
          if (updated.streakShownDate !== todayStr && !streakScheduled.current) { streakScheduled.current = true; setTimeout(() => setShowStreakPopup(true), isPWAMode ? 1800 : 600); }
          if (updated.notificationsEnabled) scheduleNotification(updated.notifHour || 19);
        } catch { localStorage.removeItem('bemat_user_v3'); }
      }
    };

    loadUser();

    // Splash: 1.5 секунды для PWA
    if (isPWAMode) {
      setTimeout(() => setIsLoading(false), 1500);
    }

    // Перепланировка уведомлений при возврате
    const vis = () => {
      if (document.visibilityState === 'visible') {
        const s = localStorage.getItem('bemat_user_v3');
        if (s) try { const p = JSON.parse(s); if (p.notificationsEnabled) scheduleNotification(p.notifHour || 19); } catch {}
      }
    };
    document.addEventListener('visibilitychange', vis);
    return () => { document.removeEventListener('visibilitychange', vis); cancelNotification(); };
  }, [isPWAMode]);

  // Обработчики
  const handleOnboarding = (name: string, goal: UserGoal) => {
    const nu: UserState = { name, goal, streak: 1, lastVisit: new Date().toISOString(), completedTasks: [], customTasks: [], notificationsEnabled: false, isOnboarded: true, catFed: false, streakShownDate: '', notifHour: 19 };
    setUser(nu); localStorage.setItem('bemat_user_v3', JSON.stringify(nu));
    setTimeout(() => setShowStreakPopup(true), 800);
  };

  const updateUser = (u: UserState) => { setUser(u); localStorage.setItem('bemat_user_v3', JSON.stringify(u)); };

  const resetProgress = () => { cancelNotification(); localStorage.removeItem('bemat_user_v3'); setUser(null); setShowResetConfirm(false); setActiveTab('dashboard'); streakScheduled.current = false; };

  const handleNavigate = (tab: string) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); };

  const closeStreak = () => { setShowStreakPopup(false); if (user) updateUser({ ...user, streakShownDate: new Date().toDateString() }); };

  const handleUpdate = () => {
    if (swWaiting.current) swWaiting.current.postMessage({ type: 'SKIP_WAITING' });
    else window.location.reload();
  };

  const handlePromptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // ====== РЕНДЕР ======

  // 1. Splash screen (только PWA)
  if (isLoading) return <SplashScreen />;

  // 2. Не PWA → лендинг
  if (!isPWAMode) return <PWALandingPage deferredPrompt={deferredPrompt} onPromptInstall={handlePromptInstall} />;

  // 3. Нет юзера → онбординг
  if (!user) return <Onboarding onComplete={handleOnboarding} />;

  // 4. Приложение
  const BackButton = () => (<div className="px-4 pt-4"><button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-stone-500 font-bold mb-2 hover:text-violet-600"><ArrowRight className="rotate-180" size={18} /> Назад</button></div>);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 pb-20 selection:bg-violet-200">
      <Sponsors />
      <Header onNavigate={handleNavigate} onOpenSettings={() => setShowResetConfirm(true)} />

      {/* Плашка обновления */}
      {updateAvailable && <UpdateBanner onUpdate={handleUpdate} />}

      <main className="max-w-xl mx-auto w-full">
        {activeTab === 'dashboard' && <Dashboard user={user} onUpdateUser={updateUser} onNavigate={handleNavigate} />}
        {activeTab === 'home' && <div><BackButton /><HomePanel onNavigate={handleNavigate} /></div>}
        {activeTab === 'books' && <div><BackButton /><BooksPanel /></div>}
        {activeTab === 'video' && <div><BackButton /><VideoPanel /></div>}
        {activeTab === 'practice' && <div><BackButton /><PracticePanel /></div>}
        {activeTab === 'speak' && <div><BackButton /><SpeakPanel /></div>}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 z-50 rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center max-w-lg mx-auto h-[64px]">
          <NavBtn active={activeTab === 'dashboard'} onClick={() => handleNavigate('dashboard')} icon={Home} label="Кабинет" />
          <NavBtn active={activeTab === 'home'} onClick={() => handleNavigate('home')} icon={GraduationCap} label="Ресурсы" />
          <NavBtn active={activeTab === 'books'} onClick={() => handleNavigate('books')} icon={Book} label="Книги" />
          <NavBtn active={activeTab === 'video'} onClick={() => handleNavigate('video')} icon={Film} label="Видео" />
          <NavBtn active={activeTab === 'practice'} onClick={() => handleNavigate('practice')} icon={PenTool} label="Практика" />
          <NavBtn active={activeTab === 'speak'} onClick={() => handleNavigate('speak')} icon={Mic} label="Разговор" />
        </div>
      </nav>

      <StreakPopup isOpen={showStreakPopup} onClose={closeStreak} streak={user.streak} />

      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Сбросить прогресс?">
        <div className="text-center space-y-4">
          <p className="text-stone-600">Все данные будут удалены.</p>
          <Button onClick={resetProgress} className="w-full !bg-red-500 !text-white !shadow-red-200">Сбросить</Button>
          <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="w-full">Отмена</Button>
        </div>
      </Modal>
    </div>
  );
}
