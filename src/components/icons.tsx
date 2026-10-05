import {
  Bot,
  BookOpen,
  Brain,
  Film,
  GraduationCap,
  Headphones,
  Mic,
  PenLine,
  PenTool,
  SpellCheck,
  Volume2,
  type LucideIcon,
} from 'lucide-react';
import type { SectionId } from '../data/resources';
import type { TaskCategory } from '../data/tasks';

/** Иконки разделов каталога — используются в шапке, чипсах, карточках и кабинете */
export const SECTION_ICONS: Record<SectionId, LucideIcon> = {
  books: BookOpen,
  video: Film,
  practice: PenTool,
  speak: Mic,
  courses: GraduationCap,
  bots: Bot,
};

/** Иконки типов заданий (чтение, аудирование, речь…) */
export const CATEGORY_ICONS: Record<TaskCategory, LucideIcon> = {
  reading: BookOpen,
  listening: Headphones,
  grammar: SpellCheck,
  vocab: Brain,
  writing: PenLine,
  speaking: Mic,
  pronunciation: Volume2,
};

/** Универсальный рендер иконки раздела */
export function SectionIcon({ id, size = 18, className }: { id: SectionId; size?: number; className?: string }) {
  const Icon = SECTION_ICONS[id];
  return <Icon size={size} className={className} aria-hidden="true" />;
}
