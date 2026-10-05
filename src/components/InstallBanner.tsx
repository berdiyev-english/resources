import { useEffect, useState, type ReactNode } from 'react';
import { Download, LogIn, Monitor, Share, Smartphone, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { getDeviceType } from '../lib/utils';
import { useInstall } from '../state/InstallContext';
import { CONTACTS } from '../data/site';
import { Modal } from './UI';

const DISMISS_KEY = 'bemat_install_dismissed_v1';

function Step({ n, title, sub, right }: { n: ReactNode; title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="flex items-center gap-3 bg-stone-50 p-3.5 rounded-xl border border-stone-100">
      <span className="w-8 h-8 bg-stone-900 text-white rounded-lg flex items-center justify-center font-black text-sm shrink-0">
        {n}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block font-bold text-sm text-stone-900">{title}</span>
        {sub && <span className="block text-[11px] text-stone-500">{sub}</span>}
      </span>
      {right && <span className="shrink-0">{right}</span>}
    </div>
  );
}

/** Инструкция по установке. Ничего не блокирует: сайтом можно пользоваться и без установки. */
export function InstallModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { canInstall, promptInstall, isStandalone } = useInstall();
  const device = getDeviceType();

  const install = async () => {
    const res = await promptInstall();
    if (res !== 'unavailable') onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Приложение BEMAT" maxWidth="max-w-md">
      {isStandalone ? (
        <div className="text-center py-6">
          <img src={logo} alt="" className="w-16 h-16 rounded-2xl mx-auto mb-4" />
          <p className="font-bold text-stone-900">Приложение уже установлено 👍</p>
          <p className="text-sm text-stone-500 mt-1">Ты пользуешься BEMAT как обычным приложением.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-violet-50 border border-violet-100">
            <img src={logo} alt="" className="w-12 h-12 rounded-xl" />
            <div>
              <p className="font-bold text-stone-900 text-sm">Установка не обязательна</p>
              <p className="text-xs text-stone-600">Сайт работает и в браузере телефона — с тем же функционалом.</p>
            </div>
          </div>

          {canInstall && (
            <button
              onClick={install}
              className="w-full py-4 grad-violet text-white font-bold rounded-2xl shadow-lg shadow-violet-200 mb-4 flex items-center justify-center gap-2"
            >
              <Download size={20} /> Установить приложение
            </button>
          )}

          {device === 'ios' && (
            <div className="space-y-3">
              <p className="text-sm font-bold text-stone-800">Установка на iPhone / iPad (Safari)</p>
              <Step n={1} title="Нажми «Поделиться»" sub="Кнопка внизу экрана Safari" right={<Share size={20} className="text-blue-500" />} />
              <Step n={2} title="Выбери «На экран Домой»" sub="Пролистай список вниз" />
              <Step n={3} title="Нажми «Добавить»" sub="Иконка BEMAT появится на рабочем столе" right={<img src={logo} alt="" className="w-8 h-8 rounded-lg" />} />
            </div>
          )}

          {device === 'android' && (
            <div className="space-y-3">
              {!canInstall && (
                <p className="text-sm text-stone-600">
                  В меню браузера нажми <b>«Установить приложение»</b> / <b>«Добавить на главный экран»</b>. Либо скачай
                  APK-версию в RuStore:
                </p>
              )}
              <a
                href={CONTACTS.rustore}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#0077FF] text-white rounded-xl font-bold no-underline"
              >
                <Smartphone size={18} /> Скачать в RuStore
              </a>
            </div>
          )}

          {device === 'desktop' && (
            <div className="space-y-3">
              <p className="text-sm text-stone-600">
                {canInstall
                  ? 'Нажми кнопку выше — приложение появится в меню «Пуск» и на рабочем столе.'
                  : 'Найди в адресной строке иконку установки (⊕ или монитор со стрелкой) — приложение откроется в отдельном окне.'}
              </p>
              <Step n={<Monitor size={16} />} title="Chrome / Edge" sub="Меню → Установить приложение" />
              <Step n={<LogIn size={16} />} title="Ничего не нужно" sub="Можно просто пользоваться сайтом" />
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

/**
 * Ненавязчивый баннер «установить приложение».
 * Появляется один раз (можно скрыть навсегда) и никогда не перекрывает контент полностью.
 */
export function InstallBanner() {
  const { isStandalone, canInstall, promptInstall } = useInstall();
  const [visible, setVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isStandalone) return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === '1') return;
    } catch {
      /* ignore */
    }
    const timer = setTimeout(() => setVisible(true), 25_000);
    return () => clearTimeout(timer);
  }, [isStandalone]);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore */
    }
  };

  if (!visible || isStandalone) return null;

  const device = getDeviceType();

  return (
    <>
      <div className="fixed bottom-[76px] lg:bottom-6 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 p-3.5 flex items-center gap-3 pointer-events-auto">
          <img src={logo} alt="" className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-stone-900">Установить BEMAT</p>
            <p className="text-[11px] text-stone-500 leading-snug">
              {device === 'ios' ? 'Работает как приложение с домашнего экрана' : 'Быстрый доступ с рабочего стола'}
            </p>
          </div>
          <button
            onClick={() => (canInstall ? promptInstall() : setShowHelp(true))}
            className="px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-bold shrink-0"
          >
            {canInstall ? 'Установить' : 'Как?'}
          </button>
          <button onClick={dismiss} aria-label="Скрыть" className="p-1.5 text-stone-400 shrink-0">
            <X size={18} />
          </button>
        </div>
      </div>
      <InstallModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}
