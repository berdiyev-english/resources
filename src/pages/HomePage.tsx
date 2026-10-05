import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Flame, Search, Target, X } from 'lucide-react';
import logo from '../assets/logo.png';
import bobSticker from '../assets/bob-sticker.png';
import { CONTACTS } from '../data/site';
import {
  RESOURCES,
  RESOURCE_BY_ID,
  SECTION_META,
  SITE_SECTIONS,
  type Resource,
} from '../data/resources';
import { Seo, faqPage, itemList } from '../lib/seo';
import { Card, SectionHeading, Button } from '../components/UI';
import { ResourceCard } from '../components/ResourceCard';
import { FaqSection } from '../components/ContentBlocks';
import { SECTION_ICONS } from '../components/icons';
import { useUser } from '../state/UserContext';

const HOME_FAQ = [
  {
    q: 'Что такое BEMAT?',
    a: 'BEMAT — бесплатный сайт и приложение для изучения английского языка: здесь собраны проверенные ресурсы для чтения книг с переводом, просмотра фильмов и сериалов в оригинале, грамматики, аудирования, разговорной практики и подготовки к ЕГЭ, ОГЭ, IELTS и TOEFL. Плюс личный кабинет с планом на 15 минут в день.',
  },
  {
    q: 'Нужно ли регистрироваться или платить?',
    a: 'Нет. Все материалы бесплатные, регистрация не нужна: прогресс сохраняется в браузере. Сайт работает и без установки приложения — просто откройте bemat.ru на телефоне или компьютере.',
  },
  {
    q: 'С какого уровня можно начинать?',
    a: 'С любого. Новичкам подойдут курсы с нуля и адаптированные книги уровня A1–A2, тем, кто продолжает — книги по уровням, сериалы с двойными субтитрами и разговорная практика с ИИ.',
  },
  {
    q: 'Сколько времени нужно заниматься в день?',
    a: 'Достаточно 15 минут, но каждый день. В личном кабинете есть готовый план: три задания разного типа, стрик и кот Боб, который «голодает», если забросить занятия.',
  },
  {
    q: 'Можно ли учить английский по мемам и фильмам?',
    a: 'Да, и это работает лучше скучных учебников. Bemem показывает мемы на английском и разбирает слова из них, 9GAG и Know Your Meme дают практику чтения, а фильмы и сериалы с субтитрами учат понимать живую речь на слух.',
  },
  {
    q: 'Можно ли подготовиться к ЕГЭ или IELTS бесплатно?',
    a: 'Да. Банк заданий ФИПИ и практические тесты IELTS бесплатны, а ИИ-репетиторы BEMAT проверяют письмо и устную часть и показывают, где теряются баллы. При регулярных занятиях этого достаточно для высокого результата.',
  },
];

const POPULAR = ['books-memes-bemem', 'books-2books', 'video-inoriginal', 'practice-bewords'];

