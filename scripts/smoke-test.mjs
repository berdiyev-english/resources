/**
 * Смоук-тест приложения в jsdom: рендерим реальные страницы и проверяем,
 * что они отрисовываются без ошибок и содержат ожидаемый контент.
 *
 * Запуск: node scripts/smoke-test.mjs   (нужен npm install и jsdom)
 */

import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const TMP = path.join(ROOT, 'node_modules', '.smoke');

function expose(key, value) {
  try {
    Object.defineProperty(globalThis, key, { value, writable: true, configurable: true });
  } catch {
    /* ignore */
  }
}

async function bundleApp() {
  await mkdir(TMP, { recursive: true });
  const outfile = path.join(TMP, 'app.mjs');
  await build({
    entryPoints: [path.join(ROOT, 'src/App.tsx')],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'browser',
    jsx: 'automatic',
    target: 'es2020',
    loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.css': 'empty' },
    // react и друзья — внешние, чтобы использовать те же инстансы, что и в тесте
    external: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'lucide-react', 'clsx', 'tailwind-merge'],
    logLevel: 'silent',
  });
  return pathToFileURL(outfile).href;
}

function setupDom(route, errors) {
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => {
    if (!/not implemented/i.test(e.message)) errors.push(`jsdom: ${e.message}`);
  });
  virtualConsole.on('error', (...args) => errors.push(`console.error: ${args.join(' ')}`));

  const dom = new JSDOM(
    `<!doctype html><html lang="ru"><head><title>t</title></head><body><div id="root"></div></body></html>`,
    { url: `https://bemat.ru${route}`, pretendToBeVisual: true, virtualConsole }
  );

  const { window } = dom;
  expose('window', window);
  expose('document', window.document);
  expose('navigator', window.navigator);
  expose('self', window);
  expose('location', window.location);

  for (const key of [
    'HTMLElement', 'SVGElement', 'Element', 'Node', 'NodeList', 'Event', 'CustomEvent', 'MouseEvent',
    'KeyboardEvent', 'FocusEvent', 'InputEvent', 'Blob', 'File', 'FormData', 'URL', 'URLSearchParams',
    'MutationObserver', 'IntersectionObserver', 'ResizeObserver', 'Text', 'Comment', 'DocumentFragment',
    'XMLHttpRequest', 'Headers', 'AbortController', 'screen', 'history', 'localStorage', 'sessionStorage',
    'CSS', 'Image', 'DOMParser', 'DataTransfer', 'FileReader', 'PopStateEvent', 'structuredClone',
  ]) {
    if (window[key] !== undefined) expose(key, window[key]);
  }

  for (const key of ['getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'fetch', 'scrollTo']) {
    if (typeof window[key] === 'function') expose(key, window[key].bind(window));
  }

  if (!window.matchMedia) {
    expose('matchMedia', () => ({
      matches: false,
      media: '',
      addEventListener() {},
      removeEventListener() {},
      addListener() {},
      removeListener() {},
      onchange: null,
      dispatchEvent: () => false,
    }));
  }

  try {
    Object.defineProperty(window.navigator, 'serviceWorker', { value: undefined, configurable: true });
  } catch {
    /* ignore */
  }

  return window;
}

async function renderRoute(AppComponent, React, createRoot, route) {
  const errors = [];
  const window = setupDom(route, errors);
  const container = window.document.getElementById('root');
  createRoot(container).render(React.createElement(AppComponent));
  await new Promise((r) => setTimeout(r, 350));
  return { window, container, errors, text: container.textContent || '' };
}

