import { test, expect } from '@playwright/test';

test.describe('Seiten & SEO', () => {
  test('404-Seite erscheint bei unbekannter URL', async ({ page }) => {
    const response = await page.goto('/gibt-es-nicht-xyz/');
    expect(response?.status()).toBe(404);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('gibt es nicht');
  });

  test('robots.txt und sitemap sind erreichbar', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    const sitemap = await request.get('/sitemap-index.xml');
    expect(sitemap.ok()).toBeTruthy();
  });

  test('genau eine H1 auf zentralen Seiten', async ({ page }) => {
    for (const path of ['/', '/leistungen/', '/arbeiten/', '/kontakt/', '/impressum/']) {
      await page.goto(path);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  });

  test('kein horizontaler Überlauf (Mobil und Desktop)', async ({ page }) => {
    for (const width of [390, 768, 1280, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `Überlauf bei ${width}px`).toBeLessThanOrEqual(1);
    }
  });

  test('Skip-Link ist vorhanden und zielt auf den Hauptinhalt', async ({ page }) => {
    await page.goto('/');
    const skip = page.locator('a.skip-link');
    await expect(skip).toHaveAttribute('href', '#main');
    await expect(page.locator('#main')).toHaveCount(1);
  });
});
