import React, { useState, useEffect } from 'react';
import { 
  Menu, X, User, BookOpen, GraduationCap, Check, ArrowRight, Send, 
  AlertCircle, Sparkles, ChevronLeft, ChevronRight, Clock, Users, 
  Puzzle, Rocket, BadgeCheck, Languages, Flame, 
  MessageCircle, Instagram, Youtube, Mail, ArrowUp, ChevronDown, 
  Trophy, Bot, BarChart3, Smartphone, Loader2, Home,
  MessageSquareDashed, EarOff, RotateCcw, Frown, FileQuestion, History, HelpCircle,
  Globe, Briefcase, Play, Mic, PenTool, Zap, TrendingUp, Award, Brain
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from './utils/cn';

// --- DATA ---

const SEATS = { group: 0, solo: 3, zero: 1 };

const MODES = {
  self: {
    title: 'Английский — ключ к твоей цели!',
    subtitle: 'Первые заметные результаты через 3 месяца.',
    bullets: [
      'Быстро заговорить на английском',
      'Разобраться с грамматикой и временами',
      'Начать понимать речь и не забывать слова',
      'Повысить уровень до C1+'
    ],
    pains: [
      { text: 'Хотите сказать, но в голове пустота', icon: MessageSquareDashed },
      { text: 'Времена кажутся бесконечным хаосом', icon: History },
      { text: 'В фильмах понимаете только "Hello"', icon: EarOff },
      { text: 'Много раз начинали и бросали', icon: RotateCcw }
    ],
    dreams: [
      { 
        title: 'Свобода передвижения', 
        text: 'Решать любые вопросы в путешествиях: от отеля до общения с полицией или врачом.', 
        icon: Globe 
      },
      { 
        title: 'Карьера и доход', 
        text: 'Проходить собеседования в международные компании и вести переговоры без переводчика.', 
        icon: Briefcase 
      },
      { 
        title: 'Контент без границ', 
        text: 'Смотреть Netflix, YouTube и профессиональные лекции в оригинале.', 
        icon: Play 
      },
      { 
        title: 'Живое общение', 
        text: 'Поддерживать беседу с иностранцами, понимая сленг, шутки и акценты.', 
        icon: MessageCircle 
      }
    ],
    resultsTitle: 'Через 3 месяца вы сможете:',
    caseTags: ['self'],
    advantages: [
      { icon: Clock, text: 'Результат через 3 месяца' },
      { icon: Users, text: '100+ учеников' },
      { icon: Puzzle, text: 'Авторская система схем' },
      { icon: Rocket, text: 'Свои гайды и боты' },
      { icon: BadgeCheck, text: 'Квалификация TEFL' },
      { icon: Languages, text: 'Уровень C2' }
    ]
  },
  oge: {
    title: 'ОГЭ больше не проблема',
    subtitle: 'Готовим по кодификатору ФИПИ. Без паники.',
    bullets: [
      'Сдать ОГЭ на 5 без нервов',
      'Разобраться с форматом экзамена',
      'Понять времена и грамматику',
      'Улучшить разговорные навыки'
    ],
    pains: [
      { text: 'В письме ступор перед пустым листом', icon: FileQuestion },
      { text: 'Слов не хватает даже для простых тем', icon: Frown },
      { text: 'Аудио звучит как просто шум', icon: EarOff },
      { text: 'Времена путаются на экзамене', icon: History }
    ],
    dreams: [
      { 
        title: 'Сдача на «Отлично»', 
        text: 'Уверенно набрать максимальный балл для поступления в профильный класс или колледж.', 
        icon: Award 
      },
      { 
        title: 'Устная часть без страха', 
        text: 'Говорить свободно и по критериям, не впадая в ступор перед микрофоном.', 
        icon: Mic 
      },
      { 
        title: 'Понимание на слух', 
        text: 'Слышать ключевую информацию в аудировании с первого раза.', 
        icon: Brain 
      },
      { 
        title: 'Письмо на автомате', 
        text: 'Писать личное письмо за 15 минут по четким шаблонам без грамматических ошибок.', 
        icon: PenTool 
      }
    ],
    resultsTitle: 'Через 3 месяца ты сможешь:',
    caseTags: ['oge'],
    advantages: [
      { icon: Trophy, text: 'Средний балл — «5»' },
      { icon: GraduationCap, text: '2 высших образования' },
      { icon: BookOpen, text: 'Автор пособий' },
      { icon: Bot, text: 'Бот на ИИ для ОГЭ' },
      { icon: BadgeCheck, text: 'Квалификация TEFL' },
      { icon: Languages, text: 'Уровень C2' }
    ]
  },
  ege: {
    title: 'Поступи в вуз на бюджет',
    subtitle: 'Стратегия под 80+ баллов.',
    bullets: [
      'Сдать ЕГЭ на 80+ баллов',
      'Понять формат и ловушки',
      'Разобраться с грамматикой',
      'Укрепить Speaking'
    ],
    pains: [
      { text: 'В эссе "вода" и потеря баллов', icon: MessageSquareDashed },
      { text: 'Тексты C1 — китайская грамота', icon: HelpCircle },
      { text: 'Listening слишком быстрый', icon: EarOff },
      { text: 'Ошибки в заданиях 32–38', icon: AlertCircle }
    ],
    dreams: [
      { 
        title: 'Поступление на бюджет', 
        text: 'Результат 85+ баллов открывает двери топовых вузов страны.', 
        icon: GraduationCap 
      },
      { 
        title: 'Идеальное Эссе', 
        text: 'Аргументировать позицию и строить логику текста на уровне C1.', 
        icon: FileText 
      },
      { 
        title: 'Тайм-менеджмент', 
        text: 'Решать тестовую часть за 20 минут, оставляя максимум времени на сложные задания.', 
        icon: Zap 
      },
      { 
        title: 'Сложные задания', 
        text: 'Алгоритмы решения заданий 30–36 и 38, где теряют баллы 90% выпускников.', 
        icon: TrendingUp 
      }
    ],
    resultsTitle: 'Через 3 месяца ты сможешь:',
    caseTags: ['ege'],
    advantages: [
      { icon: BarChart3, text: 'Средний балл — 80+' },
      { icon: GraduationCap, text: '2 высших образования' },
      { icon: BookOpen, text: 'Автор методик ЕГЭ' },
      { icon: Bot, text: 'ИИ-бот для ЕГЭ' },
      { icon: Smartphone, text: 'Свое приложение' },
      { icon: BadgeCheck, text: 'Квалификация TEFL' },
      { icon: Languages, text: 'Уровень C2' }
    ]
  }
};

const FAQS = {
  self: [
    { q: 'За сколько я заговорю?', a: 'В среднем 12 недель. 80% урока — это Speaking.' },
    { q: 'Я с нуля. Получится?', a: 'Да. Начинаем с базы, без лишней теории.' },
    { q: 'Боюсь говорить', a: 'Создаю комфортную среду, ошибки исправляем мягко.' },
    { q: 'Какая домашка?', a: 'Интерактив, видео, аудио. Без скучных учебников.' },
    { q: 'Где проходят уроки?', a: 'Teams + интерактивная доска. Всё в одном месте.' },
    { q: 'Стоимость?', a: 'Зависит от формата. Первый урок бесплатно.' }
  ],
  oge: [
    { q: 'Реально ли сдать на 5 за 3 месяца?', a: 'Да, если заниматься регулярно и бить в слабые места.' },
    { q: 'Почему теряют баллы?', a: 'Нет стратегии. Мы это исправим чек-листами.' },
    { q: 'Как готовим Speaking?', a: 'Шаблоны, клише, тренировка с таймером.' },
    { q: 'А письмо?', a: 'Дам готовые конструкции, напишем 20+ писем.' },
    { q: 'Много домашки?', a: '30-40 минут в день. Главное — регулярность.' },
    { q: 'Есть пробники?', a: 'Каждые 2 недели полный прогон.' }
  ],
  ege: [
    { q: 'Сколько нужно на 80+?', a: 'Обычно 4-6 месяцев, но за 3 можно сделать рывок.' },
    { q: 'Как писать эссе?', a: 'Строго по критериям. Дам банк аргументов.' },
    { q: 'Listening сложный', a: 'Учимся слышать ключи и отсекать лишнее.' },
    { q: 'Грамматика', a: 'Алгоритмы для каждого типа заданий.' },
    { q: 'Устная часть', a: 'Отработаем до автоматизма по шаблонам.' },
    { q: 'Есть пробники?', a: 'Раз в 2 недели с полным разбором.' }
  ]
};

const CASES = [
  // SELF
  { tags: ['self'], name: 'Анатолий', desc: 'Предприниматель', icon: User, color: 'blue', before: ['Боялся созвонов', 'Паузы в речи', 'Понимал 50%'], after: ['Звонки без переводчика', 'Беглый диалог', 'Понимает 90%'], note: '8 недель' },
  { tags: ['self'], name: 'Дина', desc: 'Аспирант', icon: User, color: 'blue', before: ['Понимала 45% лекций', 'Путаница времен'], after: ['Понимает 90%', 'Времена в системе'], note: '7 недель' },
  { tags: ['self'], name: 'Илья', desc: 'Разработчик', icon: User, color: 'blue', before: ['Заваливал интервью', 'Мало слов'], after: ['Оффер в международную компанию', 'Свободный технический English'], note: '6 недель' },
  { tags: ['self', 'travel'], name: 'Светлана', desc: 'Путешествия', icon: User, color: 'blue', before: ['Страх в отелях', 'Языковой барьер'], after: ['Решает все вопросы', 'Свободное общение'], note: '4 недели' },
  { tags: ['self'], name: 'Роман', desc: 'Менеджер', icon: User, color: 'blue', before: ['Барьер с коллегами', 'Ошибки в грамматике'], after: ['Ведёт демо на англ.', 'Минимум ошибок'], note: '6 недель' },
  // EGE
  { tags: ['ege'], name: 'Марина', desc: 'ЕГЭ', icon: User, color: 'indigo', before: ['Пробник: 62', 'Слабый Writing'], after: ['Итог: 86', 'Эссе по шаблону'], note: '3 месяца' },
  { tags: ['ege'], name: 'Данил', desc: 'ЕГЭ', icon: User, color: 'indigo', before: ['Сложный Reading', 'Проблемы с Listening'], after: ['Reading 90%', 'Listening 80%+'], note: '7 недель' },
  { tags: ['ege'], name: 'Полина', desc: 'ЕГЭ', icon: User, color: 'indigo', before: ['Мало лексики', 'Путаница времен'], after: ['Словарь C1', 'Времена ОК'], note: '6 недель' },
  { tags: ['ege'], name: 'Игорь', desc: 'ЕГЭ', icon: User, color: 'indigo', before: ['Ошибки 32-38', 'Страх Speaking'], after: ['Алгоритмы решения', 'Уверенная речь'], note: '8 недель' },
  { tags: ['ege'], name: 'Карина', desc: 'ЕГЭ', icon: User, color: 'indigo', before: ['Writing структура', 'Плохой тайминг'], after: ['Чёткий план', 'Успевает всё'], note: '5 недель' },
  // OGE
  { tags: ['oge'], name: 'Антон', desc: 'ОГЭ', icon: User, color: 'blue', before: ['«4» на грани', 'Ошибки'], after: ['Итог: «5»', 'Грамматика ОК'], note: '8 недель' },
  { tags: ['oge'], name: 'Полина', desc: 'ОГЭ', icon: User, color: 'blue', before: ['Не знала письмо', 'Мало слов'], after: ['Письмо на макс.', 'Рост словаря'], note: '6 недель' },
  { tags: ['oge'], name: 'Егор', desc: 'ОГЭ', icon: User, color: 'blue', before: ['Грамматика 0', 'Нет системы'], after: ['Понял времена', 'Есть план'], note: '5 недель' },
  { tags: ['oge'], name: 'Алина', desc: 'ОГЭ', icon: User, color: 'blue', before: ['Понимание 50%', 'Страх устной'], after: ['Стратегии чтения', 'Говорит уверенно'], note: '6 недель' },
  { tags: ['oge'], name: 'Никита', desc: 'ОГЭ', icon: User, color: 'blue', before: ['Ошибки', 'Нет плана'], after: ['Орфография ОК', 'Чёткий график'], note: '8 недель' }
];

// Helper for icon import in dreams (FileText needed for EGE)
import { FileText } from 'lucide-react';

// --- APP ---

export function App() {
  const [mode, setMode] = useState<keyof typeof MODES>('self');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const modeConfig = MODES[mode];

  useEffect(() => {
    const qs = new URLSearchParams(window.location.search);
    const m = qs.get('mode') || localStorage.getItem('mode');
    if (m && MODES[m as keyof typeof MODES]) setMode(m as keyof typeof MODES);
    
    const onScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem('mode', mode);
    const u = new URL(window.location.href);
    u.searchParams.set('mode', mode);
    window.history.replaceState(null, '', u.toString());
  }, [mode]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  const setModeHandler = (m: keyof typeof MODES) => {
    setMode(m);
    setIsMenuOpen(false);
    document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50 selection:bg-blue-100 selection:text-blue-900">
      {/* Subtle Background Blobs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[100px] opacity-60"></div>
      </div>

      <Header mode={mode} setMode={setModeHandler} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="relative z-10 pt-28 pb-20 space-y-24 sm:space-y-32">
        <OfferSection mode={mode} config={modeConfig} setMode={setModeHandler} />
        <PainSection config={modeConfig} />
        <ApproachSection />
        <ResultsSection config={modeConfig} />
        <CasesCarousel mode={mode} />
        <AdvantagesSection config={modeConfig} />
        <TypesSection />
        <Quiz />
        <FAQSection config={FAQS[mode]} />
        <ContactsSection />
      </main>

      <Footer />
      <StickyCTA />
      <FAB showScrollTop={showScrollTop} />
    </div>
  );
}

// --- SECTIONS ---

function Header({ mode, setMode, isMenuOpen, setIsMenuOpen }: any) {
  const links = [
    { href: '#help', label: 'Проблемы' },
    { href: '#students', label: 'Результаты' },
    { href: '#cases', label: 'Кейсы' },
    { href: '#types', label: 'Форматы' },
    { href: '#about', label: 'Обо мне' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm"></div>
      <div className="container-xxl px-4 relative h-16 sm:h-20 flex items-center justify-between z-[101]">
        <a href="#top" className="flex items-center gap-2 text-slate-900 hover:text-blue-600 transition-colors p-2" aria-label="На главную">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-200">
            <Home className="w-5 h-5" />
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-200/50">
          {links.map(l => (
            <a key={l.href} href={l.href} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-all">
              {l.label}
            </a>
          ))}
          {mode === 'self' && (
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-300">
              <button onClick={() => setMode('oge')} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">ОГЭ</button>
              <button onClick={() => setMode('ege')} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">ЕГЭ</button>
            </div>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <a href="#quiz" className="hidden sm:flex bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10">
            Записаться
          </a>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative z-[102]"
            aria-label="Меню"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-white/98 backdrop-blur-xl flex flex-col pt-24 px-6 md:hidden overflow-y-auto"
          >
            <nav className="flex flex-col gap-4">
              {links.map(l => (
                <a key={l.href} href={l.href} onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-slate-900 py-3 border-b border-slate-100">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-8">
               <p className="text-sm text-slate-400 mb-4 font-bold uppercase tracking-wider">Выберите цель</p>
               <div className="grid grid-cols-1 gap-3">
                {['self', 'oge', 'ege'].map(m => (
                  <button 
                    key={m}
                    onClick={() => setMode(m)} 
                    className={cn(
                      "p-4 rounded-xl text-left text-lg font-bold border transition-colors flex items-center justify-between", 
                      mode===m ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200"
                    )}
                  >
                    {m === 'self' ? 'Для себя' : m.toUpperCase()}
                    {mode === m && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-8 pb-10">
               <a href="#quiz" onClick={() => setIsMenuOpen(false)} className="block w-full text-center bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-blue-200">
                 Записаться на урок
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function OfferSection({ mode, config, setMode }: any) {
  return (
    <section id="offer" className="container-xxl px-4">
      {/* Container Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-[3rem] p-6 sm:p-10 lg:p-14 shadow-2xl shadow-slate-200 border border-slate-100/50 relative overflow-hidden">
        {/* Decorative Background inside card */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-80 pointer-events-none"></div>

        <div className="relative z-10 grid md:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left: Text Content */}
          <div className="md:col-span-7 lg:col-span-8 space-y-8 relative z-20">
            {/* Mode Switcher */}
            <div className="inline-flex p-1.5 bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm">
              {[
                { id: 'self', label: 'Для себя', icon: User },
                { id: 'oge', label: 'ОГЭ', icon: BookOpen },
                { id: 'ege', label: 'ЕГЭ', icon: GraduationCap }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    mode === m.id ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                  )}
                >
                  <m.icon className="w-4 h-4" />
                  {m.label}
                </button>
              ))}
            </div>

            <motion.div 
              key={mode} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                {config.title}
              </h1>
              <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed font-medium">
                {config.subtitle}
              </p>
              
              <div className="mt-8 flex flex-col sm:flex-row gap-6 lg:gap-10">
                <ul className="space-y-3">
                  {config.bullets.slice(0, Math.ceil(config.bullets.length / 2)).map((b: string, i: number) => (
                    <BulletItem key={i} text={b} delay={i} />
                  ))}
                </ul>
                <ul className="space-y-3">
                  {config.bullets.slice(Math.ceil(config.bullets.length / 2)).map((b: string, i: number) => (
                     <BulletItem key={i} text={b} delay={i + 2} />
                  ))}
                </ul>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 pt-2"
            >
              <a href="#quiz" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98]">
                Бесплатный урок <ArrowRight className="w-5 h-5" />
              </a>
              <a href="https://t.me/m/mjPABJEtYTky" target="_blank" className="bg-white text-blue-600 border-2 border-blue-50 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all flex items-center gap-2">
                <Send className="w-5 h-5" /> Telegram
              </a>
            </motion.div>
          </div>

          {/* Right: Photo Integrated into the card - Top Right Alignment for Desktop/Tablet */}
          <div className="md:col-span-5 lg:col-span-4 flex flex-col justify-start items-center md:items-end pt-4 md:pt-0">
             <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6 }}
               className="relative group"
             >
                {/* Photo container */}
                <div className="relative w-64 h-64 md:w-56 md:h-56 lg:w-72 lg:h-72 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl shadow-blue-900/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                   <img 
                      src="https://static.tildacdn.info/tild6137-3239-4731-b932-343437323234/__1.jpg" 
                      alt="Абдуррахим Бердиев" 
                      className="w-full h-full object-cover"
                   />
                </div>

                {/* Badge attached to photo - Adjusted for smaller size on tablet */}
                <div className="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-white p-3 md:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3 max-w-[200px] md:max-w-[220px] -rotate-3 group-hover:rotate-0 transition-transform duration-500 delay-75">
                   <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 text-xs md:text-base">TEFL</div>
                   <div>
                     <div className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-wider">Преподаватель</div>
                     <div className="text-xs md:text-sm font-bold text-slate-900 leading-tight">Абдуррахим Бердиев</div>
                   </div>
                </div>
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

