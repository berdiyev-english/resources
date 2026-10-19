import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { SECTION_META, groupsOfSection, resourcesOfSection, type SectionId } from '../data/resources';
import { Seo, breadcrumbs, faqPage, itemList } from '../lib/seo';
import { Accordion } from '../components/UI';
import { ResourceCard } from '../components/ResourceCard';
import { Breadcrumbs, FaqSection, SectionChips, TextBlocks } from '../components/ContentBlocks';
import { useUser } from '../state/UserContext';

export function SectionPage({ section }: { section: SectionId }) {
  const meta = SECTION_META[section];
  const groups = groupsOfSection(section);
  const items = resourcesOfSection(section);
  const { isFavorite, user } = useUser();
  const favCount = items.filter((r) => isFavorite(r.id)).length;

  return (
    <>
      <Seo
        seo={{
          path: meta.path,
          title: meta.title,
          description: meta.description,
          keywords: meta.keywords,
          jsonLd: [
            breadcrumbs([
              { name: 'Главная', path: '/' },
              { name: meta.navLabel, path: meta.path },
            ]),
            itemList(
              meta.h1,
              items.map((r) => ({ name: r.title, url: r.url }))
            ),
            faqPage(meta.faq),
          ],
        }}
      />

      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: meta.navLabel }]} />

      <div className="px-4 lg:px-0 pt-3 pb-6">
        {/* Компактный заголовок в стиле приложения — без длинных SEO-вступлений.
            Весь информационный текст (о разделе, FAQ) — строго под списком сайтов. */}
        <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-black text-stone-900 mb-1">
          <span
            aria-hidden="true"
            className="w-9 h-9 rounded-xl grad-violet-soft flex items-center justify-center text-lg shrink-0"
          >
            {meta.emoji}
          </span>
          {meta.navLabel}
        </h1>
        {favCount > 0 && (
          <p className="text-xs text-amber-600 font-bold mt-2">
            ⭐ В этом разделе у тебя в избранном: {favCount}.{' '}
            <Link to="/favorites" className="underline">
              Посмотреть все
            </Link>
          </p>
        )}

        <SectionChips active={section} className="mt-4 px-0" />

        {/* СПИСОК САЙТОВ — главное на странице, идёт первым */}
        <div className="mt-5">
          {groups.map((g, i) => (
            <Accordion key={g.group} title={g.group} subtitle={`${g.items.length} ресурсов`} defaultOpen={i === 0}>
              <div className="pt-1">
                {g.items.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            </Accordion>
          ))}
        </div>

        {/* ВСЯ ИНФОРМАЦИЯ — под сайтами */}
        <details className="mt-8 bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
          <summary className="list-none cursor-pointer select-none flex items-center justify-between gap-3 p-4 [&::-webkit-details-marker]:hidden">
            <span>
              <span className="block font-bold text-sm text-stone-900">ℹ️ Об этом разделе</span>
              <span className="block text-xs text-stone-500 mt-0.5">Как заниматься и частые вопросы</span>
            </span>
            <span className="shrink-0 w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 group-open:rotate-180 transition-transform">
              <ChevronDown size={16} />
            </span>
          </summary>
          <div className="px-4 pb-4 space-y-6">
            <p className="text-sm text-stone-600 leading-relaxed">{meta.intro}</p>
            <TextBlocks blocks={meta.seoBlocks} />
            <FaqSection items={meta.faq} />
          </div>
        </details>

        <Link
          to="/dashboard"
          className="mt-6 flex items-center justify-center gap-2 w-full py-4 rounded-2xl grad-violet text-white font-bold no-underline"
        >
          {user.isOnboarded ? 'Открыть мой план на сегодня' : 'Собрать план занятий на 15 минут'} <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
