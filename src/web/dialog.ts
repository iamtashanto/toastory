import { THEMES } from '../themes/themes';
import { createDialogController } from '../core';
import type {
  DialogButton,
  DialogController,
  DialogOptions,
  DialogPosition,
  DialogPromise,
  DialogState,
} from '../core';
import { cssLength, el, fill, nextId } from './dom';
import { getEngine } from './engine';
import { icon } from './icons';
import type { IconName } from './icons';
import { buildInput } from './inputs';
import type { InputControl } from './inputs';
import { openOverlay } from './overlay';
import { sanitizeToFragment } from './sanitize';

const ICONS: Record<string, IconName> = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  question: 'question',
  trash: 'trash',
  lock: 'lock',
  upload: 'upload',
  pencil: 'pencil',
  clock: 'clock',
  shield: 'shield',
};

const DEFAULT_LABELS = { confirm: 'OK', deny: 'No', cancel: 'Cancel' } as const;

function applyButton(
  node: HTMLButtonElement,
  spec: DialogButton | undefined,
  fallbackLabel: string,
  show: boolean,
): void {
  const visible = spec?.show ?? show;
  node.hidden = !visible;
  node.textContent = spec?.label ?? fallbackLabel;
  if (spec?.aria) node.setAttribute('aria-label', spec.aria);
  else node.removeAttribute('aria-label');
  if (spec?.color) node.style.setProperty('--gk-button', spec.color);
  else node.style.removeProperty('--gk-button');
}

/**
 * Opens a dialog in the DOM. The returned promise resolves with the result and carries the live
 * `handle`. Throws when no DOM is available.
 */
