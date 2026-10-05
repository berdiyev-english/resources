# BEMAT 2.0 — сайт + приложение для изучения английского

Что изменилось по сравнению с прошлой версией — коротко:

| Задача | Как решено |
|---|---|
| Пользоваться с телефона **без установки** | Убран «гейт» установки. Сайт полностью работает в браузере: те же разделы, кабинет, избранное. Установка — только необязательный баннер через 25 секунд |
| Отдельная страница «О проекте» | Роут `/about` — миссия, автор, картинки Боба, принципы, поддержка, FAQ |
| Баги | План дня не «залипает» и не пересобирается при перезагрузке; стрик не сбрасывается при возврате в тот же день; корректно работают замена/добавление заданий, прогресс не теряется при смене цели; картинки не ломают вёрстку; модалки отдают скролл; свой SW вместо чужого OneSignal |
| Разнообразные задания | Пул из ~50 заданий на 6 целей. Каждый день — 3 задания **разных типов** (чтение, аудирование, грамматика/лексика, письмо, речь). Можно заменить, добавить своё, добавить дополнительные |
| Иконки вместо эмодзи | Интерфейс переведён на `lucide-react` (разделы, типы заданий, шаги, меню). Эмодзи остались только как запасное превью карточек и в текстах описаний |
| Верхнее меню не дублирует нижнее | На телефоне снизу: Кабинет · Каталог · Книги · Видео · Практика · Разговор. В меню (гамбургер) — только Курсы, Боты, О проекте, Избранное, ИИ-боты и действия. На десктопе в шапке — полная навигация, в меню — только действия |
| Фото Боба | Картинки пользователя вставлены: чистый кот → аватар/логотип, иконки PWA и OG-картинка; кот в комнате → «сытый» и «голодный»; полный стикер с надписью и иконками → главная и «О проекте» |
| Без музыки | LyricsTraining удалён из каталога и из заданий (заодно убраны упоминания песен) |
| Bemem и ещё сайты | Каталог вырос до **56 ресурсов**: Bemem (мемы + английский) и группа «Мемы и юмор», Language Reactor, ELLLO, TED Talks, Perfect English Grammar, Cambridge Dictionary, HelloTalk, Anki, Duolingo, Storynory, Lit2Go, Gutenberg, News in Levels |
| Другие карточки на телефоне | Карточка ресурса на мобильном: вся кликабельна, крупное превью, звёздочка избранного. На desktop — «широкий» вид |
| Пункт «Избранное» в кабинете | Звёздочка на каждой карточке, блок в кабинете + отдельная страница `/favorites`, счётчик в шапке |
| Максимальная индексация | Пре-рендер HTML для каждого раздела, свои title/description/canonical/OG, JSON-LD (WebSite, Organization, Person, BreadcrumbList, ItemList, FAQPage), sitemap.xml, robots.txt, статичный текст в `index.html` для роботов без JS, отдельные SEO-тексты и FAQ на каждый раздел |
| На будущее | Единый каталог ресурсов в одном файле, разделы добавляются в 2 строки; готовые места под push, офлайн-режим, RuStore/TWA |

---

## 1. Запуск

```bash
npm install
npm run dev         # http://localhost:5173 (доступно и по локальной сети — host: true)
npm run build       # проверка типов + сборка в dist/
npm run build:seo   # сборка + пре-рендер SEO-страниц (рекомендуется для продакшена)
npm run serve:dist  # локальный просмотр прод-сборки с пре-рендером (порт 4173)
npm run smoke       # смоук-тест: 6 страниц + интерактив + проверка навигации
npm run preview:single  # автономный preview.html (один файл, без интернета) — для быстрого показа
```

Стек: React 18 + Vite 6 + TypeScript + Tailwind v4 + react-router-dom.
`framer-motion` удалён (анимации — на CSS), OneSignal-скрипт удалён (уведомления — через Web Notifications + свой `public/sw.js`).

### Если у тебя в проекте Tailwind v3

