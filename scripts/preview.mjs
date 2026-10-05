/**
 * Автономное превью в одном HTML-файле: JS, CSS, шрифты-фолбэк и картинки
 * встроены внутрь, роутер подменён на memory-роутер.
 *
 * Нужно, чтобы посмотреть интерфейс там, где нет сети и сервера
 * (например, в просмотрщике файлов). Обычный сайт — это dist/ + npm run serve:dist.
 *
 * Запуск: npm run preview:single   → preview.html
 */

import { build } from 'esbuild';
import { readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const TMP = path.join(ROOT, 'node_modules', '.preview');

async function main() {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  const assets = await readdir(path.join(DIST, 'assets'));
  const cssFile = assets.find((f) => f.startsWith('index-') && f.endsWith('.css'));
  const css = cssFile ? await readFile(path.join(DIST, 'assets', cssFile), 'utf8') : '';

  // Собираем всё приложение в один скрипт (включая React), картинки — в data-URI
  const entry = path.join(TMP, 'entry.tsx');
  await rm(TMP, { recursive: true, force: true });
  await (await import('node:fs/promises')).mkdir(TMP, { recursive: true });
  await writeFile(
    entry,
    `import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from '${path.join(ROOT, 'src/App.tsx').replace(/\\/g, '/')}';
const el = document.getElementById('root');
el.replaceChildren();
createRoot(el).render(<StrictMode><App /></StrictMode>);
`,
    'utf8'
  );

  const outfile = path.join(TMP, 'preview-bundle.js');
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    minify: true,
    format: 'iife',
    platform: 'browser',
    jsx: 'automatic',
    target: 'es2020',
    loader: { '.png': 'dataurl', '.jpg': 'dataurl', '.svg': 'dataurl', '.css': 'empty' },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  });
  const bundle = await readFile(outfile, 'utf8');

  let html = template;
  // внешние ресурсы не нужны — всё встроено
  html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, '');
  html = html.replace(/<link[^>]*fonts\.(googleapis|gstatic)[^>]*>/g, '');
  html = html.replace(/<script type="text\/javascript">[\s\S]*?<\/script>/g, '');
  html = html.replace(/<script[^>]*src="\/assets\/[^"]+"[^>]*><\/script>/g, '');
  html = html.replace(/<link[^>]*rel="manifest"[^>]*>/g, '');
  html = html.replace('</head>', `<style>${css}</style></head>`);
  html = html.replace('</body>', `<script>window.__BEMAT_PREVIEW__ = true;</script><script>${bundle}</script></body>`);

  await writeFile(path.join(ROOT, 'preview.html'), html, 'utf8');
  await rm(TMP, { recursive: true, force: true });

  const kb = Math.round((await readFile(path.join(ROOT, 'preview.html'))).length / 1024);
  console.log(`✅ preview.html готов (${kb} КБ) — один файл, работает без интернета.`);
}

main().catch((err) => {
  console.error('Не удалось собрать превью:', err);
  process.exit(1);
});
