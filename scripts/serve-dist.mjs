/**
 * Локальный предпросмотр прод-сборки так, как её отдаёт реальный хостинг:
 *   /books → dist/books/index.html (пре-рендеренная SEO-версия)
 *   /dashboard → dist/index.html (SPA-фолбэк)
 *
 * Запуск: npm run serve:dist   (порт 4173, можно задать PORT=3000)
 */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = path.join(process.cwd(), 'dist');
const PORT = Number(process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    let rel = decodeURIComponent(url.pathname);
    if (rel.endsWith('/')) rel += 'index.html';

    let file = path.join(DIST, rel);

    // не выпускаем за пределы dist
    if (!file.startsWith(DIST)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    if (await exists(file)) {
      const info = await stat(file);
      if (info.isDirectory()) file = path.join(file, 'index.html');
    }

    if (!(await exists(file))) {
      file = path.join(DIST, 'index.html'); // SPA-фолбэк
    }

    const data = await readFile(file);
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(data);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Ошибка сервера: ${err instanceof Error ? err.message : String(err)}`);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`BEMAT (прод-сборка) — http://localhost:${PORT}`);
  console.log('Отдаёт пре-рендеренные страницы: /books /video /practice /speak /courses /bots /about');
});
