/*
 * Синхронизирует готовую сборку dist/ с историческим статическим корнем
 * репозитория. Нужен только для хостингов, которые публикуют именно корень
 * Git-репозитория, а не dist/.
 *
 * Обычный деплой: загрузи dist/ после `npm run build:seo`.
 * Root-деплой:      `npm run deploy:root`.
 */

import { access, cp, rm } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');

const directories = ['assets', 'about', 'books', 'bots', 'catalog', 'courses', 'practice', 'speak', 'video', 'icophot', 'thumbs'];
const files = [
  'index.html',
  '404.html',
  'author-berdiyev.jpg',
  'bob-logo.png',
  'cat-bob-fed.png',
  'cat-bob.png',
  'manifest.webmanifest',
  'og-bemat.png',
  'robots.txt',
  'sitemap.xml',
  'sw.js',
];

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function sync(entry) {
  const source = path.join(DIST, entry);
  const target = path.join(ROOT, entry);
  if (!(await exists(source))) throw new Error(`В сборке нет ${entry}. Сначала запусти npm run build:seo.`);
  await rm(target, { recursive: true, force: true });
  await cp(source, target, { recursive: true, dereference: true });
}

async function main() {
  if (!(await exists(DIST))) throw new Error('Не найдена папка dist/. Сначала запусти npm run build:seo.');
  await Promise.all([...directories, ...files].map(sync));
  console.log('✅ Статический корень синхронизирован с dist/.');
  console.log('   Исходники (src/, scripts/, package.json) не менялись.');
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
