import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
          <span aria-hidden="true">{meta.emoji}</span> {meta.h1}
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mb-3">{meta.tagline}</p>
        <p className="text-sm text-stone-600 leading-relaxed max-w-3xl">{meta.intro}</p>

        {favCount > 0 && (
          <p className="text-xs text-amber-600 font-bold mt-3">
            ⭐ В этом разделе у тебя в избранном: {favCount}.{' '}
            <Link to="/favorites" className="underline">
              Посмотреть все
            </Link>
          </p>
        )}

        <SectionChips active={section} className="mt-5 px-0" />

        <div className="mt-6">
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

        <div className="mt-10">
          <TextBlocks blocks={meta.seoBlocks} />
        </div>

        <div className="mt-10">
          <FaqSection items={meta.faq} />
        </div>

        <Link
          to="/dashboard"
          className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl grad-violet text-white font-bold no-underline"
        >
          {user.isOnboarded ? 'Открыть мой план на сегодня' : 'Собрать план занятий на 15 минут'} <ArrowRight size={18} />
        </Link>
      </div>
    </>
  );
}
