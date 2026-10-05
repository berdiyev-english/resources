/**
 * ПРЕ-РЕНДЕР (важно для SEO).
 *
 * После `vite build` этот скрипт генерирует для каждого раздела отдельный
 * HTML-файл dist/<раздел>/index.html со своим:
 *   • <title>, description, keywords, canonical, OG/Twitter-тегами;
 *   • видимым текстом для поисковых роботов без JavaScript
 *     (заголовок, описание раздела, список ресурсов, FAQ).
 *
 * React-приложение при загрузке заменяет этот текст интерфейсом
 * (см. src/main.tsx), поэтому пользователь ничего не замечает.
 *
 * Запуск:  npm run build:seo   (build + prerender)
 */

import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const TMP_DIR = path.join(ROOT, '.prerender');
const TEMPLATE_PATH = path.join(DIST, 'index.html');

const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Собираем TS-данные сайта в один JS-файл, чтобы не дублировать контент. */
async function loadData() {
  await build({
    entryPoints: [
      path.join(ROOT, 'src/data/resources.ts'),
      path.join(ROOT, 'src/lib/site-config.ts'),
    ],
    outbase: path.join(ROOT, 'src'),
    outdir: TMP_DIR,
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'node18',
    logLevel: 'silent',
  });
  const { pathToFileURL } = await import('node:url');
  const resources = await import(pathToFileURL(path.join(TMP_DIR, 'data/resources.js')).href);
  const config = await import(pathToFileURL(path.join(TMP_DIR, 'lib/site-config.js')).href);
  return { ...resources, ...config };
}

function resourceListHtml(items) {
  return `<ul>${items
    .map((r) => `<li><a href="${esc(r.url)}">${esc(r.title)}</a> — ${esc(r.desc)}</li>`)
    .join('')}</ul>`;
}

function faqHtml(faq) {
  return faq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join('\n');
}

function fallbackHome({ SECTION_META, SITE_SECTIONS, RESOURCES }) {
  const popularIds = ['books-memes-bemem', 'books-2books', 'video-inoriginal', 'practice-bewords'];
  const popular = popularIds.map((id) => RESOURCES.find((r) => r.id === id)).filter(Boolean);

  return `
<h1>BEMAT — учить английский бесплатно: фильмы, книги, грамматика и подготовка к ЕГЭ</h1>
<p>BEMAT — бесплатный сервис для изучения английского языка. Здесь собраны проверенные сайты и сервисы, чтобы
читать книги на английском с переводом, учить язык по мемам, смотреть фильмы и сериалы с субтитрами,
тренировать грамматику и аудирование, практиковать разговорную речь с ИИ и готовиться к экзаменам
ЕГЭ, ОГЭ, IELTS и TOEFL.</p>
<h2>Разделы каталога</h2>
<ul>
${SITE_SECTIONS.map((id) => `<li><a href="${esc(SECTION_META[id].path)}">${esc(SECTION_META[id].h1)}</a></li>`).join('\n')}
<li><a href="/about">О проекте и авторе</a></li>
</ul>
<h2>Популярные ресурсы</h2>
${resourceListHtml(popular)}
<h2>План занятий на 15 минут в день</h2>
<p>В личном кабинете можно выбрать цель (ЕГЭ, ОГЭ, IELTS, TOEFL, разговорный английский или английский для себя)
и получить три задания на день: чтение, аудирование, грамматика или речь. Занимайся каждый день, следи за стриком
и помогай коту Бобу оставаться сытым.</p>
<p><a href="/dashboard">Открыть личный кабинет и собрать план</a></p>`.trim();
}

function fallbackSection(meta, groups) {
  return `
<h1>${esc(meta.h1)}</h1>
<p>${esc(meta.intro)}</p>
${groups
  .map(
    (g) => `<h2>${esc(g.group)}</h2>\n${resourceListHtml(g.items)}`
  )
  .join('\n')}
${meta.seoBlocks.map((b) => `<h2>${esc(b.h2)}</h2><p>${esc(b.text)}</p>`).join('\n')}
<h2>Частые вопросы</h2>
${faqHtml(meta.faq)}`.trim();
}

function fallbackAbout() {
  return `
<h1>О проекте BEMAT</h1>
<p>BEMAT — бесплатная точка входа в английский: проверенный каталог ресурсов (книги с переводом, фильмы с субтитрами,
грамматика, аудирование, разговорная практика, материалы для ЕГЭ, ОГЭ, IELTS и TOEFL) и ежедневный план на 15 минут
с котом Бобом.</p>
<h2>Принципы</h2>
<ul>
<li>Только польза: каждый сервис проверен на практике.</li>
<li>Бесплатно и без регистрации — прогресс хранится в браузере.</li>
<li>15 минут в день под твою цель.</li>
</ul>
<h2>Автор</h2>
<p>Абдуррахим Бердиев — преподаватель английского языка, подготовка к ЕГЭ, ОГЭ, IELTS и TOEFL, разговорная практика.
Сайт автора: <a href="https://berdiyev-eng.ru">berdiyev-eng.ru</a>.</p>
<h2>Контакты</h2>
<p>Telegram-канал: <a href="https://t.me/+NvMX2DrTa3w1NTVi">t.me/+NvMX2DrTa3w1NTVi</a></p>`.trim();
}

