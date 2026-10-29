import type { DialogBackdrop, GlazeConfig } from '../core';
import { el, focusables, prefersReducedMotion } from './dom';

/** Options for the shared modal shell. */
export interface OverlayOptions {
  /** Backdrop style. Defaults to `blur`. */
  backdrop?: DialogBackdrop;
  /** Theme name. */
  theme: string;
  /** Color mode. */
  mode: GlazeConfig['mode'];
  /** Text direction. */
  dir: GlazeConfig['dir'];
  /** Extra class on the root. */
  className?: string;
  /** Called when Escape is pressed while this overlay is on top. */
  onEscape?: () => void;
  /** Called when the backdrop is clicked. */
  onBackdrop?: () => void;
  /** When false, Tab is not trapped (used for non-focusable overlays). Defaults to `true`. */
  trap?: boolean;
}

/** A mounted modal shell: backdrop, scroll lock, inert page, focus trap and focus restore. */
export interface Overlay {
  /** Fixed full-viewport container. Panels are appended here. */
  root: HTMLElement;
  /** Opens the transition. Call after the panel is attached. */
  show(): void;
  /** Starts the exit transition and releases the page. Resolves when the DOM is gone. */
  close(): Promise<void>;
}

const stack: Overlay[] = [];
const traps = new WeakMap<Overlay, { trap: boolean; onEscape?: () => void }>();
let locks = 0;
let savedOverflow = '';
let savedPadding = '';

function lockScroll(): void {
  if (locks++ > 0) return;
  const body = document.body;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  savedOverflow = body.style.overflow;
  savedPadding = body.style.paddingRight;
  body.style.overflow = 'hidden';
  if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
}

function unlockScroll(): void {
  if (--locks > 0) return;
  document.body.style.overflow = savedOverflow;
  document.body.style.paddingRight = savedPadding;
}

function onKeydown(event: KeyboardEvent): void {
  const top = stack[stack.length - 1];
  if (!top) return;
  const info = traps.get(top);
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    info?.onEscape?.();
    return;
  }
  if (event.key !== 'Tab' || info?.trap === false) return;
  const root = top.root;
  const list = focusables(root);
  const first = list[0];
  const last = list[list.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  const active = document.activeElement;
  if (event.shiftKey && (active === first || !root.contains(active))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (active === last || !root.contains(active))) {
    event.preventDefault();
    first.focus();
  }
}

/** Creates and mounts a modal shell on `document.body`. */
export function openOverlay(options: OverlayOptions): Overlay {
  const bKind = options.backdrop ?? 'blur';
  const backdrop = el('div', 'gk-backdrop');
  const isStd = bKind === 'blur' || bKind === 'dim' || bKind === 'none';
  backdrop.dataset.kind = isStd ? bKind : 'custom';
  if (!isStd) backdrop.style.background = bKind;
  const root = el(
    'div',
    `gk-overlay gk-root${options.className ? ` ${options.className}` : ''}`,
    {
      'data-gk-theme': options.theme,
      'data-gk-mode': options.mode,
      'data-state': 'closed',
    },
    backdrop,
  );
  if (options.dir !== 'auto') root.setAttribute('dir', options.dir);

  const previous = document.activeElement;
  const hidden: { node: Element; inert: boolean; aria: string | null }[] = [];
  for (const node of [...document.body.children]) {
    if (/gk-(region|overlay)/.test(node.className)) continue;
    hidden.push({
      node,
      inert: node.hasAttribute('inert'),
      aria: node.getAttribute('aria-hidden'),
    });
    node.setAttribute('inert', '');
    node.setAttribute('aria-hidden', 'true');
  }
  lockScroll();

  let downOnBackdrop = false;
  root.addEventListener('pointerdown', (event) => {
    downOnBackdrop = event.target === root || event.target === backdrop;
  });
  root.addEventListener('click', (event) => {
    if (downOnBackdrop && (event.target === root || event.target === backdrop))
      options.onBackdrop?.();
    downOnBackdrop = false;
  });

  document.body.append(root);
  let closing: Promise<void> | undefined;
  const overlay: Overlay = {
    root,
    show() {
      if (prefersReducedMotion() || typeof requestAnimationFrame !== 'function') {
        root.dataset.state = 'open';
      } else {
        requestAnimationFrame(() => {
          root.dataset.state = 'open';
        });
      }
    },
    close() {
      if (closing) return closing;
      closing = new Promise<void>((resolve) => {
        const index = stack.indexOf(overlay);
        if (index >= 0) stack.splice(index, 1);
        if (stack.length === 0) document.removeEventListener('keydown', onKeydown, true);
        root.dataset.state = 'closing';
        for (const saved of hidden) {
          if (!saved.inert) saved.node.removeAttribute('inert');
          if (saved.aria === null) saved.node.removeAttribute('aria-hidden');
          else saved.node.setAttribute('aria-hidden', saved.aria);
        }
        unlockScroll();
        if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
        const done = (): void => {
          root.remove();
          resolve();
        };
        if (prefersReducedMotion()) done();
        else setTimeout(done, 220);
      });
      return closing;
    },
  };
  traps.set(overlay, { trap: options.trap !== false, onEscape: options.onEscape });
  if (stack.length === 0) document.addEventListener('keydown', onKeydown, true);
  stack.push(overlay);
  return overlay;
}

/** Resets all active overlays and restores page state. For tests and clean teardown. */
export function resetOverlays(): void {
  while (stack.length > 0) {
    const o = stack.pop();
    o?.root.remove();
  }
  document.removeEventListener('keydown', onKeydown, true);
  locks = 0;
  if (savedOverflow) document.body.style.overflow = savedOverflow;
  if (savedPadding) document.body.style.paddingRight = savedPadding;
  savedOverflow = '';
  savedPadding = '';
}