Приложение использует обычные классы Tailwind (`flex`, `rounded-2xl`, `bg-violet-600`, …), которые есть в обеих версиях. Градиенты специально вынесены в кастомные классы (`.grad-violet`, `.bar-orange`, …), чтобы не зависеть от переименований `bg-gradient-*`.

Что сделать при переносе в свой проект на Tailwind v3:

1. Оставь свои `@tailwind base; @tailwind components; @tailwind utilities;` в начале `src/index.css`.
2. Скопируй в **конец** своего `index.css` всё, что в `src/index.css` идёт после строки `@import "tailwindcss";` (кастомные классы, анимации, `.pb-safe`, `.seo-fallback`).
3. Блок `@theme { --font-sans: ... }` замени на обычный CSS (`body { font-family: "DM Sans", system-ui, sans-serif; }`) — в v3 такого синтаксиса нет.
4. Из `package.json` убери `tailwindcss` и `@tailwindcss/vite`, добавь `tailwindcss@^3` + `postcss` + `autoprefixer` и `postcss.config.js`.

---

## 2. Структура

```
src/
  App.tsx                    # роуты, обработка ошибок, каркас страницы
  main.tsx                   # вход + регистрация service worker + очистка SEO-фолбэка
  index.css                  # Tailwind + кастомные классы (переносить в свой проект отсюда)
  assets/                    # logo.png, cathungry.png, catfed.png (оптимизированы до ~100–130 КБ)
  components/
    Header.tsx               # шапка, меню-дровер, нижняя навигация, футер
    ResourceCard.tsx         # карточка ресурса (мобильная и desktop-версия) + избранное
    Modals.tsx               # онбординг, стрик, Боб, профиль, задание, напоминания
    InstallBanner.tsx        # необязательный баннер установки + инструкция по устройствам
    ContentBlocks.tsx        # хлебные крошки, FAQ, SEO-тексты, чипсы разделов
    UI.tsx                   # Button, Card, Modal, Accordion, Progress, EmptyState…
    Sponsors.tsx             # «спонсор дня» (rel="sponsored")
  data/
    resources.ts             # 🔴 ВЕСЬ КАТАЛОГ + SEO-тексты разделов + рекомендации по целям
    tasks.ts                 # 🔴 ПУЛ ЗАДАНИЙ по целям
    site.ts                  # навигация, боты, контакты, ссылки
  lib/
    seo.tsx                  # управление title/description/canonical/OG/JSON-LD
    site-config.ts           # SITE_URL, SITE_NAME (использует и пре-рендер)
    storage.ts               # прогресс в localStorage (+ миграция старых данных!)
    notify.ts                # локальные напоминания
    utils.ts                 # cn, device-detect, seeded random, склонения
  pages/
    HomePage.tsx             # каталог + поиск + SEO-текст + FAQ
    SectionPage.tsx          # /books /video /practice /speak /courses /bots
    DashboardPage.tsx        # кабинет: план, стрик, Боб, избранное, напоминания
    FavoritesPage.tsx        # избранное
    AboutPage.tsx            # о проекте
  state/
    UserContext.tsx          # прогресс, план дня, избранное, уведомления
    InstallContext.tsx       # beforeinstallprompt
scripts/prerender.mjs        # генерация SEO-HTML
public/
  robots.txt, sitemap.xml, manifest.webmanifest, sw.js, og-bemat.png, icophot/*
deploy/                      # nginx / Vercel / Netlify конфиги
```

---

## 3. Как добавлять контент (это главное)

### Картинки Боба

`src/assets/logo.png` — чистый кот (аватар, шапка, кабинет), `bob-sticker.png` — полный стикер с надписью BEMAT
(главная, «О проекте»), `cathungry.png` / `catfed.png` — кот с пустой и полной миской. Иконки приложения лежат в
`public/icophot/` и собраны из `logo.png` (96/180/192/512 px), OG-картинка — `public/og-bemat.png`.

### Новый сайт в каталог

Открой `src/data/resources.ts` и добавь объект в `RESOURCES`:

