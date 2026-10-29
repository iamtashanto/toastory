import type { DialogOptions, ToastType } from './types';

/** Decides ARIA live politeness level. */
export const decideAriaLive = (
  type?: ToastType,
  important?: boolean,
  custom?: 'polite' | 'assertive' | 'off',
): 'polite' | 'assertive' | 'off' =>
  custom ?? (important || type === 'error' || type === 'warning' ? 'assertive' : 'polite');

/** Decides ARIA role for a toast. */
export const decideToastRole = (
  type?: ToastType,
  important?: boolean,
  custom?: 'status' | 'alert' | 'log',
): 'status' | 'alert' | 'log' => custom ?? (important || type === 'error' ? 'alert' : 'status');

/** Decides ARIA dialog role. */
export const decideDialogRole = (o: DialogOptions): 'dialog' | 'alertdialog' =>
  !o.input && (o.tone === 'danger' || o.tone === 'warning') ? 'alertdialog' : 'dialog';

/** Decides which element receives initial focus when a dialog opens. */
export const decideFocusTarget = (
  o: DialogOptions,
): 'confirm' | 'deny' | 'cancel' | 'input' | 'close' | 'none' =>
  o.focusOn ??
  (o.input !== undefined
    ? 'input'
    : o.tone === 'danger' && o.cancelButton?.show !== false
      ? 'cancel'
      : 'confirm');

/** Computes accessible labels and button text with default fallbacks. */
export const decideDialogLabels = (
  o: DialogOptions,
): { confirmLabel: string; denyLabel: string; cancelLabel: string } => ({
  confirmLabel: o.confirmButton?.label ?? 'OK',
  denyLabel: o.denyButton?.label ?? 'No',
  cancelLabel: o.cancelButton?.label ?? 'Cancel',
});
