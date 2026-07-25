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

  test('Die Szene ist dekorativ und enthält keine Tastatur-Stopps', async ({ page }) => {
    await page.goto('/');
    const media = page.locator('[data-hero] .hero__media');
    await expect(media).toBeVisible();

    // Die Bildschirmfläche trägt keine Bedeutung für Screenreader.
    await expect(page.locator('[data-crt]')).toHaveAttribute('aria-hidden', 'true');

    const focusables = media.locator('a, button, input, select, textarea, [tabindex="0"]');
    await expect(focusables).toHaveCount(0);
  });

  test('Der Monitor zeigt das Wort KERNSEITE', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-crt-word]')).toHaveText('KERNSEITE');
  });

  test('prefers-reduced-motion: kein Wortwechsel, kein Flackern', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/');
    const crt = page.locator('[data-crt]');
    await expect(crt).toBeVisible();
    // Ohne Bewegung wird die Flacker-Klasse nie gesetzt.
    await expect(crt).not.toHaveClass(/is-live/);

    // Auch nach mehreren Wechselintervallen bleibt „KERNSEITE“ stehen.
    await page.waitForTimeout(2600);
    await expect(page.locator('[data-crt-word]')).toHaveText('KERNSEITE');

    expect(errors).toEqual([]);
    await context.close();
  });

  test('Ohne Bewegungspräferenz bleiben Reveal-Inhalte lesbar', async ({ page }) => {
    await page.goto('/');
    const faq = page.locator('.faq-home');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq).toBeVisible();
    await expect(faq.locator('h2')).toBeVisible();
  });
});
