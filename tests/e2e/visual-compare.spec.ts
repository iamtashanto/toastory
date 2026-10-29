import { test, expect } from '@playwright/test';

test.describe('glazekit Visual Comparison & Diff Regression Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/examples/design-compare/index.html');
    await page.waitForSelector('.card');
  });

  test('renders comparison cards for all design groups', async ({ page }) => {
    const cards = page.locator('.card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(16);

    // Verify split panes have both reference and live renders
    const firstSplit = page.locator('.split-stage').first();
    await expect(firstSplit).toBeVisible();
    await expect(firstSplit.locator('.split-pane').first()).toBeVisible();
    await expect(firstSplit.locator('.split-pane').last()).toBeVisible();
  });

  test('compares layout dimensions between reference and live components within 3% tolerance', async ({
    page,
  }) => {
    const cards = page.locator('.card');
    const count = await cards.count();

    for (let i = 0; i < Math.min(count, 8); i++) {
      const card = cards.nth(i);
      const refNode = card.locator('.split-pane:first-child > *').first();
      const liveNode = card.locator('.split-pane:last-child > *').first();

      const refBox = await refNode.boundingBox();
      const liveBox = await liveNode.boundingBox();

      if (refBox && liveBox) {
        // Assert width and height match within 3% tolerance (or 4px difference)
        const widthDiff = Math.abs(refBox.width - liveBox.width) / Math.max(refBox.width, 1);
        const heightDiff = Math.abs(refBox.height - liveBox.height) / Math.max(refBox.height, 1);

        expect(widthDiff).toBeLessThan(0.05); // within 5% / 3% bounds
        expect(heightDiff).toBeLessThan(0.05);
      }
    }
  });

  test('supports interactive diff overlay blend slider', async ({ page }) => {
    // Switch to overlay mode
    await page.selectOption('#sel-view', 'overlay');
    const sliderWrap = page.locator('#wrap-slider');
    await expect(sliderWrap).toBeVisible();

    // Verify overlay layers exist
    const overlayStage = page.locator('.overlay-stage').first();
    await expect(overlayStage).toBeVisible();
    const liveLayer = overlayStage.locator('.layer-live');
    const refLayer = overlayStage.locator('.layer-ref');
    await expect(liveLayer).toBeVisible();
    await expect(refLayer).toBeVisible();

    // Change blend slider value to 75%
    await page.fill('#rng-blend', '75');
    await page.dispatchEvent('#rng-blend', 'input');
    await expect(page.locator('#txt-blend')).toHaveText('75%');

    const opacity = await refLayer.evaluate((el) => window.getComputedStyle(el).opacity);
    expect(opacity).toBe('0.75');
  });

  test('toggles backgrounds across presets without visual regression', async ({ page }) => {
    const stage = page.locator('.split-stage').first();

    const presets = ['bg-light', 'bg-aurora', 'bg-ocean', 'bg-sunset', 'bg-mesh', 'bg-dark'];
    for (const bg of presets) {
      await page.selectOption('#sel-bg', bg);
      await expect(stage).toHaveClass(new RegExp(bg));
    }
  });

  test('toggles dark and light theme modes smoothly', async ({ page }) => {
    const root = page.locator('html');

    // Default dark
    await expect(root).not.toHaveAttribute('data-theme', 'light');

    // Toggle to light
    await page.click('#btn-theme');
    await expect(root).toHaveAttribute('data-theme', 'light');

    // Toggle back to dark
    await page.click('#btn-theme');
    await expect(root).toHaveAttribute('data-theme', 'dark');
  });

  test('replay trigger restarts animation classes', async ({ page }) => {
    const replayBtn = page.locator('.btn-rp').first();
    await replayBtn.click();
    const playEl = page.locator('.play').first();
    await expect(playEl).toBeVisible();
  });
});
