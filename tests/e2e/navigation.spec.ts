import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('Desktop-Navigation zeigt die Hauptlinks', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Hauptnavigation' });
    await expect(nav.getByRole('link', { name: 'Websites' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Kontakt' })).toBeVisible();
  });

  test('Mobiles Menü: öffnen, Escape schließt, Fokus kehrt zurück', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.locator('[data-menu-toggle]');
    const menu = page.locator('[data-mobile-menu]');

    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();

    // Fokus liegt im Menü
    const firstLink = menu.getByRole('link').first();
    await expect(firstLink).toBeFocused();

    // Escape schließt und gibt Fokus an den Toggle zurück
    await page.keyboard.press('Escape');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeHidden();
    await expect(toggle).toBeFocused();
  });

  test('Mobiles Menü: Fokusfalle hält den Fokus im Menü', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('[data-menu-toggle]').click();

    const menu = page.locator('[data-mobile-menu]');
    // Mehrfach Tab: Fokus muss innerhalb des Menüs bleiben
    for (let i = 0; i < 12; i++) {
      await page.keyboard.press('Tab');
      const focusedInMenu = await menu.evaluate((el) => el.contains(document.activeElement));
      expect(focusedInMenu).toBe(true);
    }
  });
});
