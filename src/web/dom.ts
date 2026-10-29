import type { Renderable } from '../core';

/** Small DOM helpers shared by the web renderers. Every function is safe to import on the server. */

/** Whether a DOM is available right now. Evaluated at call time, never at import time. */
export function hasDom(): boolean {
  return typeof document !== 'undefined' && typeof document.createElement === 'function';
}

type Child = Node | string | null | undefined | false;

/**
 * Creates an element.
 * @param tag Tag name.
 * @param className Space separated classes, empty for none.
 * @param attrs Attributes to set. `undefined` values are skipped.
 * @param children Nodes or text.
 */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  attrs: Record<string, string | undefined> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  for (const key of Object.keys(attrs)) {
    const value = attrs[key];
    if (value !== undefined) node.setAttribute(key, value);
  }
  for (const child of children) {
    if (child) node.append(child);
  }
  return node;
}

/** Writes a renderable into a node: DOM nodes are appended, everything else becomes text. */
export function fill(target: HTMLElement, value: Renderable): void {
  if (value === undefined || value === null || value === false) return;
  if (typeof Node !== 'undefined' && value instanceof Node) target.append(value);
  else target.append(String(value));
}

/** Removes every child of a node. */
export function clear(node: Node): void {
  while (node.firstChild) node.removeChild(node.firstChild);
}

let uid = 0;
/** Returns a document-unique id with the given prefix. */
export function nextId(prefix: string): string {
  uid += 1;
  return `${prefix}-${uid}`;
}

/** Whether the user asked for reduced motion. */
export function prefersReducedMotion(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Whether the OS currently prefers a dark color scheme. */
export function prefersDark(): boolean {
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}

/** Converts a number to a CSS length, leaving strings untouched. */
export function cssLength(value: string | number): string {
  return typeof value === 'number' ? `${value}px` : value;
}

/** Elements that can receive keyboard focus. */
export const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Lists visible focusable descendants in DOM order. */
export function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (node) => !node.hasAttribute('hidden') && node.getAttribute('aria-hidden') !== 'true',
  );
}
