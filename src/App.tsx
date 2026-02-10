import { useState, useEffect } from 'react';
import myLogo from './logo.png'; 
import { Sponsors } from './Sponsors';
import { InstallPrompt } from './InstallPrompt';
import { 
  Home, PenTool, Heart, Menu, X, ChevronDown, ExternalLink, GraduationCap, Bot, Book, Film, CheckCircle, Mic
} from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- UI Components ---

const Button = ({ children, className, variant = 'primary', href, onClick, ...props }: any) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-none no-underline cursor-pointer select-none active:scale-95";
  
  const variants = {
    primary: "bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-200 border border-transparent",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200",
    menu: "bg-white text-slate-800 hover:bg-slate-50 border border-slate-100 justify-start"
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
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
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-none text-left"
        >
          <span className="text-lg font-bold text-slate-900">{title}</span>
          <div className={cn("p-1.5 rounded-full bg-slate-100 text-slate-500 transition-none", isOpen && "bg-violet-100 text-violet-600")}>
            <ChevronDown size={20} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
          </div>
        </button>
        {isOpen && <div className="p-4 pt-0 border-t border-slate-100">{children}</div>}
      </div>
    </div>
  );
};

const MediaRow = ({ title, desc, img, link, btnText = "Перейти" }: any) => (
  <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-xl border border-slate-100 shadow-sm mb-3 last:mb-0 hover:border-violet-200 transition-colors">
    <div className="w-full sm:w-32 aspect-video sm:aspect-square flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden relative">
      <img src={img} alt={title} className="w-full h-full object-cover" onError={(e: any) => { e.target.src = 'https://via.placeholder.com/150?text=IMAGE'; }} />
    </div>
    <div className="flex-1 flex flex-col justify-center">
      <h4 className="text-lg font-bold text-slate-900 leading-tight mb-1.5">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
      <div>
        <Button href={link} className="w-full sm:w-auto !py-2 !bg-violet-600 !text-white !shadow-none hover:!bg-violet-700">
          {btnText}
        </Button>
      </div>
    </div>
  </div>
);

// --- Header ---

const Header = ({ onNavigate }: any) => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4 py-3">
          <button onClick={() => onNavigate('home')} className="text-2xl font-black tracking-tighter text-slate-900 flex items-center gap-2">
            
            {/* ЛОГОТИП — ИСПРАВЛЕННЫЙ ПУТЬ */}
<img 
  src={myLogo}  // <-- Используем переменную, а не путь текстом
  alt="Logo" 
  className="w-10 h-10 rounded-lg object-cover bg-slate-100" 
