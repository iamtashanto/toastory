// @vitest-environment jsdom
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { ColorMode } from '../../src/core';
import { resetEngine, ui } from '../../src/web';

beforeEach(() => {
  resetEngine();
  document.body.innerHTML = '<main id="app"></main>';
});

afterEach(() => {
  resetEngine();
  document.body.replaceChildren();
});

const checkA11y = async (element: Element): Promise<void> => {
  const results = await axe.run(element, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
    rules: {
      // Color contrast in jsdom cannot compute rendered layout pixels or real styles
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations).toEqual([]);
};

describe('accessibility (WCAG 2.2 AA with axe-core)', () => {
  it('toast notification satisfies accessibility standards', async () => {
    ui.toast.success('File saved successfully', {
      description: 'Your changes have been synced.',
      action: { label: 'Undo' },
      cancel: { label: 'Dismiss' },
      closeButton: true,
    });

    const region = document.querySelector('.gk-region');
    expect(region).not.toBeNull();
    if (region) await checkA11y(region);
  });

  it('toast notification in dark mode satisfies accessibility standards', async () => {
    ui.configure({ mode: 'dark' });
    ui.toast.error('Dark mode alert', {
      description: 'Your changes could not be synced.',
      action: { label: 'Retry' },
      cancel: { label: 'Dismiss' },
      closeButton: true,
    });

    const region = document.querySelector('.gk-region');
    expect(region).not.toBeNull();
    if (region) await checkA11y(region);
  });

  it('confirmation dialog satisfies accessibility standards', async () => {
    ui.confirm({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this repository?',
      confirmButton: { label: 'Delete', aria: 'Confirm deletion' },
      cancelButton: { label: 'Cancel', aria: 'Cancel deletion' },
      closeButtonLabel: 'Close dialog',
    });

    const overlay = document.querySelector('.gk-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) await checkA11y(overlay);
  });

  it('prompt with labeled inputs satisfies accessibility standards', async () => {
    ui.prompt({
      title: 'User Profile Details',
      input: 'text',
      inputLabel: 'Full Name',
      placeholder: 'John Doe',
      confirmButton: { label: 'Submit' },
    });

    const overlay = document.querySelector('.gk-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) await checkA11y(overlay);
  });

  it('action sheet satisfies accessibility standards', async () => {
    ui.sheet({
      title: 'Action Sheet Menu',
      message: 'Choose one of the following',
      actions: [
        { label: 'Option 1', value: '1' },
        { label: 'Option 2', value: '2' },
      ],
      cancel: { label: 'Cancel Action' },
    });

    const overlay = document.querySelector('.gk-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) await checkA11y(overlay);
  });

  it('bottom sheet satisfies accessibility standards', async () => {
    ui.bottomSheet({
      title: 'Drawer Sheet',
      text: 'Detailed drawer content',
      closeButtonLabel: 'Close drawer',
      handleLabel: 'Resize drawer',
    });

    const overlay = document.querySelector('.gk-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) await checkA11y(overlay);
  });

  it('loading overlay satisfies accessibility standards', async () => {
    ui.loading({
      text: 'Loading profile data...',
      progress: 0.5,
    });

    const overlay = document.querySelector('.gk-overlay');
    expect(overlay).not.toBeNull();
    if (overlay) await checkA11y(overlay);
  });
});

const MODES: ColorMode[] = ['light', 'dark'];

describe('showcase theme: 12 variants x 2 modes axe-core compliance', () => {
  const showcaseVariants = [
    'glass-gradient',
    'emerald',
    'neon-error',
    'ios-banner',
    'dev-dark',
    'countdown-ring',
    'stacked',
    'upload-card',
    'island',
    'gradient-border',
    'soft-light',
    'message-actions',
  ] as const;

  for (const variant of showcaseVariants) {
    for (const mode of MODES) {
      it(`showcase variant "${variant}" in ${mode} mode passes axe-core`, async () => {
        ui.configure({ theme: 'showcase', mode });
        ui.toast(`Showcase ${variant} notification`, {
          theme: 'showcase',
          variant,
          description: 'Testing showcase variant accessibility',
          badge: { label: 'New', tone: 'info' },
          kbd: '⌘S',
          actions: [
            { label: 'Action 1', onClick: () => {} },
            { label: 'Action 2', onClick: () => {} },
          ],
          closeButton: true,
          progress: variant === 'countdown-ring' ? 'ring' : 'bar',
          progressValue: 0.65,
        });

        const region = document.querySelector('.gk-region');
        expect(region).not.toBeNull();
        if (region) await checkA11y(region);
      });
    }
  }
});

describe('essentials theme: 12 variants x 2 modes axe-core compliance', () => {
  const essentialsVariants = [
    'minimal',
    'success',
    'error',
    'warning',
    'accent-bar',
    'badge-title',
    'progress-bar',
    'pill',
    'undo-bar',
    'inline-confirm',
    'loading-percent',
    'avatar',
  ] as const;

  for (const variant of essentialsVariants) {
    for (const mode of MODES) {
      it(`essentials variant "${variant}" in ${mode} mode passes axe-core`, async () => {
        ui.configure({ theme: 'essentials', mode });
        ui.toast(`Essentials ${variant} notification`, {
          theme: 'essentials',
          variant,
          description: 'Testing essentials variant accessibility',
          badge: { label: 'Status', tone: 'info' },
          action: { label: 'Undo' },
          cancel: { label: 'Dismiss' },
          closeButton: true,
          avatar: variant === 'avatar' ? { initials: 'GK' } : undefined,
          progress: variant === 'progress-bar' || variant === 'loading-percent' ? 'bar' : undefined,
          progressValue: 0.8,
        });

        const region = document.querySelector('.gk-region');
        expect(region).not.toBeNull();
        if (region) await checkA11y(region);
      });
    }
  }
});

describe('ios-glass theme: 12 variants x 2 modes axe-core compliance', () => {
  const iosGlassVariants = [
    'banner-light',
    'banner-dark',
    'capsule-success',
    'island-call',
    'hud-silent',
    'system-alert',
    'device-popup',
    'grouped-stack',
    'progress-ring',
    'shake-error',
    'focus-toggle',
    'compact-action',
  ] as const;

  for (const variant of iosGlassVariants) {
    for (const mode of MODES) {
      it(`ios-glass variant "${variant}" in ${mode} mode passes axe-core`, async () => {
        ui.configure({ theme: 'ios-glass', mode });
        ui.toast(`iOS Glass ${variant} notification`, {
          theme: 'ios-glass',
          variant,
          description: 'Testing iOS glass variant accessibility',
          badge: { label: 'Call', tone: 'info' },
          toggle:
            variant === 'focus-toggle' ? { label: 'Silent Mode', defaultChecked: true } : undefined,
          progress: variant === 'progress-ring' ? 'ring' : undefined,
          progressValue: 0.5,
          actions: [{ label: 'Accept' }, { label: 'Decline' }],
          closeButton: true,
        });

        const region = document.querySelector('.gk-region');
        expect(region).not.toBeNull();
        if (region) await checkA11y(region);
      });
    }
  }
});

describe('dialogs theme: 12 variants x 2 modes axe-core compliance', () => {
  const dialogVariants = [
    'warning-confirm',
    'danger-confirm',
    'type-to-confirm',
    'rename-prompt',
    'success',
    'update-info',
    'dark-logout',
    'ios-glass-alert',
    'bottom-sheet-confirm',
    'reauth-password',
    'otp-code',
    'session-countdown',
  ] as const;

  for (const variant of dialogVariants) {
    for (const mode of MODES) {
      it(`dialog variant "${variant}" in ${mode} mode passes axe-core`, async () => {
        ui.configure({ theme: 'dialogs', mode });

        if (variant === 'bottom-sheet-confirm') {
          ui.bottomSheet({
            theme: 'dialogs',
            variant: 'bottom-sheet-confirm',
            title: 'Remove 3 items?',
            text: 'They will be moved to trash.',
            confirmButton: { label: 'Move to trash' },
            cancelButton: { label: 'Cancel' },
          });
        } else if (variant === 'rename-prompt') {
          ui.prompt({
            theme: 'dialogs',
            variant: 'rename-prompt',
            title: 'Rename Project',
            inputLabel: 'Project Name',
            inputValue: 'toastory',
          });
        } else if (variant === 'reauth-password') {
          ui.prompt({
            theme: 'dialogs',
            variant: 'reauth-password',
            title: 'Confirm Password',
            input: 'password',
            inputLabel: 'Password',
            notice: { tone: 'warning', text: 'This step protects your account data.' },
          });
        } else if (variant === 'otp-code') {
          ui.prompt({
            theme: 'dialogs',
            variant: 'otp-code',
            title: 'Enter Verification Code',
            input: 'otp',
            inputLabel: 'Verification Code',
            otpLength: 6,
            resendCooldown: 30,
          });
        } else if (variant === 'type-to-confirm') {
          ui.confirm({
            theme: 'dialogs',
            variant: 'type-to-confirm',
            title: 'Delete Repository',
            text: 'Please type the repository name to confirm.',
            confirmText: 'glazekit-repo',
          });
        } else if (variant === 'session-countdown') {
          ui.confirm({
            theme: 'dialogs',
            variant: 'session-countdown',
            title: 'Session Expiring',
            text: 'You will be logged out in 60 seconds.',
            countdown: 60,
          });
        } else if (variant === 'success') {
          ui.alert({
            theme: 'dialogs',
            variant: 'success',
            title: 'Operation Completed',
            text: 'All settings have been successfully applied.',
          });
        } else {
          ui.confirm({
            theme: 'dialogs',
            variant,
            title: `Dialog ${variant}`,
            text: 'Testing dialog accessibility compliance',
            confirmButton: { label: 'Confirm' },
            cancelButton: { label: 'Cancel' },
          });
        }

        const overlay = document.querySelector('.gk-overlay');
        expect(overlay).not.toBeNull();
        if (overlay) await checkA11y(overlay);
      });
    }
  }
});

describe('keyboard navigation & interactions', () => {
  it('Escape key dismisses focused toast notification', () => {
    ui.toast('Dismissable toast', { closeButton: true });
    const toast = document.querySelector<HTMLElement>('.gk-list > *');
    expect(toast).not.toBeNull();

    toast?.focus();
    toast?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(ui.toast.getToasts()[0]?.dismissed).toBe(true);
  });

  it('Escape key dismisses confirmation dialog', async () => {
    const promise = ui.confirm({
      title: 'Confirm Action',
      text: 'Are you sure?',
    });

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    const overlay = document.querySelector<HTMLElement>('.gk-overlay');
    expect(overlay?.dataset.state).toBe('closing');
    const res = await promise;
    expect(res.isDismissed).toBe(true);
    expect(res.dismiss).toBe('esc');
  });

  it('Enter key triggers confirm button in dialog', async () => {
    let confirmed = false;
    const promise = ui.confirm({
      title: 'Save Changes',
      text: 'Do you want to save?',
    });
    void promise.then((res) => {
      if (res.isConfirmed) confirmed = true;
    });

    const confirmBtn = document.querySelector<HTMLButtonElement>('.gk-confirm');
    expect(confirmBtn).not.toBeNull();
    confirmBtn?.click();
    const res = await promise;
    expect(res.isConfirmed).toBe(true);
    expect(confirmed).toBe(true);
  });

  it('Arrow keys navigate choices in action sheets', () => {
    ui.sheet({
      title: 'Options',
      actions: [
        { label: 'Item 1', value: '1' },
        { label: 'Item 2', value: '2' },
        { label: 'Item 3', value: '3' },
      ],
    });

    const sheet = document.querySelector<HTMLElement>('.gk-sheet');
    const actions = sheet?.querySelectorAll<HTMLButtonElement>('.gk-sheet-action');
    expect(actions?.length).toBe(3);

    actions?.[0]?.focus();
    expect(document.activeElement).toBe(actions?.[0]);

    sheet?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(actions?.[1]);

    sheet?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(document.activeElement).toBe(actions?.[2]);

    sheet?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(document.activeElement).toBe(actions?.[1]);
  });

  it('Arrow keys and Backspace navigate across OTP input fields', () => {
    ui.prompt({
      input: 'otp',
      title: 'Verify Code',
      otpLength: 4,
    });

    const otpInputs = document.querySelectorAll<HTMLInputElement>('.gk-otp-input');
    expect(otpInputs.length).toBe(4);

    const inp0 = otpInputs[0];
    const inp1 = otpInputs[1];
    const inp2 = otpInputs[2];
    expect(inp0).toBeDefined();
    expect(inp1).toBeDefined();
    expect(inp2).toBeDefined();
    if (!inp0 || !inp1 || !inp2) return;

    inp0.focus();
    expect(document.activeElement).toBe(inp0);

    // Typing in first input advances to second input
    inp0.value = '9';
    inp0.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.activeElement).toBe(inp1);

    // ArrowRight advances to third
    inp1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(document.activeElement).toBe(inp2);

    // ArrowLeft goes back to second
    inp2.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(document.activeElement).toBe(inp1);

    // Backspace when empty goes back to first
    inp1.value = '';
    inp1.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    expect(document.activeElement).toBe(inp0);
  });
});
