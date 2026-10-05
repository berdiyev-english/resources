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
  },
});
