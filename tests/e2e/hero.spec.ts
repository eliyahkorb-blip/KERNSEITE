import { test, expect } from '@playwright/test';

test.describe('Hero (HeroCinematic)', () => {
  test('Kernaussage und beide CTAs sind sichtbar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const hero = page.locator('[data-hero]');
    await expect(hero).toBeVisible();

    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Deine Website');

    await expect(hero.getByRole('link', { name: 'Projekt besprechen' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Arbeiten ansehen' })).toBeVisible();
  });

  test('Das CRT-Motiv wird als echtes Bild ausgeliefert', async ({ page }) => {
    await page.goto('/');
    const asset = page.locator('[data-hero] .hero__asset');
    await expect(asset).toHaveCount(1);

    // Das bearbeitete Motiv (ohne Augen, mit eingebranntem Schriftzug).
    const src = await asset.getAttribute('src');
    expect(src).toContain('hero-kernseite-final');

    // Das Bild lädt tatsächlich (kein 404, keine Nullgröße).
    const ok = await asset.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
    expect(ok).toBe(true);

    // Kein Medien-Platzhalter, keine gezeichnete Figur.
    await expect(page.locator('.hero__placeholder')).toHaveCount(0);
    await expect(page.locator('svg.figure')).toHaveCount(0);
  });

  test('Über dem Bildschirm liegt kein Overlay mehr', async ({ page }) => {
    await page.goto('/');
    for (const sel of [
      '.hero__screen',
      '.hero__screen-panel',
      '.hero__screen-glow',
      '.hero__screen-scan',
      '.crt',
      '[data-crt]',
      '[data-crt-word]',
    ]) {
      await expect(page.locator(sel), `${sel} darf nicht mehr existieren`).toHaveCount(0);
    }
  });

  test('Kein dynamischer Wortwechsel auf dem Monitor', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-words]')).toHaveCount(0);

    // Auch nach mehreren früheren Wechselintervallen ändert sich nichts.
    const before = await page.locator('[data-hero]').innerHTML();
    await page.waitForTimeout(2600);
    const after = await page.locator('[data-hero]').innerHTML();
    expect(after).toBe(before);
  });

  test('Keine dekorative Vorzeile über der H1', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero] .hero__eyebrow')).toHaveCount(0);
    await expect(page.getByText('Digitalagentur für Websites, Sichtbarkeit & Systeme')).toHaveCount(
      0,
    );
  });

  test('„Unternehmen“ wird nicht getrennt', async ({ page }) => {
    for (const w of [390, 430]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      const style = await page.locator('h1').evaluate((el) => getComputedStyle(el).hyphens);
      expect(style, `hyphens bei ${w}px`).toBe('none');
    }
  });

  test('Ohne Bewegungspräferenz bleiben Reveal-Inhalte lesbar', async ({ page }) => {
    await page.goto('/');
    const faq = page.locator('.faq-home');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq).toBeVisible();
    await expect(faq.locator('h2')).toBeVisible();
  });
});
