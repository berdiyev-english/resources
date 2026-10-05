// ---------------------------------------------------------------------------
// Хранилище прогресса пользователя.
// Ключ тот же, что и раньше ('bemat_user_v3'), поэтому прогресс старых
// пользователей не теряется — loadUser() аккуратно достраивает новые поля.
// ---------------------------------------------------------------------------

export type UserGoal = 'ege' | 'oge' | 'ielts' | 'toefl' | 'speak' | 'fun';

export const GOAL_OPTIONS: { id: UserGoal; label: string; short: string; icon: string }[] = [
  { id: 'ege', label: 'Сдать ЕГЭ по английскому', short: 'ЕГЭ', icon: '🔥' },
  { id: 'oge', label: 'Сдать ОГЭ по английскому', short: 'ОГЭ', icon: '🎓' },
  { id: 'ielts', label: 'Сдать IELTS', short: 'IELTS', icon: '🌍' },
  { id: 'toefl', label: 'Сдать TOEFL', short: 'TOEFL', icon: '🇺🇸' },
  { id: 'speak', label: 'Говорить свободно', short: 'Разговор', icon: '🗣' },
  { id: 'fun', label: 'Для себя / фильмы и книги', short: 'Для себя', icon: '🍿' },
];

export const GOAL_LABELS: Record<UserGoal, string> = {
  ege: '🔥 ЕГЭ',
  oge: '🎓 ОГЭ',
  ielts: '🌍 IELTS',
  toefl: '🇺🇸 TOEFL',
  speak: '🗣 Разговор',
  fun: '🍿 Для себя',
};

export interface CustomTask {
  id: string;
  title: string;
  time: number;
}

export interface UserState {
  version: number;
  name: string;
  goal: UserGoal;
  isGuest: boolean;
  isOnboarded: boolean;
  streak: number;
  bestStreak: number;
  lastVisit: string; // ISO
  lastVisitDay: string; // YYYY-MM-DD (локальная дата)
  completedTasks: string[];
  customTasks: CustomTask[];
  planDay: string;
  planTaskIds: string[];
  optionalTaskIds: string[];
  favorites: string[];
  notificationsEnabled: boolean;
  notifHour: number;
  streakShownDay: string;
}

export const STORAGE_KEY = 'bemat_user_v3';
export const STATE_VERSION = 4;
export const PLAN_SIZE = 3;
export const EXTRA_SIZE = 2;

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Сколько дней между двумя ключами дат (b - a), в локальных сутках. */
export function dayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  if (isNaN(da.getTime()) || isNaN(db.getTime())) return 999;
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export function createUser(
  name: string,
  goal: UserGoal,
  opts: { isGuest?: boolean; isOnboarded?: boolean } = {}
): UserState {
  return {
    version: STATE_VERSION,
    name,
    goal,
    isGuest: opts.isGuest ?? false,
    isOnboarded: opts.isOnboarded ?? false,
    streak: 1,
    bestStreak: 1,
    lastVisit: new Date().toISOString(),
    lastVisitDay: '',
    completedTasks: [],
    customTasks: [],
    planDay: '',
    planTaskIds: [],
    optionalTaskIds: [],
    favorites: [],
    notificationsEnabled: false,
    notifHour: 19,
    streakShownDay: '',
  };
}

const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? (v.filter((x) => typeof x === 'string') as string[]) : [];

export function loadUser(): UserState | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Record<string, unknown>;
    if (!p || typeof p !== 'object') return null;

    const name = typeof p.name === 'string' && p.name.trim() ? p.name.trim().slice(0, 40) : 'Друг';
    const goal = (GOAL_OPTIONS.map((g) => g.id) as string[]).includes(String(p.goal))
      ? (p.goal as UserGoal)
      : 'fun';

    const base = createUser(name, goal);

    let lastVisitDay = typeof p.lastVisitDay === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(p.lastVisitDay)
      ? p.lastVisitDay
      : '';
    if (!lastVisitDay && typeof p.lastVisit === 'string') {
      const d = new Date(p.lastVisit);
      if (!isNaN(d.getTime())) lastVisitDay = todayKey(d);
    }

    const streak = Number.isFinite(Number(p.streak)) ? Math.max(1, Math.floor(Number(p.streak))) : 1;

    return {
      ...base,
      name,
      goal,
      isGuest: Boolean(p.isGuest),
      isOnboarded: Boolean(p.isOnboarded),
      streak,
      bestStreak: Math.max(streak, Math.floor(Number(p.bestStreak) || 0), 1),
      lastVisit: typeof p.lastVisit === 'string' ? p.lastVisit : base.lastVisit,
      lastVisitDay,
      completedTasks: strArr(p.completedTasks),
      customTasks: Array.isArray(p.customTasks)
        ? (p.customTasks as Record<string, unknown>[])
            .filter((t) => t && typeof t.id === 'string' && typeof t.title === 'string')
            .map((t) => ({
              id: String(t.id),
              title: String(t.title).slice(0, 80),
              time: Math.min(120, Math.max(1, Math.floor(Number(t.time) || 5))),
            }))
        : [],
      planDay: typeof p.planDay === 'string' ? p.planDay : '',
      planTaskIds: strArr(p.planTaskIds),
      optionalTaskIds: strArr(p.optionalTaskIds),
      favorites: strArr(p.favorites),
      notificationsEnabled: Boolean(p.notificationsEnabled),
      notifHour: [9, 12, 15, 17, 18, 19, 20, 21].includes(Number(p.notifHour)) ? Number(p.notifHour) : 19,
      streakShownDay: typeof p.streakShownDay === 'string' ? p.streakShownDay : '',
    };
  } catch {
    return null;
  }
}

export function saveUser(u: UserState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
  } catch {
    /* приватный режим / переполнение — молча игнорируем */
  }
}

export function clearUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