export function openDialog(initial: DialogOptions): DialogPromise {
  if (typeof document === 'undefined') {
    throw new Error(
      'glazekit: dialogs need a DOM. Call them from the browser, not during server rendering.',
    );
  }
  const config = getEngine().store.config.get();
  const controller: DialogController = createDialogController(initial);
  const titleId = nextId('gk-title');
  const textId = nextId('gk-text');
  const errorId = nextId('gk-error');
  let input: InputControl | undefined;
  let inputKey = '';

  const overlay = openOverlay({
    backdrop: initial.backdrop,
    theme: initial.theme ?? config.theme,
    mode: config.mode,
    dir: config.dir,
    onEscape: () => void controller.dismiss('esc'),
    onBackdrop: () => void controller.dismiss('backdrop'),
  });

  const panel = el('div', 'gk-dialog', { tabindex: '-1', 'aria-modal': 'true' });
  panel.setAttribute('data-gk-theme', initial.theme ?? config.theme);
  panel.setAttribute('data-gk-mode', config.mode);
  const closeBtn = el('button', 'gk-dialog-close', { type: 'button' });
  closeBtn.append(icon('close'));
  const image = el('img', 'gk-image');
  const iconBox = el('div', 'gk-dialog-icon');
  const title = el('h2', 'gk-dialog-title', { id: titleId });
  const text = el('div', 'gk-dialog-text', { id: textId });
  const noticeBox = el('div', 'gk-dialog-notice', { role: 'note' });
  noticeBox.hidden = true;
  const countdownBox = el('div', 'gk-countdown-big', { 'aria-atomic': 'true' });
  const countdownNum = el('span', 'gk-countdown-num');
  countdownBox.append(countdownNum, 's');
  countdownBox.hidden = true;
  const inputBox = el('div', 'gk-input-box');
  const error = el('div', 'gk-error', { id: errorId, role: 'alert' });
  const confirmBtn = el('button', 'gk-btn gk-confirm gk-btn--confirm', { type: 'button' });
  const denyBtn = el('button', 'gk-btn gk-deny gk-btn--deny', { type: 'button' });
  const cancelBtn = el('button', 'gk-btn gk-cancel gk-btn--cancel', { type: 'button' });
  const buttons = el('div', 'gk-dialog-buttons gk-dialog-actions', {}, cancelBtn, denyBtn, confirmBtn);
  const footer = el('div', 'gk-dialog-footer');
  const bar = el('i');
  const timerBar = el('div', 'gk-timer', { 'aria-hidden': 'true' }, bar);
  panel.append(
    closeBtn,
    image,
    iconBox,
    title,
    text,
    noticeBox,
    countdownBox,
    inputBox,
    error,
    buttons,
    footer,
    timerBar,
  );
  overlay.root.append(panel);

  let lastTimer = -1;
  let autoPaused = false;

  const sync = (state: DialogState): void => {
    const o = state.options;
    const themeName = o.theme ?? initial.theme ?? config.theme;
    const themeDef = THEMES.find((t) => t.name === themeName);
    let activeVariant = o.variant ?? initial.variant;
    if (activeVariant && themeDef?.supportedVariants && !themeDef.supportedVariants.includes(activeVariant)) {
      if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
        console.warn(
          `[glazekit] Theme "${themeName}" does not support variant "${activeVariant}". Falling back to default.`,
        );
      }
      activeVariant = undefined;
    }
    if (activeVariant) panel.setAttribute('data-gk-variant', activeVariant);
    else panel.removeAttribute('data-gk-variant');

    panel.className = ['gk-dialog', o.className].filter(Boolean).join(' ');
    panel.dataset.tone = o.tone ?? 'info';
    panel.dataset.grow = o.grow ?? '';
    const position: DialogPosition = o.position ?? 'center-center';
    const [row, col] = position.split('-') as [string, string];
    overlay.root.dataset.row = row;
    overlay.root.dataset.col = col;
    panel.style.width = o.width === undefined ? '' : cssLength(o.width);
    panel.style.padding = o.padding === undefined ? '' : cssLength(o.padding);
    const urgent = !o.input && (o.tone === 'danger' || o.tone === 'warning');
    panel.setAttribute('role', urgent ? 'alertdialog' : 'dialog');
    title.textContent = o.title ?? '';
    title.hidden = !o.title;
    if (o.title) panel.setAttribute('aria-labelledby', titleId);
    else panel.removeAttribute('aria-labelledby');

    text.replaceChildren();
    if (o.text) text.append(o.text);
    if (o.html) {
      const fragment = sanitizeToFragment(o.html);
      if (fragment) text.append(fragment);
    }
    text.hidden = !o.text && !o.html;
    if (text.hidden) panel.removeAttribute('aria-describedby');
    else panel.setAttribute('aria-describedby', textId);

    iconBox.replaceChildren();
    const toneVal =
      o.tone ??
      (o.icon === 'warning'
        ? 'warning'
        : o.icon === 'error' || o.icon === 'trash'
          ? 'danger'
          : o.icon === 'success'
            ? 'success'
            : 'info');
    iconBox.dataset.tone = toneVal;
    if (o.icon === 'custom') fill(iconBox, o.iconContent);
    else if (o.icon) {
      const iconKey = ICONS[o.icon] ?? (o.icon as IconName);
      const iconNode = icon(iconKey);
      if (iconNode) iconBox.append(iconNode);
    }
    iconBox.hidden = !o.icon;
    iconBox.dataset.icon = o.icon ?? '';

    if (o.notice) {
      noticeBox.replaceChildren();
      noticeBox.hidden = false;
      noticeBox.dataset.tone = o.notice.tone ?? 'warning';
      if (o.notice.icon) fill(noticeBox, o.notice.icon);
      else {
        const ic = icon(
          o.notice.tone === 'danger' ? 'error' : o.notice.tone === 'info' ? 'info' : 'shield',
        );
        if (ic) noticeBox.append(ic);
      }
      const noteText = el('span');
      noteText.textContent = o.notice.text;
      noticeBox.append(noteText);
    } else {
      noticeBox.hidden = true;
    }

    if (o.countdown !== undefined) {
      countdownBox.hidden = false;
      const ms = controller.handle.timer.remaining();
      const sec = Math.max(0, Math.ceil(ms / 1000));
      countdownNum.textContent = String(sec);
      if (sec === 30 || sec === 10 || sec === 5) {
        countdownBox.setAttribute('aria-live', 'assertive');
      } else {
        countdownBox.setAttribute('aria-live', 'off');
      }
    } else {
      countdownBox.hidden = true;
    }

    if (o.image) {
      image.src = o.image.src;
      image.alt = o.image.alt;
      if (o.image.width) image.width = o.image.width;
      if (o.image.height) image.height = o.image.height;
    }
    image.hidden = !o.image;

    if (o.closeButtonLabel) closeBtn.setAttribute('aria-label', o.closeButtonLabel);
    closeBtn.hidden = !o.closeButtonLabel;

    const key = `${o.input ?? ''}|${JSON.stringify(o.options ?? null)}|${o.inputLabel ?? ''}|${o.placeholder ?? ''}`;
    if (key !== inputKey) {
      inputKey = key;
      const keepValue = input ? input.read() : undefined;
      inputBox.replaceChildren();
      input = buildInput(o, titleId);
      if (input) {
        inputBox.append(input.node);
        if (keepValue !== undefined && typeof keepValue !== 'object') {
          const field = input.focusTarget;
          if (
            field instanceof HTMLInputElement &&
            field.type !== 'checkbox' &&
            field.type !== 'radio'
          ) {
            field.value = String(keepValue);
          }
        }
        for (const field of input.fields) {
          field.addEventListener('keydown', (event) => {
            const target = event.target as HTMLElement;
            const multiline = target instanceof HTMLTextAreaElement;
            if (
              event.key === 'Enter' &&
              !(multiline && !event.ctrlKey && !event.metaKey) &&
              target.tagName !== 'SELECT'
            ) {
              event.preventDefault();
              void controller.submit('confirm');
            }
          });
        }
        controller.setValueReader(input.read);
      } else controller.setValueReader(() => undefined);
    }
    inputBox.hidden = !input;
    for (const field of input?.fields ?? []) {
      if (state.error) {
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorId);
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
      }
    }
    error.textContent = state.error ?? '';
    error.hidden = !state.error;

    applyButton(confirmBtn, o.confirmButton, DEFAULT_LABELS.confirm, true);
    applyButton(denyBtn, o.denyButton, DEFAULT_LABELS.deny, false);
    applyButton(cancelBtn, o.cancelButton, DEFAULT_LABELS.cancel, false);
    buttons.dataset.reverse = o.reverseButtons ? 'true' : 'false';
    const layout =
      o.buttonLayout ??
      (activeVariant === 'update-info'
        ? 'stack'
        : activeVariant === 'ios-glass-alert'
          ? 'divided'
          : 'row');
    buttons.dataset.layout = layout;
    buttons.hidden = confirmBtn.hidden && denyBtn.hidden && cancelBtn.hidden;
    confirmBtn.disabled = denyBtn.disabled = state.loading !== null;
    confirmBtn.setAttribute('aria-busy', String(state.loading === 'confirm'));
    denyBtn.setAttribute('aria-busy', String(state.loading === 'deny'));
    confirmBtn.dataset.loading = String(state.loading === 'confirm');
    denyBtn.dataset.loading = String(state.loading === 'deny');
    panel.setAttribute('aria-busy', String(state.loading !== null));

    if (o.confirmText) {
      const checkMatch = (): void => {
        const current = String(input ? input.read() : '');
        const target = o.confirmText!;
        const match = o.caseSensitive
          ? current === target
          : current.trim().toLowerCase() === target.toLowerCase();
        confirmBtn.disabled = !match || state.loading !== null;
        confirmBtn.setAttribute('aria-disabled', String(!match));
      };
      checkMatch();
      for (const field of input?.fields ?? []) {
        field.addEventListener('input', checkMatch);
      }
    }

    footer.replaceChildren();
    if (o.footer) {
      const fragment = sanitizeToFragment(o.footer);
      if (fragment) footer.append(fragment);
    }
    footer.hidden = !o.footer;

    const remaining = controller.handle.timer.remaining();
    timerBar.hidden = !(o.timerProgressBar && remaining > 0);
    if (!timerBar.hidden && Math.abs(remaining - lastTimer) > 60) {
      lastTimer = remaining;
      bar.style.animation = 'none';
      void bar.offsetWidth;
      bar.style.animation = '';
      bar.style.setProperty('--gk-d', `${remaining}ms`);
    }
    bar.style.animationPlayState = controller.handle.timer.paused() ? 'paused' : 'running';

    if (!state.open) void overlay.close();
  };

  closeBtn.addEventListener('click', () => void controller.dismiss('close'));
  confirmBtn.addEventListener('click', () => void controller.submit('confirm'));
  denyBtn.addEventListener('click', () => void controller.submit('deny'));
  cancelBtn.addEventListener('click', () => void controller.dismiss('cancel'));
  panel.addEventListener('pointerenter', () => {
    if (controller.handle.timer.remaining() > 0 && !controller.handle.timer.paused()) {
      autoPaused = true;
      controller.handle.timer.pause();
    }
  });
  panel.addEventListener('pointerleave', () => {
    if (autoPaused) {
      autoPaused = false;
      controller.handle.timer.resume();
    }
  });

  if (initial.draggable) {
    let origin: { x: number; y: number; ox: number; oy: number } | undefined;
    let offset = { x: 0, y: 0 };
    panel.dataset.draggable = 'true';
    panel.addEventListener('pointerdown', (event) => {
      const target = event.target as Element;
      if (
        target.closest('button,input,select,textarea,a') ||
        !target.closest('.gk-dialog-title,.gk-dialog-icon')
      )
        return;
      origin = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
      panel.setPointerCapture?.(event.pointerId);
    });
    panel.addEventListener('pointermove', (event) => {
      if (!origin) return;
      offset = { x: origin.ox + event.clientX - origin.x, y: origin.oy + event.clientY - origin.y };
      panel.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    });
    const stop = (): void => {
      origin = undefined;
    };
    panel.addEventListener('pointerup', stop);
    panel.addEventListener('pointercancel', stop);
  }

  controller.subscribe(() => sync(controller.getState()));
  sync(controller.getState());
  overlay.show();

  const o = controller.getState().options;
  const focusOn =
    o.focusOn ??
    (input ? 'input' : o.tone === 'danger' && !cancelBtn.hidden ? 'cancel' : 'confirm');
  const targets = {
    confirm: confirmBtn,
    deny: denyBtn,
    cancel: cancelBtn,
    input: input?.focusTarget,
    close: closeBtn,
    none: undefined,
  } as const;
  const target = targets[focusOn];
  if (target && !target.hidden) target.focus();
  else if (focusOn !== 'none') panel.focus();
  controller.opened();

  return Object.assign(
    controller.handle.result.then((value) => value),
    { handle: controller.handle },
  );
}
