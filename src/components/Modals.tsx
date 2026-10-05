import { useEffect, useState } from 'react';
import { Bell, BellRing, CheckCircle, CheckCircle2, Flame, Sparkles, Star } from 'lucide-react';
import logo from '../assets/logo.png';
import catHungry from '../assets/cathungry.png';
import catFedImg from '../assets/catfed.png';
import { GOAL_OPTIONS, type UserGoal } from '../lib/storage';
import { requestNotificationPermission, sendTestNotification } from '../lib/notify';
import { useUser } from '../state/UserContext';
import { cn, daysWord } from '../lib/utils';
import { Modal, Progress } from './UI';

// ------------------------------- Онбординг -------------------------------

export function OnboardingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { start, continueAsGuest } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal>('fun');

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setGoal('fun');
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 1 ? 'Привет! Я Боб 🐱' : 'Твоя цель'} maxWidth="max-w-md">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 shadow-xl border-4 border-white">
          <img src={logo} alt="Кот Боб — маскот BEMAT" className="w-full h-full object-cover" />
        </div>

        {step === 1 ? (
          <>
            <p className="text-stone-600 mb-6">Помогу выучить английский. Как тебя зовут?</p>
            <input
              type="text"
              aria-label="Твоё имя"
              placeholder="Твоё имя…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white border border-stone-200 text-lg focus:outline-none focus:ring-2 focus:ring-violet-500 mb-4 shadow-sm"
            />
            <button
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50"
            >
              Дальше
            </button>
          </>
        ) : (
          <>
            <p className="text-stone-600 mb-5">
              {name.trim()}, какая у тебя цель? Я соберу задания под неё.
            </p>
            <div className="space-y-2 mb-6 text-left">
              {GOAL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setGoal(opt.id)}
                  className={cn(
                    'w-full p-3.5 rounded-2xl flex items-center gap-3 border-2 text-left',
                    goal === opt.id ? 'border-violet-600 bg-violet-50' : 'border-stone-100 bg-white'
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">
                    {opt.icon}
                  </span>
                  <span className="font-bold text-stone-800 flex-1 text-sm">{opt.label}</span>
                  {goal === opt.id && <CheckCircle2 className="w-5 h-5 text-violet-600" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                start(name, goal);
                onClose();
              }}
              className="w-full py-4 grad-violet text-white font-bold rounded-2xl shadow-lg shadow-violet-200"
            >
              Создать план 🚀
            </button>
          </>
        )}

        <button
          onClick={() => {
            continueAsGuest();
            onClose();
          }}
          className="mt-4 text-xs font-bold text-stone-400 hover:text-stone-600"
        >
          Продолжить без профиля
        </button>
      </div>
    </Modal>
  );
}

// --------------------------------- Стрик ---------------------------------

export function StreakPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useUser();
  if (!isOpen) return null;

  const streak = user.streak;
  const isFirst = streak <= 1;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-[#fafaf9] rounded-[2rem] shadow-2xl p-8 border border-white text-center animate-slide-up">
        <div className="text-7xl mb-4 animate-bounce" aria-hidden="true">
          🔥
        </div>
        {isFirst ? (
          <>
            <h3 className="text-2xl font-black text-stone-900 mb-2">Стрик зародился!</h3>
            <p className="text-stone-500 mb-2 text-sm">Занимайся каждый день, чтобы не потерять серию.</p>
            <p className="text-stone-400 text-xs mb-6">Боб верит в тебя! 🐱</p>
          </>
        ) : (
          <>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              {streak} {daysWord(streak)} подряд!
            </h3>
            <p className="text-stone-500 mb-2 text-sm">Отличная серия! Не останавливайся.</p>
            <p className="text-stone-400 text-xs mb-6">Боб гордится тобой 😸</p>
          </>
        )}

        <div className="flex items-center justify-center gap-1.5 mb-6 flex-wrap">
          {Array.from({ length: Math.min(streak, 7) }, (_, i) => (
            <span
              key={i}
              className="w-9 h-9 rounded-full bg-gradient-to-b from-orange-100 to-amber-50 flex items-center justify-center text-lg border border-orange-200 shadow-sm"
            >
              🔥
            </span>
          ))}
          {streak > 7 && <span className="text-stone-400 font-bold text-sm ml-1.5">+{streak - 7}</span>}
        </div>

        <div className="bg-violet-50 rounded-xl p-3 mb-6 border border-violet-100">
          <p className="text-xs font-bold text-violet-700">
            {isFirst
              ? '💡 Занимайся 15 минут в день!'
              : streak >= 7
                ? '🏆 Неделя без пропусков!'
                : streak >= 3
                  ? '💪 3+ дня подряд!'
                  : '📈 Каждый день — плюс к прогрессу!'}
          </p>
        </div>

        <button onClick={onClose} className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl">
          {isFirst ? 'Начнём! 🚀' : 'Продолжаем! 💪'}
        </button>
      </div>
    </div>
  );
}

// ------------------------------ Кормление Боба ------------------------------

