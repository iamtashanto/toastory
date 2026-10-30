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

const tDef = (color: string, ariaLive: 'polite' | 'assertive' = 'polite') => ({
  color: `var(--gk-${color})`,
  ariaLive,
});

const BUILT_IN_TYPES: Record<string, ToastTypeDefinition> = {
  success: tDef('success'),
  error: tDef('error', 'assertive'),
  warning: tDef('warning', 'assertive'),
  info: tDef('info'),
  loading: { ...tDef('info'), defaults: { duration: 0, dismissible: false } },
  message: tDef('fg'),
};

/** Creates a type registry. */
export function createTypeRegistry(): TypeRegistry {
  const custom = new Map<string, ToastTypeDefinition>();

  return {
    add(name, definition = {}) {
      const k = typeof name === 'string' ? name.trim() : '';
      if (!k) throw new TypeError('toastory: invalid type');
      custom.set(k, definition);
    },
    remove: (name) => custom.delete(name),
    get: (name) => custom.get(name) ?? BUILT_IN_TYPES[name],
    list: () => [...custom.keys()],
  };
}
