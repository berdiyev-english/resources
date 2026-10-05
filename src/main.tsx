import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';

// Service worker: нужен для напоминаний на Android и установки приложения.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* SW не критичен — сайт работает и без него */
    });
  });
}

const container = document.getElementById('root');

if (container) {
  // В index.html внутри #root лежит статичный SEO-фолбэк (тексты + ссылки для поисковиков).
  // Убираем его перед рендером, чтобы React-приложение не дублировало контент.
  container.replaceChildren();

  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