export function CatFeedPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { today } = useUser();
  if (!isOpen) return null;

  const { required, progress, catFed, doneRequired } = today;
  const remaining = required.length - doneRequired;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Боб и твой план" maxWidth="max-w-sm">
      <div className="text-center">
        <div
          className={cn(
            'w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-lg',
            catFed ? 'border-green-300' : 'border-orange-300'
          )}
        >
          <img
            src={catFed ? catFedImg : catHungry}
            alt={catFed ? 'Кот Боб сыт' : 'Кот Боб голодный'}
            className="w-full h-full object-cover"
          />
        </div>

        {catFed ? (
          <>
            <div className="text-4xl mb-2" aria-hidden="true">🎉</div>
            <h3 className="text-xl font-black text-stone-900 mb-1">Боб сыт!</h3>
            <p className="text-stone-500 text-sm mb-6">Приходи завтра — будет новый план 😸</p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-2" aria-hidden="true">😿</div>
            <h3 className="text-xl font-black text-stone-900 mb-1">Боб голодный!</h3>
            <p className="text-stone-500 text-sm mb-2">Выполни все задания, чтобы покормить его</p>
            <p className="text-xs text-stone-400 mb-6">Осталось: {remaining}</p>
          </>
        )}

        <div className="mb-4 text-left">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 mb-1.5">
            <span>🍽️ Миска</span>
            <span>{catFed ? 100 : progress}%</span>
          </div>
          <Progress value={catFed ? 100 : progress} tone={catFed ? 'green' : 'orange'} height="h-4" />
        </div>

        <div className="space-y-2 text-left max-h-40 overflow-y-auto mb-2">
          {required.map((t) => (
            <div
              key={t.id}
              className={cn(
                'flex items-center gap-2 text-xs p-2 rounded-lg',
                t.done ? 'text-stone-400 bg-stone-50' : 'text-stone-700 bg-white border border-stone-100'
              )}
            >
              <span aria-hidden="true">{t.done ? '✅' : '⬜'}</span>
              <span className={cn('flex-1', t.done && 'line-through')}>{t.title}</span>
              <span className="text-stone-400">{t.time}м</span>
            </div>
          ))}
        </div>

        <button onClick={onClose} className="mt-4 w-full py-3 bg-violet-600 text-white font-bold rounded-2xl">
          {catFed ? 'Отлично! 😸' : 'Пойду заниматься!'}
        </button>
      </div>
    </Modal>
  );
}

// --------------------------------- Профиль ---------------------------------

export function ProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, rename, setGoal, today } = useUser();
  const [editName, setEditName] = useState(user.name);
  const [sel, setSel] = useState<UserGoal>(user.goal);

  useEffect(() => {
    if (isOpen) {
      setEditName(user.name);
      setSel(user.goal);
    }
  }, [isOpen, user.name, user.goal]);

  const goalChanged = sel !== user.goal;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Твой профиль">
      <div className="mb-6">
        <label className="text-xs font-bold text-stone-500 uppercase mb-2 block" htmlFor="profile-name">
          Имя
        </label>
        <input
          id="profile-name"
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="w-full p-3.5 rounded-xl bg-white border border-stone-200 text-base font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
        />
      </div>

      <div className="mb-6">
        <p className="text-xs font-bold text-stone-500 uppercase mb-2">Цель</p>
        <div className="space-y-2">
          {GOAL_OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => setSel(o.id)}
              className={cn(
                'w-full p-3.5 rounded-xl flex items-center gap-3 border-2 text-left',
                sel === o.id ? 'border-violet-600 bg-violet-50' : 'border-stone-100 bg-white'
              )}
            >
              <span className="text-xl" aria-hidden="true">{o.icon}</span>
              <span className="font-bold text-stone-800 flex-1 text-sm">{o.label}</span>
              {sel === o.id && <CheckCircle2 className="w-5 h-5 text-violet-600" />}
            </button>
          ))}
        </div>
      </div>

      {goalChanged && (
        <p className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700 font-medium">
          ⚠️ При смене цели задания на сегодня обновятся под новую цель. Стрик и избранное сохранятся.
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 mb-5">
        <Stat label="Стрик" value={`${user.streak} ${daysWord(user.streak)}`} icon={<Flame size={16} className="text-orange-500" />} />
        <Stat label="Рекорд" value={`${user.bestStreak} ${daysWord(user.bestStreak)}`} icon={<Sparkles size={16} className="text-amber-500" />} />
        <Stat label="Избранное" value={String(user.favorites.length)} icon={<Star size={16} className="text-amber-500" />} />
      </div>

      <p className="text-[11px] text-stone-400 mb-4">
        Сегодня выполнено: {today.doneRequired} из {today.required.length} заданий.
      </p>

      <button
        onClick={() => {
          rename(editName);
          setGoal(sel);
          onClose();
        }}
        disabled={!editName.trim()}
        className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50"
      >
        Сохранить
      </button>
    </Modal>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white border border-stone-100 rounded-xl p-2.5 text-center">
      <span className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase text-stone-400 mb-1">
        {icon} {label}
      </span>
      <span className="block text-sm font-black text-stone-800">{value}</span>
    </div>
  );
}

// --------------------------- Добавить своё задание ---------------------------

