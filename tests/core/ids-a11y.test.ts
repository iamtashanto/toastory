import { describe, expect, it } from 'vitest';
import { nextId, normalizeId, resetIdCounter } from '../../src/core/ids';
import {
  decideAriaLive,
  decideDialogLabels,
  decideDialogRole,
  decideFocusTarget,
  decideToastRole,
} from '../../src/core/a11y-rules';

describe('ids and a11y rules', () => {
  it('generates incremental collision-safe ids and normalizes user ids', () => {
    resetIdCounter();
    expect(nextId('toast')).toBe('toast-1');
    expect(nextId('toast')).toBe('toast-2');
    expect(normalizeId('custom-id')).toBe('custom-id');
    expect(normalizeId(42)).toBe(42);
    expect(normalizeId(undefined, 'gen')).toBe('gen-3');
    resetIdCounter();
    expect(nextId('toast')).toBe('toast-1');
  });

  it('decides aria-live and toast role properly', () => {
    expect(decideAriaLive('success')).toBe('polite');
    expect(decideAriaLive('info')).toBe('polite');
    expect(decideAriaLive('error')).toBe('assertive');
    expect(decideAriaLive('warning')).toBe('assertive');
    expect(decideAriaLive('message', true)).toBe('assertive');
    expect(decideAriaLive('error', false, 'off')).toBe('off');

    expect(decideToastRole('success')).toBe('status');
    expect(decideToastRole('error')).toBe('alert');
    expect(decideToastRole('info', true)).toBe('alert');
    expect(decideToastRole('error', false, 'log')).toBe('log');
  });

  it('decides dialog role, labels, and focus targets', () => {
    expect(decideDialogRole({ tone: 'danger' })).toBe('alertdialog');
    expect(decideDialogRole({ tone: 'warning' })).toBe('alertdialog');
    expect(decideDialogRole({ tone: 'danger', input: 'text' })).toBe('dialog');
    expect(decideDialogRole({ tone: 'info' })).toBe('dialog');

    expect(decideFocusTarget({ focusOn: 'close' })).toBe('close');
    expect(decideFocusTarget({ input: 'text' })).toBe('input');
    expect(decideFocusTarget({ tone: 'danger', cancelButton: { show: true } })).toBe('cancel');
    expect(decideFocusTarget({ tone: 'info' })).toBe('confirm');

    const labels = decideDialogLabels({
      confirmButton: { label: 'Proceed' },
      denyButton: { label: 'Reject' },
      cancelButton: { label: 'Abort' },
    });
    expect(labels.confirmLabel).toBe('Proceed');
    expect(labels.denyLabel).toBe('Reject');
    expect(labels.cancelLabel).toBe('Abort');

    const defaultLabels = decideDialogLabels({});
    expect(defaultLabels.confirmLabel).toBe('OK');
    expect(defaultLabels.denyLabel).toBe('No');
    expect(defaultLabels.cancelLabel).toBe('Cancel');
  });
});
