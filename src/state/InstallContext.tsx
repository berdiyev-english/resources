import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { isStandaloneMode } from '../lib/utils';

export type InstallResult = 'accepted' | 'dismissed' | 'unavailable';

interface InstallContextValue {
  /** Браузер разрешил нативный диалог установки (Android/Desktop Chrome, Edge…) */
  canInstall: boolean;
  /** Приложение уже запущено как установленное */
  isStandalone: boolean;
  promptInstall: () => Promise<InstallResult>;
}

const InstallContext = createContext<InstallContextValue>({
  canInstall: false,
  isStandalone: false,
  promptInstall: async () => 'unavailable',
});

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(() => isStandaloneMode());

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      deferredRef.current = null;
      setCanInstall(false);
      setIsStandalone(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);

    let media: MediaQueryList | null = null;
    try {
      media = window.matchMedia('(display-mode: standalone)');
      const onChange = (e: MediaQueryListEvent) => {
        if (e.matches) setIsStandalone(true);
      };
      media.addEventListener('change', onChange);
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onInstalled);
        media?.removeEventListener('change', onChange);
      };
    } catch {
      return () => {
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
        window.removeEventListener('appinstalled', onInstalled);
      };
    }
  }, []);

  const promptInstall = useCallback(async (): Promise<InstallResult> => {
    const evt = deferredRef.current;
    if (!evt) return 'unavailable';
    try {
      await evt.prompt();
      const choice = await evt.userChoice;
      deferredRef.current = null;
      setCanInstall(false);
      return choice.outcome;
    } catch {
      return 'dismissed';
    }
  }, []);

  return (
    <InstallContext.Provider value={{ canInstall, isStandalone, promptInstall }}>
      {children}
    </InstallContext.Provider>
  );
}

export function useInstall() {
  return useContext(InstallContext);
}
