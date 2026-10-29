// @vitest-environment jsdom
import axe from 'axe-core';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { resetEngine, ui } from '../../src/web';

beforeEach(() => {
  resetEngine();
  // Provide basic main landmark so axe doesn't complain about page structure in jsdom
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