export function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addCustomTask } = useUser();
  const [title, setTitle] = useState('');
  const [time, setTime] = useState(5);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTime(5);
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Добавить задание">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-stone-500 uppercase mb-1.5 block" htmlFor="task-title">
            Что делать?
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Например: посмотреть TED Talk"
            className="w-full p-3.5 rounded-xl bg-white border border-stone-200 font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
          />
        </div>
        <div>
          <p className="text-xs font-bold text-stone-500 uppercase mb-1.5">Сколько минут?</p>
          <div className="flex gap-2">
            {[3, 5, 10, 15, 20].map((m) => (
              <button
                key={m}
                onClick={() => setTime(m)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl font-bold text-sm border-2',
                  time === m ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-stone-100 bg-white text-stone-600'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <p className="bg-stone-50 rounded-xl p-3 border border-stone-100 text-xs text-stone-500">
          💡 Задание будет повторяться <strong>каждый день</strong>. Удалить можно в любой момент в кабинете.
        </p>
        <button
          onClick={() => {
            if (title.trim()) {
              addCustomTask(title, time);
              onClose();
            }
          }}
          disabled={!title.trim()}
          className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Добавить <CheckCircle size={18} />
        </button>
      </div>
    </Modal>
  );
}

// -------------------------------- Напоминания --------------------------------

const HOURS = [9, 12, 15, 17, 18, 19, 20, 21];

export function NotifModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user, setNotifications } = useUser();
  const [enabled, setEnabled] = useState(user.notificationsEnabled);
  const [hour, setHour] = useState(user.notifHour || 19);
  const [testSent, setTestSent] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEnabled(user.notificationsEnabled);
      setHour(user.notifHour || 19);
      setError('');
      setTestSent(false);
    }
  }, [isOpen, user.notificationsEnabled, user.notifHour]);

  const toggle = () => {
    if (!enabled) {
      if (typeof window !== 'undefined' && !('Notification' in window)) {
        setError('Этот браузер не поддерживает уведомления. На iPhone добавь BEMAT на экран «Домой» — тогда они заработают.');
        return;
      }
      if ('Notification' in window && Notification.permission === 'denied') {
        setError('Уведомления заблокированы в настройках браузера. Разреши их вручную.');
        return;
      }
    }
    setError('');
    setEnabled((v) => !v);
  };

  const handleTest = async () => {
    const ok = await sendTestNotification(hour);
    if (ok) {
      setTestSent(true);
      setError('');
      setTimeout(() => setTestSent(false), 3000);
    } else {
      setError('Не удалось отправить. Разреши уведомления в настройках браузера.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Напоминания" maxWidth="max-w-sm">
      <div className="text-center mb-5">
        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-3">
          <img src={catHungry} alt="" className="w-full h-full object-cover" />
        </div>
        <p className="text-sm text-stone-600">Боб напомнит позаниматься, если день прошёл без заданий</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-100 mb-4">
        <span className="flex items-center gap-3">
          <BellRing size={20} className={enabled ? 'text-violet-600' : 'text-stone-400'} />
          <span className="font-bold text-stone-800">Уведомления</span>
        </span>
        <button
          onClick={toggle}
          role="switch"
          aria-checked={enabled}
          aria-label="Включить напоминания"
          className={cn('w-12 h-7 rounded-full relative transition-colors', enabled ? 'bg-violet-600' : 'bg-stone-200')}
        >
          <span
            className={cn(
              'w-5 h-5 bg-white rounded-full absolute top-1 shadow-sm transition-all',
              enabled ? 'right-1' : 'left-1'
            )}
          />
        </button>
      </div>

      {enabled && (
        <>
          <p className="text-xs font-bold text-stone-500 uppercase mb-2">Во сколько?</p>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {HOURS.map((h) => (
              <button
                key={h}
                onClick={() => setHour(h)}
                className={cn(
                  'py-2.5 rounded-xl font-bold text-sm border-2',
                  hour === h ? 'border-violet-600 bg-violet-50 text-violet-700' : 'border-stone-100 bg-white text-stone-600'
                )}
              >
                {h}:00
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-400 mb-4">
            ⏰ Придёт только если ты ещё не занимался в этот день
          </p>

          <button
            onClick={handleTest}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-sm mb-4 flex items-center justify-center gap-2 border-2 transition-all',
              testSent
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-dashed border-stone-200 bg-stone-50 text-stone-600 hover:border-violet-300 hover:text-violet-600'
            )}
          >
            {testSent ? (
              <>
                <CheckCircle size={16} /> Отправлено!
              </>
            ) : (
              <>
                <Bell size={16} /> Отправить тестовое уведомление
              </>
            )}
          </button>
        </>
      )}

      {error && <p className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">{error}</p>}

      <button
        onClick={async () => {
          if (enabled) {
            const ok = await requestNotificationPermission();
            if (!ok) {
              setError('Разреши уведомления в браузере, чтобы напоминания работали.');
              return;
            }
          }
          setNotifications(enabled, hour);
          onClose();
        }}
        className="w-full py-3.5 bg-violet-600 text-white font-bold rounded-2xl"
      >
        Сохранить
      </button>
    </Modal>
  );
}
