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

const pol = (color: string) => ({ color: `var(--gk-${color})`, ariaLive: 'polite' as const });
const ass = (color: string) => ({ color: `var(--gk-${color})`, ariaLive: 'assertive' as const });

const BUILT_IN_TYPES: Record<string, ToastTypeDefinition> = {
  success: pol('success'),
  error: ass('error'),
  warning: ass('warning'),
  info: pol('info'),
  loading: { ...pol('info'), defaults: { duration: 0, dismissible: false } },
  message: pol('fg'),
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
    list: () => [...custom.keys()],
  };
}
