import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share, PlusSquare, Download } from 'lucide-react';

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Проверка: запущено ли уже как приложение?
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) return;

    // Определяем iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    if (ios) {
      // Для iOS показываем таймер или сразу (тут через 2 сек)
      setTimeout(() => setShow(true), 2000);
    } else {
      // Для Android ловим событие установки
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShow(true);
      };
      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const handleInstallClick = async () => {
    if (!isIOS && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShow(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-[100] p-4 pb-8 md:pb-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 max-w-md mx-auto relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>
            
            <button 
              onClick={() => setShow(false)} 
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
                <Download className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1">Установите приложение</h3>
                <p className="text-slate-500 text-sm leading-snug">Занимайтесь удобнее прямо с домашнего экрана.</p>
              </div>
            </div>

            <div className="mt-5">
              {isIOS ? (
                <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 space-y-3 border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 shrink-0">1</span>
                    <span>Нажмите кнопку <span className="font-bold text-blue-600 inline-flex items-center gap-1"><Share className="w-4 h-4" /> Поделиться</span></span>
                  </div>
                  <div className="w-px h-3 bg-slate-300 ml-3"></div>
                  <div className="flex items-center gap-3">
                     <span className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm border border-slate-200 shrink-0">2</span>
                     <span>Выберите <span className="font-bold text-slate-900 inline-flex items-center gap-1"><PlusSquare className="w-4 h-4" /> На экран «Домой»</span></span>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={handleInstallClick}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Установить бесплатно
                </button>
              )}
            </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
