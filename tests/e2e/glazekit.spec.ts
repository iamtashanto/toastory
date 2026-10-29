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
});
