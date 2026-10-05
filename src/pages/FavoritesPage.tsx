import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { RESOURCE_BY_ID, SECTION_META, SITE_SECTIONS } from '../data/resources';
import { Seo } from '../lib/seo';
import { Breadcrumbs, SectionChips } from '../components/ContentBlocks';
import { EmptyState } from '../components/UI';
import { ResourceCard } from '../components/ResourceCard';
import { useUser } from '../state/UserContext';

export function FavoritesPage() {
  const { user } = useUser();
  const favorites = user.favorites.map((id) => RESOURCE_BY_ID[id]).filter(Boolean);

  const bySection = SITE_SECTIONS.map((section) => ({
    section,
    items: favorites.filter((r) => r.section === section),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Личная страница — не индексируем, чтобы не плодить пустые страницы в выдаче */}
      <Seo
        seo={{
          path: '/favorites',
          title: 'Избранные сайты для изучения английского | BEMAT',
          description: 'Твоя личная подборка сайтов и сервисов для изучения английского языка.',
          noindex: true,
        }}
      />

      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Избранное' }]} />

      <div className="px-4 lg:px-0 pt-3 pb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-2">
          <Star size={24} className="inline -mt-1 text-amber-400 fill-amber-400" /> Избранные сайты
        </h1>
        <p className="text-sm text-stone-600 mb-5 max-w-2xl">
          Быстрый доступ к сервисам, которые ты отметил звёздочкой. Нажми на звезду на любой карточке в каталоге — и сайт
          появится здесь.
        </p>

        {favorites.length === 0 ? (
          <EmptyState
            emoji="⭐"
            title="Пока пусто"
            text="Отмечай звёздочкой сайты, которыми пользуешься каждый день, — они соберутся на этой странице. Избранное хранится в браузере, регистрация не нужна."
          >
            <SectionChips />
          </EmptyState>
        ) : (
          <div className="space-y-8">
            {bySection.map(({ section, items }) => {
              const meta = SECTION_META[section];
              return (
                <section key={section}>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-bold text-stone-900">
                      <span aria-hidden="true">{meta.emoji}</span> {meta.navLabel}
                    </h2>
                    <Link to={meta.path} className="text-xs font-bold text-violet-600 no-underline">
                      Все ресурсы раздела →
                    </Link>
                  </div>
                  <div className="space-y-2">
                    {items.map((r) => (
                      <ResourceCard key={r.id} resource={r} compact />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
