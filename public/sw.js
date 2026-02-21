self.addEventListener('install', (event) => {
  self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
  // Пустой fetch, чтобы пройти проверку
});