```ts
{
  id: 'books-my-site',            // уникальный id (используется в избранном)
  section: 'books',               // books | video | practice | speak | courses | bots
  group: 'Читать на английском',  // подзаголовок внутри раздела
  title: 'Мой сервис — книги',
  desc: 'Одно предложение: чем полезен.',
  img: 'https://…/preview.jpg',   // можно не указывать — будет эмодзи
  url: 'https://example.com',
  badge: 'С переводом',           // необязательная плашка
  emoji: '📖',
}
```

Сайт автоматически появится: в разделе, в поиске на главной, в избранном, в пре-рендеренном HTML и JSON-LD.

### Новое задание

`src/data/tasks.ts` → массив `TASK_POOL`:

```ts
{
  id: 'ege-new-task',
  goal: 'ege',                     // ege | oge | ielts | toefl | speak | fun
  category: 'speaking',            // reading | listening | grammar | vocab | writing | speaking | pronunciation
  title: 'Устная часть: описать график за 3 минуты',
  hint: 'Совет, который увидит пользователь',   // необязательно
  time: 6,
  link: 'https://…',               // внешняя ссылка
  // или internal: '/speak'        // ссылка внутрь приложения
}
```

Планировщик сам следит, чтобы в дне были задания разных категорий.

### Новый раздел каталога

1. Добавь `SectionId` в `SectionId` (`resources.ts`).
2. Заполни `SECTION_META` (title, description, keywords, intro, seoBlocks, faq) — это и есть SEO-текст страницы.
3. Добавь роут в `src/App.tsx` (`<Route path="/new" element={<SectionPage section="new" />} />`).
4. Добавь URL в `public/sitemap.xml`.
5. Пересобери с пре-рендером: `npm run build:seo` — папка `dist/new/index.html` появится сама.

### Цель пользователя

`src/lib/storage.ts` → `GOAL_OPTIONS` + новый пул в `TASK_POOL` + рекомендации в `GOAL_RECOMMENDATIONS`.

---

## 4. SEO: что сделано и что сделать тебе

**Уже в коде**

- Свои `title`, `description`, `keywords`, `canonical`, OG/Twitter для **каждой** страницы (меняются на лету в `Seo`).
- Пре-рендер: `dist/books/index.html`, `dist/video/index.html`, … — поисковик получает готовый HTML (заголовок, описание, список ресурсов, FAQ) даже без исполнения JS. Скрипт `scripts/prerender.mjs` собирает данные напрямую из `src/data/resources.ts`, так что дублировать тексты не нужно.
- `index.html` содержит видимый статичный текст внутри `#root` (между комментариями `seo-fallback-start/end`) — его видит любой робот, а React при старте его заменяет.
- Разметка Schema.org: WebSite + SearchAction, EducationalOrganization, Person (автор), BreadcrumbList, ItemList (список ресурсов), FAQPage (вопросы-ответы на каждой странице).
- `robots.txt` (закрывает `/dashboard`, `/favorites`, `/404`, чистит UTM) и `sitemap.xml`.
- Yandex.Metrika (id `106787121`) перенесена в `index.html` как была.

**Что сделать руками (обязательно)**

1. Задеплоить `dist/` так, чтобы отдавались как «файлы + fallback на index.html» (см. `deploy/`).
2. Яндекс.Вебмастер и Google Search Console: добавить `https://bemat.ru`, отправить `sitemap.xml`, запросить переобход страниц.
3. Проверить пре-рендер: открыть вкладку без JS (или `curl https://bemat.ru/books | grep title`) — должен быть `title` раздела и текст.
4. Яндекс: включить «Переобход страниц», проверить `robots.txt` в Вебмастере. Турбо-страницы не нужны.
5. Добавить сайт в Яндекс.Бизнес/каталоги, где уместно (для брендового запроса «бимат»).
6. Скорость: загружать хостинг с HTTP/2 + gzip/brotli (в `deploy/nginx-bemat.conf` уже настроено).

**Про индексацию страниц с несколькими вариантами:** параметры `?utm_*`, `yclid`, `gclid` вычищены в robots.txt и не создают дубли.

---

## 5. Уведомления и push

