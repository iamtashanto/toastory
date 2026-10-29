import type { ToastId } from './types';

let counter = 0;

/**
 * Returns a collision-safe, incremental unique identifier.
 * @param prefix Optional prefix for the id (default: 'gk').
 */
export function nextId(prefix = 'gk'): string {
  counter += 1;
  return `${prefix}-${counter}`;
}

/**
 * Normalizes an optional user-provided id, generating an incremental id if omitted.
 * @param id User-supplied id or undefined.
 * @param prefix Prefix used when generating an id.
 */
export function normalizeId(id: ToastId | undefined, prefix = 'gk'): ToastId {
  if (id !== undefined && id !== '') return id;
  return nextId(prefix);
}

/**
 * Resets the internal counter. Useful for deterministic test execution.
 */
export function resetIdCounter(): void {
  counter = 0;
}

