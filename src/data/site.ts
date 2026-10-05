import { SECTION_META, SITE_SECTIONS, type SectionId } from './resources';

/** Навигация по разделам (используется в шапке, дровере, футере, sitemap) */
export const SECTIONS_NAV: { path: string; label: string; emoji: string; id: SectionId }[] = SITE_SECTIONS.map(
  (id: SectionId) => ({
    path: SECTION_META[id].path,
    label: SECTION_META[id].navLabel,
    emoji: SECTION_META[id].emoji,
    id,
  })
);

/** ИИ-помощники — выводятся в меню */
export const AI_BOTS = [
  { label: 'ЕГЭ с ИИ', url: 'https://t.me/EGE_ENGLISH_GPT_bot', desc: '80+ баллов' },
  { label: 'ОГЭ с ИИ', url: 'https://t.me/OGE_ENG_HELPER_BOT', desc: 'ОГЭ на «5»' },
  { label: 'IELTS Expert', url: 'https://t.me/IELTS_berdiyev_bot', desc: 'Цель 7+' },
  { label: 'TOEFL Expert', url: 'https://t.me/TOBEENG_TOEFL_IBT_BOT', desc: 'Цель 100+' },
  { label: 'Боб — английский с ИИ', url: 'https://t.me/Tobeeng_GPT_bot', desc: 'Разговор за 3 месяца' },
];

export const CONTACTS = {
  telegram: 'https://t.me/+NvMX2DrTa3w1NTVi',
  author: 'https://berdiyev-eng.ru',
  donate: 'https://pay.cloudtips.ru/p/8f56d7d3',
  rustore: 'https://www.rustore.ru/catalog/app/co.median.android.pkpxbe',
  authorName: 'Абдуррахим Бердиев',
  authorPhoto: 'https://static.tildacdn.info/tild6137-3239-4731-b932-343437323234/__1.jpg',
  authorTags: ['Аспирант пед. наук', 'TEFL', 'C2', '2000+ учеников', 'Автор BEMAT'],
};
