import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Flame,
  Plus,
  RefreshCw,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Wand2,
} from 'lucide-react';
import catHungry from '../assets/cathungry.png';
import catFedImg from '../assets/catfed.png';
import { GOAL_LABELS } from '../lib/storage';
import { CATEGORY_META } from '../data/tasks';
import { GOAL_RECOMMENDATIONS, RESOURCE_BY_ID } from '../data/resources';
import { Seo } from '../lib/seo';
import { useUser, type DayTask } from '../state/UserContext';
import { cn, daysWord } from '../lib/utils';
import { Card, Progress, SectionHeading } from '../components/UI';
import { CATEGORY_ICONS } from '../components/icons';
import { ResourceCard } from '../components/ResourceCard';
import { AddTaskModal, CatFeedPopup, NotifModal, OnboardingModal, ProfileModal } from '../components/Modals';

export function DashboardPage() {
  const { user, today, hasProfile, toggleTask, swapTask, removeCustomTask, addExtraTasks } = useUser();
  const [showCat, setShowCat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!hasProfile);

  useEffect(() => {
    if (!hasProfile) setShowOnboarding(true);
  }, [hasProfile]);

  // Когда Боб «наелся» — показываем попап один раз на переходе
  const prevFed = useRef(today.catFed);
  useEffect(() => {
    if (today.catFed && !prevFed.current) setShowCat(true);
    prevFed.current = today.catFed;
  }, [today.catFed]);

  const favorites = user.favorites
    .map((id) => RESOURCE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 4);

  const recommendations = (GOAL_RECOMMENDATIONS[user.goal] || [])
    .map((id) => RESOURCE_BY_ID[id])
    .filter(Boolean)
    .slice(0, 3);

  return (
    <>
      <Seo
        seo={{
          path: '/dashboard',
          title: 'Личный кабинет — план занятий английским | BEMAT',
          description: 'Твой план на 15 минут в день: задания, стрик, кот Боб и избранные сайты для изучения английского.',
          noindex: true,
        }}
      />

      <div className="px-4 lg:px-0 pt-5">
        {/* Приветствие */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <p className="text-stone-500 text-[11px] font-bold uppercase tracking-wider">Личный кабинет</p>
            <h1 className="text-2xl font-black text-stone-800 flex items-center gap-2">
              <span className="truncate">Привет, {user.name}</span> 👋
              <button
                onClick={() => setShowProfile(true)}
                aria-label="Редактировать профиль"
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-violet-600 shrink-0"
              >
                <Edit3 size={16} />
              </button>
            </h1>
          </div>
          <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-stone-100 shrink-0">
            <Flame className={cn('w-5 h-5', user.streak > 0 ? 'text-orange-500 fill-orange-500' : 'text-stone-300')} />
            <span className="font-bold text-stone-800 text-sm">
              {user.streak} {daysWord(user.streak)}
            </span>
          </span>
        </div>

        {!hasProfile && (
          <Card className="p-4 mb-5 border-violet-100 grad-violet-soft">
            <p className="font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Wand2 size={18} className="text-violet-600" /> Собери план под свою цель
            </p>
            <p className="text-xs text-stone-600 mb-3">
              Скажи, к чему готовишься — задания станут точнее: ЕГЭ, ОГЭ, IELTS, TOEFL, разговор или «для себя».
            </p>
            <button
              onClick={() => setShowOnboarding(true)}
              className="w-full py-3 rounded-xl bg-violet-600 text-white font-bold text-sm"
            >
              Настроить за 20 секунд
            </button>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Левая колонка */}
          <div className="lg:col-span-2 space-y-5">
            {/* Боб */}
            <button
              onClick={() => setShowCat(true)}
              className={cn(
                'w-full text-left rounded-[2rem] p-5 shadow-sm border transition-shadow hover:shadow-md',
                today.catFed ? 'grad-green-soft border-green-200' : 'grad-orange-soft border-orange-200'
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'w-16 h-16 rounded-full overflow-hidden border-[3px] shadow-md shrink-0',
                    today.catFed ? 'border-green-300' : 'border-orange-300'
                  )}
                >
                  <img
                    src={today.catFed ? catFedImg : catHungry}
                    alt={today.catFed ? 'Кот Боб сыт' : 'Кот Боб голодный'}
                    className="w-full h-full object-cover"
                  />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-stone-900 text-base mb-0.5">
                    {today.catFed ? 'Боб сыт! 😸' : 'Боб голодный 😿'}
                  </span>
                  <span className="block text-xs text-stone-500 mb-2">
                    {today.catFed
                      ? 'Все задания выполнены. Приходи завтра!'
                      : `Выполни ${today.required.length - today.doneRequired} ${today.required.length - today.doneRequired === 1 ? 'задание' : 'задания'} из плана`}
                  </span>
                  <Progress value={today.catFed ? 100 : today.progress} tone={today.catFed ? 'green' : 'orange'} className="bg-white/70" />
                </span>
              </div>
            </button>

            {/* План */}
            <Card className="p-5 relative overflow-hidden">
              <span className="absolute top-0 left-0 w-full h-1.5 bg-stone-100" aria-hidden="true">
                <span className="block h-full bar-violet transition-all duration-500 rounded-r-full" style={{ width: `${today.progress}%` }} />
              </span>

              <div className="flex justify-between items-start mb-4 mt-1.5">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">План на сегодня</h2>
                  <p className="text-stone-500 text-xs flex items-center gap-1.5">
                    <Clock size={12} /> ~{today.totalMinutes} мин · выполнено {today.doneMinutes} мин · цель:{' '}
                    {GOAL_LABELS[user.goal]}
                  </p>
                </div>
                <button
                  onClick={() => setShowProfile(true)}
                  className="px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] font-bold text-stone-600 shrink-0"
                >
                  Сменить цель
                </button>
              </div>

              <div className="space-y-3">
                {today.required.map((t) => (
                  <TaskRow
                    key={t.id}
                    task={t}
                    onToggle={() => toggleTask(t.id)}
                    onSwap={t.custom ? undefined : () => swapTask(t.id)}
                    onRemove={t.custom ? () => removeCustomTask(t.id) : undefined}
                  />
                ))}
              </div>

              {today.optional.length > 0 && (
                <div className="pt-4 mt-4 border-t border-dashed border-stone-200">
                  <p className="text-[10px] font-bold text-stone-400 uppercase mb-2 px-1">Дополнительно</p>
                  <div className="space-y-3">
                    {today.optional.map((t) => (
                      <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} onSwap={() => swapTask(t.id)} />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  onClick={() => setShowAdd(true)}
                  className="flex-1 py-3 bg-stone-50 hover:bg-stone-100 border-2 border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-500 hover:text-violet-600 flex items-center justify-center gap-2"
                >
                  <Plus size={18} /> Своё задание
                </button>
                <button
                  onClick={addExtraTasks}
                  className="flex-1 py-3 bg-violet-50 hover:bg-violet-100 border-2 border-dashed border-violet-200 rounded-xl text-sm font-bold text-violet-600 flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} /> Хочу больше заданий
                </button>
              </div>
            </Card>

            {/* Напоминания */}
            <button
              onClick={() => setShowNotif(true)}
              className={cn(
                'w-full text-left rounded-[2rem] p-5 shadow-sm border',
                user.notificationsEnabled ? 'grad-violet-soft border-violet-200' : 'grad-violet border-transparent'
              )}
            >
              <span className="flex items-center gap-4">
                <span
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center shrink-0',
                    user.notificationsEnabled ? 'bg-violet-100' : 'bg-white/20'
                  )}
                >
                  {user.notificationsEnabled ? (
                    <BellRing size={24} className="text-violet-600" />
                  ) : (
                    <Bell size={24} className="text-white" />
                  )}
                </span>
                <span className="flex-1">
                  {user.notificationsEnabled ? (
                    <>
                      <span className="block font-bold text-violet-900 text-sm">Напоминания включены</span>
                      <span className="block text-xs text-violet-600">Каждый день в {user.notifHour || 19}:00</span>
                    </>
                  ) : (
                    <>
                      <span className="block font-bold text-white text-sm">Включить напоминания</span>
                      <span className="block text-xs text-violet-100">Боб напомнит позаниматься, если забудешь</span>
                    </>
                  )}
                </span>
              </span>
            </button>
          </div>

          {/* Правая колонка */}
          <div className="space-y-5">
            {/* Статистика */}
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-2 text-center">
                <StatBox label="Стрик" value={`${user.streak}`} sub={daysWord(user.streak)} icon={<Flame size={14} className="text-orange-500" />} />
                <StatBox label="Рекорд" value={`${user.bestStreak}`} sub={daysWord(user.bestStreak)} icon={<Trophy size={14} className="text-amber-500" />} />
                <StatBox
                  label="Сегодня"
                  value={`${today.doneRequired}/${today.required.length}`}
                  sub="заданий"
                  icon={<CheckCircle2 size={14} className="text-emerald-500" />}
                />
              </div>
            </Card>

            {/* Избранное */}
            <section>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-1.5">
                  <Star size={16} className="text-amber-400 fill-amber-400" /> Избранное
                </h2>
                <Link to="/favorites" className="text-[11px] font-bold text-violet-600 no-underline">
                  Все ({user.favorites.length}) →
                </Link>
              </div>
              {favorites.length > 0 ? (
                <div className="space-y-2">
                  {favorites.map((r) => (
                    <ResourceCard key={r.id} resource={r} compact />
                  ))}
                </div>
              ) : (
                <Card className="p-4 text-center">
                  <p className="text-xs text-stone-500 mb-3">
                    Отмечай звёздочкой сайты, которыми пользуешься постоянно — они появятся здесь.
                  </p>
                  <Link to="/" className="text-xs font-bold text-violet-600 no-underline">
                    Открыть каталог →
                  </Link>
                </Card>
              )}
            </section>

            {/* Рекомендации */}
            {recommendations.length > 0 && (
              <section>
                <SectionHeading title="Под твою цель" emoji="🎯" />
                <div className="space-y-2">
                  {recommendations.map((r) => (
                    <ResourceCard key={r.id} resource={r} compact />
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <CatFeedPopup isOpen={showCat} onClose={() => setShowCat(false)} />
      <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} />
      <AddTaskModal isOpen={showAdd} onClose={() => setShowAdd(false)} />
      <NotifModal isOpen={showNotif} onClose={() => setShowNotif(false)} />
      <OnboardingModal isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </>
  );
}

function StatBox({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="bg-stone-50 rounded-xl p-2.5">
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-stone-400 mb-0.5">
        {icon} {label}
      </span>
      <span className="block text-lg font-black text-stone-800 leading-none">{value}</span>
      <span className="block text-[10px] text-stone-400">{sub}</span>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onSwap,
  onRemove,
}: {
  task: DayTask;
  onToggle: () => void;
  onSwap?: () => void;
  onRemove?: () => void;
}) {
  const meta = CATEGORY_META[task.category];
  const CategoryIcon = CATEGORY_ICONS[task.category];

  return (
    <div
      onClick={onToggle}
      className={cn(
        'flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors',
        task.done ? 'bg-stone-50 border-transparent opacity-70' : 'bg-white border-stone-100 hover:border-violet-200 shadow-sm'
      )}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        aria-pressed={task.done}
        aria-label={task.done ? 'Отменить выполнение' : 'Отметить выполненным'}
        className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center border shrink-0',
          task.done ? 'bg-violet-500 border-violet-500' : 'border-stone-300 bg-white'
        )}
      >
        {task.done && <CheckCircle2 className="w-4 h-4 text-white" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={cn('font-bold text-sm text-stone-800 leading-snug', task.done && 'line-through text-stone-400')}>
          {task.title}
        </p>
        <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
          {task.custom ? (
            <span className="inline-flex items-center gap-1">
              <Star size={11} aria-hidden="true" /> Своё задание
            </span>
          ) : (
            <span className="inline-flex items-center gap-1">
              <CategoryIcon size={11} aria-hidden="true" /> {meta.label}
            </span>
          )}
          · ~{task.time} мин
        </p>
        {task.hint && !task.done && <p className="text-[11px] text-stone-400 mt-0.5 italic">{task.hint}</p>}
      </div>

      {task.internal && (
        <Link
          to={task.internal}
          onClick={(e) => e.stopPropagation()}
          aria-label="Открыть раздел"
          className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg shrink-0"
        >
          <ArrowRight size={16} />
        </Link>
      )}
      {task.link && (
        <a
          href={task.link}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          aria-label="Открыть сайт задания"
          className="p-2 text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-lg shrink-0"
        >
          <ExternalLink size={16} />
        </a>
      )}
      {onSwap && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwap();
          }}
          aria-label="Заменить задание"
          title="Заменить задание"
          className="p-2 text-stone-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg shrink-0"
        >
          <RefreshCw size={15} />
        </button>
      )}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Удалить задание"
          className="p-2 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-lg shrink-0"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
