/**
 * Синхронизация превьюшек ресурсов.
 *
 * Проблема, которую решает: в /thumbs лежат картинки, названные по id ресурса
 * (например, practice-youglish.png), но в src/data/resources.ts у многих
 * ресурсов поле img либо отсутствует, либо ведёт на внешний tildacdn-URL,
 * который недоступен с территории РФ — поэтому фото «не подключались».
 *
 * Что делает скрипт:
 *   1) Копирует все файлы из /thumbs в /public/thumbs (Vite отдаёт public/
 *      по корневому пути => /thumbs/<id>.png работает и в dev, и в build).
 *   2) Для каждого ресурса, у которого есть thumbs/<id>.png, ставит
 *      img: '/thumbs/<id>.png' (локальная картинка надёжнее внешней).
 *   3) Ресурсы без локальной превьюшки не трогает — для них работает
 *      эмодзи-плейсхолдер или существующий URL.
 *
 * Запуск: node scripts/sync-thumbs.mjs   (или npm run sync-thumbs)
 */

import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const THUMBS_SRC = path.join(ROOT, 'thumbs');
const THUMBS_DST = path.join(ROOT, 'public', 'thumbs');
const DATA_FILE = path.join(ROOT, 'src', 'data', 'resources.ts');

async function main() {
  // 1) thumbs -> public/thumbs
  const files = await readdir(THUMBS_SRC);
  const pngs = files.filter((f) => f.endsWith('.png'));
  await mkdir(THUMBS_DST, { recursive: true });
  for (const f of pngs) {
    await copyFile(path.join(THUMBS_SRC, f), path.join(THUMBS_DST, f));
  }
  const idsWithThumb = new Set(pngs.map((f) => f.replace(/\.png$/, '')));
  console.log(`✔ Скопировано превьюшек в public/thumbs: ${pngs.length}`);

  // 2) Обновляем img у ресурсов, для которых есть локальная картинка
  let src = await readFile(DATA_FILE, 'utf8');
  const start = src.indexOf('export const RESOURCES');
  const end = src.indexOf('export const RESOURCE_BY_ID');
  if (start === -1 || end === -1) {
    throw new Error('Не удалось найти массив RESOURCES в resources.ts');
  }
  const seg = src.slice(start, end);

  let updated = 0;
  let added = 0;
  const newSeg = seg.replace(
    /\{\s*\n(\s*)id: '([a-z]+-[a-z0-9-]+)',[\s\S]*?\n\s*\}/g,
    (block, indent, id) => {
      if (!idsWithThumb.has(id)) return block;
      const localImg = `'/thumbs/${id}.png'`;
      if (/img:\s*'\/thumbs\/[a-z0-9-]+\.png'/.test(block)) return block; // уже ок
      if (/img:/.test(block)) {
        updated += 1;
        return block.replace(/img: '[^']*'/, `img: ${localImg}`);
      }
      added += 1;
      // вставляем img перед url:
      return block.replace(/(\n\s*)url:/, `\n${indent}img: ${localImg},$1url:`);
    }
  );

  src = src.slice(0, start) + newSeg + src.slice(end);
  await writeFile(DATA_FILE, src, 'utf8');
  console.log(`✔ img заменён на локальный: ${updated}, добавлен: ${added}`);
  console.log('✅ Готово.');
}

main().catch((e) => {
  console.error('sync-thumbs упал:', e);
  process.exit(1);
});
