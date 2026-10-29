import { createDialogController } from '../core';
import type {
  BottomSheetHandle,
  BottomSheetOptions,
  DialogPromise,
  DismissReason,
  LoadingHandle,
  LoadingOptions,
  SheetOptions,
} from '../core';
import { el, nextId } from './dom';
import { getEngine } from './engine';
import { icon } from './icons';
import { openOverlay } from './overlay';
import { sanitizeToFragment } from './sanitize';

function requireDom(): void {
  if (typeof document === 'undefined') {
    throw new Error(
      'glazekit: this component needs a DOM. Call it from the browser, not during server rendering.',
    );
  }
}

/**
 * Opens an action sheet. Resolves with `isConfirmed: true` and the chosen action value, or a
 * dismissal (`cancel`, `backdrop` or `esc`).
 */
export function openSheet(options: SheetOptions): DialogPromise {
  requireDom();
  const config = getEngine().store.config.get();
  const controller = createDialogController({
    allowOutsideClick: options.allowOutsideClick,
    allowEscape: options.allowEscape,
  });
  const titleId = nextId('gk-title');
  const messageId = nextId('gk-text');
  const overlay = openOverlay({
    backdrop: options.backdrop,
    theme: options.theme ?? config.theme,
    mode: config.mode,
    dir: config.dir,
    className: 'gk-overlay-sheet',
    onEscape: () => void controller.dismiss('esc'),
    onBackdrop: () => void controller.dismiss('backdrop'),
  });
  overlay.root.dataset.row = 'bottom';
  overlay.root.dataset.col = 'center';

  const panel = el('div', `gk-sheet${options.className ? ` ${options.className}` : ''}`, {
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    'data-gk-theme': options.theme ?? config.theme,
    'data-gk-mode': config.mode,
  });
  if (options.title) {
    panel.append(el('h2', 'gk-sheet-title', { id: titleId }, options.title));
    panel.setAttribute('aria-labelledby', titleId);
  }
  if (options.message) {
    panel.append(el('p', 'gk-sheet-message', { id: messageId }, options.message));
    panel.setAttribute('aria-describedby', messageId);
  }
  const group = el('div', 'gk-sheet-group', { role: 'group' });
  if (options.title) group.setAttribute('aria-labelledby', titleId);
  let firstEnabled: HTMLButtonElement | undefined;
  for (const action of options.actions) {
    const button = el('button', 'gk-sheet-action', {
      type: 'button',
      'data-style': action.style ?? 'default',
    });
    if (action.disabled) button.disabled = true;
    if (action.icon) {
      const holder = el('span', 'gk-sheet-icon', { 'aria-hidden': 'true' });
      const fragment = sanitizeToFragment(action.icon);
      if (fragment) holder.append(fragment);
      button.append(holder);
    }
    button.append(el('span', 'gk-sheet-label', {}, action.label));
    button.addEventListener('click', () => {
      if (action.style === 'cancel') controller.dismiss('cancel');
      else controller.handle.close({ isConfirmed: true, value: action.value ?? action.label });
    });
    if (!action.disabled && !firstEnabled) firstEnabled = button;
    group.append(button);
  }
  panel.append(group);
  let cancel: HTMLButtonElement | undefined;
  if (options.cancel !== false) {
    cancel = el('button', 'gk-sheet-cancel', { type: 'button' }, options.cancel?.label ?? 'Cancel');
    cancel.addEventListener('click', () => void controller.dismiss('cancel'));
    panel.append(cancel);
  }
  overlay.root.append(panel);
  controller.subscribe(() => {
    if (!controller.getState().open) void overlay.close();
  });
  overlay.show();
  (firstEnabled ?? cancel ?? panel).focus();
  controller.opened();
  return Object.assign(
    controller.handle.result.then((value) => value),
    { handle: controller.handle },
  );
}

