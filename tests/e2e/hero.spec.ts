import { test, expect } from '@playwright/test';

test('Startseite erklärt das Angebot und führt zu Projekt und Anfrage', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('[data-hero]');
  await expect(hero.getByRole('heading', { level: 1 })).toContainText('Eine Website');
  await expect(hero.getByRole('link', { name: 'Website anfragen' })).toHaveAttribute(
    'href',
    '/kontakt/?leistung=websites',
  );
  await expect(hero.getByRole('link', { name: 'Projekte ansehen' })).toHaveAttribute(
    'href',
    '/arbeiten/',
  );
  await expect(hero.getByRole('img')).toBeVisible();
  await expect(hero.locator('canvas, video')).toHaveCount(0);
});

test('Die Startseite lädt ausschließlich eigene Ressourcen', async ({ page }) => {
  const external: string[] = [];
  page.on('request', (request) => {
    if (!request.url().startsWith('http://localhost:4321') && /^https?:/.test(request.url()))
      external.push(request.url());
  });
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  expect(external).toEqual([]);
});

test('Desktop-Startseite bleibt kompakt', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThan(7000);
});

for (const width of [320, 390, 768, 1440]) {
  test(`Wichtige Seiten ohne Überlauf bei ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/',
      '/leistungen/websites/',
      '/agentur/',
      '/kontakt/',
      '/branchen/handwerk/',
      '/arbeiten/kaya-doener-himmelstadt/',
      '/bildnachweise/',
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        ),
        path,
      ).toBeLessThanOrEqual(1);
      const broken = await page
        .locator('img')
        .evaluateAll((images) =>
          images
            .filter((img) => img.complete && !img.naturalWidth)
            .map((img) => img.getAttribute('src')),
        );
      expect(broken, path).toEqual([]);
      if (
        [390, 1440].includes(width) &&
        ['/', '/leistungen/websites/', '/agentur/', '/kontakt/'].includes(path)
      ) {
        for (const img of await page.locator('img').all()) await img.scrollIntoViewIfNeeded();
        await page.evaluate(() =>
          Promise.all(Array.from(document.images).map((img) => img.decode().catch(() => {}))),
        );
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
        await testInfo.attach(`Ansicht-${width}-${path.replaceAll('/', '-') || 'start'}`, {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      }
    }
  });
}
