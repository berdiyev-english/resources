import React, { useState, useEffect, useRef } from 'react';
import logo from './logo.png';
import catHungry from './cathungry.png';
import catFedImg from './catfed.png';
import { Sponsors } from './Sponsors';
import { InstallPrompt } from './InstallPrompt';
import {
  Home, PenTool, Heart, Menu, X, ChevronDown, ExternalLink,
  GraduationCap, Bot, Book, Film, CheckCircle, Mic, Gift,
  Flame, Bell, Settings, Trophy, ArrowRight, CheckCircle2,
  Edit3, Plus, Trash2, Clock
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ТИПЫ ---
type UserGoal = 'ege' | 'oge' | 'ielts' | 'toefl' | 'speak' | 'fun';

interface CustomTask {
  id: string;
  title: string;
  time: number;
}

interface UserState {
  name: string;
  goal: UserGoal;
  streak: number;
  lastVisit: string;
  completedTasks: string[];
  customTasks: CustomTask[];
  notificationsEnabled: boolean;
  isOnboarded: boolean;
  catFed: boolean;
  streakShownDate: string;
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

// --- ЗАДАНИЯ (~15 мин/день) ---
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

// --- UI COMPONENTS ---

const Button = ({ children, className, variant = 'primary', href, onClick, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-transform no-underline cursor-pointer select-none active:scale-95";
  const variants: Record<string, string> = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 border border-transparent",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 border border-stone-200",
  };
  const Comp = href ? 'a' : 'button';
  return (
    <Comp href={href} onClick={onClick}
      className={cn(baseStyles, variants[variant] || variants.primary, className)}
      {...(href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >{children}</Comp>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
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
      <div>
        <Button href={link} className="py-1.5 px-4 text-xs !bg-violet-600 !text-white shadow-sm hover:!bg-violet-700 w-auto rounded-lg">{btnText}</Button>
      </div>
    </div>
  </div>
);

// --- ОНБОРДИНГ ---

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
          <p className="text-stone-600 mb-8 text-lg">Помогу тебе выучить английский. Как тебя зовут?</p>
          <input type="text" placeholder="Твоё имя..." className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4 shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
          <button disabled={!name.trim()} onClick={() => setStep(2)} className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-lg shadow-violet-200">Дальше</button>
        </div>
      )}
      {step === 2 && (
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{name}, какая у тебя цель?</h2>
          <p className="text-stone-500 mb-6">Я составлю план занятий для тебя.</p>
          <div className="space-y-3 mb-8">
            {GOAL_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => setGoal(opt.id)}
                className={cn("w-full p-4 rounded-2xl flex items-center gap-3 border-2 transition-all text-left",
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

// --- ПОПАП СТРИКА ---

const StreakPopup = ({ isOpen, onClose, streak }: { isOpen: boolean; onClose: () => void; streak: number }) => {
  if (!isOpen) return null;

  const isFirst = streak <= 1;
  const fireCount = Math.min(streak, 7);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fafaf9] rounded-[2rem] shadow-2xl p-8 border border-white text-center">
        
        {/* Анимированный огонь */}
        <div className="text-7xl mb-4 animate-bounce">🔥</div>

        {isFirst ? (
          <>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Стрик зародился!</h3>
            <p className="text-stone-500 mb-2 text-sm">Ты начал свой путь! Занимайся каждый день, чтобы не потерять стрик.</p>
            <p className="text-stone-400 text-xs mb-6">Боб верит в тебя! 🐱</p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              {streak} {streak < 5 ? 'дня' : 'дней'} подряд!
            </h3>
            <p className="text-stone-500 mb-2 text-sm">Отличная серия! Не останавливайся!</p>
            <p className="text-stone-400 text-xs mb-6">Боб гордится тобой 😸</p>
          </>
        )}

        {/* Полоска огней */}
        <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
          {Array.from({ length: fireCount }, (_, i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-b from-orange-100 to-amber-50 flex items-center justify-center text-lg border border-orange-200 shadow-sm">
              🔥
            </div>
          ))}
          {streak > 7 && (
            <span className="text-stone-400 font-bold text-sm ml-1.5">+{streak - 7}</span>
          )}
        </div>

        {/* Мотивация */}
        <div className="bg-violet-50 rounded-xl p-3 mb-6 border border-violet-100">
          <p className="text-xs font-bold text-violet-700">
            {isFirst
              ? '💡 Совет: занимайся хотя бы 15 минут в день — это 1 урок!'
              : streak >= 7
                ? '🏆 Неделя без пропусков! Ты — машина!'
                : streak >= 3
                  ? '💪 3+ дня подряд — отличное начало!'
                  : '📈 Каждый день — это +1 к твоему уровню!'
            }
          </p>
        </div>

        <button onClick={onClose} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200">
          {isFirst ? 'Начнём! 🚀' : 'Продолжаем! 💪'}
        </button>
      </div>
    </div>
  );
};

// --- ПОПАП КОРМЁЖКИ ---

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

        <div className={cn("w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-lg transition-all duration-700", isFed ? "border-green-300 shadow-green-100" : "border-orange-300 shadow-orange-100")}>
          <img src={isFed ? catFedImg : catHungry} alt="Bob" className="w-full h-full object-cover" />
        </div>

        {isFed ? (
          <>
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-xl font-black text-stone-900 mb-1">Боб сыт и счастлив!</h3>
            <p className="text-stone-500 text-sm mb-6">Спасибо что покормил! Приходи завтра 😸</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2">😿</div>
            <h3 className="text-xl font-black text-stone-900 mb-1">Боб голодный!</h3>
            <p className="text-stone-500 text-sm mb-2">Выполни все задания, чтобы покормить Боба</p>
            <p className="text-xs text-stone-400 mb-6">
              Осталось: {remaining} {remaining === 1 ? 'задание' : remaining < 5 ? 'задания' : 'заданий'}
            </p>
          </>
        )}

        <div className="mb-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1.5">
            <span>🍽️ Миска с кормом</span>
            <span>{feedProgress}%</span>
          </div>
          <div className="h-4 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
            <div className={cn("h-full rounded-full transition-all duration-1000", isFed ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-300 to-amber-400")} style={{ width: `${feedProgress}%` }} />
          </div>
        </div>

        <div className="mt-4 space-y-2 text-left max-h-40 overflow-y-auto">
          {tasks.map((task: any) => {
            const isDone = user.completedTasks.includes(task.id);
            return (
              <div key={task.id} className={cn("flex items-center gap-2 text-xs p-2 rounded-lg", isDone ? "text-stone-400 bg-stone-50" : "text-stone-700 bg-white border border-stone-100")}>
                <span>{isDone ? '✅' : '⬜'}</span>
                <span className={cn("flex-1", isDone && "line-through")}>{task.title}</span>
                <span className="text-stone-400">{task.time} мин</span>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="mt-6 w-full py-3 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200">
          {isFed ? 'Отлично! 😸' : 'Пойду заниматься!'}
        </button>
      </div>
    </div>
  );
};

// --- ПОПАП ПРОФИЛЯ ---

const ProfileModal = ({ isOpen, onClose, user, onSave }: { isOpen: boolean; onClose: () => void; user: UserState; onSave: (name: string, goal: UserGoal) => void }) => {
  const [editName, setEditName] = useState(user.name);
  const [selectedGoal, setSelectedGoal] = useState<UserGoal>(user.goal);

  useEffect(() => {
    if (isOpen) { setEditName(user.name); setSelectedGoal(user.goal); }
  }, [isOpen, user]);

  const handleSave = () => {
    if (!editName.trim()) return;
    onSave(editName.trim(), selectedGoal);
    onClose();
  };

  const goalChanged = selectedGoal !== user.goal;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-900">Твой профиль</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img src={logo} alt="Bob" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Имя</label>
          <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
            className="w-full p-3.5 rounded-xl bg-white border border-stone-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm" placeholder="Твоё имя..." />
        </div>

        <div className="mb-6">
          <label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2 block">Цель</label>
          <div className="space-y-2">
            {GOAL_OPTIONS.map((opt) => (
              <button key={opt.id} onClick={() => setSelectedGoal(opt.id)}
                className={cn("w-full p-3.5 rounded-xl flex items-center gap-3 border-2 transition-all text-left",
                  selectedGoal === opt.id ? "border-violet-600 bg-violet-50" : "border-stone-100 bg-white"
                )}>
                <span className="text-xl">{opt.icon}</span>
                <span className="font-bold text-stone-800 flex-1 text-sm">{opt.label}</span>
                {selectedGoal === opt.id && <CheckCircle2 className="w-5 h-5 text-violet-600 fill-violet-100" />}
                {user.goal === opt.id && selectedGoal !== opt.id && <span className="text-[10px] text-stone-400 font-bold">текущая</span>}
              </button>
            ))}
          </div>
        </div>

        {goalChanged && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
            ⚠️ При смене цели план на сегодня сбросится, но стрик сохранится!
          </div>
        )}

        <button onClick={handleSave} disabled={!editName.trim()}
          className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl hover:bg-violet-700 shadow-lg shadow-violet-200 disabled:opacity-50">
          Сохранить
        </button>
      </div>
    </div>
  );
};

// --- ПОПАП ДОБАВЛЕНИЯ ЗАДАНИЯ ---

const AddTaskModal = ({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: (title: string, time: number) => void }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(5);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), time);
    setTitle('');
    setTime(5);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-stone-900">Добавить задание</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500"><X size={20} /></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 block">Что делать?</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Посмотреть TED Talk"
              className="w-full p-3.5 rounded-xl bg-white border border-stone-200 font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm" />
          </div>

          <div>
            <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 block">Сколько минут?</label>
            <div className="flex gap-2">
              {[3, 5, 10, 15, 20].map(m => (
                <button key={m} onClick={() => setTime(m)}
                  className={cn("flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all",
                    time === m ? "border-violet-600 bg-violet-50 text-violet-700" : "border-stone-100 bg-white text-stone-600"
                  )}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
            <p className="text-xs text-stone-500">💡 Это задание будет появляться в твоём плане <strong>каждый день</strong>. Удалить можно в любой момент.</p>
          </div>

          <button onClick={handleAdd} disabled={!title.trim()}
            className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:bg-violet-700 shadow-lg shadow-violet-200">
            Добавить ✅
          </button>
        </div>
      </div>
    </div>
  );
};

// --- DASHBOARD ---

const Dashboard = ({ user, onUpdateUser, onNavigate }: { user: UserState; onUpdateUser: (u: UserState) => void; onNavigate: (tab: string) => void }) => {

  // Собираем все задания: стандартные + кастомные
  const defaultTasks = DAILY_TASKS[user.goal] || DAILY_TASKS.fun;
  const customDailyTasks = (user.customTasks || []).map(ct => ({
    ...ct, link: '', isExternal: false, isCustom: true,
  }));
  const allTasks = [...defaultTasks, ...customDailyTasks];

  const validCompleted = user.completedTasks.filter(id => allTasks.some(t => t.id === id));
  const progress = allTasks.length > 0 ? Math.round((validCompleted.length / allTasks.length) * 100) : 0;
  const totalTime = allTasks.reduce((sum, t) => sum + t.time, 0);
  const doneTime = allTasks.filter(t => validCompleted.includes(t.id)).reduce((sum, t) => sum + t.time, 0);

  const [showCatPopup, setShowCatPopup] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const toggleTask = (taskId: string) => {
    const isCompleted = validCompleted.includes(taskId);
    const newCompleted = isCompleted
      ? user.completedTasks.filter(id => id !== taskId)
      : [...user.completedTasks, taskId];

    const newValidCompleted = newCompleted.filter(id => allTasks.some(t => t.id === id));
    const allDone = newValidCompleted.length >= allTasks.length;

    if (allDone && !user.catFed) {
      setTimeout(() => setShowCatPopup(true), 500);
    }

    onUpdateUser({ ...user, completedTasks: newCompleted, catFed: user.catFed || allDone });
  };

  const handleTaskLink = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    if (task.isExternal) { window.open(task.link, '_blank'); return; }
    const hash = task.link.replace('#', '');
    if (['home', 'books', 'video', 'practice', 'speak'].includes(hash)) {
      onNavigate(hash);
    } else {
      onNavigate('home');
      setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  };

  const addCustomTask = (title: string, time: number) => {
    const newTask: CustomTask = { id: `custom_${Date.now()}`, title, time };
    onUpdateUser({ ...user, customTasks: [...(user.customTasks || []), newTask] });
  };

  const deleteCustomTask = (taskId: string) => {
    onUpdateUser({
      ...user,
      customTasks: (user.customTasks || []).filter(t => t.id !== taskId),
      completedTasks: user.completedTasks.filter(id => id !== taskId),
      catFed: false, // пересчитаем
    });
  };

  const handleProfileSave = (name: string, goal: UserGoal) => {
    const goalChanged = goal !== user.goal;
    onUpdateUser({
      ...user, name, goal,
      completedTasks: goalChanged ? [] : user.completedTasks,
      catFed: goalChanged ? false : user.catFed,
    });
  };

  const requestNotification = async () => {
    if (!("Notification" in window)) { alert("Браузер не поддерживает уведомления"); return; }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      onUpdateUser({ ...user, notificationsEnabled: true });
      new Notification("Привет от Боба! 🐱", { body: "Буду напоминать заниматься английским!", icon: logo });
    }
  };

  const isCatFed = user.catFed;
  const feedProgress = isCatFed ? 100 : progress;

  return (
    <div className="pb-24 pt-4 px-4 space-y-5">

      {/* Приветствие */}
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Личный кабинет</p>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-stone-800">Привет, {user.name} 👋</h1>
            <button onClick={() => setShowProfileModal(true)} className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-violet-600 transition-colors">
              <Edit3 size={16} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
          <Flame className={cn("w-5 h-5", user.streak > 0 ? "text-orange-500 fill-orange-500" : "text-stone-300")} />
          <span className="font-bold text-stone-800">{user.streak} дн.</span>
        </div>
      </div>

      {/* Цель */}
      <div className="flex items-center gap-3">
        <div className="bg-violet-50 rounded-2xl px-4 py-2.5 border border-violet-100 flex items-center gap-2 flex-1">
          <Trophy className="w-4 h-4 text-violet-600" />
          <span className="text-sm font-bold text-violet-800">{GOAL_LABELS[user.goal]}</span>
        </div>
        <button onClick={() => setShowProfileModal(true)} className="px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50">Изменить</button>
      </div>

      {/* Боб (кормёжка) */}
      <div onClick={() => setShowCatPopup(true)}
        className={cn("rounded-[2rem] p-5 shadow-sm border cursor-pointer transition-all hover:shadow-md",
          isCatFed ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
        )}>
        <div className="flex items-center gap-4">
          <div className={cn("w-16 h-16 rounded-full overflow-hidden border-[3px] shadow-md shrink-0", isCatFed ? "border-green-300" : "border-orange-300")}>
            <img src={isCatFed ? catFedImg : catHungry} alt="Bob" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-900 text-base mb-0.5">{isCatFed ? 'Боб сыт! 😸' : 'Боб голодный! 😿'}</h3>
            <p className="text-xs text-stone-500 mb-2">{isCatFed ? 'Приходи завтра!' : 'Выполни задания чтобы покормить'}</p>
            <div className="h-2.5 bg-white/70 rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-700", isCatFed ? "bg-gradient-to-r from-green-400 to-emerald-500" : "bg-gradient-to-r from-orange-300 to-amber-400")} style={{ width: `${feedProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* План на сегодня */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
          <div className="h-full bg-violet-500 transition-all duration-500 rounded-r-full" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex justify-between items-start mb-5 mt-2">
          <div>
            <h2 className="text-lg font-bold text-stone-900">План на сегодня</h2>
            <p className="text-stone-500 text-xs flex items-center gap-1.5">
              <Clock size={12} /> ~{totalTime} мин · Сделано: {doneTime}/{totalTime} мин ({progress}%)
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {/* Стандартные задания */}
          {defaultTasks.map((task) => {
            const isDone = validCompleted.includes(task.id);
            return (
              <div key={task.id}
                className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  isDone ? "bg-stone-50 border-transparent opacity-60" : "bg-white border-stone-100 hover:border-violet-200 shadow-sm"
                )}
                onClick={() => toggleTask(task.id)}>
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border transition-colors shrink-0",
                  isDone ? "bg-violet-500 border-violet-500" : "border-stone-300")}>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn("font-bold text-sm text-stone-700 block", isDone && "line-through text-stone-400")}>{task.title}</span>
                  <span className="text-[11px] text-stone-400">~{task.time} мин</span>
                </div>
                {!isDone && task.link && (
                  <button onClick={(e) => handleTaskLink(e, task)} className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg shrink-0">
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Кастомные задания */}
          {customDailyTasks.length > 0 && (
            <div className="pt-2 border-t border-dashed border-stone-200">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-1">Мои задания</p>
              {customDailyTasks.map((task: any) => {
                const isDone = validCompleted.includes(task.id);
                return (
                  <div key={task.id}
                    className={cn("flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer mb-2 last:mb-0",
                      isDone ? "bg-stone-50 border-transparent opacity-60" : "bg-violet-50/50 border-violet-100 hover:border-violet-200 shadow-sm"
                    )}
                    onClick={() => toggleTask(task.id)}>
                    <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border transition-colors shrink-0",
                      isDone ? "bg-violet-500 border-violet-500" : "border-violet-300")}>
                      {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={cn("font-bold text-sm text-stone-700 block", isDone && "line-through text-stone-400")}>{task.title}</span>
                      <span className="text-[11px] text-stone-400">~{task.time} мин · своё</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteCustomTask(task.id); }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg shrink-0 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Кнопка добавить */}
        <button onClick={() => setShowAddTask(true)}
          className="mt-4 w-full py-3 bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-500 hover:text-violet-600 transition-colors flex items-center justify-center gap-2">
          <Plus size={18} /> Добавить своё задание
        </button>

        {progress === 100 && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center">
            Все задания выполнены! Боб покормлен 😸🎉
          </div>
        )}
      </div>

      {/* Уведомления */}
      {!user.notificationsEnabled && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-base mb-1">Напоминалки</h3>
            <p className="text-violet-100 text-xs mb-3">Боб напомнит позаниматься, чтобы не потерять стрик.</p>
            <button onClick={requestNotification} className="px-4 py-2 bg-white text-violet-700 font-bold rounded-xl text-sm flex items-center gap-2">
              <Bell size={16} /> Включить
            </button>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] text-7xl opacity-20 rotate-12">🔔</div>
        </div>
      )}

      {/* Библиотека */}
      <div>
        <h3 className="font-bold text-stone-800 mb-3 px-1">Библиотека материалов</h3>
        <div className="grid grid-cols-2 gap-3">
          <MenuCard icon={Home} label="Вся подборка" color="bg-slate-100 text-slate-700" onClick={() => onNavigate('home')} />
          <MenuCard icon={Book} label="Книги" color="bg-emerald-100 text-emerald-700" onClick={() => onNavigate('books')} />
          <MenuCard icon={Film} label="Фильмы" color="bg-rose-100 text-rose-700" onClick={() => onNavigate('video')} />
          <MenuCard icon={PenTool} label="Грамматика" color="bg-amber-100 text-amber-700" onClick={() => onNavigate('practice')} />
          <MenuCard icon={Mic} label="Разговор" color="bg-sky-100 text-sky-700" onClick={() => onNavigate('speak')} />
          <MenuCard icon={Bot} label="AI Боты" color="bg-violet-100 text-violet-700" onClick={() => { onNavigate('home'); setTimeout(() => document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' }), 300); }} />
        </div>
      </div>

      {/* Попапы */}
      <CatFeedPopup isOpen={showCatPopup} onClose={() => setShowCatPopup(false)} user={user} tasks={allTasks} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} user={user} onSave={handleProfileSave} />
      <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} onAdd={addCustomTask} />
    </div>
  );
};

const MenuCard = ({ icon: Icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-1", color)}><Icon size={24} /></div>
    <span className="font-bold text-stone-700 text-sm">{label}</span>
  </button>
);

// --- HEADER ---

const Header = ({ onNavigate, onOpenSettings }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-stone-100">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
          <img src={logo} alt="Bob" className="w-9 h-9 rounded-full bg-stone-200 border border-white shadow-sm" />
          <span className="font-black text-xl tracking-tight text-stone-800">BEMAT</span>
        </button>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSupportOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100"><Gift size={20} /></button>
          <button onClick={() => setIsMenuOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 text-white"><Menu size={20} /></button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex justify-end" onClick={() => setIsMenuOpen(false)}>
          <div className="w-80 h-full bg-[#fafaf9] p-6 shadow-2xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl text-stone-900">Меню</h3>
              <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-stone-100 rounded-full"><X size={20} /></button>
            </div>
            <div className="space-y-2 mb-6">
              <div className="px-2 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">AI Помощники</div>
              {[
                { l: 'ЕГЭ Английский с ИИ', u: 'https://t.me/EGE_ENGLISH_GPT_bot', d: 'Подготовит на 80+ баллов' },
                { l: 'ОГЭ Английский с ИИ', u: 'https://t.me/OGE_ENG_HELPER_BOT', d: 'Сдайте ОГЭ на 5' },
                { l: 'IELTS Expert', u: 'https://t.me/IELTS_berdiyev_bot', d: 'IELTS легко' },
                { l: 'TOEFL Expert', u: 'https://t.me/TOBEENG_TOEFL_IBT_BOT', d: 'TOEFL 100+' },
                { l: 'Боб — Английский с ИИ', u: 'https://t.me/Tobeeng_GPT_bot', d: 'Научит говорить за 3 месяца' },
              ].map(b => (
                <a key={b.l} href={b.u} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-violet-50 group border border-transparent hover:border-violet-100 transition-colors">
                  <div><div className="font-bold text-stone-800 text-sm group-hover:text-violet-700">{b.l}</div><div className="text-xs text-stone-500">{b.d}</div></div>
                  <ExternalLink size={16} className="text-stone-300 group-hover:text-violet-500 shrink-0" />
                </a>
              ))}
            </div>
            <div className="h-px bg-stone-200 my-4" />
            <div className="space-y-3">
              <button onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm">ℹ️ О приложении</button>
              <button onClick={() => { setIsMenuOpen(false); onOpenSettings(); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700 text-sm"><Settings size={18} /> Сбросить прогресс</button>
              <a href="https://berdiyev-eng.ru" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-violet-600 text-white font-bold text-sm"><Gift size={18} /> Бесплатный урок</a>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="О приложении BEMAT">
        <div className="space-y-4">
          <p className="text-stone-700 leading-relaxed"><strong>BEMAT</strong> — быстрые ссылки на лучшие бесплатные сервисы для изучения английского.</p>
          <ul className="space-y-2 text-sm text-stone-600">
            {['Курсы и боты для подготовки к экзаменам', 'Чтение книг и новостей с переводом', 'Видео: фильмы, аудирование, лексика', 'Грамматика и перевод предложений', 'Разговорная практика и изучение слов'].map(t => (
              <li key={t} className="flex items-start gap-2"><span className="text-violet-500">•</span><span>{t}</span></li>
            ))}
          </ul>
          <Button onClick={() => setIsAboutOpen(false)} className="w-full !py-3">Понятно!</Button>
        </div>
      </Modal>

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Поддержать проект">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"><Heart size={40} className="text-white fill-white" /></div>
          <p className="text-stone-600 mb-6 text-sm">BEMAT — бесплатный проект. Ваша поддержка помогает Бобу кушать и развивать приложение!</p>
          <div className="space-y-3">
            <Button href="https://pay.cloudtips.ru/p/8f56d7d3" className="w-full !py-3">Поддержать</Button>
            <Button variant="ghost" href="https://t.me/+NvMX2DrTa3w1NTVi" className="w-full">Telegram канал</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// --- ПАНЕЛИ ---

const HomePanel = ({ onNavigate }: { onNavigate: (tab: string) => void }) => {
  const CARDS = [
    { title: "Бесплатные курсы", desc: "Бесплатные курсы по английскому в одном месте", icon: GraduationCap, color: "text-blue-500", action: () => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Боты и материалы", desc: "Боты для экзаменов и разговорной практики", icon: Bot, color: "text-violet-500", action: () => document.getElementById('bots')?.scrollIntoView({ behavior: 'smooth' }) },
    { title: "Чтение", desc: "Читайте книги с переводом", icon: Book, color: "text-emerald-500", action: () => onNavigate('books') },
    { title: "Видео", desc: "Фильмы и аудирование", icon: Film, color: "text-rose-500", action: () => onNavigate('video') },
    { title: "Грамматика", desc: "Более 150 уроков грамматики", icon: PenTool, color: "text-amber-500", action: () => onNavigate('practice') },
    { title: "Разговор", desc: "Практика с реальными людьми", icon: Mic, color: "text-cyan-500", action: () => onNavigate('speak') },
  ];
  return (
    <div className="pb-24 space-y-8 pt-4 px-4">
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map(c => (
          <div key={c.title} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-3">
            <div className={cn("p-2.5 rounded-xl bg-stone-50", c.color)}><c.icon size={28} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-stone-900 text-sm leading-tight mb-1">{c.title}</h3>
              <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{c.desc}</p>
            </div>
            <button onClick={c.action} className="mt-2 w-full py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 shadow-sm shadow-violet-200 active:scale-95 transition-transform">Перейти</button>
          </div>
        ))}
      </div>

      <div id="courses" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1"><GraduationCap className="text-violet-600" /><h2 className="text-xl font-bold text-stone-900">Бесплатные курсы</h2></div>
        <MediaRow title="Плейлист‑курсы в TG" desc="Подборка курсов под каждый уровень. Всё бесплатно." img="https://static.tildacdn.info/tild3534-3233-4463-a134-346339623162/7A7E2857-CCF4-42C5-A.jpeg" link="https://t.me/to_be_eng/190" btnText="Открыть" />
        <MediaRow title="Lingust — с нуля" desc="Пошаговый курс с нуля: объяснения + практика." img="https://static.tildacdn.info/tild3662-6262-4237-b766-646237396666/52B5C22F-AAA2-4AF7-8.jpeg" link="https://lingust.ru/english/english-lessons" btnText="Открыть" />
      </div>

      <div id="bots" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1"><Bot className="text-violet-600" /><h2 className="text-xl font-bold text-stone-900">Боты и материалы</h2></div>
        <MediaRow title="ЕГЭ Английский с ИИ" desc="План, объяснения, стратегии, проверка заданий и Speaking. 80+ баллов" img="https://bemat.ru/egeai.jpg" link="https://t.me/EGE_ENGLISH_GPT_bot" btnText="Попробовать" />
        <MediaRow title="ОГЭ Английский с ИИ" desc="План, объяснения, стратегии, проверка заданий и Speaking." img="https://bemat.ru/ogeai.jpg" link="https://t.me/OGE_ENG_HELPER_BOT" btnText="Попробовать" />
        <MediaRow title="IELTS эксперт" desc="Academic/General: стратегия, критерии." img="https://static.tildacdn.info/tild3532-3932-4635-a261-306563383261/11.jpg" link="https://t.me/IELTS_berdiyev_bot" btnText="Попробовать" />
        <MediaRow title="TOEFL iBT эксперт" desc="План, практика, разбор критериев." img="https://static.tildacdn.info/tild3936-3366-4461-a139-656230353061/10.jpg" link="https://t.me/TOBEENG_TOEFL_IBT_BOT" btnText="Попробовать" />
        <MediaRow title="ЕГЭ материалы" desc="Лексика, грамматика, шаблоны, тренажёры." img="https://bemat.ru/egemat.jpg" link="https://t.me/tobeeng_ege_bot" btnText="Открыть" />
        <MediaRow title="Боб — Английский с ИИ" desc="Личный репетитор в телефоне. Заговори за 3 месяца" img="https://bemat.ru/bobai.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
      </div>

      <div className="mt-12 pt-8 border-t border-stone-200">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg shadow-stone-100/50">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
              <img src="https://static.tildacdn.info/tild6137-3239-4731-b932-343437323234/__1.jpg" alt="Абдуррахим Бердиев" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {['TEFL', 'Уровень C2', '100+ учеников', 'Автор BEMAT'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold border border-stone-200">{tag}</span>
                ))}
              </div>
              <h3 className="text-2xl font-black text-stone-900 mb-3">Об авторе</h3>
              <p className="text-stone-600 leading-relaxed mb-4">Я — Абдуррахим Бердиев. Помогаю заговорить на английском, снимаю барьер и объясняю грамматику простыми схемами. Готовлю к ЕГЭ/ОГЭ и международным экзаменам (IELTS/TOEFL).</p>
              <ul className="space-y-2 mb-6 text-sm text-stone-600">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /><span>Разговорная практика и уверенность в речи</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /><span>Грамматика без лишней теории</span></li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500 flex-shrink-0" /><span>Экзамены: стратегии, Speaking/Writing</span></li>
              </ul>
              <Button href="https://berdiyev-eng.ru" className="w-full !py-3 !bg-stone-900 !text-white text-base shadow-xl">Бесплатный урок английского</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BooksPanel = () => (
  <div className="pb-24 pt-4 px-4">
    <Accordion title="Читать на английском" defaultOpen={true}>
      <MediaRow title="2books.su" desc="Книги в оригинале и адаптированные + перевод." img="https://static.tildacdn.info/tild3539-6535-4239-b735-666530633965/1.jpg" link="https://2books.su/" />
      <MediaRow title="Linguasaur" desc="Книги по уровням, заметки и перевод." img="https://optim.tildacdn.pub/tild6263-3964-4535-b234-303234656665/-/format/webp/3.png.webp" link="https://linguasaur.com/ru/en/books" />
      <MediaRow title="AnyLang" desc="Чтение, карточки слов и перевод." img="https://static.tildacdn.info/tild3564-3631-4036-b636-623266636266/2.png" link="https://anylang.net/ru/books/en" />
      <MediaRow title="Breaking News English" desc="Новости с заданиями и лексикой." img="https://static.tildacdn.info/tild3161-3861-4234-b362-613030653564/2.jpg" link="https://breakingnewsenglish.com/" />
    </Accordion>
  </div>
);

const VideoPanel = () => (
  <div className="pb-24 pt-4 px-4">
    <Accordion title="Фильмы и сериалы" defaultOpen={true}>
      <MediaRow title="Inoriginal" desc="Двойные субтитры EN/RU." img="https://static.tildacdn.info/tild3336-3030-4964-b966-303862353932/10.jpg" link="https://inoriginal.net/" />
      <MediaRow title="Solarmovies" desc="Кино без рекламы." img="https://static.tildacdn.info/tild3036-3665-4436-b131-396638313261/ADB9F47D-E5AA-479B-A.jpeg" link="https://solarmovies.ms/home" />
      <MediaRow title="HDRezka" desc="Переключи озвучку на EN." img="https://static.tildacdn.info/tild3639-6237-4435-b338-373633663331/IMG_7903.PNG" link="https://hdrezka.fans/" />
      <MediaRow title="Zetflix" desc="Запасной ресурс." img="https://static.tildacdn.info/tild3430-6262-4238-b332-343464626162/11.jpg" link="https://go.zetflix-online.lol/" />
    </Accordion>
    <Accordion title="Аудирование">
      <MediaRow title="Listen in English" desc="Уроки по уровням с аудированием." img="https://static.tildacdn.info/tild3636-3261-4532-b231-626664646132/BA22E78D-3200-4109-8.jpeg" link="https://listeninenglish.com/index.php" />
      <MediaRow title="iSLCollective (видео)" desc="Видео‑уроки по фильмам, сериалам." img="https://static.tildacdn.info/tild3836-3837-4331-b162-623335363239/12.jpg" link="https://en.islcollective.com/english-esl-video-lessons/search" />
    </Accordion>
    <Accordion title="Лексика">
      <MediaRow title="TED‑Ed" desc="Короткие уроки с лексикой." img="https://static.tildacdn.info/tild6339-3537-4662-a130-303765373530/IMG_7745.PNG" link="https://ed.ted.com/lessons" />
      <MediaRow title="6 Minute English" desc="Короткие уроки от BBC." img="https://static.tildacdn.info/tild3864-3339-4639-b030-653330343666/IMG_7746.PNG" link="https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" />
    </Accordion>
  </div>
);

const PracticePanel = () => (
  <div className="pb-24 pt-4 px-4">
    <Accordion title="Грамматика" defaultOpen={true}>
      <MediaRow title="Bewords.ru" desc="Более 150 уроков грамматики." img="https://bemat.ru/bewordsgram.jpg" link="https://bewords.ru/" btnText="Открыть" />
      <MediaRow title="Test‑English" desc="Грамматика и лексика от A1 до B2." img="https://static.tildacdn.info/tild3131-3437-4330-a633-393162336665/4.jpg" link="https://test-english.com/grammar-points/" />
      <MediaRow title="Lingust — грамматика" desc="148 уроков с объяснениями." img="https://optim.tildacdn.pub/tild3062-6233-4431-b363-353163363163/-/format/webp/0D4BE37D-2FBF-4950-8.jpeg.webp" link="https://lingust.ru/english/grammar" />
    </Accordion>
    <Accordion title="Перевод предложений">
      <MediaRow title="RU → EN тренажёр" desc="Отработка грамматики через перевод." img="https://static.tildacdn.info/tild6435-3633-4265-b966-313030633165/photo.PNG" link="https://bemat.ru/collect.html" btnText="Открыть тренажёр" />
    </Accordion>
  </div>
);

const SpeakPanel = () => (
  <div className="pb-24 pt-4 px-4">
    <Accordion title="Разговорная практика" defaultOpen={true}>
      <MediaRow title="Боб — Английский с ИИ" desc="Поговорит с вами голосом, поправит ошибки." img="https://bemat.ru/bobai.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
      <MediaRow title="HelloTalk" desc="Общение с носителями со всего мира." img="https://static.tildacdn.info/tild6631-3338-4435-b966-313430333161/_____2.jpg" link="https://www.hellotalk.com/ru" />
      <MediaRow title="Character.AI" desc="Бесплатный разговор с ИИ (EN)." img="https://static.tildacdn.info/tild6435-6666-4139-a237-396664643764/_____3.jpg" link="https://character.ai/" />
    </Accordion>
    <Accordion title="Учить слова">
      <MediaRow title="Bewords" desc="Учите слова прямо на сайте." img="https://bemat.ru/bewordswords.jpg" link="https://bewords.ru/" />
      <MediaRow title="EnglSpace" desc="Слова через ассоциации." img="https://static.tildacdn.info/tild3462-3164-4432-b633-316131343833/BEE2697D-A7E6-43D6-9.jpeg" link="https://t.me/English_Mnemo_Bot" />
    </Accordion>
  </div>
);

// --- НАВИГАЦИЯ ---

const NavBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-violet-600" : "text-stone-400 hover:text-stone-600")}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} className={cn("transition-all", active && "scale-110")} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);

// --- APP ---

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserState | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showStreakPopup, setShowStreakPopup] = useState(false);
  const streakPopupScheduled = useRef(false);

  // Загрузка
  useEffect(() => {
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

        // Новый день
        if (todayStr !== last.toDateString()) {
          newCompleted = [];
          newCatFed = false;
          if (diff <= 1) newStreak += 1;
          else newStreak = 1;
        }

        const updated: UserState = {
          ...parsed,
          streak: newStreak,
          lastVisit: today.toISOString(),
          completedTasks: newCompleted,
          catFed: newCatFed,
          customTasks: parsed.customTasks || [],
          streakShownDate: parsed.streakShownDate || '',
        };

        setUser(updated);
        localStorage.setItem('bemat_user_v3', JSON.stringify(updated));

        // Показать стрик попап если не показывали сегодня
        if (updated.streakShownDate !== todayStr && !streakPopupScheduled.current) {
          streakPopupScheduled.current = true;
          setTimeout(() => setShowStreakPopup(true), 600);
        }
      } catch {
        localStorage.removeItem('bemat_user_v3');
      }
    }
  }, []);

  const handleOnboarding = (name: string, goal: UserGoal) => {
    const newUser: UserState = {
      name, goal, streak: 1, lastVisit: new Date().toISOString(),
      completedTasks: [], customTasks: [], notificationsEnabled: false,
      isOnboarded: true, catFed: false, streakShownDate: '',
    };
    setUser(newUser);
    localStorage.setItem('bemat_user_v3', JSON.stringify(newUser));

    // Показать стрик «зародился» после онбординга
    setTimeout(() => setShowStreakPopup(true), 800);
  };

  const updateUser = (u: UserState) => {
    setUser(u);
    localStorage.setItem('bemat_user_v3', JSON.stringify(u));
  };

  const resetProgress = () => {
    localStorage.removeItem('bemat_user_v3');
    setUser(null);
    setShowResetConfirm(false);
    setActiveTab('dashboard');
    streakPopupScheduled.current = false;
  };

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  };

  const closeStreakPopup = () => {
    setShowStreakPopup(false);
    if (user) {
      const updated = { ...user, streakShownDate: new Date().toDateString() };
      updateUser(updated);
    }
  };

  if (!user) return <Onboarding onComplete={handleOnboarding} />;

  const handleBack = () => setActiveTab('dashboard');
  const BackButton = () => (
    <div className="px-4 pt-4">
      <button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2 hover:text-violet-600 transition-colors">
        <ArrowRight className="rotate-180" size={18} /> Назад
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 pb-20 selection:bg-violet-200">
      <Sponsors />
      <Header onNavigate={handleNavigate} onOpenSettings={() => setShowResetConfirm(true)} />

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

      <InstallPrompt />

      {/* Попап стрика */}
      <StreakPopup isOpen={showStreakPopup} onClose={closeStreakPopup} streak={user.streak} />

      {/* Сброс */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Сбросить прогресс?">
        <div className="text-center space-y-4">
          <p className="text-stone-600">Все данные (имя, цель, стрик, задания) будут удалены.</p>
          <Button onClick={resetProgress} className="w-full !bg-red-500 !text-white !shadow-red-200">Сбросить</Button>
          <Button variant="ghost" onClick={() => setShowResetConfirm(false)} className="w-full">Отмена</Button>
        </div>
      </Modal>
    </div>
  );
}
