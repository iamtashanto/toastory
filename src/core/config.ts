import type { GlazeConfig, Listener, Unsubscribe } from './types';

/** Default configuration used until `configure` is called. */
export const DEFAULT_CONFIG: Readonly<GlazeConfig> = Object.freeze({
  theme: 'ios-glass',
  mode: 'auto',
  position: 'top-right',
  duration: 4000,
  maxVisible: 8,
  gap: 12,
  stack: true,
  dir: 'auto',
  hotkey: 'alt+t',
  pauseOn: ['hover', 'focus', 'hidden'],
  container: undefined,
  shadow: true,
  closeButton: false,
  richColors: false,
  invert: false,
  swipe: true,
  dragThreshold: 45,
  progress: false,
  closeOnClick: false,
  exitDuration: 250,
  historyLimit: 100,
  regionLabel: 'Notifications',
  closeLabel: 'Close notification',
  startPaused: false,
} satisfies GlazeConfig);

/** Observable configuration holder. */
export interface ConfigStore {
  /** Returns the current configuration. */
  get(): Readonly<GlazeConfig>;
  /** Merges a partial configuration and notifies subscribers. Returns the new configuration. */
  set(patch: Partial<GlazeConfig>): Readonly<GlazeConfig>;
  /** Restores defaults. */
  reset(): void;
  /** Subscribes to changes. */
  subscribe(listener: Listener): Unsubscribe;
}

/** Creates an isolated configuration store. */
export function createConfigStore(initial: Partial<GlazeConfig> = {}): ConfigStore {
  let current: Readonly<GlazeConfig> = Object.freeze({
    ...DEFAULT_CONFIG,
    ...stripUndefined(initial),
  });
  const listeners = new Set<Listener>();
  const emit = (): void => {
    for (const listener of [...listeners]) listener();
  };
  return {
    get: () => current,
    set(patch) {
      current = Object.freeze({ ...current, ...stripUndefined(patch) });
      emit();
      return current;
    },
    reset() {
      current = DEFAULT_CONFIG;
      emit();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

function stripUndefined<T extends object>(value: T): Partial<T> {
  const out: Partial<T> = {};
  for (const key of Object.keys(value) as (keyof T)[]) {
    if (value[key] !== undefined) out[key] = value[key];
  }
  return out;
}
