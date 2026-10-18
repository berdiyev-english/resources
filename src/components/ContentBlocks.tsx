import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { Accordion } from './UI';
import { SECTION_META, SITE_SECTIONS, type SectionId } from '../data/resources';
import { SECTION_ICONS } from './icons';
import { cn } from '../lib/utils';

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="px-4 lg:px-0 pt-4">
      <ol className="flex items-center flex-wrap gap-1 text-[11px] text-stone-400 list-none p-0 m-0">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            {item.to ? (
              <Link to={item.to} className="no-underline text-stone-500 hover:text-violet-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-stone-400">{item.label}</span>
            )}
            {i < items.length - 1 && <ChevronRight size={12} className="text-stone-300" />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionChips({ active, className }: { active?: SectionId; className?: string }) {
  return (
    <div className={cn('flex gap-2 overflow-x-auto no-scrollbar px-4 lg:px-0 pb-1', className)}>
      <Link
        to="/"
        className={cn(
          'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border no-underline',
          !active ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-stone-600 border-stone-200'
        )}
      >
        <LayoutGrid size={14} aria-hidden="true" /> Всё
      </Link>
      {SITE_SECTIONS.map((id) => {
        const meta = SECTION_META[id];
        const Icon = SECTION_ICONS[id];
        return (
          <Link
            key={id}
            to={meta.path}
            className={cn(
              'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border no-underline whitespace-nowrap',
              active === id ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-stone-600 border-stone-200'
            )}
          >
            <Icon size={14} aria-hidden="true" /> {meta.navLabel}
          </Link>
        );
      })}
    </div>
  );
}

/**
 * SEO-тексты. По умолчанию свёрнуты в компактный аккордеон —
 * чтобы страница не превращалась в «простыню» текста,
 * но поисковики по-прежнему видели весь контент в HTML.
 */
export function TextBlocks({
  blocks,
  collapsible = true,
}: {
  blocks: { h2: string; text: string }[];
  collapsible?: boolean;
}) {
  if (!collapsible) {
    return (
      <div className="space-y-5">
        {blocks.map((b) => (
          <section key={b.h2}>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mb-2">{b.h2}</h2>
            <p className="text-sm text-stone-600 leading-relaxed">{b.text}</p>
          </section>
        ))}
      </div>
    );
  }

  return (
    <Accordion title="Подробнее о разделе" subtitle="Полезно прочитать · 2–3 минуты">
      <div className="space-y-5 pt-1">
        {blocks.map((b) => (
          <section key={b.h2}>
            <h2 className="text-sm sm:text-base font-bold text-stone-900 mb-1.5">{b.h2}</h2>
            <p className="text-[13px] text-stone-600 leading-relaxed">{b.text}</p>
          </section>
        ))}
      </div>
    </Accordion>
  );
}

export function FaqSection({
  items,
  title = 'Частые вопросы',
  maxVisible = 2,
}: {
  items: { q: string; a: string }[];
  title?: string;
  /** Сколько вопросов показывать, остальное — по кнопке «показать ещё» */
  maxVisible?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, maxVisible);

  return (
    <section>
      <h2 className="text-xl font-black text-stone-900 mb-4">{title}</h2>
      {visible.map((f, i) => (
        <Accordion key={f.q} title={f.q} defaultOpen={i === 0 && !expanded}>
          <p className="text-sm text-stone-600 leading-relaxed">{f.a}</p>
        </Accordion>
      ))}
      {!expanded && items.length > maxVisible && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-3 w-full py-3 rounded-2xl bg-white border border-stone-200 text-sm font-bold text-violet-700 active:scale-[0.98] transition-transform"
        >
          Показать ещё {items.length - maxVisible} вопрос(а)…
        </button>
      )}
    </section>
  );
}
