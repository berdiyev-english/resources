import React, { useState, useEffect } from 'react';
import logo from './logo.png'; 
import { Sponsors } from './Sponsors';
import { InstallPrompt } from './InstallPrompt';
import { 
  Home, PenTool, Heart, Menu, X, ChevronDown, ExternalLink, 
  GraduationCap, Bot, Book, Film, CheckCircle, Mic, Gift, 
  Flame, Bell, Settings, Trophy, ArrowRight, CheckCircle2
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- ТИПЫ ДАННЫХ ДЛЯ ЛИЧНОГО КАБИНЕТА ---
type UserGoal = 'ege' | 'oge' | 'speak' | 'fun';

interface UserState {
  name: string;
  goal: UserGoal;
  streak: number;
  lastVisit: string;
  completedTasks: string[];
  notificationsEnabled: boolean;
  isOnboarded: boolean;
}

// --- ЗАДАНИЯ ПОД ЦЕЛИ (С ТВОИМИ ССЫЛКАМИ) ---
const DAILY_TASKS = {
  ege: [
    { id: 't1', title: 'Решить вариант ЕГЭ', link: 'https://en-ege.sdamgia.ru/', isExternal: true },
    { id: 't2', title: 'Повторить грамматику', link: 'https://bewords.ru/', isExternal: true },
    { id: 't3', title: 'Материалы и шаблоны', link: '#bots', isExternal: false } // Внутри приложения
  ],
  oge: [
    { id: 't1', title: 'Решить вариант ОГЭ', link: 'https://en-oge.sdamgia.ru/', isExternal: true },
    { id: 't2', title: 'Учить слова (Bewords)', link: 'https://bewords.ru/', isExternal: true },
    { id: 't3', title: 'Бот-помощник ОГЭ', link: '#bots', isExternal: false }
  ],
  speak: [
    { id: 't4', title: 'Разговор с ИИ Бобом', link: 'https://t.me/Tobeeng_GPT_bot', isExternal: true },
    { id: 't5', title: 'Учить 10 слов (Bewords)', link: 'https://bewords.ru/', isExternal: true },
  ],
  fun: [
    { id: 't6', title: 'Посмотреть видео/сериал', link: '#video', isExternal: false },
    { id: 't7', title: 'Прочитать главу книги', link: '#books', isExternal: false },
  ]
};

// --- UI COMPONENTS (Кнопки, Модалки) ---

const Button = ({ children, className, variant = 'primary', href, onClick, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-transform no-underline cursor-pointer select-none active:scale-95";
  
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200 border border-transparent",
    ghost: "bg-transparent text-stone-600 hover:bg-stone-100 border border-stone-200",
    menu: "bg-white text-stone-800 hover:bg-stone-50 border border-stone-100 justify-start"
  };

  const Comp = href ? 'a' : 'button';
  
  return (
    <Comp 
      href={href}
      onClick={onClick}
      className={cn(baseStyles, variants[variant as keyof typeof variants], className)}
      {...props}
    >
      {children}
    </Comp>
  );
};

const Modal = ({ isOpen, onClose, title, children }: any) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 text-stone-500">
            <X size={20} />
          </button>
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 transition-none text-left"
        >
          <span className="text-lg font-bold text-stone-900">{title}</span>
          <div className={cn("p-1.5 rounded-full bg-stone-100 text-stone-500 transition-none", isOpen && "bg-violet-100 text-violet-600")}>
            <ChevronDown size={20} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
          </div>
        </button>
        {isOpen && <div className="p-4 pt-0 border-t border-stone-100">{children}</div>}
      </div>
    </div>
  );
};

