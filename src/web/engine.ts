import { createToastEngine } from '../core';
import type { GlazeConfig, ToastApi, ToastStore } from '../core';
import { canMountToaster, mountToaster } from './toaster';
import type { ToasterHandle } from './toaster';

/** Shared state behind `ui`. One instance exists per page, even when the package is bundled twice. */
export interface WebEngine {
  /** Toast state container. */
  store: ToastStore;
  /** The toast API. */
  toast: ToastApi;
  /** Whether the built-in DOM renderer mounts itself when the first toast appears. */
  autoMount: boolean;
  /** The mounted renderer, when any. */
  toaster: ToasterHandle | undefined;
}

const KEY = Symbol.for('glazekit.engine.v1');

/** Returns the page wide engine, creating it on first use. Safe on the server. */
export function getEngine(): WebEngine {
  const holder = globalThis as { [KEY]?: WebEngine };
  const existing = holder[KEY];
  if (existing) return existing;
  const { store, toast } = createToastEngine();
  const engine: WebEngine = { store, toast, autoMount: true, toaster: undefined };
  store.subscribe(() => {
    if (engine.autoMount && !engine.toaster && canMountToaster() && store.getToasts().length > 0) {
      engine.toaster = mountToaster(store);
    }
  });
  holder[KEY] = engine;
  return engine;
}

/**
 * Enables or disables the built-in DOM toast renderer. Framework adapters disable it when they
 * render toasts themselves. Disabling tears down an already mounted renderer.
 */
export function setAutoMount(enabled: boolean): void {
  const engine = getEngine();
  engine.autoMount = enabled;
  if (!enabled && engine.toaster) {
    engine.toaster.destroy();
    engine.toaster = undefined;
  } else if (
    enabled &&
    !engine.toaster &&
    canMountToaster() &&
    engine.store.getToasts().length > 0
  ) {
    engine.toaster = mountToaster(engine.store);
  }
}

/** Applies configuration to the page wide engine. Returns the resulting configuration. */
export function configure(patch: Partial<GlazeConfig>): Readonly<GlazeConfig> {
  return getEngine().store.config.set(patch);
}

/**
 * Dismisses every toast, tears down the DOM renderer, clears history and restores the default
 * configuration and auto-mount behaviour. Intended for tests and hot module reloading.
 */
export function resetEngine(): void {
  const engine = getEngine();
  engine.store.config.set({ exitDuration: 0 });
  engine.store.dismissAll();
  engine.store.clearHistory();
  engine.store.config.reset();
  for (const name of engine.store.types.list()) engine.store.types.remove(name);
  engine.toaster?.destroy();
  engine.toaster = undefined;
  engine.autoMount = true;
}
