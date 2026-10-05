/* BEMAT Service Worker
   Минимальный: нужен, чтобы
   1) работали локальные напоминания на Android (showNotification требует SW),
   2) браузер предлагал установку приложения,
   3) клик по уведомлению открывал личный кабинет.
   Полноценный офлайн-режим можно включить через vite-plugin-pwa (см. README). */

const VERSION = 'bemat-sw-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

// Страница может попросить активировать новую версию SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// Клик по уведомлению — открываем приложение на плане дня
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = '/dashboard';
  event.waitUntil(
    (async () => {
      const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of all) {
        if ('focus' in client) {
          await client.focus();
          if ('navigate' in client) {
            try {
              await client.navigate(target);
            } catch {
              /* ignore */
            }
          }
          return;
        }
      }
      await self.clients.openWindow(target);
    })()
  );
});

// Пасsthrough-обработчик: нужен для условия устанавливаемости PWA.
// Стратегия — сеть, а кэш только как подстраховка для статики.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok && url.pathname.startsWith('/assets/')) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(request).then((cached) => cached || Response.error()))
  );
});
