import type { Store } from './types';

/**
 * Creates a tiny observable store with batched microtask updates.
 * Compatible with React `useSyncExternalStore`, Svelte store contract,
 * Vue reactivity, and Angular signals/observables.
 *
 * @param initialValue Initial state value.
 */
export function createStore<T>(initialValue: T): Store<T> {
  let state = initialValue;
  const listeners = new Set<((state: T) => void) | (() => void)>();
  let batchScheduled = false;

  const notify = (): void => {
    batchScheduled = false;
    const current = state;
    for (const listener of [...listeners]) {
      try {
        (listener as (val: T) => void)(current);
      } catch (err) {
        // Prevent subscriber errors from breaking other listeners
        console.error(err);
      }
    }
  };

  const scheduleNotify = (immediate: boolean): void => {
    if (immediate) {
      notify();
      return;
    }
    if (batchScheduled) return;
    batchScheduled = true;
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(notify);
    } else {
      void Promise.resolve().then(notify);
    }
  };

  return {
    getSnapshot: () => state,
    setState: (updater, immediate = false) => {
      const next = typeof updater === 'function' ? (updater as (prev: T) => T)(state) : updater;
      if (Object.is(next, state)) return;
      state = next;
      scheduleNotify(immediate);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      // Svelte store contract: if callback accepts an argument, invoke it synchronously with the snapshot
      if (listener.length > 0) {
        try {
          (listener as (val: T) => void)(state);
        } catch (err) {
          console.error(err);
        }
      }
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

// Re-exports for backward-compatibility with tests and adapters
export { createToastManager, createToastStore, MANUAL_PAUSE } from './toast-manager';
export type {
  AddToastInput,
  ToastManager,
  ToastManagerOptions,
  ToastStore,
  ToastStoreOptions,
} from './toast-manager';
