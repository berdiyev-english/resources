import { CheckCircle, Heart, Mail, Rocket, Target, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import bobSticker from '../assets/bob-sticker.png';
import { CONTACTS, SECTIONS_NAV } from '../data/site';
import { Seo, faqPage } from '../lib/seo';
import { Breadcrumbs, FaqSection } from '../components/ContentBlocks';
import { Button, Card, SectionHeading } from '../components/UI';
import { SECTION_ICONS } from '../components/icons';
import { SITE_URL } from '../lib/seo';

const ABOUT_FAQ = [
  {
    q: 'Кто делает BEMAT?',
    a: `${CONTACTS.authorName} — преподаватель английского, аспирант педагогических наук. Проект BEMAT создан, чтобы бесплатные материалы для изучения английского были собраны в одном месте и подкреплены ежедневным планом.`,
  },
  {
    q: 'BEMAT бесплатный? В чём подвох?',
    a: 'Все подборки и задания бесплатны, рекламы внутри приложения нет. Проект поддерживают сами пользователи — если он помогает, можно поддержать разработку и «корм для Боба».',
  },
  {
    q: 'Нужно ли устанавливать приложение?',
    a: 'Нет. Сайт полностью работает в браузере телефона и компьютера: прогресс и избранное хранятся в браузере. Установка даёт только быстрый доступ с домашнего экрана и напоминания.',
  },
  {
    q: 'Куда сохраняется мой прогресс?',
    a: 'В localStorage браузера — на нашем сервере ничего не хранится, аккаунт не нужен. Если очистить данные браузера, прогресс сбросится.',
  },
  {
    q: 'Можно предложить свой сайт или бота в каталог?',
    a: `Да, напишите в Telegram-канал проекта (${CONTACTS.telegram}). Мы добавляем только бесплатные и реально полезные ресурсы.`,
  },
];

export function AboutPage() {
  return (
    <>
      <Seo
        seo={{
          path: '/about',
          title: 'О проекте BEMAT — бесплатное изучение английского языка',
          description:
            'BEMAT — бесплатный проект для изучения английского: каталог проверенных ресурсов, план занятий на 15 минут в день и ИИ-репетиторы. Об авторе, принципах и поддержке проекта.',
          keywords: 'о проекте bemat, бесплатное изучение английского, автор BEMAT, Абдуррахим Бердиев, английский бесплатно',
          jsonLd: [
            {
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              name: 'О проекте BEMAT',
              url: `${SITE_URL}/about`,
              inLanguage: 'ru-RU',
            },
            {
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: CONTACTS.authorName,
              jobTitle: 'Преподаватель английского языка',
              url: CONTACTS.author,
              image: CONTACTS.authorPhoto,
              worksFor: { '@type': 'EducationalOrganization', name: 'BEMAT', url: `${SITE_URL}/` },
              knowsAbout: ['English language teaching', 'ЕГЭ по английскому', 'ОГЭ по английскому', 'IELTS', 'TOEFL'],
            },
            faqPage(ABOUT_FAQ),
          ],
        }}
      />

      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'О проекте' }]} />

      <div className="px-4 lg:px-0 pt-3 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 mb-8">
          <img
            src={bobSticker}
            alt="Кот Боб — маскот BEMAT: книги, фильмы, практика, разговор, боты"
            className="w-44 sm:w-52 rounded-3xl bg-white shadow-sm shrink-0"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-3">О проекте BEMAT</h1>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              BEMAT — это бесплатная точка входа в английский. Вместо десятков разрозненных ссылок и «подборок из
              интернета» здесь собран проверенный каталог: книги с переводом, мемы, фильмы и сериалы с субтитрами,
              грамматика, аудирование, разговорная практика и материалы для ЕГЭ, ОГЭ, IELTS и TOEFL. А ещё — ежедневный
              план на 15 минут, стрик и кот Боб, который следит, чтобы ты не бросил.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 mb-10">
          {[
            { icon: <Target size={20} />, title: 'Только польза', text: 'Никакой «воды»: каждый сервис проверен и реально помогает учить язык.' },
            { icon: <Users size={20} />, title: 'Бесплатно и без регистрации', text: 'Материалы открыты всем, прогресс хранится в твоём браузере.' },
            { icon: <Rocket size={20} />, title: '15 минут в день', text: 'Небольшие задания под твою цель: экзамен, работа или фильмы в оригинале.' },
          ].map((c) => (
            <Card key={c.title} className="p-4">
              <span className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                {c.icon}
              </span>
              <h2 className="font-bold text-stone-900 text-sm mb-1">{c.title}</h2>
              <p className="text-xs text-stone-500 leading-relaxed">{c.text}</p>
            </Card>
          ))}
        </div>

        <section className="mb-10">
          <SectionHeading emoji="🗂" title="Что внутри" />
          <ul className="grid sm:grid-cols-2 gap-2 list-none p-0 m-0">
            {SECTIONS_NAV.map((s) => {
              const Icon = SECTION_ICONS[s.id];
              return (
                <li key={s.path}>
                  <Link
                    to={s.path}
                    className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-stone-100 shadow-sm no-underline hover:border-violet-200"
                  >
                    <span className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </span>
                    <span className="font-bold text-sm text-stone-800">{s.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mb-10">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={CONTACTS.authorPhoto}
                alt={`${CONTACTS.authorName} — автор BEMAT`}
                loading="lazy"
                className="w-32 sm:w-40 aspect-[3/4] object-cover rounded-2xl shadow-md mx-auto sm:mx-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CONTACTS.authorTags.map((t) => (
                    <span key={t} className="px-2.5 py-1 bg-stone-100 text-stone-600 rounded-full text-[11px] font-bold border border-stone-200">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-black text-stone-900 mb-2">{CONTACTS.authorName}</h2>
                <p className="text-sm text-stone-600 leading-relaxed mb-4">
                  Преподаю английский и готовлю к экзаменам: объясняю грамматику без зауми, ставлю речь и разбираю
                  стратегии ЕГЭ, ОГЭ, IELTS и TOEFL. BEMAT — продолжение этой работы: то, что действительно помогает
                  ученикам, собрано здесь в одном месте.
                </p>
                <ul className="space-y-1.5 mb-5 list-none p-0 m-0">
                  {['2000+ учеников', 'Автор курсов и ИИ-ботов BEMAT', 'Разговорная практика и стратегии экзаменов'].map(
                    (t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-stone-600">
                        <CheckCircle size={16} className="text-emerald-500 shrink-0" /> {t}
                      </li>
                    )
                  )}
                </ul>
                <div className="flex flex-wrap gap-2">
                  <Button href={CONTACTS.author}>Бесплатный урок</Button>
                  <Button href={CONTACTS.telegram} variant="ghost">
                    Telegram-канал
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section className="mb-10">
          <Card className="p-5 text-center">
            <span className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <Heart size={26} className="fill-rose-400 text-rose-400" />
            </span>
            <h2 className="text-lg font-black text-stone-900 mb-2">Как поддержать проект</h2>
            <p className="text-sm text-stone-600 mb-4 max-w-md mx-auto">
              BEMAT делается в одиночку и без рекламы. Если проект экономит твоё время — поддержи разработку, и Боб не
              останется голодным 🐱
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button href={CONTACTS.donate}>Поддержать</Button>
              <Button href={CONTACTS.author} variant="ghost">
                <Mail size={16} /> Связаться с автором
              </Button>
            </div>
          </Card>
        </section>

        <section>
          <FaqSection items={ABOUT_FAQ} title="Частые вопросы о проекте" />
        </section>
      </div>
    </>
  );
}
