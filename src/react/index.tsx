import { useEffect, useMemo, useSyncExternalStore, type JSX } from 'react';
import type { GlazeConfig, ToastApi, ToastRecord } from '../core';
import { canMountToaster, mountToaster } from '../web/toaster';
import { getEngine, setAutoMount } from '../web/engine';
import { toast, ui } from '../web/ui';

export { ui, toast };
export type { Ui } from '../web/ui';

/** Props for the React Toaster component. */
export interface ToasterProps extends Partial<GlazeConfig> {
  /** Custom container class name. */
  className?: string;
}

/**
 * React Toaster provider and container.
 * Safe for SSR and hydration. Configures toastory and handles toast rendering.
 */
export function Toaster(props: ToasterProps): JSX.Element | null {
  const { className: _className, ...configPatch } = props;
  void _className;
  const engine = getEngine();

  // Apply configuration on mount and prop changes
  useEffect(() => {
    if (Object.keys(configPatch).length > 0) {
      engine.store.config.set(configPatch);
    }
  }, [configPatch, engine]);

  useEffect(() => {
    // Disable web autoMount since React component manages the toaster lifecycle
    setAutoMount(false);

    if (canMountToaster()) {
      const handle = mountToaster(engine.store);
      return () => {
        handle.destroy();
        setAutoMount(true);
      };
    }
    return undefined;
  }, [engine]);

  return null;
}

/** Hook returning the toast API and the list of currently active toasts. */
export function useToast(): {
  toast: ToastApi;
  toasts: readonly ToastRecord[];
} {
  const engine = getEngine();
  const toasts = useSyncExternalStore(
    (onStoreChange) => engine.store.subscribe(onStoreChange),
    () => engine.store.getToasts(),
    () => [],
  );

  return useMemo(() => ({ toast: engine.toast, toasts }), [engine, toasts]);
}

/** Hook returning the full `ui` toolkit and reactive toast state. */
export function useGlazekit(): {
  ui: typeof ui;
  toast: ToastApi;
  toasts: readonly ToastRecord[];
  config: Readonly<GlazeConfig>;
} {
  const engine = getEngine();
  const toasts = useSyncExternalStore(
    (onStoreChange) => engine.store.subscribe(onStoreChange),
    () => engine.store.getToasts(),
    () => [],
  );
  const config = useSyncExternalStore(
    (onStoreChange) => engine.store.config.subscribe(onStoreChange),
    () => engine.store.config.get(),
    () => engine.store.config.get(),
  );

  return useMemo(
    () => ({
      ui,
      toast: engine.toast,
      toasts,
      config,
    }),
    [engine, toasts, config],
  );
}
