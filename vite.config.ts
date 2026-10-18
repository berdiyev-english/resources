import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Если у тебя Tailwind v3 — убери @tailwindcss/vite и tailwindcss из devDependencies
// и добавь обычный postcss-конфиг (см. README, раздел «Если у тебя Tailwind v3»).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,          // доступ с телефона по локальной сети + live-preview
    port: 5173,
    allowedHosts: true,  // разрешаем любые хосты для dev/preview (защита от "Blocked request")
  },
  preview: {
    host: true,
    port: 4173,
    allowedHosts: true,
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,
    // ВАЖНО: раньше было outDir:'assets' — из-за этого картинки, которые Vite
    // кладёт в подпапку assets (логотип/кот Боб), уезжали в /assets/assets/...
    // и на сервере давали 404 (битая «лапа», битый логотип).
    // Теперь сборка идёт в dist/, а scripts/deploy-root.mjs копирует готовые
    // файлы в корень репозитория (так деплоится bemat.ru).
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
