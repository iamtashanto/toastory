// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetEngine, ui } from '../../src/web';

const dialogEl = (): HTMLElement | null => document.querySelector('.gk-dialog');
const overlayEl = (): HTMLElement | null => document.querySelector('.gk-overlay');

beforeEach(() => {
  vi.useFakeTimers();
  resetEngine();
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('ui.alert and ui.confirm', () => {
  it('alert renders title, text and single confirm button', async () => {
    const promise = ui.alert({
      title: 'Alert Title',
      text: 'Alert body text',
      confirmButton: { label: 'Acknowledge' },
    });

    const dialog = dialogEl();
    expect(dialog).not.toBeNull();
    expect(dialog?.querySelector('.gk-dialog-title')?.textContent).toBe('Alert Title');
    expect(dialog?.querySelector('.gk-dialog-text')?.textContent).toBe('Alert body text');

    const confirmBtn = dialog?.querySelector<HTMLButtonElement>('.gk-confirm');
    const cancelBtn = dialog?.querySelector<HTMLButtonElement>('.gk-cancel');

    expect(confirmBtn?.textContent).toBe('Acknowledge');
    expect(confirmBtn?.hidden).toBe(false);
    expect(cancelBtn?.hidden).toBe(true);

    confirmBtn?.click();
    const result = await promise;
    expect(result.isConfirmed).toBe(true);
    expect(result.isDismissed).toBe(false);
  });

  it('confirm renders confirm and cancel buttons and resolves correctly', async () => {
    const promise = ui.confirm({
      title: 'Are you sure?',
      text: 'This action cannot be undone',
      confirmButton: { label: 'Yes, proceed' },
      cancelButton: { label: 'No, abort' },
    });

    const dialog = dialogEl();
    const confirmBtn = dialog?.querySelector<HTMLButtonElement>('.gk-confirm');
    const cancelBtn = dialog?.querySelector<HTMLButtonElement>('.gk-cancel');

    expect(confirmBtn?.textContent).toBe('Yes, proceed');
    expect(cancelBtn?.textContent).toBe('No, abort');
    expect(confirmBtn?.hidden).toBe(false);
    expect(cancelBtn?.hidden).toBe(false);

    cancelBtn?.click();
    const result = await promise;
    expect(result.isConfirmed).toBe(false);
    expect(result.isDismissed).toBe(true);
    expect(result.dismiss).toBe('cancel');
  });

  it('deny button works when configured', async () => {
    const promise = ui.confirm({
      title: 'Save changes?',
      denyButton: { show: true, label: 'Discard' },
    });

    const dialog = dialogEl();
    const denyBtn = dialog?.querySelector<HTMLButtonElement>('.gk-deny');
    expect(denyBtn?.hidden).toBe(false);
    expect(denyBtn?.textContent).toBe('Discard');

    denyBtn?.click();
    const result = await promise;
    expect(result.isDenied).toBe(true);
    expect(result.isConfirmed).toBe(false);
  });
});

describe('dialog options and styling', () => {
  it('applies tones, positions, grow, footer and image', async () => {
    const promise = ui.confirm({
      title: 'Delete account',
      tone: 'danger',
      position: 'top-start',
      grow: 'row',
      footer: '<a href="/help">Need help?</a>',
      image: { src: 'https://example.com/warn.png', alt: 'Warning', width: 64, height: 64 },
      closeButtonLabel: 'Close dialog',
      reverseButtons: true,
      width: 500,
      padding: 30,
    });

    const dialog = dialogEl() as HTMLElement;
    const overlay = overlayEl() as HTMLElement;

    expect(dialog.dataset.tone).toBe('danger');
    expect(dialog.getAttribute('role')).toBe('alertdialog');
    expect(dialog.dataset.grow).toBe('row');
    expect(overlay.dataset.row).toBe('top');
    expect(overlay.dataset.col).toBe('start');
    expect(dialog.style.width).toBe('500px');
    expect(dialog.style.padding).toBe('30px');

    const img = dialog.querySelector<HTMLImageElement>('.gk-image');
    expect(img?.src).toBe('https://example.com/warn.png');
    expect(img?.alt).toBe('Warning');
    expect(img?.width).toBe(64);

    const closeBtn = dialog.querySelector<HTMLButtonElement>('.gk-dialog-close');
    expect(closeBtn?.getAttribute('aria-label')).toBe('Close dialog');

    const footer = dialog.querySelector('.gk-dialog-footer');
    expect(footer?.querySelector('a')?.textContent).toBe('Need help?');

    const buttons = dialog.querySelector('.gk-dialog-buttons') as HTMLElement;
    expect(buttons.dataset.reverse).toBe('true');

    closeBtn?.click();
    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('close');
  });

  it('renders all icon types and custom icons', async () => {
    for (const iconType of ['success', 'error', 'warning', 'info', 'question'] as const) {
      const p = ui.alert({ icon: iconType });
      const iconBox = dialogEl()?.querySelector('.gk-dialog-icon');
      expect(iconBox?.dataset.icon).toBe(iconType);
      expect(iconBox?.querySelector('svg')).not.toBeNull();
      p.handle.close();
      await vi.advanceTimersByTimeAsync(300);
    }

    const customNode = document.createElement('span');
    customNode.className = 'custom-icon';
    const pCustom = ui.alert({ icon: 'custom', iconContent: customNode });
    expect(dialogEl()?.querySelector('.custom-icon')).toBe(customNode);
    pCustom.handle.close();
    await vi.advanceTimersByTimeAsync(300);
  });
});

describe('ui.prompt and input types', () => {
  it('supports text input with initial value and Enter key submit', async () => {
    const promise = ui.prompt({
      title: 'Enter your name',
      inputValue: 'Alice',
      placeholder: 'Your name',
    });

    const input = dialogEl()?.querySelector<HTMLInputElement>('.gk-field');
    expect(input?.value).toBe('Alice');
    expect(input?.placeholder).toBe('Your name');

    if (input) input.value = 'Bob';
    input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('Bob');
  });

  it('supports textarea input', async () => {
    const promise = ui.prompt({
      input: 'textarea',
      inputValue: 'Multi-line note',
      placeholder: 'Notes',
    });

    const area = dialogEl()?.querySelector<HTMLTextAreaElement>('textarea.gk-field');
    expect(area?.value).toBe('Multi-line note');
    if (area) area.value = 'Updated note';

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('Updated note');
  });

  it('supports select input with array and record options', async () => {
    const promise = ui.prompt({
      input: 'select',
      options: { us: 'United States', ca: 'Canada', uk: 'United Kingdom' },
      inputValue: 'ca',
    });

    const select = dialogEl()?.querySelector<HTMLSelectElement>('select.gk-field');
    expect(select?.value).toBe('ca');
    if (select) select.value = 'uk';

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('uk');
  });

  it('supports radio input', async () => {
    const promise = ui.prompt({
      input: 'radio',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
      ],
      inputValue: 'medium',
    });

    const radios = dialogEl()?.querySelectorAll<HTMLInputElement>('input[type="radio"]');
    expect(radios?.length).toBe(3);
    const checked = Array.from(radios ?? []).find((r) => r.checked);
    expect(checked?.value).toBe('medium');

    const large = Array.from(radios ?? []).find((r) => r.value === 'large');
    if (large) large.checked = true;

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('large');
  });

  it('supports checkbox input', async () => {
    const promise = ui.prompt({
      input: 'checkbox',
      inputValue: true,
      inputLabel: 'I agree to terms',
    });

    const box = dialogEl()?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(box?.checked).toBe(true);
    if (box) box.checked = false;

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe(false);
  });

  it('supports range input with output display', async () => {
    const promise = ui.prompt({
      input: 'range',
      inputValue: 50,
      inputAttributes: { min: '0', max: '100', step: '5' },
    });

    const range = dialogEl()?.querySelector<HTMLInputElement>('input[type="range"]');
    const output = dialogEl()?.querySelector<HTMLOutputElement>('.gk-output');
    expect(range?.value).toBe('50');
    expect(output?.textContent).toBe('50');

    if (range) {
      range.value = '75';
      range.dispatchEvent(new Event('input', { bubbles: true }));
    }
    expect(output?.textContent).toBe('75');

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe(75);
  });

  it('supports number input with numeric conversion', async () => {
    const promise = ui.prompt({
      input: 'number',
      inputValue: 42,
    });

    const input = dialogEl()?.querySelector<HTMLInputElement>('input[type="number"]');
    expect(input?.value).toBe('42');
    if (input) input.value = '100';

    dialogEl()?.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe(100);
  });

  it('validates input synchronously and asynchronously', async () => {
    const validate = vi
      .fn()
      .mockReturnValueOnce('Name cannot be empty')
      .mockResolvedValueOnce(undefined);

    const promise = ui.prompt({
      inputValue: '',
      validate,
    });

    const dialog = dialogEl() as HTMLElement;
    const confirmBtn = dialog.querySelector<HTMLButtonElement>('.gk-confirm');

    confirmBtn?.click();
    await vi.advanceTimersByTimeAsync(0);
    expect(validate).toHaveBeenCalledTimes(1);

    const errorEl = dialog.querySelector('.gk-error') as HTMLElement;
    expect(errorEl.hidden).toBe(false);
    expect(errorEl.textContent).toBe('Name cannot be empty');

    const input = dialog.querySelector<HTMLInputElement>('.gk-field');
    expect(input?.getAttribute('aria-invalid')).toBe('true');

    if (input) input.value = 'Valid Name';
    confirmBtn?.click();
    await vi.advanceTimersByTimeAsync(10);

    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('Valid Name');
  });
});

describe('dialog timer and interaction', () => {
  it('runs timer with timerProgressBar and pauses on hover', async () => {
    const promise = ui.alert({
      title: 'Self-closing alert',
      timer: 2000,
      timerProgressBar: true,
    });

    const dialog = dialogEl() as HTMLElement;
    const timerBar = dialog.querySelector('.gk-timer') as HTMLElement;
    expect(timerBar.hidden).toBe(false);

    vi.advanceTimersByTime(1000);
    expect(promise.handle.timer.remaining()).toBe(1000);

    dialog.dispatchEvent(new MouseEvent('pointerenter'));
    vi.advanceTimersByTime(2000);
    expect(promise.handle.timer.remaining()).toBe(1000);

    dialog.dispatchEvent(new MouseEvent('pointerleave'));
    vi.advanceTimersByTime(1000);

    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('timer');
  });

  it('handles backdrop click dismissal', async () => {
    const promise = ui.alert({
      title: 'Backdrop dismissal test',
    });

    const backdrop = document.querySelector('.gk-backdrop') as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('backdrop');
  });

  it('supports drag handle when draggable is true', () => {
    ui.alert({
      title: 'Draggable Dialog',
      draggable: true,
    });

    const dialog = dialogEl() as HTMLElement;
    expect(dialog.dataset.draggable).toBe('true');

    const title = dialog.querySelector('.gk-dialog-title') as HTMLElement;
    title.dispatchEvent(
      new MouseEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 100 }),
    );
    dialog.dispatchEvent(
      new MouseEvent('pointermove', { bubbles: true, clientX: 150, clientY: 180 }),
    );
    dialog.dispatchEvent(new MouseEvent('pointerup', { bubbles: true }));

    expect(dialog.style.transform).toBe('translate(50px, 80px)');
  });
});
