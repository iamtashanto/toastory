// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { resetEngine, ui } from '../../src/web';

beforeEach(() => {
  vi.useFakeTimers();
  resetEngine();
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
  vi.useRealTimers();
});

describe('ui.sheet (Action Sheet)', () => {
  it('renders title, message and actions with correct styles', async () => {
    const promise = ui.sheet({
      title: 'Share File',
      message: 'Choose a destination',
      actions: [
        { label: 'Copy Link', value: 'copy' },
        { label: 'Send via Email', value: 'email' },
        { label: 'Delete file', value: 'delete', style: 'destructive' },
        { label: 'Disabled action', disabled: true },
      ],
      cancel: { label: 'Dismiss' },
    });

    const sheet = document.querySelector('.gk-sheet') as HTMLElement;
    expect(sheet).not.toBeNull();
    expect(sheet.querySelector('.gk-sheet-title')?.textContent).toBe('Share File');
    expect(sheet.querySelector('.gk-sheet-message')?.textContent).toBe('Choose a destination');

    const actions = sheet.querySelectorAll<HTMLButtonElement>('.gk-sheet-action');
    expect(actions).toHaveLength(4);

    expect(actions[0]?.textContent).toBe('Copy Link');
    expect(actions[2]?.dataset.style).toBe('destructive');
    expect(actions[3]?.disabled).toBe(true);

    const cancelBtn = sheet.querySelector<HTMLButtonElement>('.gk-sheet-cancel');
    expect(cancelBtn?.textContent).toBe('Dismiss');

    actions[1]?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(res.value).toBe('email');
  });

  it('cancel button dismisses with cancel reason', async () => {
    const promise = ui.sheet({
      actions: [{ label: 'Option A' }],
      cancel: { label: 'Abort' },
    });

    const cancelBtn = document.querySelector<HTMLButtonElement>('.gk-sheet-cancel');
    cancelBtn?.click();

    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('cancel');
  });

  it('supports action with style cancel to dismiss', async () => {
    const promise = ui.sheet({
      actions: [{ label: 'Cancel', style: 'cancel' }],
      cancel: false,
    });

    const action = document.querySelector<HTMLButtonElement>('.gk-sheet-action');
    action?.click();

    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('cancel');
  });
});

describe('ui.bottomSheet', () => {
  it('mounts bottom sheet with snap points, title, and body', async () => {
    const didOpen = vi.fn();
    const willClose = vi.fn();

    const sheet = ui.bottomSheet({
      title: 'Filter Results',
      text: 'Select your filters below',
      snapPoints: [0.25, 0.5, 0.9],
      initialSnap: 1,
      closeButtonLabel: 'Close sheet',
      didOpen,
      willClose,
    });

    const bsheet = document.querySelector('.gk-bsheet') as HTMLElement;
    expect(bsheet).not.toBeNull();
    expect(bsheet.querySelector('.gk-bsheet-title')?.textContent).toBe('Filter Results');
    expect(bsheet.querySelector('.gk-bsheet-body')?.textContent).toBe('Select your filters below');
    expect(bsheet.style.getPropertyValue('--gk-sheet-h')).toBe('50vh');

    expect(didOpen).toHaveBeenCalledWith(sheet);

    sheet.snapTo(2);
    expect(bsheet.style.getPropertyValue('--gk-sheet-h')).toBe('90vh');

    sheet.update({ text: 'Updated filter instructions' });
    expect(bsheet.querySelector('.gk-bsheet-body')?.textContent).toBe(
      'Updated filter instructions',
    );

    const grab = bsheet.querySelector<HTMLButtonElement>('.gk-grab');
    expect(grab).not.toBeNull();
    grab?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(bsheet.style.getPropertyValue('--gk-sheet-h')).toBe('50vh');

    sheet.close();
    const res = await sheet.result;
    expect(res.isDismissed).toBe(true);
    expect(willClose).toHaveBeenCalled();
  });
});

describe('ui.loading', () => {
  it('renders indeterminate loading spinner and text, then closes', async () => {
    const handle = ui.loading({
      text: 'Loading assets...',
    });

    const loading = document.querySelector('.gk-loading') as HTMLElement;
    expect(loading).not.toBeNull();
    expect(loading.getAttribute('role')).toBe('status');
    expect(loading.getAttribute('aria-busy')).toBe('true');
    expect(loading.querySelector('.gk-loading-text')?.textContent).toBe('Loading assets...');
    expect(loading.querySelector('.gk-loading-bar')?.hasAttribute('hidden')).toBe(true);

    handle.update({ text: 'Processing...' });
    expect(loading.querySelector('.gk-loading-text')?.textContent).toBe('Processing...');

    handle.close();
    await vi.advanceTimersByTimeAsync(300);
    await handle.closed;
    expect(document.querySelector('.gk-loading')).toBeNull();
  });

  it('renders determinate progress bar when progress is specified', async () => {
    const handle = ui.loading({
      text: 'Uploading...',
      progress: 0.45,
    });

    const loading = document.querySelector('.gk-loading') as HTMLElement;
    const bar = loading.querySelector('.gk-loading-bar') as HTMLElement;
    expect(bar.hidden).toBe(false);
    expect(bar.getAttribute('aria-valuenow')).toBe('45');

    handle.update({ progress: 0.8 });
    expect(bar.getAttribute('aria-valuenow')).toBe('80');

    handle.close();
    await vi.advanceTimersByTimeAsync(300);
    await handle.closed;
  });
});

describe('ui.steps (Multi-step flow)', () => {
  it('navigates through multiple steps and handles back navigation', async () => {
    const stepsPromise = ui.steps([
      { title: 'Step 1: Username', input: 'text', inputValue: 'john' },
      { title: 'Step 2: Email', input: 'email', inputValue: 'john@example.com' },
      { title: 'Step 3: Confirm', text: 'Ready to submit?' },
    ]);

    // Step 1
    let dialog = document.querySelector('.gk-dialog') as HTMLElement;
    expect(dialog.querySelector('.gk-dialog-title')?.textContent).toBe('Step 1: Username');
    dialog.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    await vi.advanceTimersByTimeAsync(300);

    // Step 2
    dialog = document.querySelector('.gk-dialog') as HTMLElement;
    expect(dialog.querySelector('.gk-dialog-title')?.textContent).toBe('Step 2: Email');

    // Test back button
    const backBtn = dialog.querySelector<HTMLButtonElement>('.gk-deny');
    expect(backBtn?.textContent).toBe('Back');
    backBtn?.click();
    await vi.advanceTimersByTimeAsync(300);

    // Back to Step 1
    dialog = document.querySelector('.gk-dialog') as HTMLElement;
    expect(dialog.querySelector('.gk-dialog-title')?.textContent).toBe('Step 1: Username');
    dialog.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    await vi.advanceTimersByTimeAsync(300);

    // Step 2 again
    dialog = document.querySelector('.gk-dialog') as HTMLElement;
    expect(dialog.querySelector('.gk-dialog-title')?.textContent).toBe('Step 2: Email');
    dialog.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    await vi.advanceTimersByTimeAsync(300);

    // Step 3
    dialog = document.querySelector('.gk-dialog') as HTMLElement;
    expect(dialog.querySelector('.gk-dialog-title')?.textContent).toBe('Step 3: Confirm');
    dialog.querySelector<HTMLButtonElement>('.gk-confirm')?.click();
    await vi.advanceTimersByTimeAsync(300);

    const result = await stepsPromise;
    expect(result.isConfirmed).toBe(true);
    expect(result.values).toEqual(['john', 'john@example.com', undefined]);
    expect(result.step).toBe(2);
  });
});