/>
            BEMAT
          </button>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSupportOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 active:scale-95 transition-transform"
            >
              <Heart size={22} className="fill-current" />
            </button>
            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition-transform"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
              
              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 top-12 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 flex flex-col gap-1">
                    <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">AI Помощники</div>
                    {[
                      { l: 'EGE Assistant', u: 'https://t.me/EGE_ENGLISH_GPT_bot', d: '80+ баллов' },
                      { l: 'OGE Helper', u: 'https://t.me/OGE_ENG_HELPER_BOT', d: 'Сдать на 5' },
                      { l: 'IELTS Expert', u: 'https://t.me/IELTS_berdiyev_bot', d: 'Band 7+' },
                      { l: 'TOEFL Expert', u: 'https://t.me/TOBEENG_TOEFL_IBT_BOT', d: 'Стратегии' },
                      { l: 'TO BE ENG GPT', u: 'https://t.me/Tobeeng_GPT_bot', d: 'Репетитор' },
                    ].map((b) => (
                      <a key={b.l} href={b.u} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-violet-50 group border border-transparent hover:border-violet-100 transition-colors">
                        <div>
                          <div className="font-bold text-slate-800 text-sm group-hover:text-violet-700">{b.l}</div>
                          <div className="text-xs text-slate-500">{b.d}</div>
                        </div>
                        <ExternalLink size={16} className="text-slate-300 group-hover:text-violet-500" />
                      </a>
                    ))}
                    <div className="h-px bg-slate-100 my-1" />
                    <button 
                      onClick={() => { setIsMenuOpen(false); setIsAboutOpen(true); }}
                      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-sm text-slate-800"
                    >
                      ℹ️ О приложении
                    </button>
                    <a 
                      href="https://t.me/Berdiyev_eng"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: '#7c3aed', color: '#ffffff' }}
                      className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-bold text-sm shadow-md"
                    >
                      🎁 Бесплатный урок
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* About App Modal */}
      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="О приложении BEMAT">
        <div className="space-y-4">
          <p className="text-slate-700 leading-relaxed">
            <strong>BEMAT</strong> — это быстрые ссылки на лучшие бесплатные сервисы для изучения английского языка.
          </p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Курсы и боты для подготовки к экзаменам</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Чтение книг и новостей с переводом</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Видео: фильмы, аудирование, лексика</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Грамматика и перевод предложений</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-violet-500">•</span>
              <span>Разговорная практика и изучение слов</span>
            </li>
          </ul>
          <Button onClick={() => setIsAboutOpen(false)} className="w-full !py-3">
            Понятно!
          </Button>
        </div>
      </Modal>

      {/* Support Modal */}
      <Modal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} title="Поддержать проект">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Heart size={40} className="text-red-500 fill-red-500" />
          </div>
          <p className="text-slate-800 text-lg font-medium mb-6 leading-relaxed">
            Это очень нужно и важно, иначе проекту хана... 🥺 <br/>
            <span className="text-sm text-slate-500 font-normal mt-2 block">Поддержите развитие BEMAT любой суммой.</span>
          </p>
          <div className="space-y-3">
            <Button href="https://pay.cloudtips.ru/p/8f56d7d3" className="w-full !py-3 !text-base !bg-slate-900 !text-white shadow-xl shadow-slate-200">
              Поддержать рублем
            </Button>
            <Button variant="ghost" href="https://t.me/+NvMX2DrTa3w1NTVi" className="w-full">
              Telegram‑канал
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// --- Bottom Nav ---

const TABS = [
  { id: 'home', icon: Home, label: 'Домой' },
  { id: 'books', icon: Book, label: 'Книги' },
  { id: 'video', icon: Film, label: 'Видео' },
  { id: 'practice', icon: PenTool, label: 'Практика' },
  { id: 'speak', icon: Mic, label: 'Разговор' },
] as const;

