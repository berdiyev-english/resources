// ---------------------------------------------------------------------------
// ЗАДАНИЯ НА ДЕНЬ.
// Для каждой цели — пул полезных заданий. Каждый день из пула собирается
// 3 задания разного типа (чтение / аудирование / грамматика / лексика /
// письмо / речь), чтобы тренировались все навыки, а не одно и то же.
// Каждое задание можно заменить или добавить ещё.
// ---------------------------------------------------------------------------

import { seededShuffle } from '../lib/utils';
import type { UserGoal } from '../lib/storage';
import { PLAN_SIZE } from '../lib/storage';

export type TaskCategory = 'reading' | 'listening' | 'grammar' | 'vocab' | 'writing' | 'speaking' | 'pronunciation';

export interface TaskTemplate {
  id: string;
  goal: UserGoal;
  title: string;
  /** Подсказка: что именно сделать */
  hint?: string;
  time: number;
  category: TaskCategory;
  /** Внешняя ссылка */
  link?: string;
  /** Внутренняя ссылка приложения (например /books) */
  internal?: string;
}

export const CATEGORY_META: Record<TaskCategory, { label: string; emoji: string }> = {
  reading: { label: 'Чтение', emoji: '📖' },
  listening: { label: 'Аудирование', emoji: '🎧' },
  grammar: { label: 'Грамматика', emoji: '📐' },
  vocab: { label: 'Лексика', emoji: '🧠' },
  writing: { label: 'Письмо', emoji: '✍️' },
  speaking: { label: 'Речь', emoji: '🗣' },
  pronunciation: { label: 'Произношение', emoji: '🔊' },
};

const BBC6 = 'https://www.bbc.co.uk/learningenglish/english/features/6-minute-english';
const BEWORDS = 'https://bewords.ru/';
const YOUGLISH = 'https://youglish.com/';
const TED = 'https://ed.ted.com/lessons';
const TEST_ENGLISH = 'https://test-english.com/grammar-points/';
const NEWS_LEVELS = 'https://www.newsinlevels.com/';
const F4T = 'https://www.free4talk.com/';
const CHAR_AI = 'https://character.ai/';
const BEMEM = 'https://bemem.ru/';
const ISL = 'https://en.islcollective.com/english-esl-video-lessons/search';
const LISTEN_IN_EN = 'https://listeninenglish.com/index.php';
const BN_ENG = 'https://breakingnewsenglish.com/';
const TWOBOOKS = 'https://2books.su/';
const EXAM_ENGLISH = 'https://www.examenglish.com/';

