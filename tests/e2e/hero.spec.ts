import { test, expect } from '@playwright/test';

test.describe('Hero-Animation „Der digitale Kern“', () => {
  test('Module sind per Klick aktivierbar und setzen aria-pressed', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const stage = page.locator('[data-stage]');
    await expect(stage).toBeVisible();

    const googleBtn = page.locator('[data-module="google"]');
    await googleBtn.click();
    await expect(stage).toHaveAttribute('data-active-module', 'google');
    await expect(googleBtn).toHaveAttribute('aria-pressed', 'true');
  });

  test('Module sind per Tastatur erreichbar und aktivierbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const videoBtn = page.locator('[data-module="video"]');
    await videoBtn.focus();
    await expect(videoBtn).toBeFocused();
    // Fokus aktiviert das Modul (mouseenter/focus-Handler)
    await expect(page.locator('[data-stage]')).toHaveAttribute('data-active-module', 'video');
  });

  test('prefers-reduced-motion: Hero rendert statisch ohne Fehler', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await expect(page.locator('[data-stage]')).toBeVisible();
    // Textalternative ist vorhanden
    await expect(page.locator('[data-hero-alt]')).toHaveCount(1);
    await context.close();
  });
});
