import { useEffect, type ReactNode } from 'react';
import { ChevronDown, Star, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';

// ------------------------------- Кнопка -------------------------------

type ButtonVariant = 'primary' | 'ghost' | 'dark' | 'danger' | 'soft';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-violet-600 text-white hover:bg-violet-700 shadow-lg shadow-violet-200',
  ghost: 'bg-transparent text-stone-600 hover:bg-stone-100 border border-stone-200',
  dark: 'bg-stone-900 text-white hover:bg-stone-800 shadow-lg shadow-stone-300/40',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200',
  soft: 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-100',
};

export function Button({
  children,
  className,
  variant = 'primary',
  href,
  onClick,
  external,
  ...props
}: {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  external?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-transform no-underline cursor-pointer select-none active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed';

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        className={cn(base, VARIANTS[variant], className)}
        {...(external === false
          ? {}
          : { target: '_blank', rel: 'noopener noreferrer' })}
      >
        {children}
      </a>
    );
  }
  return (
    <button onClick={onClick} className={cn(base, VARIANTS[variant], className)} {...props}>
      {children}
    </button>
  );
}

// ------------------------------- Карточка -------------------------------

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-3xl border border-stone-100 shadow-sm', className)}>{children}</div>
  );
}

// ------------------------------ Прогресс ------------------------------

export function Progress({
  value,
  tone = 'violet',
  height = 'h-2.5',
  className,
}: {
  value: number;
  tone?: 'violet' | 'orange' | 'green';
  height?: string;
  className?: string;
}) {
  const bar = tone === 'green' ? 'bar-green' : tone === 'orange' ? 'bar-orange' : 'bar-violet';
  return (
    <div className={cn('bg-stone-100 rounded-full overflow-hidden', height, className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-700', bar)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
}

// ------------------------------- Модалка -------------------------------

let openModals = 0;

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    if (!isOpen) return;
    openModals += 1;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      openModals = Math.max(0, openModals - 1);
      if (openModals === 0) document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={cn(
          'relative w-full bg-[#fafaf9] rounded-[2rem] shadow-2xl p-6 border border-white max-h-[90vh] overflow-y-auto animate-slide-up',
          maxWidth
        )}
      >
        <div className="flex items-center justify-between mb-4 gap-4">
          <h3 className="text-xl font-bold text-stone-900">{title}</h3>
          <button onClick={onClose} aria-label="Закрыть" className="p-2 rounded-full hover:bg-stone-200 text-stone-500 shrink-0">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ------------------------------- Аккордеон -------------------------------

export function Accordion({
  title,
  subtitle,
  children,
  defaultOpen = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mb-4 last:mb-0">
      <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="w-full flex items-center justify-between p-4 bg-white hover:bg-stone-50 text-left gap-3"
        >
          <span>
            <span className="block text-lg font-bold text-stone-900">{title}</span>
            {subtitle && <span className="block text-xs text-stone-500 mt-0.5">{subtitle}</span>}
          </span>
          <span className={cn('p-1.5 rounded-full bg-stone-100 text-stone-500 shrink-0', isOpen && 'bg-violet-100 text-violet-600')}>
            <ChevronDown size={20} className={cn('transition-transform duration-200', isOpen && 'rotate-180')} />
          </span>
        </button>
        {isOpen && <div className="p-4 pt-3 border-t border-stone-100">{children}</div>}
      </div>
    </div>
  );
}

// --------------------------- Звёздочка «в избранное» ---------------------------

export function FavoriteStar({ active, onToggle, label }: { active: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      type="button"
      aria-label={active ? `Убрать из избранного: ${label}` : `Добавить в избранное: ${label}`}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        'p-2 rounded-xl transition-colors shrink-0',
        active ? 'bg-amber-100 text-amber-500' : 'bg-white/90 text-stone-300 hover:text-amber-400 hover:bg-white'
      )}
    >
      <Star size={18} className={cn(active && 'fill-amber-400')} />
    </button>
  );
}

// ------------------------------- Прочее -------------------------------

export function SectionHeading({
  emoji,
  title,
  subtitle,
  id,
}: {
  emoji?: string;
  title: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <div className="mb-4 px-1 scroll-mt-24" id={id}>
      <h2 className="text-xl sm:text-2xl font-black text-stone-900 flex items-center gap-2">
        {emoji && <span aria-hidden="true">{emoji}</span>}
        {title}
      </h2>
      {subtitle && <p className="text-sm text-stone-500 mt-1">{subtitle}</p>}
    </div>
  );
}

export function EmptyState({
  emoji,
  title,
  text,
  children,
}: {
  emoji: string;
  title: string;
  text?: string;
  children?: ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6">
      <div className="text-5xl mb-4" aria-hidden="true">
        {emoji}
      </div>
      <h3 className="text-lg font-bold text-stone-900 mb-1">{title}</h3>
      {text && <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">{text}</p>}
      {children}
    </div>
  );
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold', className)}>
      {children}
    </span>
  );
}