export const TASK_POOL: TaskTemplate[] = [
  // ============================== ЕГЭ ==============================
  {
    id: 'ege-reading',
    goal: 'ege',
    category: 'reading',
    title: 'Чтение: 1 текст + 3 задания из банка ЕГЭ',
    hint: 'Следи за временем: 1 текст ≈ 8 минут',
    time: 8,
    link: 'https://en-ege.sdamgia.ru/',
  },
  {
    id: 'ege-listening',
    goal: 'ege',
    category: 'listening',
    title: 'Аудирование: 6 Minute English + 3 новые фразы',
    hint: 'Слушай дважды: сначала без текста, потом с транскриптом',
    time: 8,
    link: BBC6,
  },
  {
    id: 'ege-grammar',
    goal: 'ege',
    category: 'grammar',
    title: 'Грамматика: задание 19–25 (формы слов)',
    hint: 'Разбери каждую ошибку: какое правило за ней стоит',
    time: 8,
    link: BEWORDS,
  },
  {
    id: 'ege-lexis',
    goal: 'ege',
    category: 'grammar',
    title: 'Лексика: задание 26–31 (словообразование)',
    hint: 'Выпиши приставки и суффиксы, которые встретились',
    time: 7,
    link: TEST_ENGLISH,
  },
  {
    id: 'ege-vocab',
    goal: 'ege',
    category: 'vocab',
    title: 'Выучить 10 слов из экзаменационной лексики',
    hint: 'Повтори их вечером — так они уйдут в долгую память',
    time: 5,
    link: BEWORDS,
  },
  {
    id: 'ege-writing-letter',
    goal: 'ege',
    category: 'writing',
    title: 'Письмо (задание 37): написать 100–140 слов',
    hint: 'Проверь ИИ-репетитором: структура, вопросы, объём',
    time: 12,
    link: 'https://t.me/EGE_ENGLISH_GPT_bot',
  },
  {
    id: 'ege-writing-essay',
    goal: 'ege',
    category: 'writing',
    title: 'Эссе (задание 38): 200–250 слов по графику',
    hint: 'Соблюдай план: 5 абзацев и обязательные связки',
    time: 15,
    link: 'https://t.me/EGE_ENGLISH_GPT_bot',
  },
  {
    id: 'ege-speaking-photo',
    goal: 'ege',
    category: 'speaking',
    title: 'Устная часть: описать фото за 2 минуты',
    hint: '12–15 предложений, без пауз больше 3 секунд',
    time: 6,
    link: 'https://t.me/EGE_ENGLISH_GPT_bot',
  },
  {
    id: 'ege-speaking-read',
    goal: 'ege',
    category: 'speaking',
    title: 'Устная часть: прочитать текст вслух (задание 1)',
    hint: 'Запиши себя и послушай: паузы, интонация, сложные слова',
    time: 5,
    link: 'https://en-ege.sdamgia.ru/',
  },
  {
    id: 'ege-pronunc',
    goal: 'ege',
    category: 'pronunciation',
    title: 'Произношение: 10 сложных слов в YouGlish',
    hint: 'Слушай носителей и повторяй вслух по 3 раза',
    time: 6,
    link: YOUGLISH,
  },

  // ============================== ОГЭ ==============================
  {
    id: 'oge-reading',
    goal: 'oge',
    category: 'reading',
    title: 'Чтение: 1 текст + задания 1–2 ОГЭ',
    hint: 'Подчёркивай в тексте места, где нашёл ответ',
    time: 8,
    link: 'https://en-oge.sdamgia.ru/',
  },
  {
    id: 'oge-listening',
    goal: 'oge',
    category: 'listening',
    title: 'Аудирование: короткий текст ОГЭ + проверка',
    hint: 'Первый раз — без пауз, второй — с паузами',
    time: 8,
    link: 'https://en-oge.sdamgia.ru/',
  },
  {
    id: 'oge-grammar',
    goal: 'oge',
    category: 'grammar',
    title: 'Грамматика: 10 заданий (времена и формы)',
    hint: 'Каждую ошибку помечай, чтобы вернуться к теме',
    time: 7,
    link: BEWORDS,
  },
  {
    id: 'oge-vocab',
    goal: 'oge',
    category: 'vocab',
    title: 'Выучить 10 слов по теме дня',
    hint: 'Темы ОГЭ: путешествия, школа, свободное время, еда',
    time: 5,
    link: BEWORDS,
  },
  {
    id: 'oge-writing',
    goal: 'oge',
    category: 'writing',
    title: 'Письмо (задание 35): 100–120 слов',
    hint: 'Обязательно ответь на все 3 вопроса и задай свои',
    time: 12,
    link: 'https://t.me/OGE_ENG_HELPER_BOT',
  },
  {
    id: 'oge-speaking',
    goal: 'oge',
    category: 'speaking',
    title: 'Устная часть: монолог по теме (1,5 минуты)',
    hint: 'Начни с «I would like to tell you about…»',
    time: 7,
    link: 'https://t.me/OGE_ENG_HELPER_BOT',
  },
  {
    id: 'oge-shadowing',
    goal: 'oge',
    category: 'pronunciation',
    title: 'Shadowing: повторить 10 фраз за диктором',
    hint: 'Копируй не только слова, но и интонацию',
    time: 6,
    link: LISTEN_IN_EN,
  },

  // ============================== IELTS ==============================
  {
    id: 'ielts-reading',
    goal: 'ielts',
    category: 'reading',
    title: 'Reading: 1 секция + разбор ошибок',
    hint: 'Тренируй skimming и scanning, уложись в 20 минут на 3 секции',
    time: 12,
    link: 'https://takeielts.britishcouncil.org/take-ielts/prepare/free-ielts-practice-tests',
  },
  {
    id: 'ielts-listening',
    goal: 'ielts',
    category: 'listening',
    title: 'Listening: 1 секция практики',
    hint: 'Слушай один раз, как на экзамене, и переноси ответы сразу',
    time: 10,
    link: EXAM_ENGLISH,
  },
  {
    id: 'ielts-writing-task2',
    goal: 'ielts',
    category: 'writing',
    title: 'Writing Task 2: эссе 250+ слов',
    hint: 'Отправь на проверку: важны Task Response и Cohesion',
    time: 15,
    link: 'https://t.me/IELTS_berdiyev_bot',
  },
  {
    id: 'ielts-writing-task1',
    goal: 'ielts',
    category: 'writing',
    title: 'Writing Task 1: описать график',
    hint: 'Не давай мнений, только данные и сравнения',
    time: 12,
    link: 'https://t.me/IELTS_berdiyev_bot',
  },
  {
    id: 'ielts-speaking-cue',
    goal: 'ielts',
    category: 'speaking',
    title: 'Speaking Part 2: говорить 2 минуты по карточке',
    hint: 'Записывай себя и следи за временем: 1:50–2:10 идеально',
    time: 8,
    link: 'https://t.me/IELTS_berdiyev_bot',
  },
  {
    id: 'ielts-vocab',
    goal: 'ielts',
    category: 'vocab',
    title: '20 академических слов (Academic Word List)',
    hint: 'Учи с коллокациями: «conduct a study», «significant impact»',
    time: 7,
    link: BEWORDS,
  },
  {
    id: 'ielts-grammar',
    goal: 'ielts',
    category: 'grammar',
    title: 'Грамматика B2/C1: сложные структуры для Writing',
    hint: 'Цель — использовать 3–4 сложные конструкции в эссе',
    time: 8,
    link: TEST_ENGLISH,
  },
  {
    id: 'ielts-shadowing',
    goal: 'ielts',
    category: 'pronunciation',
    title: 'Shadowing: 10 фраз вслух за носителем',
    hint: 'Работает над беглостью и ударением в Speaking',
    time: 7,
    link: YOUGLISH,
  },

  // ============================== TOEFL ==============================
  {
    id: 'toefl-reading',
    goal: 'toefl',
    category: 'reading',
    title: 'Reading: 1 пассаж с таймером',
    hint: 'Цель — 20 минут на пассаж, включая последний вопрос',
    time: 12,
    link: 'https://www.examenglish.com/TOEFL/',
  },
  {
    id: 'toefl-listening',
    goal: 'toefl',
    category: 'listening',
    title: 'Listening: лекция + заметки (note-taking)',
    hint: 'Пиши только ключевые слова, не предложения',
    time: 10,
    link: 'https://www.examenglish.com/TOEFL/toefl_listening.html',
  },
  {
    id: 'toefl-speaking',
    goal: 'toefl',
    category: 'speaking',
    title: 'Speaking Task 1: записать ответ на 45 секунд',
    hint: 'Формула: позиция → 2 причины → пример',
    time: 8,
    link: 'https://t.me/TOBEENG_TOEFL_IBT_BOT',
  },
  {
    id: 'toefl-writing',
    goal: 'toefl',
    category: 'writing',
    title: 'Integrated Writing: разобрать шаблон ответа',
    hint: '4 абзаца: лекция vs текст по трём пунктам',
    time: 15,
    link: 'https://t.me/TOBEENG_TOEFL_IBT_BOT',
  },
  {
    id: 'toefl-vocab',
    goal: 'toefl',
    category: 'vocab',
    title: '15 академических слов для TOEFL',
    hint: 'Особенно полезны слова про науку и исследования',
    time: 6,
    link: BEWORDS,
  },
  {
    id: 'toefl-grammar',
    goal: 'toefl',
    category: 'grammar',
    title: 'Грамматика: структуры для академического письма',
    hint: 'Акцент на пассив, придаточные и связки',
    time: 8,
    link: TEST_ENGLISH,
  },
  {
    id: 'toefl-notes',
    goal: 'toefl',
    category: 'listening',
    title: 'Тренировка конспекта: 5 минут аудио → 1 минута пересказа',
    hint: 'Перескажи вслух по своим заметкам',
    time: 8,
    link: EXAM_ENGLISH,
  },

  // ============================== РАЗГОВОР ==============================
  {
    id: 'speak-ai-chat',
    goal: 'speak',
    category: 'speaking',
    title: '8 минут разговора с ИИ-Бобом голосом',
    hint: 'Не бойся ошибок — задача просто не останавливаться',
    time: 8,
    link: 'https://t.me/Tobeeng_GPT_bot',
  },
  {
    id: 'speak-shadow',
    goal: 'speak',
    category: 'pronunciation',
    title: 'Shadowing: короткий урок TED-Ed вслух',
    hint: 'Слушай фразу — повторяй сразу за диктором',
    time: 8,
    link: TED,
  },
  {
    id: 'speak-free4talk',
    goal: 'speak',
    category: 'speaking',
    title: 'Комната Free4talk: поговорить с человеком',
    hint: 'Выбери комнату своего уровня или ниже, чтобы не бояться',
    time: 12,
    link: F4T,
  },
  {
    id: 'speak-monologue',
    goal: 'speak',
    category: 'speaking',
    title: 'Монолог 2 минуты: как прошёл день',
    hint: 'Без остановок, даже если не знаешь слово — перефразируй',
    time: 5,
  },
  {
    id: 'speak-roleplay',
    goal: 'speak',
    category: 'speaking',
    title: 'Роль-плей с ИИ: кафе, отель, аэропорт',
    hint: 'Выбери ситуацию, которая может случиться в реальности',
    time: 8,
    link: CHAR_AI,
  },
  {
    id: 'speak-vocab',
    goal: 'speak',
    category: 'vocab',
    title: '10 слов + 3 фразы-чанка',
    hint: '«To be honest…», «It depends on…», «I would rather…»',
    time: 6,
    link: BEWORDS,
  },
  {
    id: 'speak-pron',
    goal: 'speak',
    category: 'pronunciation',
    title: '15 слов в YouGlish: слушать и повторять',
    hint: 'Обрати внимание на ударение и связную речь',
    time: 6,
    link: YOUGLISH,
  },
  {
    id: 'speak-voice-note',
    goal: 'speak',
    category: 'speaking',
    title: 'Голосовое 1 минута: планы на неделю',
    hint: 'Запиши и переслушай — услышишь свои ошибки',
    time: 6,
  },
  {
    id: 'speak-memes',
    goal: 'speak',
    category: 'speaking',
    title: '5 мемов в Bemem → пересказать их вслух',
    hint: 'Перескажи шутку своими словами: «This meme is about…»',
    time: 7,
    link: BEMEM,
  },

  // ============================== ДЛЯ СЕБЯ ==============================
  {
    id: 'fun-scene',
    goal: 'fun',
    category: 'listening',
    title: 'Сцена из сериала с двойными субтитрами',
    hint: 'Одна сцена: RU → EN → без субтитров',
    time: 10,
    internal: '/video',
  },
  {
    id: 'fun-chapter',
    goal: 'fun',
    category: 'reading',
    title: 'Глава книги с переводом',
    hint: 'Не переводи всё подряд — только незнакомые слова',
    time: 10,
    internal: '/books',
  },
  {
    id: 'fun-words',
    goal: 'fun',
    category: 'vocab',
    title: 'Выучить 5 слов по своему интересу',
    hint: 'Учи слова из фильмов и мемов, которые тебе нравятся',
    time: 5,
    link: BEWORDS,
  },
  {
    id: 'fun-memes',
    goal: 'fun',
    category: 'reading',
    title: 'Мемы на английском — 10 минут в Bemem',
    hint: 'Разбери шутки, которые не понял: в них самая живая лексика',
    time: 7,
    link: BEMEM,
  },
  {
    id: 'fun-6min',
    goal: 'fun',
    category: 'listening',
    title: 'BBC 6 Minute English',
    hint: '6 минут + транскрипт: выпиши 3 фразы',
    time: 7,
    link: BBC6,
  },
  {
    id: 'fun-ted',
    goal: 'fun',
    category: 'listening',
    title: 'TED-Ed: урок с субтитрами и заданиями',
    hint: 'Тема — та, что реально интересна',
    time: 8,
    link: TED,
  },
  {
    id: 'fun-news',
    goal: 'fun',
    category: 'reading',
    title: 'Новости на английском своего уровня',
    hint: 'Читай и слушай одновременно — так запоминается быстрее',
    time: 7,
    link: NEWS_LEVELS,
  },
  {
    id: 'fun-story',
    goal: 'fun',
    category: 'reading',
    title: 'Короткий рассказ с заданиями',
    hint: 'Breaking News English: текст + аудио + упражнения',
    time: 8,
    link: BN_ENG,
  },
  {
    id: 'fun-video-lesson',
    goal: 'fun',
    category: 'listening',
    title: 'Мини-видео с заданиями (iSLCollective)',
    hint: 'Грамматика отрабатывается прямо по сюжету',
    time: 7,
    link: ISL,
  },
  {
    id: 'fun-book-start',
    goal: 'fun',
    category: 'reading',
    title: 'Начать книгу на 2books.su',
    hint: 'Выбери что-то короткое — важен финиш, а не объём',
    time: 10,
    link: TWOBOOKS,
  },
];

