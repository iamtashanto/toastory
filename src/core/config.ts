import type { GlazeConfig, Listener, Unsubscribe } from './types';

/** Library default configuration. */
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
  newestOnTop: true,
  dedupeWindow: 500,
} satisfies GlazeConfig);

/** Observable configuration container holding immutable snapshots. */
export interface ConfigStore {
  /** Returns the current immutable configuration snapshot. */
  get(): Readonly<GlazeConfig>;
  /** Merges a partial configuration and notifies subscribers. Returns the updated snapshot. */
  set(patch: Partial<GlazeConfig>): Readonly<GlazeConfig>;
  /** Restores library defaults. */
  reset(): void;
  /** Subscribes to configuration changes. */
  subscribe(listener: Listener): Unsubscribe;
}

/**
 * Resolves an option according to precedence:
 * Call option > Theme default > Global config > Library default.
 */
export function resolvePrecedence<T>(
  callVal: T | undefined,
  themeVal: T | undefined,
  globalVal: T | undefined,
  defaultVal: T,
): T {
  if (callVal !== undefined) return callVal;
  if (themeVal !== undefined) return themeVal;
  if (globalVal !== undefined) return globalVal;
  return defaultVal;
}

/** Creates an isolated, immutable configuration store. */
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
