import type { DialogOptions, ToastType } from './types';

/**
 * Decides ARIA live politeness level:
 * assertive for error, warning, or important toasts; polite otherwise.
 */
export function decideAriaLive(
  type?: ToastType,
  important?: boolean,
  customAriaLive?: 'polite' | 'assertive' | 'off',
): 'polite' | 'assertive' | 'off' {
  if (customAriaLive !== undefined) return customAriaLive;
  if (important === true || type === 'error' || type === 'warning') {
    return 'assertive';
  }
  return 'polite';
}

/**
 * Decides ARIA role for a toast:
 * 'alert' for error or important toasts; 'status' otherwise.
 */
export function decideToastRole(
  type?: ToastType,
  important?: boolean,
  customRole?: 'status' | 'alert' | 'log',
): 'status' | 'alert' | 'log' {
  if (customRole !== undefined) return customRole;
  if (important === true || type === 'error') {
    return 'alert';
  }
  return 'status';
}

/**
 * Decides ARIA dialog role:
 * 'alertdialog' for urgent notifications with no input, 'dialog' otherwise.
 */
export function decideDialogRole(options: DialogOptions): 'dialog' | 'alertdialog' {
  const isUrgent = !options.input && (options.tone === 'danger' || options.tone === 'warning');
  return isUrgent ? 'alertdialog' : 'dialog';
}

/**
 * Decides which element receives initial focus when a dialog opens.
 */
export function decideFocusTarget(
  options: DialogOptions,
): 'confirm' | 'deny' | 'cancel' | 'input' | 'close' | 'none' {
  if (options.focusOn !== undefined) return options.focusOn;
  if (options.input !== undefined) return 'input';
  if (options.tone === 'danger' && options.cancelButton?.show !== false) {
    return 'cancel';
  }
  return 'confirm';
}

/**
 * Computes accessible labels and button text with default fallbacks.
 */
export function decideDialogLabels(options: DialogOptions): {
  confirmLabel: string;
  denyLabel: string;
  cancelLabel: string;
} {
  return {
    confirmLabel: options.confirmButton?.label ?? 'OK',
    denyLabel: options.denyButton?.label ?? 'No',
    cancelLabel: options.cancelButton?.label ?? 'Cancel',
  };
}