const META_RES = {
  description: /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/>/i,
  keywords: /<meta\s+name="keywords"\s+content="[\s\S]*?"\s*\/>/i,
  robots: /<meta\s+name="robots"\s+content="[\s\S]*?"\s*\/>/i,
  canonical: /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/>/i,
  ogUrl: /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/>/i,
  ogTitle: /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/>/i,
  ogDescription: /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/>/i,
  twTitle: /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/>/i,
  twDescription: /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/>/i,
};

function applyMeta(html, { title, description, keywords, path: routePath, siteUrl, noindex }) {
  const url = siteUrl + (routePath === '/' ? '/' : routePath);
  const t = esc(title);
  const d = esc(description);
  const k = esc(keywords || '');
  const u = esc(url);

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  out = out.replace(META_RES.description, `<meta name="description" content="${d}" />`);
  out = out.replace(META_RES.keywords, `<meta name="keywords" content="${k}" />`);
  out = out.replace(
    META_RES.robots,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'}" />`
  );
  out = out.replace(META_RES.canonical, `<link rel="canonical" href="${u}" />`);
  out = out.replace(META_RES.ogUrl, `<meta property="og:url" content="${u}" />`);
  out = out.replace(META_RES.ogTitle, `<meta property="og:title" content="${t}" />`);
  out = out.replace(META_RES.ogDescription, `<meta property="og:description" content="${d}" />`);
  out = out.replace(META_RES.twTitle, `<meta name="twitter:title" content="${t}" />`);
  out = out.replace(META_RES.twDescription, `<meta name="twitter:description" content="${d}" />`);
  return out;
}

function applyFallback(html, inner) {
  const start = '<!--seo-fallback-start-->';
  const end = '<!--seo-fallback-end-->';
  const from = html.indexOf(start);
  const to = html.indexOf(end);
  if (from === -1 || to === -1) return html; // маркеры не найдены — оставляем как есть
  return (
    html.slice(0, from + start.length) +
    `\n<div class="seo-fallback">\n${inner}\n</div>\n` +
    html.slice(to)
  );
}

async function main() {
  let template;
  try {
    template = await readFile(TEMPLATE_PATH, 'utf8');
  } catch {
    console.error('❌ Не найден dist/index.html. Сначала выполни `npm run build`.');
    process.exit(1);
  }

  const data = await loadData();
  const { SECTION_META, SITE_SECTIONS, groupsOfSection, SITE_URL } = data;

  const routes = [
    {
      path: '/',
      title: 'BEMAT — английский бесплатно: фильмы, книги, курсы, ЕГЭ и ОГЭ',
      description:
        'Бесплатные ресурсы для изучения английского: фильмы и сериалы с субтитрами, книги с переводом, 150+ уроков грамматики, разговорная практика с ИИ и подготовка к ЕГЭ, ОГЭ, IELTS, TOEFL.',
      keywords:
        'английский бесплатно, учить английский, фильмы на английском, книги на английском с переводом, грамматика английского, подготовка к ЕГЭ по английскому, подготовка к ОГЭ, ielts, toefl, аудирование, разговорный английский',
      inner: fallbackHome(data),
    },
    ...SITE_SECTIONS.map((id) => {
      const meta = SECTION_META[id];
      return {
        path: meta.path,
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        inner: fallbackSection(meta, groupsOfSection(id)),
      };
    }),
    {
      path: '/about',
      title: 'О проекте BEMAT — бесплатное изучение английского языка',
      description:
        'BEMAT — бесплатный проект для изучения английского: каталог проверенных ресурсов, план занятий на 15 минут в день и ИИ-репетиторы. Об авторе, принципах и поддержке проекта.',
      keywords: 'о проекте bemat, бесплатное изучение английского, автор BEMAT',
      inner: fallbackAbout(),
    },
  ];

  let count = 0;
  for (const route of routes) {
    let html = applyMeta(template, { ...route, siteUrl: SITE_URL });
    html = applyFallback(html, route.inner);

    const outDir = route.path === '/' ? DIST : path.join(DIST, route.path.replace(/^\//, ''));
    await mkdir(outDir, { recursive: true });
    await writeFile(path.join(outDir, 'index.html'), html, 'utf8');
    count += 1;
    console.log(`  ✔ ${route.path}`);
  }

  await rm(TMP_DIR, { recursive: true, force: true });
  console.log(`\n✅ Пре-рендер готов: ${count} страниц в dist/.`);
  console.log('   Загружай папку dist/ на хостинг — страницы отдают HTML со своим title и текстом.');
}

main().catch((err) => {
  console.error('Пре-рендер упал:', err);
  process.exit(1);
});
