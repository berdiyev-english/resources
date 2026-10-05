import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  clearUser,
  createUser,
  dayDiff,
  loadUser,
  PLAN_SIZE,
  saveUser,
  todayKey,
  type CustomTask,
  type UserGoal,
  type UserState,
} from '../lib/storage';
import { pickExtra, pickPlan, pickReplacement, TASK_BY_ID, type TaskCategory, type TaskTemplate } from '../data/tasks';
import { cancelReminder, scheduleDailyReminder } from '../lib/notify';

export interface DayTask extends TaskTemplate {
  done: boolean;
  custom?: boolean;
}

interface TodaySummary {
  /** Задания, которые нужно выполнить, чтобы покормить Боба: план + свои задания */
  required: DayTask[];
  /** Дополнительные задания (не обязательные) */
  optional: DayTask[];
  all: DayTask[];
  doneRequired: number;
  progress: number;
  totalMinutes: number;
  doneMinutes: number;
  catFed: boolean;
}

interface UserContextValue {
  user: UserState;
  /** Пользователь прошёл онбординг (выбрал имя и цель) */
  hasProfile: boolean;
  today: TodaySummary;
  /** Сегодня наступил новый день — можно показать попап со стриком */
  newDayReached: boolean;
  dismissNewDay: () => void;
  start: (name: string, goal: UserGoal) => void;
  continueAsGuest: () => void;
  setGoal: (goal: UserGoal) => void;
  rename: (name: string) => void;
  toggleTask: (id: string) => void;
  addCustomTask: (title: string, time: number) => void;
  removeCustomTask: (id: string) => void;
  swapTask: (id: string) => void;
  addExtraTasks: () => void;
  toggleFavorite: (resourceId: string) => void;
  isFavorite: (resourceId: string) => boolean;
  setNotifications: (enabled: boolean, hour: number) => void;
  reset: () => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const CUSTOM_CATEGORY: TaskCategory = 'vocab';

/** Обновление состояния при смене дня: сброс заданий, стрик, новый план. */
function refreshDay(u: UserState): { user: UserState; isNewDay: boolean } {
  const today = todayKey();

  if (u.lastVisitDay === today) {
    if (u.planDay === today && u.planTaskIds.length > 0) return { user: u, isNewDay: false };

    // План собирается заново (первый заход, смена цели, старые данные) —
    // из выполненных оставляем только те задания, что есть в новом плане и свои.
    const ids = pickPlan(u.goal, `${today}|${u.goal}`);
    const keep = u.completedTasks.filter(
      (id) => ids.includes(id) || u.customTasks.some((t) => t.id === id)
    );
    return {
      user: { ...u, planDay: today, planTaskIds: ids, completedTasks: keep },
      isNewDay: false,
    };
  }

  const diff = u.lastVisitDay ? dayDiff(u.lastVisitDay, today) : 999;
  const streak = diff === 1 ? u.streak + 1 : 1;

  return {
    user: {
      ...u,
      lastVisit: new Date().toISOString(),
      lastVisitDay: today,
      streak,
      bestStreak: Math.max(u.bestStreak || 1, streak),
      completedTasks: [],
      optionalTaskIds: [],
      planDay: today,
      planTaskIds: pickPlan(u.goal, `${today}|${u.goal}`),
    },
    isNewDay: true,
  };
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserState>(
    () => loadUser() ?? createUser('Друг', 'fun', { isGuest: true, isOnboarded: false })
  );
  const [newDayReached, setNewDayReached] = useState(false);

  const userRef = useRef(user);
  userRef.current = user;

  // Сохраняем при каждом изменении
  useEffect(() => {
    saveUser(user);
  }, [user]);

  /** Проверка смены дня (при старте, при возврате во вкладку, раз в минуту). */
  const checkDay = useCallback(() => {
    const prev = userRef.current;
    const res = refreshDay(prev);
    if (res.user !== prev) setUser(res.user);
    if (res.isNewDay && prev.isOnboarded && prev.streakShownDay !== todayKey()) {
      setNewDayReached(true);
    }
  }, []);

  useEffect(() => {
    checkDay();
    const onVisible = () => {
      if (document.visibilityState === 'visible') checkDay();
    };
    document.addEventListener('visibilitychange', onVisible);
    const interval = setInterval(checkDay, 60 * 1000);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(interval);
    };
  }, [checkDay]);

  // Напоминания
  useEffect(() => {
    if (!user.notificationsEnabled) {
      cancelReminder();
      return;
    }
    const hour = user.notifHour;
    const shouldSkip = () => {
      const fresh = loadUser();
      return !!fresh && fresh.lastVisitDay === todayKey() && fresh.completedTasks.length > 0;
    };
    scheduleDailyReminder(hour, shouldSkip);
    const onVisible = () => {
      if (document.visibilityState === 'visible') scheduleDailyReminder(hour, shouldSkip);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      cancelReminder();
    };
  }, [user.notificationsEnabled, user.notifHour]);

  // ------------------------------ действия ------------------------------

  const start = useCallback((name: string, goal: UserGoal) => {
    const today = todayKey();
    setUser((u) => ({
      ...u,
      name: name.trim().slice(0, 40) || 'Друг',
      goal,
      isGuest: false,
      isOnboarded: true,
      // план под новую цель собираем сразу, не дожидаясь следующей проверки дня
      planDay: today,
      planTaskIds: pickPlan(goal, `${today}|${goal}`),
      optionalTaskIds: [],
      completedTasks: [],
      lastVisit: new Date().toISOString(),
      lastVisitDay: today,
    }));
  }, []);

  const continueAsGuest = useCallback(() => {
    setUser((u) => ({ ...u, isOnboarded: true, isGuest: u.isGuest }));
  }, []);

