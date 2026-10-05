// ---------------------------------------------------------------------------
// Локальные напоминания (Web Notification API).
// Работают, пока вкладка/приложение открыты или «заморожены» браузером
// ненадолго. Если нужны напоминания при полностью закрытом приложении —
// подключи OneSignal (см. README, раздел «Push-уведомления»).
// ---------------------------------------------------------------------------

const ICON = '/icophot/web-app-manifest-192x192.png';
const BADGE = '/icophot/web-app-manifest-192x192.png';

let reminderTimer: ReturnType<typeof setTimeout> | null = null;

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  return notificationsSupported() ? Notification.permission : 'unsupported';
}

export function cancelReminder() {
  if (reminderTimer) {
    clearTimeout(reminderTimer);
    reminderTimer = null;
  }
}

const MESSAGES: { title: string; body: string }[] = [
  { title: 'Боб проголодался! 🐱', body: '15 минут занятий — и Боб будет сыт 🔥' },
  { title: 'Не забудь про английский 📚', body: 'Одно задание из плана — уже победа' },
  { title: 'Стрик горит! 🔥', body: 'Зайди на 15 минут, чтобы сохранить серию' },
  { title: 'Боб скучает 😿', body: 'Он ждёт тебя, чтобы вместе поучить английский' },
];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

async function showNow(title: string, body: string, tag: string): Promise<boolean> {
  const options: NotificationOptions & { vibrate?: number[]; renotify?: boolean } = {
    body,
    icon: ICON,
    badge: BADGE,
    tag,
    renotify: true,
    vibrate: [200, 100, 200],
  };
  try {
    const reg = navigator.serviceWorker ? await navigator.serviceWorker.getRegistration() : null;
    if (reg) {
      await reg.showNotification(title, options as NotificationOptions);
      return true;
    }
  } catch {
    /* падаем в обычный Notification */
  }
  try {
    new Notification(title, { body, icon: ICON, tag });
    return true;
  } catch {
    return false;
  }
}

/**
 * Планирует напоминание на указанный час. `shouldSkip` вызывается в момент
 * срабатывания: если пользователь уже позанимался сегодня — уведомление не
 * показываем, а просто переносим на следующий день.
 */
export function scheduleDailyReminder(hour: number, shouldSkip: () => boolean) {
  cancelReminder();
  if (!notificationsSupported() || Notification.permission !== 'granted') return;

  const now = new Date();
  const target = new Date(now);
  target.setHours(hour, 0, 0, 0);
  if (target.getTime() <= now.getTime()) target.setDate(target.getDate() + 1);

  // setTimeout хранит задержку в 32-битном int — ограничиваем ~24 днями,
  // при срабатывании просто перепланируем.
  const delay = Math.min(target.getTime() - now.getTime(), 24 * 60 * 60 * 1000);

  reminderTimer = setTimeout(() => {
    try {
      if (!shouldSkip()) {
        const msg = pick(MESSAGES);
        void showNow(msg.title, msg.body, 'bemat-daily');
      }
    } catch {
      /* ignore */
    }
    scheduleDailyReminder(hour, shouldSkip);
  }, delay);
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!notificationsSupported()) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  try {
    const p = await Notification.requestPermission();
    return p === 'granted';
  } catch {
    return false;
  }
}

export async function sendTestNotification(hour: number): Promise<boolean> {
  const ok = await requestNotificationPermission();
  if (!ok) return false;
  return showNow('Напоминания включены! 🔔', `Напомню в ${hour}:00, если не позанимаешься`, 'bemat-test');
}
