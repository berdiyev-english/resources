import { useEffect } from 'react';
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from './site-config';

export { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL };

export interface PageSeo {
  title: string;
  description: string;
  /** Путь без домена, например '/books' */
  path: string;
  keywords?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

const JSONLD_ID = 'bemat-page-jsonld';

/**
 * Проставляет title/description/canonical/OG/Twitter/JSON-LD для текущей страницы.
 * Для настоящего SEO важен ещё SSR/prerender — см. scripts/prerender.mjs
 */
export function Seo({ seo }: { seo: PageSeo }) {
  // Объект seo создаётся заново на каждом рендере страницы, поэтому в качестве
  // зависимости эффекта используем сериализованный ключ — тогда мета-теги
  // обновляются только при реальном изменении данных.
  const key = JSON.stringify(seo);

  useEffect(() => {
    const url = SITE_URL + (seo.path === '/' ? '/' : seo.path);

    document.title = seo.title;
    upsertMeta('name', 'description', seo.description);
    if (seo.keywords) upsertMeta('name', 'keywords', seo.keywords);
    upsertMeta(
      'name',
      'robots',
      seo.noindex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    upsertLink('canonical', url);

    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', seo.title);
    upsertMeta('property', 'og:description', seo.description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE);
    upsertMeta('property', 'og:locale', 'ru_RU');
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', seo.title);
    upsertMeta('name', 'twitter:description', seo.description);
    upsertMeta('name', 'twitter:image', DEFAULT_OG_IMAGE);

    document.getElementById(JSONLD_ID)?.remove();
    if (seo.jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = JSONLD_ID;
      script.textContent = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return null;
}

// --------------------------- помощники для разметки ---------------------------

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: SITE_URL + (it.path === '/' ? '/' : it.path),
    })),
  };
}

export function itemList(name: string, items: { name: string; url?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.url ? { url: it.url } : {}),
    })),
  };
}

export function faqPage(faq: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