// --- ИСПРАВЛЕННЫЙ MEDIA ROW (ДЛЯ ТЕЛЕФОНОВ) ---
const MediaRow = ({ title, desc, img, link, btnText = "Перейти" }: any) => (
  <div className="flex flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-2xl border border-stone-100 shadow-sm mb-3 last:mb-0 hover:border-violet-200 transition-colors items-start sm:items-center">
    
    {/* Картинка: всегда слева, квадратная */}
    <div className="w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 bg-stone-50 rounded-xl overflow-hidden relative border border-stone-100">
      <img 
        src={img} 
        alt={title} 
        className="w-full h-full object-cover" 
        onError={(e: any) => { e.target.src = 'https://via.placeholder.com/150?text=IMAGE'; }} 
      />
    </div>

    {/* Контент: справа */}
    <div className="flex-1 flex flex-col justify-between min-h-[5rem] py-0.5">
      <div>
        <h4 className="text-sm sm:text-base font-bold text-stone-900 leading-tight mb-1 line-clamp-2">{title}</h4>
        <p className="text-xs text-stone-500 leading-snug mb-2 line-clamp-2">{desc}</p>
      </div>
      
      <div>
        <Button href={link} className="py-1.5 px-4 text-xs !bg-violet-600 !text-white shadow-sm hover:!bg-violet-700 w-auto rounded-lg">
          {btnText}
        </Button>
      </div>
    </div>
  </div>
);

// --- КОМПОНЕНТЫ НОВОЙ ЛОГИКИ (ОНБОРДИНГ И ДАШБОРД) ---