  const setGoal = useCallback((goal: UserGoal) => {
    setUser((u) => {
      if (u.goal === goal) return u;
      const plan = pickPlan(goal, `${todayKey()}|${goal}`);
      const keep = u.completedTasks.filter((id) => u.customTasks.some((t) => t.id === id));
      return {
        ...u,
        goal,
        planDay: todayKey(),
        planTaskIds: plan,
        optionalTaskIds: [],
        completedTasks: keep,
      };
    });
  }, []);

  const rename = useCallback((name: string) => {
    setUser((u) => ({ ...u, name: name.trim().slice(0, 40) || u.name, isGuest: false, isOnboarded: true }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setUser((u) => ({
      ...u,
      completedTasks: u.completedTasks.includes(id)
        ? u.completedTasks.filter((x) => x !== id)
        : [...u.completedTasks, id],
    }));
  }, []);

  const addCustomTask = useCallback((title: string, time: number) => {
    const task: CustomTask = {
      id: `c_${Date.now().toString(36)}`,
      title: title.trim().slice(0, 80),
      time,
    };
    setUser((u) => ({ ...u, customTasks: [...u.customTasks, task] }));
  }, []);

  const removeCustomTask = useCallback((id: string) => {
    setUser((u) => ({
      ...u,
      customTasks: u.customTasks.filter((t) => t.id !== id),
      completedTasks: u.completedTasks.filter((x) => x !== id),
    }));
  }, []);

  const swapTask = useCallback((id: string) => {
    setUser((u) => {
      const exclude = [...u.planTaskIds, ...u.optionalTaskIds];
      const next = pickReplacement(u.goal, id, exclude, `${id}|${Date.now()}`);
      if (!next) return u;
      const inPlan = u.planTaskIds.includes(id);
      const inOptional = u.optionalTaskIds.includes(id);
      return {
        ...u,
        planTaskIds: inPlan ? u.planTaskIds.map((x) => (x === id ? next : x)) : u.planTaskIds,
        optionalTaskIds: inOptional ? u.optionalTaskIds.map((x) => (x === id ? next : x)) : u.optionalTaskIds,
        completedTasks: u.completedTasks.filter((x) => x !== id),
      };
    });
  }, []);

  const addExtraTasks = useCallback(() => {
    setUser((u) => {
      const exclude = [...u.planTaskIds, ...u.optionalTaskIds];
      const extra = pickExtra(u.goal, exclude, 2, `extra|${Date.now()}`);
      if (extra.length === 0) return u;
      return { ...u, optionalTaskIds: [...u.optionalTaskIds, ...extra] };
    });
  }, []);

  const toggleFavorite = useCallback((resourceId: string) => {
    setUser((u) => ({
      ...u,
      favorites: u.favorites.includes(resourceId)
        ? u.favorites.filter((x) => x !== resourceId)
        : [resourceId, ...u.favorites],
    }));
  }, []);

  const isFavorite = useCallback(
    (resourceId: string) => user.favorites.includes(resourceId),
    [user.favorites]
  );

  const setNotifications = useCallback((enabled: boolean, hour: number) => {
    setUser((u) => ({ ...u, notificationsEnabled: enabled, notifHour: hour }));
  }, []);

  const reset = useCallback(() => {
    cancelReminder();
    clearUser();
    const fresh = createUser('Друг', 'fun', { isGuest: true, isOnboarded: false });
    setUser(fresh);
    saveUser(fresh);
  }, []);

  const dismissNewDay = useCallback(() => {
    setNewDayReached(false);
    setUser((u) => ({ ...u, streakShownDay: todayKey() }));
  }, []);

  // ------------------------------ производные ------------------------------

  const today = useMemo<TodaySummary>(() => {
    const toTask = (t: TaskTemplate, done: boolean): DayTask => ({ ...t, done });

    const required: DayTask[] = [
      ...user.planTaskIds
        .map((id) => TASK_BY_ID[id])
        .filter(Boolean)
        .map((t) => toTask(t, user.completedTasks.includes(t.id))),
      ...user.customTasks.map((ct) =>
        toTask(
          {
            id: ct.id,
            goal: user.goal,
            title: ct.title,
            time: ct.time,
            category: CUSTOM_CATEGORY,
          },
          user.completedTasks.includes(ct.id)
        )
      ),
    ];

    const optional: DayTask[] = user.optionalTaskIds
      .map((id) => TASK_BY_ID[id])
      .filter(Boolean)
      .map((t) => toTask(t, user.completedTasks.includes(t.id)));

    const all = [...required, ...optional];

    const doneRequired = required.filter((t) => t.done).length;
    const totalMinutes = [...required, ...optional].reduce((s, t) => s + t.time, 0);
    const doneMinutes = all.filter((t) => t.done).reduce((s, t) => s + t.time, 0);
    const progress = required.length ? Math.round((doneRequired / required.length) * 100) : 0;

    return {
      required,
      optional,
      all,
      doneRequired,
      progress,
      totalMinutes,
      doneMinutes,
      catFed: required.length > 0 && doneRequired === required.length,
    };
  }, [user]);

  const value: UserContextValue = {
    user,
    hasProfile: user.isOnboarded,
    today,
    newDayReached,
    dismissNewDay,
    start,
    continueAsGuest,
    setGoal,
    rename,
    toggleTask,
    addCustomTask,
    removeCustomTask,
    swapTask,
    addExtraTasks,
    toggleFavorite,
    isFavorite,
    setNotifications,
    reset,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser должен вызываться внутри <UserProvider>');
  return ctx;
}

export { PLAN_SIZE };
