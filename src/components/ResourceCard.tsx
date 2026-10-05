import { useState } from 'react';
import { ExternalLink, ShieldAlert, Star } from 'lucide-react';
import type { Resource } from '../data/resources';
import { useUser } from '../state/UserContext';
import { cn } from '../lib/utils';
import { Pill } from './UI';

function ResourceThumb({ resource, className }: { resource: Resource; className?: string }) {
  const [broken, setBroken] = useState(!resource.img);

  if (broken) {
    return (
      <div className={cn('flex items-center justify-center grad-violet-soft', className)} aria-hidden="true">
        <span className="text-3xl">{resource.emoji}</span>
      </div>
    );
  }

  return (
    <img
      src={resource.img}
      alt={`${resource.title} — изучение английского`}
      loading="lazy"
      decoding="async"
      onError={() => setBroken(true)}
      className={cn('object-cover bg-stone-100', className)}
    />
  );
}

/**
 * Карточка сайта-ресурса.
 * Мобильные: компактная, вся карточка — ссылка (легко попасть пальцем),
 * плюс звёздочка для избранного. Desktop: полная версия с картинкой и кнопкой.
 */
export function ResourceCard({ resource, compact = false }: { resource: Resource; compact?: boolean }) {
  const { isFavorite, toggleFavorite } = useUser();
  const fav = isFavorite(resource.id);

  if (compact) {
    return (
      <div className="flex items-stretch gap-3 p-3 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-violet-200 transition-colors">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 flex-1 min-w-0 no-underline text-inherit"
        >
          <ResourceThumb resource={resource} className="w-12 h-12 rounded-xl shrink-0 overflow-hidden" />
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-sm text-stone-900 truncate">{resource.title}</span>
            <span className="block text-[11px] text-stone-500 truncate">{resource.desc}</span>
          </span>
          <ExternalLink size={16} className="text-stone-300 shrink-0" />
        </a>
        <button
          type="button"
          aria-label={fav ? 'Убрать из избранного' : 'Добавить в избранное'}
          aria-pressed={fav}
          onClick={() => toggleFavorite(resource.id)}
          className={cn('p-2 rounded-xl shrink-0', fav ? 'bg-amber-100 text-amber-500' : 'text-stone-300 hover:text-amber-400')}
        >
          <Star size={18} className={cn(fav && 'fill-amber-400')} />
        </button>
      </div>
    );
  }

  return (
    <article className="relative mb-3 last:mb-0">
      <a
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 bg-white rounded-2xl border border-stone-100 shadow-sm hover:border-violet-200 hover:shadow transition-all no-underline text-inherit"
      >
        {/* Мобильная версия превью — маленький квадрат; на sm+ — крупный */}
        <ResourceThumb resource={resource} className="w-full h-32 sm:w-28 sm:h-28 rounded-xl shrink-0 overflow-hidden" />

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start gap-3">
            <h3 className="text-base font-bold text-stone-900 leading-tight mb-1 pr-9 sm:pr-0">{resource.title}</h3>
          </div>
          <p className="text-xs sm:text-[13px] text-stone-500 leading-snug mb-3">{resource.desc}</p>

          <div className="flex flex-wrap items-center gap-1.5 mb-3 sm:mb-2">
            {resource.badge && (
              <Pill className="bg-violet-50 text-violet-700 border border-violet-100">{resource.badge}</Pill>
            )}
            {resource.vpn && (
              <Pill className="bg-amber-50 text-amber-700 border border-amber-100">
                <ShieldAlert size={12} /> нужен VPN
              </Pill>
            )}
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 self-start px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold">
            {resource.btnText || 'Перейти'} <ExternalLink size={13} />
          </span>
          <span className="sm:hidden inline-flex items-center gap-1 text-xs font-bold text-violet-600">
            {resource.btnText || 'Перейти'} <ExternalLink size={13} />
          </span>
        </div>
      </a>

      <div className="absolute top-3 right-3">
        <button
          type="button"
          aria-label={fav ? `Убрать из избранного: ${resource.title}` : `В избранное: ${resource.title}`}
          aria-pressed={fav}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(resource.id);
          }}
          className={cn(
            'p-2 rounded-xl transition-colors border',
            fav
              ? 'bg-amber-100 text-amber-500 border-amber-200'
              : 'bg-white/90 text-stone-300 border-stone-100 hover:text-amber-400 backdrop-blur-sm'
          )}
        >
          <Star size={18} className={cn(fav && 'fill-amber-400')} />
        </button>
      </div>
    </article>
  );
}