const Onboarding = ({ onComplete }: { onComplete: (name: string, goal: UserGoal) => void }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal>('fun');

  return (
    <div className="fixed inset-0 z-[60] bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center">
      {/* Аватарка кота Боба */}
      <div className="w-32 h-32 rounded-full overflow-hidden mb-6 shadow-xl border-4 border-white animate-pulse">
        <img src={logo} alt="Bob" className="w-full h-full object-cover" />
      </div>
      
      {step === 1 && (
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-black text-stone-800 mb-2">Привет! Я Боб 🐱</h1>
          <p className="text-stone-600 mb-8 text-lg">Помогу тебе выучить английский. Как тебя зовут?</p>
          <input 
            type="text" 
            placeholder="Твое имя..." 
            className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4 shadow-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button 
            disabled={!name.trim()}
            onClick={() => setStep(2)}
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 hover:scale-[1.02] transition-transform shadow-lg shadow-violet-200"
          >
            Дальше
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">{name}, какая у тебя цель?</h2>
          <p className="text-stone-500 mb-6">Я составлю план занятий для тебя.</p>
          
          <div className="space-y-3 mb-8">
            {[
              { id: 'ege', label: 'Сдать ЕГЭ', icon: '🔥' },
              { id: 'oge', label: 'Сдать ОГЭ', icon: '🎓' },
              { id: 'speak', label: 'Говорить свободно', icon: '🗣' },
              { id: 'fun', label: 'Для себя / Фильмы', icon: '🍿' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setGoal(opt.id as UserGoal)}
                className={cn(
                  "w-full p-4 rounded-2xl flex items-center gap-3 border-2 transition-all text-left",
                  goal === opt.id ? "border-violet-600 bg-violet-50" : "border-white bg-white shadow-sm"
                )}
              >
                <span className="text-2xl">{opt.icon}</span>
                <span className="font-bold text-stone-800">{opt.label}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => onComplete(name, goal)}
            className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl hover:scale-[1.02] transition-transform shadow-lg shadow-violet-200"
          >
            Создать план 🚀
          </button>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, onUpdateUser, onNavigate }: any) => {
  const tasks = DAILY_TASKS[user.goal as UserGoal] || DAILY_TASKS.fun;
  const progress = Math.round((user.completedTasks.length / tasks.length) * 100);

  const toggleTask = (taskId: string) => {
    const isCompleted = user.completedTasks.includes(taskId);
    let newCompleted;
    if (isCompleted) {
      newCompleted = user.completedTasks.filter((id: string) => id !== taskId);
    } else {
      newCompleted = [...user.completedTasks, taskId];
    }
    onUpdateUser({ ...user, completedTasks: newCompleted });
  };

  const requestNotification = async () => {
    if (!("Notification" in window)) {
      alert("Твой браузер не поддерживает уведомления");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      onUpdateUser({ ...user, notificationsEnabled: true });
      new Notification("Привет от Боба! 🐱", {
        body: "Я буду напоминать тебе заниматься английским!",
        icon: logo
      });
    }
  };

  // Обработчик клика по стрелке задачи
  const handleTaskLink = (e: React.MouseEvent, task: any) => {
    e.stopPropagation();
    if (task.isExternal) {
      window.open(task.link, '_blank');
    } else {
      // Внутренняя навигация
      const section = task.link.replace('#', '');
      if (['books', 'video', 'practice', 'speak'].includes(section)) {
        onNavigate(section);
      } else {
        // Если это якорь внутри (например #bots), переходим на HomePanel и скроллим
        onNavigate('home');
        setTimeout(() => {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Приветствие */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">Личный кабинет</p>
          <h1 className="text-2xl font-black text-stone-800">Привет, {user.name} 👋</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
          <Flame className={cn("w-5 h-5", user.streak > 0 ? "text-orange-500 fill-orange-500" : "text-stone-300")} />
          <span className="font-bold text-stone-800">{user.streak} дн.</span>
        </div>
      </div>

      {/* План на сегодня */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-stone-100 relative overflow-hidden">
        {/* Прогресс бар */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
          <div className="h-full bg-violet-500 transition-all duration-500 rounded-r-full" style={{ width: `${progress}%` }}></div>
        </div>
        
        <div className="flex justify-between items-start mb-6 mt-2">
          <div>
            <h2 className="text-xl font-bold text-stone-900">План на сегодня</h2>
            <p className="text-stone-500 text-sm">Выполнено: {progress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-2xl animate-bounce">
            {progress === 100 ? '🎉' : '🐱'}
          </div>
        </div>

        <div className="space-y-3">
          {tasks.map((task: any) => {
            const isDone = user.completedTasks.includes(task.id);
            return (
              <div 
                key={task.id}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                  isDone ? "bg-stone-50 border-transparent opacity-60" : "bg-white border-stone-100 hover:border-violet-200 shadow-sm"
                )}
                onClick={() => toggleTask(task.id)}
              >
                <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border transition-colors shrink-0", isDone ? "bg-violet-500 border-violet-500" : "border-stone-300")}>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <span className={cn("flex-1 font-bold text-sm text-stone-700", isDone && "line-through text-stone-400")}>
                  {task.title}
                </span>
                {!isDone && (
                   <button onClick={(e) => handleTaskLink(e, task)} className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg">
                     <ArrowRight size={16} />
                   </button>
                )}
              </div>
            )
          })}
        </div>
        
        {progress === 100 && (
           <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center">
             Отличная работа! Боб гордится тобой 😸
           </div>
        )}
      </div>

      {/* Уведомления */}
      {!user.notificationsEnabled && (
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-[2rem] p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-1">Напоминалки</h3>
            <p className="text-violet-100 text-sm mb-4">Боб напомнит тебе позаниматься, чтобы не потерять стрик.</p>
            <button 
              onClick={requestNotification}
              className="px-5 py-2.5 bg-white text-violet-700 font-bold rounded-xl text-sm hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <Bell size={16} /> Включить
            </button>
          </div>
          <div className="absolute right-[-10px] bottom-[-20px] text-8xl opacity-20 rotate-12">🔔</div>
        </div>
      )}

      {/* Меню категорий */}
      <div>
        <h3 className="font-bold text-stone-800 mb-4 px-1">Библиотека материалов</h3>
        <div className="grid grid-cols-2 gap-3">
          <MenuCard icon={Home} label="Вся подборка" color="bg-slate-100 text-slate-700" onClick={() => onNavigate('home')} />
          <MenuCard icon={Book} label="Книги" color="bg-emerald-100 text-emerald-700" onClick={() => onNavigate('books')} />
          <MenuCard icon={Film} label="Фильмы" color="bg-rose-100 text-rose-700" onClick={() => onNavigate('video')} />
          <MenuCard icon={PenTool} label="Грамматика" color="bg-amber-100 text-amber-700" onClick={() => onNavigate('practice')} />
          <MenuCard icon={Mic} label="Разговор" color="bg-sky-100 text-sky-700" onClick={() => onNavigate('speak')} />
        </div>
      </div>
    </div>
  );
};

const MenuCard = ({ icon: Icon, label, color, onClick }: any) => (
  <button onClick={onClick} className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm flex flex-col items-center gap-2 hover:scale-[1.02] transition-transform active:scale-95">
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-1", color)}>
      <Icon size={24} />
    </div>
    <span className="font-bold text-stone-700 text-sm">{label}</span>
  </button>
);

// --- HEADER (ГЛОБАЛЬНЫЙ) ---
const Header = ({ onNavigate, onOpenSettings }: any) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fafaf9]/90 backdrop-blur-md px-4 py-3 flex justify-between items-center border-b border-stone-100">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2">
          <img src={logo} alt="Bob" className="w-9 h-9 rounded-full bg-stone-200 border border-white shadow-sm" />
          <span className="font-black text-xl tracking-tight text-stone-800">BEMAT</span>
        </button>
        
        <div className="flex items-center gap-3">
           <button 
              onClick={() => setIsSupportOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-amber-50 text-amber-500 border border-amber-100"
            >
              <Gift size={20} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-stone-900 text-white"
            >
              <Menu size={20} />
            </button>
        </div>
      </header>

      {/* Меню (справа) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/20 backdrop-blur-sm flex justify-end">
           <div className="w-72 h-full bg-[#fafaf9] p-6 shadow-2xl animate-in slide-in-from-right duration-300">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-bold text-xl text-stone-900">Меню</h3>
                <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-stone-100 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="space-y-4">
                 <button onClick={() => { setIsMenuOpen(false); onOpenSettings(); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white border border-stone-100 font-bold text-stone-700">
                    <Settings size={20} /> Сбросить прогресс
                 </button>
                 <a href="https://t.me/Berdiyev_eng" target="_blank" className="w-full flex items-center gap-3 p-3 rounded-xl bg-violet-600 text-white font-bold">
                    <Gift size={20} /> Бесплатный урок
                 </a>
              </div>
           </div>
        </div>
      )}

      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Поддержать проект">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-amber-200 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart size={40} className="text-white fill-white animate-pulse" />
          </div>
          <p className="text-stone-600 mb-6 text-sm">
            BEMAT — бесплатный проект. Ваша поддержка помогает Бобу кушать и развивать приложение!
          </p>
          <div className="space-y-3">
            <Button href="https://pay.cloudtips.ru/p/8f56d7d3" className="w-full !py-3">Поддержать</Button>
            <Button variant="ghost" href="https://t.me/+NvMX2DrTa3w1NTVi" className="w-full">Telegram канал</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// --- APP ---

export function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<UserState | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ЗАГРУЗКА
  useEffect(() => {
    const saved = localStorage.getItem('bemat_user_v2');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Логика стрик
      const last = new Date(parsed.lastVisit);
      const today = new Date();
      const diff = Math.floor((today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      
      let newStreak = parsed.streak;
      let newCompleted = parsed.completedTasks;

      // Если новый день
      if (today.toDateString() !== last.toDateString()) {
        newCompleted = []; // Сброс задач
        if (diff <= 1) newStreak += 1; // Увеличиваем стрик
        else newStreak = 1; // Стрик сгорел
      }

      const updated = { ...parsed, streak: newStreak, lastVisit: today.toISOString(), completedTasks: newCompleted };
      setUser(updated);
      localStorage.setItem('bemat_user_v2', JSON.stringify(updated));
    }
  }, []);

  const handleOnboarding = (name: string, goal: UserGoal) => {
    const newUser: UserState = {
      name, goal, streak: 1, lastVisit: new Date().toISOString(),
      completedTasks: [], notificationsEnabled: false, isOnboarded: true
    };
    setUser(newUser);
    localStorage.setItem('bemat_user_v2', JSON.stringify(newUser));
  };

  const updateUser = (u: UserState) => {
    setUser(u);
    localStorage.setItem('bemat_user_v2', JSON.stringify(u));
  };

  const resetProgress = () => {
    localStorage.removeItem('bemat_user_v2');
    setUser(null);
    setShowResetConfirm(false);
  };

  // ЕСЛИ НЕТ ЮЗЕРА -> ОНБОРДИНГ
  if (!user) {
    return <Onboarding onComplete={handleOnboarding} />;
  }

  // ОБЩАЯ ОБЕРТКА ДЛЯ РЕСУРСОВ
  const handleBack = () => setActiveTab('dashboard');

  return (
    <div className="min-h-screen bg-[#fafaf9] font-sans text-stone-900 pb-20 selection:bg-violet-200">
      <Sponsors />
      <Header onNavigate={setActiveTab} onOpenSettings={() => setShowResetConfirm(true)} />

      <main className="max-w-xl mx-auto w-full">
        {activeTab === 'dashboard' && (
          <Dashboard user={user} onUpdateUser={updateUser} onNavigate={setActiveTab} />
        )}
        
        {/* Старые панели с кнопкой Назад */}
        {activeTab === 'home' && (
           <div className="animate-in fade-in slide-in-from-right">
             <div className="px-4 pt-4"><button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2"><ArrowRight className="rotate-180" size={18}/> Назад</button></div>
             <HomePanel onNavigate={setActiveTab} />
           </div>
        )}
        {activeTab === 'books' && (
           <div className="animate-in fade-in slide-in-from-right">
             <div className="px-4 pt-4"><button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2"><ArrowRight className="rotate-180" size={18}/> Назад</button></div>
             <BooksPanel />
           </div>
        )}
        {activeTab === 'video' && (
           <div className="animate-in fade-in slide-in-from-right">
             <div className="px-4 pt-4"><button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2"><ArrowRight className="rotate-180" size={18}/> Назад</button></div>
             <VideoPanel />
           </div>
        )}
        {activeTab === 'practice' && (
           <div className="animate-in fade-in slide-in-from-right">
             <div className="px-4 pt-4"><button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2"><ArrowRight className="rotate-180" size={18}/> Назад</button></div>
             <PracticePanel />
           </div>
        )}
        {activeTab === 'speak' && (
           <div className="animate-in fade-in slide-in-from-right">
             <div className="px-4 pt-4"><button onClick={handleBack} className="flex items-center gap-2 text-stone-500 font-bold mb-2"><ArrowRight className="rotate-180" size={18}/> Назад</button></div>
             <SpeakPanel />
           </div>
        )}
      </main>

      {/* НИЖНЕЕ МЕНЮ (НАВИГАЦИЯ) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-stone-200 px-6 pb-safe z-50 rounded-t-[1.5rem] shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center max-w-lg mx-auto h-[70px]">
          <NavBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={Home} label="Кабинет" />
          <NavBtn active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={GraduationCap} label="Ресурсы" />
          <NavBtn active={activeTab === 'books'} onClick={() => setActiveTab('books')} icon={Book} label="Книги" />
          <NavBtn active={activeTab === 'video'} onClick={() => setActiveTab('video')} icon={Film} label="Видео" />
        </div>
      </nav>

      <InstallPrompt />

      {/* Модалка сброса (для отладки или если юзер хочет сменить имя) */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Сбросить прогресс?">
         <div className="text-center space-y-4">
            <p className="text-stone-600">Все данные (имя, цель, стрик) будут удалены. Вы начнете заново.</p>
            <Button onClick={resetProgress} className="w-full !bg-red-500 !text-white !shadow-red-200">Сбросить</Button>
         </div>
      </Modal>
    </div>
  );
}

const NavBtn = ({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={cn("flex flex-col items-center gap-1 transition-colors", active ? "text-violet-600" : "text-stone-400 hover:text-stone-600")}>
    <Icon size={24} strokeWidth={active ? 2.5 : 2} className={cn("transition-all", active && "scale-110")} />
    <span className="text-[10px] font-bold">{label}</span>
  </button>
);
