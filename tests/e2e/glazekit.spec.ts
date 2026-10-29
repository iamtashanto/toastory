import { test, expect } from '@playwright/test';

test.describe('glazekit Browser E2E Test Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/e2e/harness.html');
    await page.waitForFunction(
      () => (window as unknown as { __harnessReady?: boolean }).__harnessReady === true,
    );
  });

  test('renders toast notification with title and message', async ({ page }) => {
    await page.click('#btn-toast');
    const toast = page.locator('.gk-toast');
    await expect(toast).toBeVisible();
    await expect(page.locator('.gk-title')).toHaveText('Welcome');
    await expect(page.locator('.gk-desc')).toHaveText('Standard message');
  });

  test('renders success and error toasts with correct tone classes and icons', async ({ page }) => {
    await page.click('#btn-success');
    const successToast = page.locator('.gk-toast--success');
    await expect(successToast).toBeVisible();
    await expect(successToast.locator('svg')).toBeVisible();

    await page.click('#btn-error');
    const errorToast = page.locator('.gk-toast--error');
    await expect(errorToast).toBeVisible();
    await expect(errorToast.locator('svg')).toBeVisible();
  });

  test('handles toast action button click and triggers callback', async ({ page }) => {
    await page.click('#btn-action');
    const actionBtn = page.locator('.gk-action-btn');
    await expect(actionBtn).toBeVisible();
    await expect(actionBtn).toHaveText('Undo Action');

    await actionBtn.click();
    const events = await page.evaluate(
      () => (window as unknown as { __events: unknown[] }).__events,
    );
    expect(events).toContain('undo_clicked');
  });

  test('dismisses toast via touch/drag swipe gesture', async ({ page }) => {
    await page.click('#btn-swipe');
    const toast = page.locator('.gk-toast');
    await expect(toast).toBeVisible();

    const box = await toast.boundingBox();
    expect(box).not.toBeNull();

    if (box) {
      const startX = box.x + box.width / 2;
      const startY = box.y + box.height / 2;

      await page.mouse.move(startX, startY);
      await page.mouse.down();
      // Swipe right beyond the 70px dragThreshold
      await page.mouse.move(startX + 180, startY, { steps: 10 });
      await page.mouse.up();
    }

    await expect(toast).not.toBeVisible();
  });

  test('opens confirm dialog, traps focus, and resolves user confirmation', async ({ page }) => {
    await page.click('#btn-confirm');
    const dialog = page.locator('.gk-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('.gk-dialog-title')).toHaveText('Confirm Operation');
    await expect(page.locator('.gk-dialog-text')).toHaveText('Are you sure you want to proceed?');

    const confirmBtn = page.locator('.gk-btn--confirm');
    await expect(confirmBtn).toBeVisible();

    // Verify Tab cycles within dialog buttons
    await page.keyboard.press('Tab');
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedTag).toBe('BUTTON');

    await confirmBtn.click();
    await expect(dialog).not.toBeVisible();

    const events = await page.evaluate(
      () =>
        (window as unknown as { __events: Array<{ type: string; res: { isConfirmed: boolean } }> })
          .__events,
    );
    const confirmEvent = events.find((e) => e.type === 'confirm_result');
    expect(confirmEvent?.res.isConfirmed).toBe(true);
  });

  test('opens prompt dialog, edits input, and resolves user text value', async ({ page }) => {
    await page.click('#btn-prompt');
    const dialog = page.locator('.gk-dialog');
    await expect(dialog).toBeVisible();

    const input = page.locator('.gk-input input');
    await expect(input).toBeVisible();
    await expect(input).toHaveValue('Default Value');

    await input.fill('Brand New Text Value');
    await page.locator('.gk-btn--confirm').click();

    await expect(dialog).not.toBeVisible();

    const events = await page.evaluate(
      () =>
        (
          window as unknown as {
            __events: Array<{ type: string; res: { isConfirmed: boolean; value: string } }>;
          }
        ).__events,
    );
    const promptEvent = events.find((e) => e.type === 'prompt_result');
    expect(promptEvent?.res.isConfirmed).toBe(true);
    expect(promptEvent?.res.value).toBe('Brand New Text Value');
  });

  test('opens action sheet and selects an option', async ({ page }) => {
    await page.click('#btn-sheet');
    const sheet = page.locator('.gk-sheet');
    await expect(sheet).toBeVisible();

    const optBtn = page.locator('.gk-sheet-action', { hasText: 'Option One' });
    await expect(optBtn).toBeVisible();
    await optBtn.click();

    await expect(sheet).not.toBeVisible();

    const events = await page.evaluate(
      () =>
        (
          window as unknown as {
            __events: Array<{ type: string; res: { isConfirmed: boolean; value: string } }>;
          }
        ).__events,
    );
    const sheetEvent = events.find((e) => e.type === 'sheet_result');
    expect(sheetEvent?.res.isConfirmed).toBe(true);
    expect(sheetEvent?.res.value).toBe('opt1');
  });

  test('opens loading overlay and closes via handle', async ({ page }) => {
    await page.click('#btn-loading');
    const loadingOverlay = page.locator('.gk-overlay');
    await expect(loadingOverlay).toBeVisible();
    await expect(page.locator('.gk-loading-spinner')).toBeVisible();

    await page.evaluate(() => {
      const handle = (window as unknown as { __loadingHandle: { close: () => void } })
        .__loadingHandle;
      handle.close();
    });

    await expect(loadingOverlay).not.toBeVisible();
  });

  test('navigates toasts with Alt+T hotkey and dismisses with Escape', async ({ page }) => {
    await page.click('#btn-toast');
    const toast = page.locator('.gk-toast');
    await expect(toast).toBeVisible();

    // Trigger Alt+T to focus toast list
    await page.keyboard.press('Alt+KeyT');
    const isToastFocused = await page.evaluate(() => {
      const active = document.activeElement;
      return active?.classList.contains('gk-toast') || active?.closest('.gk-toast') !== null;
    });
    expect(isToastFocused).toBe(true);

    // Escape dismisses
    await page.keyboard.press('Escape');
    await expect(toast).not.toBeVisible();
  });

  test('stacking expands on hover and contracts on leave', async ({ page }) => {
    await page.evaluate(() => {
      const { ui } = window as unknown as {
        ui: { configure(c: unknown): void; toast(m: string, o?: unknown): void };
      };
      ui.configure({ stack: true });
      ui.toast('Card 1', { duration: 0 });
      ui.toast('Card 2', { duration: 0 });
      ui.toast('Card 3', { duration: 0 });
    });
    const region = page.locator('.gk-region');
    await expect(region).toBeVisible();
    await expect(region).toHaveAttribute('data-expanded', 'false');

    await region.hover();
    await expect(region).toHaveAttribute('data-expanded', 'true');

    // Move away
    await page.mouse.move(0, 0);
    await expect(region).toHaveAttribute('data-expanded', 'false');
  });

  test('pauses toast countdown on hover and resumes on leave', async ({ page }) => {
    await page.evaluate(() => {
      const { ui } = window as unknown as { ui: { toast(m: string, o?: unknown): void } };
      ui.toast('Pause me on hover', { duration: 1200, id: 'pause-test' });
    });
    const toast = page.locator('.gk-toast');
    await expect(toast).toBeVisible();

    const region = page.locator('.gk-region');
    await region.hover();

    // Wait 1500ms while hovered - toast must still be visible
    await page.waitForTimeout(1500);
    await expect(toast).toBeVisible();

    // Move mouse away to resume
    await page.mouse.move(0, 0);
    // After countdown resumes, toast should dismiss
    await expect(toast).not.toBeVisible({ timeout: 3000 });
  });

  test('executes keyboard-only close and action via tab navigation', async ({ page }) => {
    await page.evaluate(() => {
      const { ui } = window as unknown as {
        ui: { toast(m: string, o?: unknown): void };
      };
      ui.toast('Action needed', {
        id: 'kb-test',
        duration: 0,
        action: {
          label: 'Accept',
          onClick: () => {
            (window as unknown as { __events: string[] }).__events.push('kb_action_done');
          },
        },
      });
    });

    // Focus via Alt+T
    await page.keyboard.press('Alt+KeyT');
    // Tab to action button
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    const events = await page.evaluate(
      () => (window as unknown as { __events: string[] }).__events,
    );
    expect(events).toContain('kb_action_done');
    await expect(page.locator('.gk-toast')).not.toBeVisible();
  });

  test('supports RTL direction configuration and attributes', async ({ page }) => {
    await page.evaluate(() => {
      const { ui } = window as unknown as {
        ui: { configure(c: unknown): void; toast(m: string, o?: unknown): void };
      };
      ui.configure({ dir: 'rtl' });
      ui.toast('مرحبا بالعالم', { duration: 0 });
    });
    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('dir', 'rtl');
    const toast = page.locator('.gk-toast');
    await expect(toast).toHaveAttribute('dir', 'rtl');
  });

  test('handles reduced-motion media query correctly', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.evaluate(() => {
      const { ui } = window as unknown as { ui: { toast(m: string, o?: unknown): void } };
      ui.toast('Reduced motion toast', { duration: 0 });
    });
    const toast = page.locator('.gk-toast');
    await expect(toast).toBeVisible();
  });

  test('renders 50 simultaneous toasts without main-thread long tasks exceeding 50ms', async ({
    page,
  }) => {
    await page.evaluate(() => {
      (
        window as unknown as { __longTasks: Array<{ duration: number; startTime: number }> }
      ).__longTasks = [];
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
              (
                window as unknown as {
                  __longTasks: Array<{ duration: number; startTime: number }>;
                }
              ).__longTasks.push({
                duration: entry.duration,
                startTime: entry.startTime,
              });
            }
          }
        });
        observer.observe({ entryTypes: ['longtask'] });
      } catch {
        // longtask not supported in all browser environments
      }
    });

    const startTime = Date.now();
    await page.evaluate(() => {
      const { ui } = window as unknown as {
        ui: { configure(c: unknown): void; toast(m: string, o?: unknown): void };
      };
      ui.configure({ maxVisible: 50 });
      for (let i = 0; i < 50; i++) {
        ui.toast(`Performance Toast #${i + 1}`, { duration: 0 });
      }
    });
    const durationMs = Date.now() - startTime;
    console.log(`Spawned 50 toasts in ${durationMs}ms`);

    const toastCount = await page.locator('.gk-toast').count();
    expect(toastCount).toBe(50);

    const longTasks = await page.evaluate(
      () =>
        (window as unknown as { __longTasks: Array<{ duration: number; startTime: number }> })
          .__longTasks || [],
    );
    console.log(`Long tasks (>50ms) detected: ${longTasks.length}`, longTasks);
    expect(longTasks).toHaveLength(0);
  });
});