export const TASK_BY_ID: Record<string, TaskTemplate> = Object.fromEntries(
  TASK_POOL.map((t) => [t.id, t])
);

export function tasksOfGoal(goal: UserGoal): TaskTemplate[] {
  return TASK_POOL.filter((t) => t.goal === goal);
}

/**
 * Собирает план на день: сначала по одному заданию каждого типа
 * (чтение, аудирование, грамматика/лексика, письмо, речь), затем добирает
 * оставшиеся. Сид = дата + цель, поэтому план стабилен в течение дня.
 */
export function pickPlan(goal: UserGoal, seed: string, size: number = PLAN_SIZE): string[] {
  const pool = seededShuffle(tasksOfGoal(goal), seed);
  const picked: TaskTemplate[] = [];
  const usedCategories = new Set<TaskCategory>();
  const wantOrder: TaskCategory[] = ['reading', 'listening', 'grammar', 'vocab', 'speaking', 'writing', 'pronunciation'];

  for (const cat of wantOrder) {
    if (picked.length >= size) break;
    const candidate = pool.find((t) => t.category === cat && !picked.includes(t));
    if (candidate) {
      picked.push(candidate);
      usedCategories.add(cat);
    }
  }
  for (const t of pool) {
    if (picked.length >= size) break;
    if (!picked.includes(t)) picked.push(t);
  }
  return picked.map((t) => t.id);
}

/** Подбирает замену заданию — сначала в той же категории. */
export function pickReplacement(
  goal: UserGoal,
  taskId: string,
  exclude: string[],
  seed: string
): string | undefined {
  const current = TASK_BY_ID[taskId];
  const shuffled = seededShuffle(tasksOfGoal(goal), seed).filter((t) => !exclude.includes(t.id));
  if (shuffled.length === 0) return undefined;
  const sameCategory = current ? shuffled.find((t) => t.category === current.category) : undefined;
  return (sameCategory ?? shuffled[0]).id;
}

/** Добирает дополнительные задания (кнопка «Хочу больше»). */
export function pickExtra(goal: UserGoal, exclude: string[], count: number, seed: string): string[] {
  return seededShuffle(tasksOfGoal(goal), seed)
    .filter((t) => !exclude.includes(t.id))
    .slice(0, count)
    .map((t) => t.id);
}