export function HomePage() {
  const { hasProfile } = useUser();
  const [query, setQuery] = useState('');

  const results = useMemo<Resource[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return RESOURCES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.desc.toLowerCase().includes(q) ||
        r.group.toLowerCase().includes(q)
    );
  }, [query]);


  return (
    <>
      <Seo
        seo={{
          path: '/',
          title: 'BEMAT — английский бесплатно: фильмы, книги, курсы, ЕГЭ и ОГЭ',
          description:
            'Бесплатные ресурсы для изучения английского: фильмы и сериалы с субтитрами, книги с переводом, 150+ уроков грамматики, разговорная практика с ИИ и подготовка к ЕГЭ, ОГЭ, IELTS, TOEFL. Всё в одном месте.',
          keywords:
            'английский бесплатно, учить английский, фильмы на английском, книги на английском с переводом, грамматика английского, подготовка к ЕГЭ по английскому, подготовка к ОГЭ, ielts, toefl, аудирование, разговорный английский',
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'BEMAT',
              alternateName: 'Бимат — английский бесплатно',
              url: 'https://bemat.ru/',
              inLanguage: 'ru-RU',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://bemat.ru/?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'EducationalOrganization',
              name: 'BEMAT',
              url: 'https://bemat.ru/',
              description:
                'Бесплатные ресурсы для изучения английского языка: фильмы, книги, грамматика, разговорная практика и подготовка к экзаменам.',
              sameAs: [CONTACTS.telegram, CONTACTS.author],
            },
            itemList(
              'Разделы BEMAT',
              SITE_SECTIONS.map((id) => ({ name: SECTION_META[id].navLabel, url: `https://bemat.ru${SECTION_META[id].path}` }))
            ),
            faqPage(HOME_FAQ),
          ],
        }}
      />

      <div className="px-4 lg:px-0">
        {/* HERO */}
        <section className="relative pt-6 pb-8 hero-glow rounded-3xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1 text-center sm:text-left">
              <p className="text-violet-600 text-[11px] font-bold uppercase tracking-[0.18em] mb-2">
                Бесплатно · без регистрации · онлайн
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight mb-3">
                Учить английский — <span className="text-grad-violet">бесплатно и по делу</span>
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-5 max-w-xl mx-auto sm:mx-0">
                Фильмы и сериалы с субтитрами, книги с переводом, грамматика, разговорная практика с ИИ и подготовка к
                ЕГЭ, ОГЭ, IELTS и TOEFL. Собери свой план на 15 минут в день — и покорми кота Боба.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl grad-violet text-white font-bold no-underline shadow-lg shadow-violet-200"
                >
                  {hasProfile ? 'Мой план на сегодня' : 'Составить план на 15 минут'} <ArrowRight size={18} />
                </Link>
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white border border-stone-200 text-stone-700 font-bold no-underline"
                >
                  Смотреть каталог
                </a>
              </div>
              <p className="text-xs text-stone-400 mt-3">
                Работает прямо в браузере телефона — приложение устанавливать не обязательно.
              </p>
            </div>

            <div className="relative shrink-0">
              <div className="absolute inset-0 grad-violet rounded-full blur-2xl opacity-20" aria-hidden="true" />
              <img
                src={logo}
                alt="Кот Боб — маскот проекта BEMAT"
                className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-[2rem] shadow-2xl border-4 border-white rotate-3"
              />
              <span className="absolute -bottom-2 -right-2 bg-green-400 text-stone-900 px-2.5 py-1 rounded-xl text-[11px] font-black shadow">
                FREE
              </span>
            </div>
          </div>
        </section>

        {/* ПОИСК ПО КАТАЛОГУ */}
        <section id="catalog" className="scroll-mt-20 mb-8">
          <SectionHeading
            emoji="🔎"
            title="Каталог ресурсов"
            subtitle={`${RESOURCES.length} проверенных сайтов, сервисов и ботов`}
          />
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Найти: книги, субтитры, ЕГЭ, произношение…"
              aria-label="Поиск по каталогу ресурсов"
              className="w-full pl-11 pr-11 py-3.5 rounded-2xl bg-white border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Очистить поиск"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-400 hover:text-stone-600"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {query.trim().length >= 2 ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-stone-500 px-1">Найдено: {results.length}</p>
                {results.map((r) => (
                  <ResourceCard key={r.id} resource={r} compact />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <p className="text-sm text-stone-500 mb-3">Ничего не нашлось. Попробуй другой запрос.</p>
              </Card>
            )
          ) : (
            <>
              {/* Разделы */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SITE_SECTIONS.map((id) => {
                  const meta = SECTION_META[id];
                  const Icon = SECTION_ICONS[id];
                  return (
                    <Link
                      key={id}
                      to={meta.path}
                      className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm no-underline hover:border-violet-200 hover:shadow transition-all flex flex-col"
                    >
                      <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-2.5">
                        <Icon size={18} />
                      </span>
                      <span className="font-bold text-stone-900 text-sm leading-tight mb-1">{meta.navLabel}</span>
                      <span className="text-[11px] text-stone-500 leading-snug">{meta.tagline}</span>
                      <span className="mt-3 text-[11px] font-bold text-violet-600 inline-flex items-center gap-1">
                        Открыть <ArrowRight size={12} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </section>

        {/* ПОПУЛЯРНОЕ */}
        <section className="mb-8">
          <SectionHeading emoji="⭐" title="Популярное у учеников" />
          <div className="space-y-1">
            {POPULAR.map((id) => {
              const r = RESOURCE_BY_ID[id];
              return r ? <ResourceCard key={id} resource={r} /> : null;
            })}
          </div>
        </section>

        {/* КАК ЭТО РАБОТАЕТ */}
        <section className="mb-8">
          <SectionHeading emoji="🐱" title="Как это работает" />
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start mb-5">
              <img
                src={bobSticker}
                alt="Кот Боб и разделы BEMAT: книги, фильмы, практика, разговор, боты"
                loading="lazy"
                className="w-40 sm:w-48 rounded-2xl bg-white shrink-0"
              />
              <p className="text-sm text-stone-600 leading-relaxed">
                Боб — твой наставник. Каждый день он даёт три небольших задания под твою цель: чтение, аудирование,
                грамматику или речь. Выполнил все — Боб сыт. Забросил английский — Боб голодный и грустный 😿
              </p>
            </div>
            <ol className="space-y-3 list-none p-0 m-0">
              {[
                { icon: Target, title: 'Выбери цель', text: 'ЕГЭ, ОГЭ, IELTS, TOEFL, разговор или «для себя»' },
                { icon: Clock, title: 'Занимайся 15 минут в день', text: 'Три задания: чтение, аудирование, грамматика или речь' },
                { icon: Flame, title: 'Следи за стриком', text: 'Серия дней без пропусков и рекорд в профиле' },
              ].map((step) => (
                <li key={step.title} className="flex items-start gap-3">
                  <span className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                    <step.icon size={16} />
                  </span>
                  <span>
                    <span className="block font-bold text-sm text-stone-900">{step.title}</span>
                    <span className="block text-xs text-stone-500">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            <Link
              to="/dashboard"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-violet-600 text-white font-bold no-underline"
            >
              Открыть личный кабинет <ArrowRight size={18} />
            </Link>
          </Card>
        </section>

        {/* SEO-ТЕКСТ (для поисковиков) */}
        <section className="mb-8">
          <SectionHeading emoji="📘" title="Как заниматься английским бесплатно" />
          <div className="space-y-4">
            <p className="text-sm text-stone-600 leading-relaxed">
              До уровня B1–B2 реально дойти без платных курсов: важно не количество материалов, а регулярность. BEMAT
              собирает бесплатные ресурсы в одном месте — книги с переводом, мемы, фильмы с субтитрами, грамматику и
              разговорную практику — и добавляет то, чего обычно не хватает: план на 15 минут, прогресс и проверку
              письма с речью с помощью ИИ.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              <strong className="text-stone-800">Для экзаменов:</strong> банк заданий ФИПИ для ЕГЭ и ОГЭ, практические
              тесты British Council и ExamEnglish для IELTS и TOEFL, ИИ-репетиторы для проверки эссе и устной части.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              <strong className="text-stone-800">Для речи:</strong> ИИ-собеседник Боб, комнаты Free4talk с реальными
              людьми и произношение по видео носителей в YouGlish.
            </p>
          </div>
        </section>

        <section className="mb-8">
          <FaqSection items={HOME_FAQ} title="Вопросы и ответы" />
        </section>

        {/* АВТОР */}
        <section className="mb-6">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={CONTACTS.authorPhoto}
                alt={`${CONTACTS.authorName} — автор проекта BEMAT`}
                loading="lazy"
                className="w-28 sm:w-36 aspect-[3/4] object-cover rounded-2xl shadow-md mx-auto sm:mx-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CONTACTS.authorTags.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-[11px] font-bold border border-stone-200">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-black text-stone-900 mb-2">
                  {CONTACTS.authorName} — автор проекта
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-3">
                  Помогаю заговорить на английском: ЕГЭ и ОГЭ, IELTS и TOEFL, разговорная практика и грамматика без
                  скучной теории.
                </p>
                <ul className="space-y-1.5 mb-4 list-none p-0 m-0">
                  {['Разговорная практика', 'Грамматика без теории', 'Стратегии экзаменов'].map((t) => (
                    <li key={t} className="flex items-center gap-2 text-sm text-stone-600">
                      <CheckCircle size={16} className="text-emerald-500 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
                <Button href={CONTACTS.author} variant="dark" className="w-full sm:w-auto">
                  Бесплатный урок
                </Button>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