function BulletItem({ text, delay }: { text: string, delay: number }) {
  return (
    <motion.li 
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: delay * 0.1 }}
      className="flex items-start gap-3 text-slate-700 max-w-xs"
    >
      <div className="mt-1 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
        <Check className="w-3 h-3" />
      </div>
      <span className="font-medium text-sm sm:text-base leading-tight">{text}</span>
    </motion.li>
  )
}

function PainSection({ config }: any) {
  return (
    <Reveal>
      <section id="help" className="container-xxl px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-bold tracking-wider uppercase text-sm mb-2 block">Проблемы</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Знакомые ситуации?</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.pains.map((pain: any, i: number) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all h-full flex flex-col items-start"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6 text-red-500 shrink-0">
                <pain.icon className="w-7 h-7" />
              </div>
              <p className="text-slate-700 font-bold text-lg leading-snug">{pain.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function ApproachSection() {
  const steps = [
    { icon: MessageCircle, text: 'Говорим с 1-го урока', color: 'bg-blue-100 text-blue-600' },
    { icon: Puzzle, text: 'Грамматика без зубрежки', color: 'bg-indigo-100 text-indigo-600' },
    { icon: Flame, text: 'Игровой формат', color: 'bg-orange-100 text-orange-600' },
    { icon: Youtube, text: 'Разбор видео', color: 'bg-red-100 text-red-600' },
  ];
  return (
    <Reveal>
      <section className="container-xxl px-4">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/30 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12 justify-between">
            <div className="lg:w-1/3">
              <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Sparkles className="text-yellow-400 fill-yellow-400" /> Мой подход
              </h3>
              <p className="text-slate-300 text-lg leading-relaxed">Никакой воды. Только то, что дает результат здесь и сейчас. Простые схемы и много практики.</p>
            </div>
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-4 w-full">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center gap-4 bg-white/10 p-5 rounded-2xl border border-white/10 hover:bg-white/20 transition-colors">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.color)}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-lg">{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function ResultsSection({ config }: any) {
  return (
    <Reveal>
      <section id="students" className="container-xxl px-4">
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm mb-2 block">Результат</span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{config.resultsTitle}</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {config.dreams.map((dream: any, i: number) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex items-start gap-5 p-6 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors text-emerald-600">
                <dream.icon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-xl text-slate-900 mb-2">{dream.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium">{dream.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function CasesCarousel({ mode }: any) {
  const filtered = CASES.filter(c => c.tags.includes(mode));
  const [index, setIndex] = useState(0);

  useEffect(() => setIndex(0), [mode]);

  const next = () => setIndex(i => (i + 1) % filtered.length);
  const prev = () => setIndex(i => (i - 1 + filtered.length) % filtered.length);

  return (
    <Reveal>
      <section id="cases" className="container-xxl px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-slate-900">Кейсы учеников</h2>
          <div className="flex gap-2">
            <button onClick={prev} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={next} className="w-12 h-12 rounded-full flex items-center justify-center border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2.5rem] min-h-[450px] bg-white shadow-xl border border-slate-100">
          <AnimatePresence mode="wait">
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12 h-full flex flex-col lg:flex-row gap-12"
            >
              <div className="lg:w-1/3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 pb-8 lg:pb-0 lg:pr-8">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-100 text-slate-600">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-slate-900">{filtered[index].name}</h4>
                      <p className="text-slate-500 font-medium">{filtered[index].desc}</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold text-sm">
                    <Clock className="w-4 h-4" /> {filtered[index].note}
                  </div>
                </div>
              </div>

              <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-slate-400 uppercase text-xs font-bold tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400"></div> Было</div>
                  <ul className="space-y-3">
                    {filtered[index].before.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div className="text-emerald-600 uppercase text-xs font-bold tracking-wider flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Стало</div>
                  <ul className="space-y-3">
                    {filtered[index].after.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-900 font-medium bg-emerald-50/50 p-3 rounded-xl">
                        <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Reveal>
  );
}

function AdvantagesSection({ config }: any) {
  return (
    <Reveal>
      <section id="about" className="container-xxl px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Почему я?</h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {config.advantages.map((adv: any, i: number) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-900">
                <adv.icon className="w-6 h-6" />
              </div>
              <p className="text-slate-700 font-semibold">{adv.text}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <a href="https://berdiyev-eng.ru/me" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors group">
            Подробнее обо мне <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </Reveal>
  );
}

function TypesSection() {
  const types = [
    { title: 'Группы', icon: Users, desc: 'Мини-группы 3-5 человек. Драйв и общение.', seats: SEATS.group },
    { title: 'Индивидуально', icon: User, desc: 'Персональная программа под ваш запрос и темп.', seats: SEATS.solo },
    { title: 'С нуля за 3 мес.', icon: Flame, desc: 'Интенсив для быстрого старта.', seats: SEATS.zero },
  ];

  return (
    <Reveal>
      <section id="types" className="container-xxl px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-slate-900">Форматы занятий</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {types.map((t, i) => (
            <motion.div 
              key={i}
              className={cn(
                "p-8 rounded-[2rem] border flex flex-col bg-white transition-all duration-300",
                t.seats > 0 ? "border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-2" : "border-slate-100 opacity-60 grayscale"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-900"><t.icon className="w-6 h-6" /></div>
                {t.seats > 0 ? (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">Места: {t.seats}</span>
                ) : (
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-500">Мест нет</span>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-3 text-slate-900">{t.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed flex-grow">{t.desc}</p>
              <a 
                href="#quiz" 
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-center transition-all",
                  t.seats > 0 ? "bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg" : "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
              >
                {t.seats > 0 ? 'Записаться' : 'Лист ожидания'}
              </a>
            </motion.div>
          ))}
        </div>
      </section>
    </Reveal>
  );
}

function Quiz() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (k: string, v: string) => setData({ ...data, [k]: v });
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('https://formspree.io/f/mblkbjve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      setSent(true);
    } catch {
      alert('Ошибка. Напишите мне в Telegram.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) return (
    <section id="quiz" className="container-xxl px-4 mb-20">
      <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-xl border border-emerald-100">
        <div className="inline-flex p-5 rounded-full bg-emerald-50 mb-6 text-emerald-600"><Check className="w-10 h-10" /></div>
        <h3 className="text-3xl font-bold text-slate-900 mb-2">Заявка отправлена!</h3>
        <p className="text-slate-500 text-lg">Я свяжусь с вами в ближайшее время в мессенджере.</p>
      </div>
    </section>
  );

  return (
    <Reveal>
      <section id="quiz" className="container-xxl px-4">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"></div>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Бесплатный первый урок</h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">Оставьте заявку — я свяжусь с вами, мы проведем диагностику и я составлю для вас персональный план обучения.</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Check className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">Диагностика уровня языка</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"><Check className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">Персональный план на 3 месяца</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Check className="w-4 h-4" /></div>
                  <span className="font-medium text-slate-700">Бонус: Гайд по временам</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={submit} className="flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  <span>Шаг {step} из 4</span>
                  <span>{Math.round((step/4)*100)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-600"
                    initial={{ width: 0 }} animate={{ width: `${(step/4)*100}%` }}
                  />
                </div>
              </div>

              <div className="min-h-[200px]">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="text-xl font-bold text-slate-900">Ваш примерный уровень?</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['A0 (Нулевой)', 'A1-A2 (База)', 'B1-B2 (Средний)', 'C1+ (Продвинутый)'].map(l => (
                        <button type="button" key={l} onClick={() => { update('level', l); setStep(2); }} className="p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left text-slate-700 font-medium transition-all">{l}</button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="text-xl font-bold text-slate-900">Какая у вас цель?</label>
                    {['Для себя / Путешествия', 'Сдать ОГЭ / ЕГЭ', 'Работа / Карьера', 'Другое'].map(g => (
                      <button type="button" key={g} onClick={() => { update('goal', g); setStep(3); }} className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left text-slate-700 font-medium transition-all">{g}</button>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="text-xl font-bold text-slate-900">Удобный формат?</label>
                    {['Индивидуально', 'Мини-группа', 'Не знаю, посоветуйте'].map(f => (
                      <button type="button" key={f} onClick={() => { update('format', f); setStep(4); }} className="w-full p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 text-left text-slate-700 font-medium transition-all">{f}</button>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="text-xl font-bold text-slate-900">Как с вами связаться?</label>
                    <input required placeholder="Ваше имя" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium" onChange={e => update('name', e.target.value)} />
                    <input required placeholder="Телефон или WhatsApp" className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all font-medium" onChange={e => update('phone', e.target.value)} />
                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-2 mt-2">
                      {loading ? <Loader2 className="animate-spin" /> : 'Получить план и гайд'}
                    </button>
                    <div className="text-center mt-4">
                      <p className="text-sm text-slate-400 mb-2">или напишите мне лично</p>
                      <a href="https://t.me/m/mjPABJEtYTky" target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                         <Send className="w-4 h-4" /> Telegram
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {step > 1 && step < 4 && (
                <button type="button" onClick={() => setStep(s => s - 1)} className="mt-6 text-sm font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"><ChevronLeft className="w-4 h-4" /> Назад</button>
              )}
            </form>
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function FAQSection({ config }: any) {
  return (
    <section id="faq" className="container-xxl px-4">
      <h2 className="text-3xl font-bold mb-10 text-center text-slate-900">Частые вопросы</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {config.map((item: any, i: number) => (
          <details key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm open:shadow-md transition-all">
            <summary className="cursor-pointer p-6 font-semibold flex items-center justify-between select-none text-slate-800">
              {item.q}
              <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

function ContactsSection() {
  const contacts = [
    { icon: Send, label: 'Telegram', href: 'https://t.me/m/mjPABJEtYTky', color: 'text-blue-500 bg-blue-50 hover:bg-blue-100' },
    { icon: MessageCircle, label: 'WhatsApp', href: 'https://wa.me/79111880148', color: 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100' },
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/berdiyev_english', color: 'text-pink-500 bg-pink-50 hover:bg-pink-100' },
    { icon: Mail, label: 'Email', href: 'mailto:abdurrahimberdiev@gmail.com', color: 'text-slate-600 bg-slate-100 hover:bg-slate-200' },
  ];

  return (
    <section id="contacts" className="container-xxl px-4 text-center">
      <h2 className="text-3xl font-bold mb-8 text-slate-900">Связь со мной</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {contacts.map((c, i) => (
          <a key={i} href={c.href} target="_blank" className={cn("flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold", c.color)}>
            <c.icon className="w-5 h-5" />
            <span>{c.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 py-12 text-center text-slate-400 text-sm bg-slate-50">
      <div className="container-xxl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="font-bold text-slate-900 text-lg">ToBe English</div>
           <p>© 2025 All rights reserved.</p>
        </div>
        <p className="mt-4 text-xs opacity-60 max-w-lg mx-auto">*Instagram и WhatsApp принадлежат компании Meta, признанной экстремистской организацией в РФ.</p>
      </div>
    </footer>
  );
}

function StickyCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 800);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-auto"
        >
          <a href="#quiz" className="flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full shadow-2xl hover:scale-105 transition-transform whitespace-nowrap">
            Бесплатный урок <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FAB({ showScrollTop }: any) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      <a href="https://t.me/m/mjPABJEtYTky" target="_blank" className="p-3.5 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors">
        <Send className="w-5 h-5" />
      </a>
      {showScrollTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-3.5 rounded-full bg-white text-slate-600 shadow-lg border border-slate-200 hover:bg-slate-50 transition-colors">
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
