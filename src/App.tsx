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
  Smartphone, Monitor, RefreshCw, LogIn // <-- LogIn добавлен
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

// ==============================
// УТИЛИТЫ
// ==============================

function checkIsPWA(): boolean {
  if (typeof window === 'undefined') return false;
  // @ts-ignore
  if (window.navigator.standalone === true) return true;
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  if (window.matchMedia('(display-mode: fullscreen)').matches) return true;
  if (window.matchMedia('(display-mode: minimal-ui)').matches) return true;
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
// 2. PWA LANDING PAGE
// ==============================

const PWALandingPage = ({ deferredPrompt, onPromptInstall, onSkip }: { deferredPrompt: any; onPromptInstall: () => void; onSkip: () => void }) => {
  const device = getDeviceType();

  const scrollToInstall = () => {
    document.getElementById('install-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const features = [
    { icon: '🐱', title: 'Кот Боб', desc: 'Твой личный наставник. Корми его знаниями!' },
    { icon: '🎬', title: 'Фильмы и сериалы', desc: 'Смотри в оригинале с умными субтитрами' },
    { icon: '📚', title: 'Книги с переводом', desc: 'Читай и учи новые слова в контексте' },
    { icon: '🎓', title: 'ЕГЭ / ОГЭ / IELTS', desc: 'Готовься к экзаменам с AI-помощниками' },
    { icon: '🗣', title: 'Разговорный клуб', desc: 'Практикуй речь с AI и реальными людьми' },
    { icon: '🔥', title: 'Система стриков', desc: 'Занимайся по 15 минут в день и не теряй прогресс' },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 overflow-y-auto pb-safe">
      {/* 1. Верхний бар */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <img src={logo} alt="BEMAT" className="w-8 h-8 rounded-full bg-stone-100" />
          <span className="font-black text-lg tracking-tight text-stone-900">BEMAT</span>
        </div>
        {/* Кнопка в хедере */}
        {device === 'ios' ? (
          <button onClick={scrollToInstall} className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-violet-700 transition-colors">
            Установить
          </button>
        ) : deferredPrompt ? (
          <button onClick={onPromptInstall} className="bg-violet-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-violet-700 transition-colors">
            {device === 'desktop' ? 'Установить на ПК' : 'Скачать'}
          </button>
        ) : device === 'desktop' ? (
          <button onClick={onSkip} className="bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:bg-stone-800 transition-colors flex items-center gap-2">
            <LogIn size={14} /> Войти
          </button>
        ) : null}
      </div>

      {/* 2. Hero */}
      <div className="pt-28 pb-10 px-6 flex flex-col items-center text-center">
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 bg-violet-200 rounded-full blur-xl opacity-50 animate-pulse" />
          <img src={logo} alt="Bob" className="relative w-full h-full rounded-full border-4 border-white shadow-2xl object-cover" />
          <div className="absolute -bottom-2 -right-2 bg-white px-3 py-1 rounded-full text-xl shadow-lg">🇬🇧</div>
        </div>
        
        <h1 className="text-4xl font-black text-stone-900 mb-3 leading-tight">
          Английский <br/><span className="text-violet-600">в твоём кармане</span>
        </h1>
        <p className="text-stone-600 text-base max-w-xs mb-8 leading-relaxed">
          Бесплатное приложение с фильмами, книгами и AI-репетитором. Учи язык играючи вместе с котом Бобом! 🐱
        </p>

        {/* Кнопки Hero */}
        {device === 'android' && deferredPrompt && (
          <button onClick={onPromptInstall} className="w-full max-w-xs py-4 bg-stone-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mb-4">
            <Download size={20} /> Скачать на Android
          </button>
        )}
        {device === 'ios' && (
          <button onClick={scrollToInstall} className="w-full max-w-xs py-4 bg-stone-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mb-4">
            <Download size={20} /> Установить на iPhone
          </button>
        )}
        {device === 'desktop' && (
          deferredPrompt ? (
            <button onClick={onPromptInstall} className="w-full max-w-xs py-4 bg-stone-900 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mb-4">
              <Monitor size={20} /> Установить на компьютер
            </button>
          ) : (
            <button onClick={onSkip} className="w-full max-w-xs py-4 bg-violet-600 text-white font-bold rounded-2xl shadow-xl hover:scale-[1.02] transition-transform flex items-center justify-center gap-2 mb-4">
              <LogIn size={20} /> Войти в приложение
            </button>
          )
        )}
        
        <p className="text-xs text-stone-400 font-medium">Бесплатно · Без рекламы · Без регистрации</p>
      </div>

      {/* 3. Фичи */}
      <div className="px-4 pb-12">
        <h2 className="text-xl font-bold text-stone-900 mb-4 px-2">Что внутри?</h2>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-4 rounded-3xl border border-stone-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex flex-col gap-2">
              <div className="w-10 h-10 bg-stone-50 rounded-2xl flex items-center justify-center text-xl mb-1">{f.icon}</div>
              <div>
                <h3 className="font-bold text-stone-900 text-sm leading-tight mb-1">{f.title}</h3>
                <p className="text-[11px] text-stone-500 leading-snug">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Инструкция */}
      <div id="install-section" className="px-4 pb-16 scroll-mt-20">
        <div className="bg-stone-900 rounded-[2.5rem] p-6 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600 blur-[60px] opacity-40 rounded-full translate-x-10 -translate-y-10" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-black mb-2 flex items-center gap-3">
              <Download className="text-violet-400" /> 
              {device === 'ios' ? 'Скачать на iPhone' : device === 'desktop' ? 'Установка на ПК' : 'Установка'}
            </h2>
            
            {/* iOS Info */}
            {device === 'ios' && (
              <div className="mb-6 bg-white/10 p-4 rounded-2xl border border-white/5">
                <p className="text-sm font-bold mb-1">🍎 В App Store пока нет</p>
                <p className="text-xs text-stone-300 leading-relaxed">
                  Но вы можете скачать веб-версию! Она работает точно так же, как обычное приложение. 
                  <br/><br/>
                  <span className="text-white font-bold">После установки нажмите на иконку на рабочем столе — и всё заработает шикарно! ✨</span>
                </p>
              </div>
            )}

            {/* iOS Steps */}
            {device === 'ios' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-white text-stone-900 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">1</div>
                  <div className="flex-1"><p className="font-bold text-sm">Нажми «Поделиться»</p><p className="text-xs text-stone-400 mt-0.5">Внизу экрана Safari</p></div>
                  <div className="w-8 h-8 flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15V3M12 3L7 8M12 3L17 8M4 11V19C4 20.1046 4.89543 21 6 21H18C19.1046 21 20 20.1046 20 19V11" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-white text-stone-900 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">2</div>
                  <div className="flex-1"><p className="font-bold text-sm">«На экран Домой»</p><p className="text-xs text-stone-400 mt-0.5">В списке (пролистай вниз)</p></div>
                  <div className="w-8 h-8 rounded-lg bg-stone-700 flex items-center justify-center border border-stone-600"><div className="bg-white/90 w-6 h-6 rounded flex items-center justify-center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5V19M5 12H19" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>
                </div>
                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 bg-white text-stone-900 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">3</div>
                  <div className="flex-1"><p className="font-bold text-sm">Нажми «Добавить»</p><p className="text-xs text-stone-400 mt-0.5">В правом верхнем углу</p></div>
                  <div className="text-[#007AFF] font-bold text-sm">Добавить</div>
                </div>
                <div className="flex items-center gap-4 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 p-4 rounded-2xl border border-violet-500/30">
                  <div className="w-10 h-10 bg-violet-600 text-white rounded-xl flex items-center justify-center font-black text-lg shadow-lg">4</div>
                  <div className="flex-1"><p className="font-bold text-sm text-white">Всё готово! 🥳</p><p className="text-xs text-violet-200 mt-0.5 leading-snug">Нажми на иконку <span className="text-white font-bold">BEMAT</span> на рабочем столе и наслаждайся!</p></div>
                  <img src={logo} className="w-10 h-10 rounded-xl border border-white/10 shadow-sm" alt="App Icon" />
                </div>
              </div>
            )}

            {/* Android Logic */}
            {device === 'android' && (
              <div className="space-y-4">
                {deferredPrompt ? (
                  <>
                    <p className="text-white font-bold text-lg mb-2 text-center">Доступна быстрая установка! 🚀</p>
                    <button onClick={onPromptInstall} className="w-full py-5 bg-white text-stone-900 font-black text-lg rounded-2xl shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-3 animate-pulse">
                      <Download size={24} className="text-violet-600" /> УСТАНОВИТЬ ПРИЛОЖЕНИЕ
                    </button>
                    <p className="text-stone-400 text-xs text-center mt-2">Официальное PWA-приложение BEMAT</p>
                  </>
                ) : (
                  <div className="bg-white/10 p-5 rounded-2xl border border-white/5 text-center">
                    <p className="font-bold mb-3 text-white">Приложение уже установлено?</p>
                    <p className="text-sm text-stone-300 mb-6">Если нет — скачайте APK через RuStore</p>
                    <a href="https://www.rustore.ru/catalog/app/co.median.android.pkpxbe" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full py-4 bg-[#0077FF] text-white rounded-xl text-base font-bold shadow-lg hover:bg-[#0066CC] transition-colors">
                       <Smartphone size={20} /> <span>Скачать в RuStore</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Desktop Logic */}
            {device === 'desktop' && (
              <div className="space-y-4">
                 {deferredPrompt ? (
                    // Сценарий 1: Браузер разрешил установку
                    <>
                      <p className="text-white font-bold text-lg mb-2 text-center">Доступна установка на ПК! 🖥️</p>
                      <button 
                        onClick={onPromptInstall} 
                        className="w-full py-4 bg-white text-stone-900 font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-3 animate-pulse"
                      >
                         <Monitor size={20} className="text-violet-600" /> УСТАНОВИТЬ НА КОМПЬЮТЕР
                      </button>
                      <p className="text-stone-400 text-xs text-center mt-2">
                        Приложение появится в меню Пуск и на рабочем столе
                      </p>
                    </>
                 ) : (
                    // Сценарий 2: Браузер не дал событие
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/5 text-center">
                       <p className="font-bold text-white mb-2">Уже установили?</p>
                       <p className="text-sm text-stone-300 mb-4">
                         Если вы видите это в приложении — нажмите "Войти".<br/>
                         Если нет — найдите иконку <span className="inline-flex items-center justify-center bg-white/20 w-6 h-6 rounded-full text-xs font-bold mx-1">⊕</span> в адресной строке.
                       </p>
                       <button onClick={onSkip} className="w-full py-3 bg-violet-600 text-white font-bold rounded-xl shadow-lg hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                         <LogIn size={18} /> Войти в приложение
                       </button>
                    </div>
                 )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Футер */}
      <div className="text-center pb-8 pt-4">
        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mb-2">BEMAT PROJECT</p>
        <div className="flex justify-center gap-6 text-xs font-bold text-stone-500">
          <a href="https://t.me/+NvMX2DrTa3w1NTVi" className="hover:text-violet-600 transition-colors">Telegram</a>
          <a href="https://berdiyev-eng.ru" className="hover:text-violet-600 transition-colors">Об авторе</a>
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
// ГЛАВНЫЙ КОМПОНЕНТ
// ==============================

export function App() {
  const [isPWAMode, setIsPWAMode] = useState(() => checkIsPWA());
  const [isLoading, setIsLoading] = useState(() => checkIsPWA());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Состояние
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserState | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const streakScheduled = useRef(false);
  const swWaiting = useRef<ServiceWorker | null>(null);

  // 1. Install Prompt
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // 2. SW Updates
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    const checkUpdates = async () => {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.update();
        if (reg.waiting) { swWaiting.current = reg.waiting; setUpdateAvailable(true); }
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
    const interval = setInterval(checkUpdates, 60 * 1000);
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (!refreshing) { refreshing = true; window.location.reload(); } });
    return () => clearInterval(interval);
  }, []);

  // 3. User & Splash & PWA Check
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
    if (isPWAMode) setTimeout(() => setIsLoading(false), 1500);

    // Auto-detect PWA mode switch (если юзер нажал "Войти" или браузер сам переключился)
    const match = window.matchMedia('(display-mode: standalone)');
    const onChange = (evt: MediaQueryListEvent) => { if (evt.matches) setIsPWAMode(true); };
    match.addEventListener('change', onChange);

    const vis = () => { if (document.visibilityState === 'visible') { const s = localStorage.getItem('bemat_user_v3'); if (s) try { const p = JSON.parse(s); if (p.notificationsEnabled) scheduleNotification(p.notifHour || 19); } catch {} } };
    document.addEventListener('visibilitychange', vis);
    return () => { 
      document.removeEventListener('visibilitychange', vis); 
      match.removeEventListener('change', onChange);
      cancelNotification(); 
    };
  }, [isPWAMode]);

  // Handlers
  const handleOnboarding = (name: string, goal: UserGoal) => {
    const nu: UserState = { name, goal, streak: 1, lastVisit: new Date().toISOString(), completedTasks: [], customTasks: [], notificationsEnabled: false, isOnboarded: true, catFed: false, streakShownDate: '', notifHour: 19 };
    setUser(nu); localStorage.setItem('bemat_user_v3', JSON.stringify(nu));
    setTimeout(() => setShowStreakPopup(true), 800);
  };
  const updateUser = (u: UserState) => { setUser(u); localStorage.setItem('bemat_user_v3', JSON.stringify(u)); };
  const resetProgress = () => { cancelNotification(); localStorage.removeItem('bemat_user_v3'); setUser(null); setShowResetConfirm(false); setActiveTab('dashboard'); streakScheduled.current = false; };
  const handleNavigate = (tab: string) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }); };
  const closeStreak = () => { setShowStreakPopup(false); if (user) updateUser({ ...user, streakShownDate: new Date().toDateString() }); };
  const handleUpdate = () => { if (swWaiting.current) swWaiting.current.postMessage({ type: 'SKIP_WAITING' }); else window.location.reload(); };
  const handlePromptInstall = async () => { if (!deferredPrompt) return; deferredPrompt.prompt(); await deferredPrompt.userChoice; setDeferredPrompt(null); };
  
  // NEW: Manual skip for desktop (Кнопка "Войти")
  const handleEnterApp = () => setIsPWAMode(true);

  // Render
  if (isLoading) return <SplashScreen />;
  if (!isPWAMode) return <PWALandingPage deferredPrompt={deferredPrompt} onPromptInstall={handlePromptInstall} onSkip={handleEnterApp} />;
  if (!user) return <Onboarding onComplete={handleOnboarding} />;

  const BackButton = () => (<div className="px-4 pt-4"><button onClick={() => setActiveTab('dashboard')} className="flex items-center gap-2 text-stone-500 font-bold mb-2 hover:text-violet-600"><ArrowRight className="rotate-180" size={18} /> Назад</button></div>);

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 pb-20 selection:bg-violet-200">
      <Sponsors />
      <Header onNavigate={handleNavigate} onOpenSettings={() => setShowResetConfirm(true)} />
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
        <div className="text-center space-y-4"><p className="text-stone-600">Все данные будут удалены.</p><Button onClick={resetProgress} className="w-full !bg-red-500 !text-white !shadow-red-200">Сбросить</Button><Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="w-full">Отмена</Button></div>
      </Modal>
    </div>
  );
}
