import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

// --- ЗДЕСЬ НАСТРАИВАЕМ КАРТИНКИ СПОНСОРОВ ---
const SPONSORS_DATA = [
  {
    id: 1,
    name: 'SkyEng',
    // Если картинка лежит в папке public/icophot, пишите путь через точку:
    logo: './icophot/skyeng.png', // <-- ЗАМЕНИТЕ НА СВОЕ НАЗВАНИЕ ФАЙЛА
    url: 'https://skyeng.ru',
  },
  {
    id: 2,
    name: 'Ваш Спонсор',
    // Можно использовать прямую ссылку из интернета (это всегда работает):
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Duolingo_logo_2019.svg/2560px-Duolingo_logo_2019.svg.png',
    url: 'https://duolingo.com',
  },
  {
    id: 3,
    name: 'Моя компания',
    // Пример с еще одним файлом из папки:
    logo: './icophot/my-sponsor.png', 
    url: '#',
  }
];

export function Sponsors() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SPONSORS_DATA.length);
    }, 3000); 

    return () => clearInterval(timer);
  }, []);

  const sponsor = SPONSORS_DATA[current];

  return (
    <div className="w-full bg-slate-50 border-b border-slate-200 overflow-hidden relative h-14 sm:h-16 flex items-center justify-center">
      <div className="absolute left-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 z-10 hidden sm:block">
        Спонсор дня
      </div>
      
      <AnimatePresence mode="wait">
        <motion.a
          key={sponsor.id}
          href={sponsor.url}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 group px-4 py-2"
        >
          <span className="text-[10px] font-bold text-slate-400 uppercase sm:hidden">Спонсор:</span>

          {/* Картинка спонсора */}
          <img 
            src={sponsor.logo} 
            alt={sponsor.name} 
            className="h-6 sm:h-8 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300" 
            onError={(e: any) => {
              // Если картинка сломалась, покажем текст
              e.target.style.display = 'none'; 
              e.target.nextSibling.style.display = 'block'; 
            }}
          />
          {/* Запасной текст, если картинки нет */}
          <span className="hidden font-bold text-slate-900 text-sm">{sponsor.name}</span>
          
          <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all" />
        </motion.a>
      </AnimatePresence>

      <div className="absolute bottom-1 flex gap-1">
        {SPONSORS_DATA.map((_, index) => (
          <div 
            key={index}
            className={`h-1 rounded-full transition-all duration-300 ${index === current ? 'w-4 bg-violet-500' : 'w-1 bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}
