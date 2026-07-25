import { test, expect } from '@playwright/test';

test.describe('Hero (HeroCinematic)', () => {
  test('Kernaussage und beide CTAs sind sichtbar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const hero = page.locator('[data-hero]');
    await expect(hero).toBeVisible();

    // Genau eine H1, und sie steht als echter Text im Hero (nicht im Bild).
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Deine Website');

    await expect(hero.getByRole('link', { name: 'Kostenfreie Analyse' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Arbeiten ansehen' })).toBeVisible();
  });

  test('Die Szene ist dekorativ und nicht fokussierbar', async ({ page }) => {
    await page.goto('/');
    const stage = page.locator('[data-hero] .hero__stage');
    await expect(stage).toBeVisible();

    // Bildschirmfläche ist als dekorativ ausgezeichnet.
    const screen = page.locator('[data-hero-screen]');
    await expect(screen).toHaveAttribute('aria-hidden', 'true');

    // Innerhalb der Szene gibt es keine Tastatur-Stopps.
    const focusables = stage.locator('a, button, input, select, textarea, [tabindex="0"]');
    await expect(focusables).toHaveCount(0);
  });

  test('Der Monitor zeigt das Wort KERNSEITE', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero-word]')).toHaveText('KERNSEITE');
  });

  test('prefers-reduced-motion: Hero rendert statisch ohne Fehler', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/');
    const hero = page.locator('[data-hero]');
    await expect(hero).toBeVisible();
    // Das Skript markiert den Hero als statisch -> keine Flacker-Animation.
    await expect(hero).toHaveClass(/is-static/);
    await expect(page.locator('h1')).toBeVisible();

    expect(errors).toEqual([]);
    await context.close();
  });

  test('Ohne Bewegungspräferenz bleiben alle Reveal-Inhalte lesbar', async ({ page }) => {
    await page.goto('/');
    // Die letzte Sektion wird angesteuert; danach muss ihr Inhalt sichtbar sein.
    const faq = page.locator('.faq-home');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq).toBeVisible();
    await expect(faq.locator('h2')).toBeVisible();
  });
});