- Сейчас: напоминания через Web Notification API + свой `public/sw.js` (работают, пока вкладка/приложение открыты или в кэше браузера). На Android без service worker уведомления показывать нельзя — поэтому SW добавлен.
- Кнопка «Отправить тестовое уведомление» в кабинете сразу просит разрешение и показывает пример.
- Если нужны напоминания при **полностью закрытом** приложении (например, «стрик горит» в 19:00) — самый быстрый путь:

```html
<!-- index.html, перед </head> -->
<script src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js" defer></script>
<script>
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  OneSignalDeferred.push(function (OneSignal) {
    OneSignal.init({ appId: 'ТВОЙ_APP_ID', safari_web_id: 'web.onesignal.auto.XXXX' });
  });
</script>
```

и в `src/lib/notify.ts` → `scheduleDailyReminder` заменить локальный `showNow()` на вызов `OneSignal.push(['sendTag', …])` / серверную рассылку. Ключ в том, что OneSignal сам поднимет свой SW — тогда из `public/sw.js` нужно убрать `install`/`activate` самопропуск, чтобы воркеры не конфликтовали (инструкция OneSignal описывает это в разделе «Existing Service Worker»).

---

## 6. Установка приложения

Три варианта, все уже поддержаны:

1. **PWA** — `manifest.webmanifest` + `sw.js`: Android/Chrome покажет «Установить приложение», iOS — через «Поделиться → На экран Домой» (инструкция в модалке `InstallBanner.tsx`).
2. **RuStore** — ссылка `CONTACTS.rustore` в `src/data/site.ts` (сейчас на старое приложение; замени на новое, когда будет сборка).
3. **TWA/WebView-обёртка** — если понадобится APK в RuStore: оборачиваешь `https://bemat.ru` в Trusted Web Activity (Android Studio / Bubblewrap), тот же manifest подойдёт.

---

## 7. Деплой

```bash
npm run build:seo      # dist/ с пре-рендеренными страницами
npm run serve:dist     # проверить локально, что /books отдаёт SEO-версию
```

Что смотреть перед заливкой: `/`, `/books`, `/about` — со своим `title`; `/dashboard` и `/favorites` — обычная SPA-оболочка (они закрыты от индексации в `robots.txt`).

- **Свой VPS (nginx):** `deploy/nginx-bemat.conf` — скопировать в `/etc/nginx/sites-available/bemat.ru`, поправить `root`, `ssl_certificate`, выполнить `nginx -t && systemctl reload nginx`.
- **Vercel:** `deploy/vercel.json` (переименовать в `vercel.json` в корне проекта).
- **Netlify:** `deploy/netlify.toml` (переименовать в `netlify.toml` в корне).

Обновлять контент: правишь `src/data/*.ts` → `npm run build:seo` → заливаешь `dist/`.

---

## 8. Чек-лист перед публикацией

- [ ] Заменил `src/data/site.ts` ссылки (RuStore, донат, Telegram, сайт автора), если изменились.
- [ ] Проверил `SITE_URL` в `src/lib/site-config.ts` (сейчас `https://bemat.ru`).
- [ ] Прогнал `npm run build:seo` — 8 страниц в `dist/`.
- [ ] Обновил `lastmod` в `public/sitemap.xml` после крупных правок.
- [ ] Отправил sitemap в Яндекс.Вебмастер и Google Search Console.
- [ ] Проверил на телефоне: каталог → звёздочка → «Избранное» → «Мой план» → уведомления.
- [ ] Проверил в приватном окне без JS: страница показывает заголовок и список ресурсов.

---

## 9. Идеи на будущее

- Прогресс по ресурсам («открыл впервые», «занимался сегодня») — данные уже есть, нужен счётчик.
- Поиск с подсказками по заданиям и уровням сложности.
- Коллекции: «Английский для путешествий», «250 слов уровня A2» и т. п.
- Расписание занятий по дням недели, недельный отчёт по минутам.
- Push-рассылки (OneSignal), офлайн-режим (`vite-plugin-pwa`), TWA-сборка в RuStore.
- Голосовые задания с оценкой произношения (Web Speech API).
