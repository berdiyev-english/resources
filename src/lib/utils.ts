import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DeviceType = 'ios' | 'android' | 'desktop';

export function getDeviceType(): DeviceType {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'desktop';
}

/** Приложение открыто как установленное (PWA / WebView из RuStore)? */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  if (nav.standalone === true) return true;
  if (typeof document !== 'undefined' && document.referrer.startsWith('android-app://')) return true;
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Детерминированный «рандом» по сиду: план дня не должен меняться при перезагрузке
// ---------------------------------------------------------------------------

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(seed: string) {
  const seedFn = xmur3(seed);
  return mulberry32(seedFn());
}

export function seededShuffle<T>(arr: T[], seed: string): T[] {
  const rnd = seededRandom(seed);
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Русские склонения: plural(3, ['день','дня','дней']) → 'дня' */
export function plural(n: number, forms: [string, string, string]): string {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return forms[0];
  if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
  return forms[2];
}

export const daysWord = (n: number) => plural(n, ['день', 'дня', 'дней']);
export const minutesWord = (n: number) => plural(n, ['минута', 'минуты', 'минут']);
export const tasksWord = (n: number) => plural(n, ['задание', 'задания', 'заданий']);
