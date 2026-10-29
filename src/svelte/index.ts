import type { GlazeConfig, ToastRecord, Unsubscribe } from '../core';
import { canMountToaster, mountToaster } from '../web/toaster';
import { getEngine, setAutoMount } from '../web/engine';
import { toast, ui } from '../web/ui';

export { ui, toast };
export type { Ui } from '../web/ui';

/** Svelte Readable store interface. */
export interface Readable<T> {
  subscribe(run: (value: T) => void): Unsubscribe;
}

/** Readable Svelte store of the currently active toasts. */
export const toasts: Readable<readonly ToastRecord[]> = {
  subscribe(run: (value: readonly ToastRecord[]) => void): Unsubscribe {
    const engine = getEngine();
    run(engine.store.getToasts());
    return engine.store.subscribe(() => {
      run(engine.store.getToasts());
    });
  },
};

/** Readable Svelte store of the current global configuration. */
export const config: Readable<Readonly<GlazeConfig>> = {
  subscribe(run: (value: Readonly<GlazeConfig>) => void): Unsubscribe {
    const engine = getEngine();
    run(engine.store.config.get());
    return engine.store.config.subscribe(() => {
      run(engine.store.config.get());
    });
  },
};

/** Svelte action for mounting and managing the glazekit Toaster. */
export function glazeToaster(
  node?: HTMLElement,
  options?: Partial<GlazeConfig>,
): {
  update?: (options?: Partial<GlazeConfig>) => void;
  destroy?: () => void;
} {
  const engine = getEngine();
  if (options) {
    engine.store.config.set(options);
  }

  setAutoMount(false);
  if (canMountToaster()) {
    const handle = mountToaster(engine.store);
    return {
      update(nextOptions?: Partial<GlazeConfig>) {
        if (nextOptions) engine.store.config.set(nextOptions);
      },
      destroy() {
        handle.destroy();
        setAutoMount(true);
      },
    };
  }

  return {
    destroy() {
      setAutoMount(true);
    },
  };
}