/** Opens a bottom sheet with drag-to-resize snap points. */
export function openBottomSheet(options: BottomSheetOptions): BottomSheetHandle {
  requireDom();
  const config = getEngine().store.config.get();
  const snaps = (options.snapPoints?.length ? [...options.snapPoints] : [0.5])
    .map((value) => Math.min(1, Math.max(0.1, value)))
    .sort((a, b) => a - b);
  let index = Math.min(snaps.length - 1, Math.max(0, options.initialSnap ?? 0));
  const controller = createDialogController({
    allowOutsideClick: options.allowOutsideClick,
    allowEscape: options.allowEscape,
    willClose: () => options.willClose?.(handle),
  });
  const titleId = nextId('gk-title');

  const overlay = openOverlay({
    backdrop: options.backdrop,
    theme: options.theme ?? config.theme,
    mode: config.mode,
    dir: config.dir,
    className: 'gk-overlay-bottom',
    onEscape: () => void controller.dismiss('esc'),
    onBackdrop: () => void controller.dismiss('backdrop'),
  });
  overlay.root.dataset.row = 'bottom';
  overlay.root.dataset.col = 'center';

  const panel = el('div', `gk-bsheet${options.className ? ` ${options.className}` : ''}`, {
    role: 'dialog',
    'aria-modal': 'true',
    tabindex: '-1',
    'data-gk-theme': options.theme ?? config.theme,
    'data-gk-mode': config.mode,
  });
  const grab = el('button', 'gk-grab', {
    type: 'button',
    'aria-label': options.handleLabel ?? 'Resize sheet',
  });
  const title = el('h2', 'gk-bsheet-title', { id: titleId });
  const body = el('div', 'gk-bsheet-body');
  const closeBtn = el('button', 'gk-dialog-close', { type: 'button' });
  closeBtn.append(icon('close'));
  panel.append(closeBtn, grab, title, body);
  overlay.root.append(panel);

  const setHeight = (fraction: number, animate: boolean): void => {
    panel.dataset.dragging = String(!animate);
    panel.style.setProperty('--gk-sheet-h', `${fraction * 100}vh`);
  };
  const render = (patch: Pick<BottomSheetOptions, 'title' | 'text' | 'html'>): void => {
    title.textContent = patch.title ?? '';
    title.hidden = !patch.title;
    if (patch.title) panel.setAttribute('aria-labelledby', titleId);
    else panel.removeAttribute('aria-labelledby');
    body.replaceChildren();
    if (patch.text) body.append(patch.text);
    if (patch.html) {
      const fragment = sanitizeToFragment(patch.html);
      if (fragment) body.append(fragment);
    }
  };
  render(options);
  grab.hidden = options.handle === false;
  closeBtn.hidden = !options.closeButtonLabel;
  if (options.closeButtonLabel) closeBtn.setAttribute('aria-label', options.closeButtonLabel);
  closeBtn.addEventListener('click', () => void controller.dismiss('close'));
  setHeight(snaps[index] ?? 0.5, true);

  const snapTo = (next: number): void => {
    index = Math.min(snaps.length - 1, Math.max(0, next));
    setHeight(snaps[index] ?? 0.5, true);
  };

  grab.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      snapTo(index + 1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (index === 0 && options.dismissible !== false) controller.dismiss('close');
      else snapTo(index - 1);
    }
  });

  let drag: { y: number; base: number } | undefined;
  const view = (): number => window.innerHeight || 1;
  panel.addEventListener('pointerdown', (event) => {
    const target = event.target as Element;
    if (!target.closest('.gk-grab,.gk-bsheet-title')) return;
    drag = { y: event.clientY, base: snaps[index] ?? 0.5 };
    panel.setPointerCapture?.(event.pointerId);
  });
  panel.addEventListener('pointermove', (event) => {
    if (!drag) return;
    const fraction = drag.base + (drag.y - event.clientY) / view();
    setHeight(Math.min(snaps[snaps.length - 1] ?? 1, Math.max(0, fraction)), false);
  });
  const end = (event: PointerEvent): void => {
    if (!drag) return;
    const fraction = drag.base + (drag.y - event.clientY) / view();
    drag = undefined;
    const lowest = snaps[0] ?? 0.5;
    if (options.dismissible !== false && fraction < lowest / 2) {
      controller.dismiss('close');
      return;
    }
    let best = 0;
    snaps.forEach((snap, i) => {
      if (Math.abs(snap - fraction) < Math.abs((snaps[best] ?? 0) - fraction)) best = i;
    });
    snapTo(best);
  };
  panel.addEventListener('pointerup', end);
  panel.addEventListener('pointercancel', end);

  const handle: BottomSheetHandle = {
    body,
    result: controller.handle.result,
    close: (reason: DismissReason = 'close') => void controller.dismiss(reason),
    snapTo,
    update: render,
  };
  controller.subscribe(() => {
    if (!controller.getState().open) void overlay.close();
  });
  overlay.show();
  (grab.hidden ? panel : grab).focus();
  options.didOpen?.(handle);
  return handle;
}

/** Shows a blocking loading overlay with an announced status message. */
export function openLoading(options: LoadingOptions = {}): LoadingHandle {
  requireDom();
  const config = getEngine().store.config.get();
  let open = true;
  let resolveClosed: () => void = () => undefined;
  const closed = new Promise<void>((resolve) => {
    resolveClosed = resolve;
  });
  const overlay = openOverlay({
    backdrop: options.backdrop,
    theme: options.theme ?? config.theme,
    mode: config.mode,
    dir: config.dir,
    className: `gk-overlay-loading${options.className ? ` ${options.className}` : ''}`,
    trap: false,
    onEscape: () => {
      if (options.allowEscape) handle.close();
    },
  });
  overlay.root.dataset.row = 'center';
  overlay.root.dataset.col = 'center';
  const spinner = icon('loading');
  spinner.setAttribute('width', '32');
  spinner.setAttribute('height', '32');
  const label = el('div', 'gk-loading-text', { id: nextId('gk-text') });
  const fillBar = el('i');
  const track = el(
    'div',
    'gk-loading-bar',
    { role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': '100' },
    fillBar,
  );
  const panel = el(
    'div',
    'gk-loading',
    {
      role: 'status',
      'aria-live': 'polite',
      'aria-busy': 'true',
      tabindex: '-1',
      'data-gk-theme': options.theme ?? config.theme,
      'data-gk-mode': config.mode,
    },
    spinner,
    label,
    track,
  );
  overlay.root.append(panel);

  let current: Pick<LoadingOptions, 'text' | 'progress'> = {
    text: options.text,
    progress: options.progress,
  };
  const apply = (patch: Pick<LoadingOptions, 'text' | 'progress'>): void => {
    current = patch;
    label.textContent = patch.text ?? '';
    label.hidden = !patch.text;
    if (patch.progress === undefined) {
      track.hidden = true;
      track.removeAttribute('aria-valuenow');
    } else {
      const pct = Math.round(Math.min(1, Math.max(0, patch.progress)) * 100);
      track.hidden = false;
      track.setAttribute('aria-valuenow', String(pct));
      if (patch.text) track.setAttribute('aria-label', patch.text);
      fillBar.style.width = `${pct}%`;
    }
  };
  apply(options);
  overlay.show();
  panel.focus();

  const handle: LoadingHandle = {
    closed,
    update(patch) {
      if (open) apply({ ...current, ...patch });
    },
    close() {
      if (!open) return;
      open = false;
      void overlay.close().then(resolveClosed);
    },
  };
  return handle;
}
