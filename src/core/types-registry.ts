import type { ToastTypeDefinition } from './types';

/** Registry of custom toast types. */
export interface TypeRegistry {
  /**
   * Registers or replaces a toast type.
   * @param name Non-empty type name.
   * @param definition Defaults, icon and accent color for the type.
   */
  add(name: string, definition?: ToastTypeDefinition): void;
  /** Removes a type. Returns whether it existed. */
  remove(name: string): boolean;
  /** Looks a type up. */
  get(name: string): ToastTypeDefinition | undefined;
  /** Lists registered type names. */
  list(): string[];
}

/** Creates an empty type registry. */
export function createTypeRegistry(): TypeRegistry {
  const map = new Map<string, ToastTypeDefinition>();
  return {
    add(name, definition = {}) {
      if (typeof name !== 'string' || name.trim() === '') {
        throw new TypeError('glazekit: toast type name must be a non-empty string');
      }
      map.set(name, definition);
    },
    remove: (name) => map.delete(name),
    get: (name) => map.get(name),
    list: () => [...map.keys()],
  };
}
