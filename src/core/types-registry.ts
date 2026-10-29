import type { ToastTypeDefinition } from './types';

/** Registry of custom and built-in toast types. */
export interface TypeRegistry {
  /**
   * Registers or replaces a toast type.
   * @param name Non-empty type name.
   * @param definition Defaults, icon, color tokens, default duration, ariaLive.
   */
  add(name: string, definition?: ToastTypeDefinition): void;
  /** Removes a type. Returns whether it existed. */
  remove(name: string): boolean;
  /** Looks a type up. */
  get(name: string): ToastTypeDefinition | undefined;
  /** Lists registered custom type names. */
  list(): string[];
}

const BUILT_IN_TYPES: Record<string, ToastTypeDefinition> = {
  success: {
    color: 'var(--gk-success, #34c759)',
    ariaLive: 'polite',
  },
  error: {
    color: 'var(--gk-error, #ff3b30)',
    ariaLive: 'assertive',
  },
  warning: {
    color: 'var(--gk-warning, #ff9500)',
    ariaLive: 'assertive',
  },
  info: {
    color: 'var(--gk-info, #007aff)',
    ariaLive: 'polite',
  },
  loading: {
    color: 'var(--gk-info, #007aff)',
    ariaLive: 'polite',
    defaults: { duration: 0, dismissible: false },
  },
  message: {
    color: 'var(--gk-fg, #1d1d1f)',
    ariaLive: 'polite',
  },
};

/** Creates a type registry. */
export function createTypeRegistry(): TypeRegistry {
  const custom = new Map<string, ToastTypeDefinition>();

  return {
    add(name, definition = {}) {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new TypeError('glazekit: toast type name must be a non-empty string');
      }
      custom.set(name.trim(), definition);
    },
    remove: (name) => custom.delete(name),
    get: (name) => custom.get(name) ?? BUILT_IN_TYPES[name],
    list: () => Array.from(custom.keys()),
  };
}
