import { test, expect } from '@playwright/test';

test.describe('Theme System and Playground E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/theme-playground/index.html');
    await expect(page.locator('.brand')).toBeVisible();
  });

  test('switches themes and renders signature ios-glass toast', async ({ page }) => {
    await page.selectOption('#theme-sel', 'ios-glass');
    await page.click('#btn-toast-success');

    const toast = page.locator('.gk-toast--success');
    await expect(toast).toBeVisible();

    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('data-gk-theme', 'ios-glass');
  });

  test('switches to liquid-glass theme and verifies attributes', async ({ page }) => {
    await page.selectOption('#theme-sel', 'liquid-glass');
    await page.click('#btn-toast-info');

    const toast = page.locator('.gk-toast--info');
    await expect(toast).toBeVisible();

    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('data-gk-theme', 'liquid-glass');
  });

  test('switches to aurora animated glow theme', async ({ page }) => {
    await page.selectOption('#theme-sel', 'aurora');
    await page.click('#btn-toast-warning');

    const toast = page.locator('.gk-toast--warning');
    await expect(toast).toBeVisible();

    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('data-gk-theme', 'aurora');
  });

  test('toggles light and dark mode', async ({ page }) => {
    await page.selectOption('#mode-sel', 'light');
    await page.click('#btn-toast-success');

    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('data-gk-mode', 'light');

    await page.selectOption('#mode-sel', 'dark');
    await expect(region).toHaveAttribute('data-gk-mode', 'dark');
  });

  test('triggers dialog and confirms', async ({ page }) => {
    await page.selectOption('#theme-sel', 'ios-glass');
    await page.click('#btn-dialog-confirm');

    const dialog = page.locator('.gk-dialog');
    await expect(dialog).toBeVisible();
    await expect(page.locator('.gk-overlay')).toHaveAttribute('data-gk-theme', 'ios-glass');

    const confirmBtn = page.locator('.gk-dialog .gk-btn--confirm');
    await confirmBtn.click();
    await expect(dialog).not.toBeVisible();
  });

  test('triggers action sheet and dismisses', async ({ page }) => {
    await page.click('#btn-sheet');

    const sheet = page.locator('.gk-sheet');
    await expect(sheet).toBeVisible();

    const cancelBtn = page.locator('.gk-sheet-action[data-style="cancel"]');
    await cancelBtn.click();
    await expect(sheet).not.toBeVisible();
  });

  test('registers and activates custom theme at runtime', async ({ page }) => {
    await page.fill('#custom-name', 'e2e-cyber');
    await page.click('#btn-define-theme');

    // Verify dynamic style injection in head
    const styleTag = page.locator('style[data-gk-theme="e2e-cyber"]');
    await expect(styleTag).toBeAttached();

    const region = page.locator('.gk-region');
    await expect(region).toHaveAttribute('data-gk-theme', 'e2e-cyber');
  });
});