const BottomNav = ({ activeTab, onTabChange }: any) => (
  <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 pb-[env(safe-area-inset-bottom,0px)] z-50">
    <div className="flex justify-between items-center max-w-lg mx-auto h-[64px]">
      {TABS.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full gap-1 active:scale-90 transition-transform",
              isActive ? "text-violet-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn("p-1 rounded-full", isActive && "bg-violet-50")}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "fill-violet-200" : ""} />
            </div>
            <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </div>
  </nav>
);

// --- Panels ---

const HomePanel = ({ onNavigate }: any) => {
  const CARDS = [
    { title: "Бесплатные курсы", desc: "YouTube‑курсы + Lingust", icon: GraduationCap, color: "text-blue-500", action: () => { document.getElementById('courses')?.scrollIntoView({behavior:'smooth'}) } },
    { title: "Боты и материалы", desc: "ЕГЭ, ОГЭ, IELTS, GPT", icon: Bot, color: "text-violet-500", action: () => { document.getElementById('bots')?.scrollIntoView({behavior:'smooth'}) } },
    { title: "Чтение", desc: "Книги с переводом", icon: Book, color: "text-emerald-500", action: () => onNavigate('books') },
    { title: "Видео", desc: "Фильмы и аудирование", icon: Film, color: "text-rose-500", action: () => onNavigate('video') },
    { title: "Грамматика", desc: "Тренажёры и тесты", icon: PenTool, color: "text-amber-500", action: () => onNavigate('practice') },
    { title: "Разговор", desc: "HelloTalk, AI, Слова", icon: Mic, color: "text-cyan-500", action: () => onNavigate('speak') },
  ];

  return (
    <div className="pb-24 space-y-8 pt-4">
      {/* Hero Grid */}
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map((c) => (
          <div key={c.title} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start gap-3">
            <div className={cn("p-2.5 rounded-xl bg-slate-50", c.color)}>
              <c.icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">{c.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.desc}</p>
            </div>
            <button 
              onClick={c.action}
              className="mt-2 w-full py-2.5 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 shadow-sm shadow-violet-200 active:scale-95 transition-transform"
            >
              Перейти
            </button>
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <div id="courses" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1">
          <GraduationCap className="text-violet-600" />
          <h2 className="text-xl font-bold text-slate-900">Бесплатные курсы</h2>
        </div>
        <MediaRow title="Плейлист‑курсы в TG" desc="Подборка YouTube‑курсов с пояснениями. Всё бесплатно." img="https://static.tildacdn.info/tild3534-3233-4463-a134-346339623162/7A7E2857-CCF4-42C5-A.jpeg" link="https://t.me/to_be_eng/190" btnText="Открыть" />
        <MediaRow title="Lingust — с нуля" desc="Пошаговый курс для старта: объяснения + практика." img="https://static.tildacdn.info/tild3662-6262-4237-b766-646237396666/52B5C22F-AAA2-4AF7-8.jpeg" link="https://lingust.ru/english/english-lessons" btnText="Открыть" />
      </div>

      {/* Bots Section */}
      <div id="bots" className="scroll-mt-24">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Bot className="text-violet-600" />
          <h2 className="text-xl font-bold text-slate-900">Боты и материалы</h2>
        </div>
        <MediaRow title="EGE ASSISTANT" desc="План, объяснения, стратегии; проверка Speaking." img="https://static.tildacdn.info/tild6436-3766-4232-b064-626263353832/____.jpg" link="https://t.me/EGE_ENGLISH_GPT_bot" btnText="Попробовать" />
        <MediaRow title="OGE HELPER" desc="План подготовки, алгоритмы заданий, проверка." img="https://static.tildacdn.info/tild3932-6233-4638-a231-613534383636/12.jpg" link="https://t.me/OGE_ENG_HELPER_BOT" btnText="Попробовать" />
        <MediaRow title="IELTS эксперт" desc="Academic/General: стратегия, критерии." img="https://static.tildacdn.info/tild3532-3932-4635-a261-306563383261/11.jpg" link="https://t.me/IELTS_berdiyev_bot" btnText="Попробовать" />
        <MediaRow title="TOEFL iBT эксперт" desc="План, практика, разбор критериев." img="https://static.tildacdn.info/tild3936-3366-4461-a139-656230353061/10.jpg" link="https://t.me/TOBEENG_TOEFL_IBT_BOT" btnText="Попробовать" />
        <MediaRow title="ЕГЭ материалы" desc="Лексика, грамматика, шаблоны, тренажёры." img="https://static.tildacdn.info/tild6439-6435-4862-b137-346266376233/9.jpg" link="https://t.me/tobeeng_ege_bot" btnText="Открыть" />
        <MediaRow title="TO BE ENG GPT" desc="Персональный помощник: план, задания." img="https://static.tildacdn.info/tild3566-3038-4238-b863-343131373138/_____1.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
      </div>

      {/* Author */}
      <div className="mt-12 pt-8 border-t border-slate-200">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-lg shadow-slate-100/50">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-48 aspect-[3/4] rounded-2xl overflow-hidden shadow-md">
               <img src="https://static.tildacdn.info/tild6137-3239-4731-b932-343437323234/__1.jpg" alt="Абдуррахим Бердиев" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                {['TEFL', 'Уровень C2', '100+ учеников', 'Автор BEMAT'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">Об авторе</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Я — Абдуррахим Бердиев. Помогаю заговорить на английском, снимаю барьер и объясняю
                грамматику простыми схемами. Готовлю к ЕГЭ/ОГЭ и международным экзаменам (IELTS/TOEFL).
              </p>
              <ul className="space-y-2 mb-6 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Разговорная практика и уверенность в речи</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Грамматика без лишней теории</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                  <span>Экзамены: стратегии, Speaking/Writing</span>
                </li>
              </ul>
              <Button href="https://t.me/Berdiyev_eng" className="w-full !py-3 !bg-slate-900 !text-white text-base shadow-xl">
                Бесплатный урок английского
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BooksPanel = () => (
  <div className="pb-24 pt-4">
    <Accordion title="Читать на английском" defaultOpen={true}>
      <MediaRow title="2books.su" desc="Книги в оригинале и адаптированные + перевод." img="https://static.tildacdn.info/tild3539-6535-4239-b735-666530633965/1.jpg" link="https://2books.su/" />
      <MediaRow title="Linguasaur" desc="Книги по уровням, заметки и перевод." img="https://optim.tildacdn.pub/tild6263-3964-4535-b234-303234656665/-/format/webp/3.png.webp" link="https://linguasaur.com/ru/en/books" />
      <MediaRow title="AnyLang" desc="Чтение, карточки слов и перевод." img="https://static.tildacdn.info/tild3564-3631-4036-b636-623266636266/2.png" link="https://anylang.net/ru/books/en" />
      <MediaRow title="Breaking News English" desc="Новости с заданиями и лексикой." img="https://static.tildacdn.info/tild3161-3861-4234-b362-613030653564/2.jpg" link="https://breakingnewsenglish.com/" />
    </Accordion>
  </div>
);

const VideoPanel = () => (
  <div className="pb-24 pt-4">
    <Accordion title="Фильмы и сериалы" defaultOpen={true}>
      <MediaRow title="Inoriginal" desc="Один из лучших: двойные субтитры EN/RU." img="https://static.tildacdn.info/tild3336-3030-4964-b966-303862353932/10.jpg" link="https://inoriginal.net/" />
      <MediaRow title="Solarmovies" desc="Кино без рекламы; русские субтитры не всегда." img="https://static.tildacdn.info/tild3036-3665-4436-b131-396638313261/ADB9F47D-E5AA-479B-A.jpeg" link="https://solarmovies.ms/home" />
      <MediaRow title="HDRezka" desc="Запасной вариант: переключи озвучку на EN." img="https://static.tildacdn.info/tild3639-6237-4435-b338-373633663331/IMG_7903.PNG" link="https://hdrezka.fans/" />
      <MediaRow title="Zetflix" desc="Ещё один запасной ресурс." img="https://static.tildacdn.info/tild3430-6262-4238-b332-343464626162/11.jpg" link="https://go.zetflix-online.lol/" />
    </Accordion>
    <Accordion title="Аудирование">
      <MediaRow title="Listen in English" desc="Готовые уроки по уровням с аудированием." img="https://static.tildacdn.info/tild3636-3261-4532-b231-626664646132/BA22E78D-3200-4109-8.jpeg" link="https://listeninenglish.com/index.php" />
      <MediaRow title="iSLCollective (видео)" desc="Видео‑уроки по фильмам, сериалам." img="https://static.tildacdn.info/tild3836-3837-4331-b162-623335363239/12.jpg" link="https://en.islcollective.com/english-esl-video-lessons/search" />
      <MediaRow title="TubeQuizard" desc="Тренажёр слуха: вставляй пропуски." img="http://www.tubequizard.com/static/images/logo.png" link="http://www.tubequizard.com/" />
    </Accordion>
    <Accordion title="Лексика">
      <MediaRow title="TED‑Ed" desc="Короткие уроки с лексикой." img="https://static.tildacdn.info/tild6339-3537-4662-a130-303765373530/IMG_7745.PNG" link="https://ed.ted.com/lessons" />
      <MediaRow title="6 Minute English" desc="Короткие уроки от BBC." img="https://static.tildacdn.info/tild3864-3339-4639-b030-653330343666/IMG_7746.PNG" link="https://www.bbc.co.uk/learningenglish/english/features/6-minute-english" />
    </Accordion>
  </div>
);

const PracticePanel = () => (
  <div className="pb-24 pt-4">
    <Accordion title="Грамматика" defaultOpen={true}>
      <MediaRow title="Bewords.ru" desc="Более 150 уроков грамматики." img="https://bewords.ru/images/logo.png" link="https://bewords.ru/" btnText="Открыть" />
      <MediaRow title="Test‑English" desc="Грамматика и лексика от A1 до B2." img="https://static.tildacdn.info/tild3131-3437-4330-a633-393162336665/4.jpg" link="https://test-english.com/grammar-points/" />
      <MediaRow title="Lingust — грамматика" desc="148 уроков с объяснениями." img="https://optim.tildacdn.pub/tild3062-6233-4431-b363-353163363163/-/format/webp/0D4BE37D-2FBF-4950-8.jpeg.webp" link="https://lingust.ru/english/grammar" />
    </Accordion>
    <Accordion title="Перевод предложений">
      <MediaRow title="RU → EN тренажёр" desc="Отработка грамматики через перевод." img="https://static.tildacdn.info/tild6435-3633-4265-b966-313030633165/photo.PNG" link="https://berdiyev-english.github.io/resources/collect.html" btnText="Открыть тренажёр" />
    </Accordion>
  </div>
);

const SpeakPanel = () => (
  <div className="pb-24 pt-4">
    <Accordion title="Разговорная практика" defaultOpen={true}>
      <MediaRow title="HelloTalk" desc="Общение с носителями со всего мира." img="https://static.tildacdn.info/tild6631-3338-4435-b966-313430333161/_____2.jpg" link="https://www.hellotalk.com/ru" />
      <MediaRow title="Character.AI" desc="Бесплатный разговор с ИИ (EN)." img="https://static.tildacdn.info/tild6435-6666-4139-a237-396664643764/_____3.jpg" link="https://character.ai/" />
      <MediaRow title="TO BE ENG GPT" desc="Поговорит голосом, поправит ошибки." img="https://static.tildacdn.info/tild6139-6638-4834-b766-373131303463/_____1.jpg" link="https://t.me/Tobeeng_GPT_bot" btnText="Попробовать" />
    </Accordion>
    <Accordion title="Учить слова">
      <MediaRow title="Bewords" desc="Учите слова прямо на сайте." img="https://bewords.ru/images/logo.png" link="https://bewords.ru/" />
      <MediaRow title="EnglSpace" desc="Слова через ассоциации." img="https://static.tildacdn.info/tild3462-3164-4432-b633-316131343833/BEE2697D-A7E6-43D6-9.jpeg" link="https://t.me/English_Mnemo_Bot" />
    </Accordion>
  </div>
);

// --- APP ---

export function App() {
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'books', 'video', 'practice', 'speak'].includes(hash)) setActiveTab(hash);
  }, []);

  const handleNavigate = (tab: any) => {
    setActiveTab(tab);
    window.location.hash = tab;
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-violet-200">
      <Sponsors />
      <Header onNavigate={handleNavigate} />
      
      <main className="max-w-xl mx-auto px-4 w-full">
        {activeTab === 'home' && <HomePanel onNavigate={handleNavigate} />}
        {activeTab === 'books' && <BooksPanel />}
        {activeTab === 'video' && <VideoPanel />}
        {activeTab === 'practice' && <PracticePanel />}
        {activeTab === 'speak' && <SpeakPanel />}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleNavigate} />
      <InstallPrompt />
    </div>
  );
}