async function main() {
  const bundleUrl = await bundleApp();

  const React = await import('react');
  const { createRoot } = await import('react-dom/client');
  const { App } = await import(bundleUrl);

  const cases = [
    {
      route: '/',
      checks: [
        ['Заголовок h1', (c) => !!c.querySelector('h1')],
        ['Лендинг: есть описание приложения', (_c, t) => t.includes('Как это работает')],
        ['Каталог с разделами', (_c, t) => t.includes('Каталог ресурсов') && t.includes('Книги')],
        ['Ресурсы видны', (_c, t) => t.includes('2books') && t.includes('Inoriginal')],
        ['FAQ отрисован', (_c, t) => t.includes('Что такое BEMAT')],
        ['На лендинге нет нижней панели', (c) => !c.querySelector('nav[aria-label="Навигация по приложению"]')],
        ['Спонсора дня больше нет', (_c, t) => !/Спонсор/i.test(t)],
      ],
    },
    {
      route: '/books',
      checks: [
        ['H1 раздела', (c) => /Книги на английском/.test(c.querySelector('h1')?.textContent || '')],
        ['Ресурсы раздела', (_c, t) => t.includes('Linguasaur') && t.includes('Project Gutenberg')],
        ['Группа «Мемы и юмор» на месте', (_c, t) => t.includes('Мемы и юмор на английском')],
        ['SEO-текст раздела', (_c, t) => t.includes('С чего начать читать')],
        ['FAQ раздела', (_c, t) => t.includes('Где читать книги на английском с переводом')],
        ['Музыкальных сервисов нет', (_c, t) => !/LyricsTraining|песн/i.test(t)],
      ],
    },
    {
      route: '/dashboard',
      checks: [
        ['Кабинет приветствует', (_c, t) => t.includes('Привет')],
        ['Нижняя панель: 5 пунктов', (c) => {
          const nav = c.querySelector('nav[aria-label="Навигация по приложению"]');
          return !!nav && nav.querySelectorAll('a').length === 5;
        }],
        ['В нижней панели нет пункта «Каталог»', (c) => {
          const nav = c.querySelector('nav[aria-label="Навигация по приложению"]');
          return !!nav && ![...nav.querySelectorAll('a')].some((a) => a.getAttribute('href') === '/');
        }],
        ['План на сегодня есть', (_c, t) => t.includes('План на сегодня')],
        ['Кот Боб на месте', (_c, t) => t.includes('Боб')],
        ['Задания отрисованы', (c) => (c.querySelectorAll('[aria-label="Отметить выполненным"]').length > 0)],
      ],
    },
    {
      route: '/about',
      checks: [
        ['H1 «О проекте»', (c) => /О проекте BEMAT/.test(c.querySelector('h1')?.textContent || '')],
        ['Автор указан', (_c, t) => t.includes('Бердиев')],
        ['FAQ о проекте', (_c, t) => t.includes('BEMAT бесплатный')],
      ],
    },
    {
      route: '/favorites',
      checks: [
        ['Пустое состояние избранного', (_c, t) => t.includes('Пока пусто')],
        ['Подсказка про звёздочку', (_c, t) => t.includes('звёздочкой')],
      ],
    },
    {
      route: '/несуществующая-страница',
      checks: [['Страница 404', (_c, t) => t.includes('Страница не найдена')]],
    },
  ];

  console.log('\nСмоук-тест BEMAT (jsdom)\n');
  let failed = 0;
  const allErrors = [];

  for (const testCase of cases) {
    const { container, text, errors } = await renderRoute(App, React, createRoot, testCase.route);
    console.log(`${testCase.route}`);
    for (const [name, check] of testCase.checks) {
      const ok = Boolean(check(container, text));
      console.log(`  ${ok ? '✅' : '❌'} ${name}`);
      if (!ok) failed += 1;
    }
    if (errors.length) {
      console.log('  ⚠️  ошибки рендера:');
      errors.slice(0, 3).forEach((e) => console.log('     -', e));
      allErrors.push(...errors);
    }
    console.log('');
  }

  // ---------------- Интерактивные проверки ----------------
  console.log('Интерактив\n');

  // 1. Отметка задания в кабинете → прогресс сохраняется в localStorage
  {
    const { window, container, errors } = await renderRoute(App, React, createRoot, '/dashboard');
    const checkbox = container.querySelector('[aria-label="Отметить выполненным"]');
    checkbox?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const saved = JSON.parse(window.localStorage.getItem('bemat_user_v3') || '{}');
    const ok = Array.isArray(saved.completedTasks) && saved.completedTasks.length === 1;
    console.log(`  ${ok ? '✅' : '❌'} Задание отмечается и сохраняется (completedTasks: ${saved.completedTasks?.length ?? 0})`);
    if (!ok) failed += 1;
    if (errors.length) allErrors.push(...errors);
  }

  // 2. Звёздочка в разделе → ресурс попадает в избранное
  {
    const { window, container, errors } = await renderRoute(App, React, createRoot, '/books');
    const star = container.querySelector('button[aria-label^="В избранное"]');
    star?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const saved = JSON.parse(window.localStorage.getItem('bemat_user_v3') || '{}');
    const okFav = Array.isArray(saved.favorites) && saved.favorites.length === 1;
    console.log(`  ${okFav ? '✅' : '❌'} Звёздочка добавляет сайт в избранное (${saved.favorites?.[0] ?? '—'})`);
    if (!okFav) failed += 1;
    if (errors.length) allErrors.push(...errors);
  }

  // 3. Замена задания меняет его на другое из пула
  {
    const { window, container, errors } = await renderRoute(App, React, createRoot, '/dashboard');
    const before = container.querySelectorAll('[aria-label="Отметить выполненным"]').length;
    const swap = container.querySelector('[aria-label="Заменить задание"]');
    swap?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const saved = JSON.parse(window.localStorage.getItem('bemat_user_v3') || '{}');
    const okSwap = Array.isArray(saved.planTaskIds) && saved.planTaskIds.length === before;
    console.log(`  ${okSwap ? '✅' : '❌'} Замена задания сохраняет размер плана (${saved.planTaskIds?.length ?? 0} из ${before})`);
    if (!okSwap) failed += 1;
    if (errors.length) allErrors.push(...errors);
    console.log('');
  }

  // 4. Удалённые сервисы не вернулись
  {
    const { container, errors } = await renderRoute(App, React, createRoot, '/');
    const text = container.textContent || '';
    const okRemoved = !/Anki|Duolingo/i.test(text);
    console.log('\nКаталог');
    console.log(`  ${okRemoved ? '✅' : '❌'} Anki и Duolingo удалены`);
    if (!okRemoved) failed += 1;
    if (errors.length) allErrors.push(...errors);
    console.log('');
  }

  // 5. Меню не дублирует нижнюю навигацию на телефоне
  {
    const { window, container, errors } = await renderRoute(App, React, createRoot, '/');
    const menuBtn = container.querySelector('[aria-label="Открыть меню"]');
    menuBtn?.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 200));

    const drawer = container.querySelector('[role="dialog"][aria-label="Меню"]');
    const hrefs = drawer ? [...drawer.querySelectorAll('a')].map((a) => a.getAttribute('href')) : [];
    const hasExtra = ['/', '/courses', '/bots', '/about', '/favorites'].every((h) => hrefs.includes(h));
    const noDuplicates = !['/books', '/video', '/practice', '/speak'].some((h) => hrefs.includes(h));
    const ok = Boolean(drawer) && hasExtra && noDuplicates;

    console.log(`\nНавигация`);
    console.log(`  ${drawer ? '✅' : '❌'} Меню открывается`);
    console.log(`  ${hasExtra ? '✅' : '❌'} В меню есть Каталог, Курсы, Боты, О проекте, Избранное`);
    console.log(`  ${noDuplicates ? '✅' : '❌'} Меню не повторяет нижнюю панель (без Книги/Видео/Практика/Разговор)`);
    if (!ok) failed += 1;
    if (errors.length) allErrors.push(...errors);
    console.log('');
  }

  console.log(failed === 0 && allErrors.length === 0 ? '✅ Все проверки пройдены' : `❌ Провалено проверок: ${failed}, ошибок: ${allErrors.length}`);
  process.exit(failed > 0 || allErrors.length > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Смоук-тест упал:', err);
  process.exit(1);
});
