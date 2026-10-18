/**
 * ДЕПЛОЙ В КОРЕНЬ РЕПОЗИТОРИЯ (bemat.ru берёт файлы из корня).
 *
 * Проблема, которую решает этот скрипт:
 *   Корень репозитория — это «старая копия» dist/. Когда менялись имена
 *   файлов сборки (logo-BRaaqtNl.png, index-*.js и т.д.), в корень копировали
 *   только часть файлов. В итоге браузер просил /assets/logo-BRaaqtNl.png,
 *   которого в корне нет → 404 → битый логотип/лапа/фото автора. Плюс старый
 *   service worker кешировал эти 404, и картинки «не появлялись» даже после
 *   фикса.
 *
 * Решение: ВСЕГДА пересобирать и зеркалить dist/ в корень целиком:
 *   npm run build:seo && node scripts/deploy-root.mjs
 *
 * Что делает:
 *   1) Удаляет из корня старые сгенерированные ассеты assets/index-*.{js,css}
 *      и раскиданные по корню хешеные картинки (logo-XXXX.png и т.п.).
 *   2) Копирует ВЕСЬ dist/ в корень (index.html, assets/, thumbs/, sw.js,
 *      favicon, author-berdiyev.jpg, bob-logo.png, страницы разделов .../index.html).
 *   3) Проверяет, что каждый src/href из корневых HTML-файлов реально существует,
 *      и печатает список проблем (должен быть пустым).
 */

import { cp, rm, readFile, writeFile, readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { existsSync } from 'node:fs';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('Нет dist/index.html — сначала выполни: npm run build:seo');
  process.exit(1);
}

// --- 1. чистка старых артефактов сборки в корне ------------------------------
const rootEntries = await readdir(ROOT);
let removed = 0;
for (const name of rootEntries) {
  // хешеные картинки в корне: logo-BRaaqtNl.png, bob-sticker-640PEbRi.png...
  if (/^[a-z0-9-]+-[A-Za-z0-9_-]{6,}\.(png|jpg|jpeg|svg|ico|webp|js|css)$/i.test(name)) {
    await rm(path.join(ROOT, name), { force: true });
    removed++;
  }
}
// старые js/css внутри корневого assets/ (кроме служебных папок)
const rootAssets = path.join(ROOT, 'assets');
if (existsSync(rootAssets)) {
  for (const name of await readdir(rootAssets)) {
    if (/^index-.*\.(js|css)$/.test(name) || /^[a-z0-9-]+-[A-Za-z0-9_-]{6,}\.(png|jpg|jpeg|svg|ico|webp)$/i.test(name)) {
      await rm(path.join(rootAssets, name), { force: true });
      removed++;
    }
  }
}
console.log(`Удалено старых артефактов: ${removed}`);

// --- 2. зеркалим весь dist/ в корень -----------------------------------------
async function copyDir(src, dst) {
  await mkdir(dst, { recursive: true });
  for (const entry of await readdir(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) await copyDir(s, d);
    else await cp(s, d, { force: true });
  }
}
await copyDir(DIST, ROOT);
console.log('dist/ скопирован в корень.');

// --- 3. проверка ссылок в корневых HTML --------------------------------------
const htmlFiles = [];
(async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && !['node_modules', '.git', 'src', 'scripts', 'public', 'deploy'].includes(e.name)) {
      await walk(p);
    } else if (e.name.endsWith('.html')) {
      htmlFiles.push(p);
    }
  }
})(ROOT);

const problems = [];
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"]+\.(?:js|css|png|jpe?g|svg|ico|webp)(?:\?[^"]*)?)"/g)]
    .map((m) => m[1])
    .filter((u) => !/^https?:|^data:|^\/\//.test(u));
  for (const ref of refs) {
    const rel = ref.replace(/^\.\//, '').replace(/^\//, '');
    const target = path.resolve(path.dirname(file), rel);
    const targetRoot = path.join(ROOT, rel);
    if (!existsSync(target) && !existsSync(targetRoot)) {
      problems.push(`${path.relative(ROOT, file)} -> ${ref}`);
    }
  }
}

if (problems.length) {
  console.error('Битые ссылки (' + problems.length + '):');
  for (const p of problems) console.error('  ' + p);
  process.exit(1);
}
console.log('Все локальные ссылки во всех HTML существуют ✔');
