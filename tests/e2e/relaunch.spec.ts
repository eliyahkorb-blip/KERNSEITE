import { test, expect } from '@playwright/test';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

/** Alle HTML-Dateien im Build einsammeln. */
function htmlFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(p, acc);
    else if (entry.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

test.describe('Relaunch – Inhalte und Medien', () => {
  test('Kinderkörbchen verweist auf die .com-Domain', async ({ page }) => {
    await page.goto('/arbeiten/kinderkoerbchen/');
    const link = page.getByRole('link', { name: /Website ansehen/i });
    await expect(link).toHaveAttribute('href', 'https://www.xn--kinderkrbchen-omb.com');
    await expect(page.getByText('www.kinderkörbchen.com')).toBeVisible();
  });

  test('Keine alte Kinderkörbchen-Domain und kein ponct.de im Build', () => {
    const forbidden = [
      'kinderkörbchen.de',
      'xn--kinderkrbchen-9ib',
      'ponct.de',
      'kinderkoerbchen.de',
    ];
    const hits: string[] = [];
    for (const file of htmlFiles(DIST)) {
      const html = readFileSync(file, 'utf8');
      for (const f of forbidden) {
        if (html.includes(f)) hits.push(`${file}: ${f}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Keine alten SVG-Projektplatzhalter mehr im Build', () => {
    const hits: string[] = [];
    for (const file of htmlFiles(DIST)) {
      const html = readFileSync(file, 'utf8');
      for (const m of html.matchAll(/\/assets\/references\/[\w-]+\.svg/g)) {
        hits.push(`${file}: ${m[0]}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Die echten Bilddateien liegen vor', () => {
    const required = [
      'public/assets/references/kaya-doener-desktop.webp',
      'public/assets/references/kinderkoerbchen-desktop.webp',
      'public/assets/references/google-business-profile-kinderkoerbchen.webp',
      'public/assets/video/hero-kernseite-poster.webp',
      'public/assets/video/hero-kernseite-poster-portrait.webp',
    ];
    for (const rel of required) {
      expect(existsSync(join(ROOT, rel)), `${rel} fehlt`).toBe(true);
    }
  });

  test('Keine verbotenen alten UI-Farben in den Stylesheets', () => {
    const cssDir = join(DIST, '_astro');
    const forbidden = ['#19e6f2', '#304ffe', '#081b3a', '#cbd4e3', '#ff5d45', '#223cd6'];
    const hits: string[] = [];
    for (const name of readdirSync(cssDir)) {
      if (!name.endsWith('.css')) continue;
      const css = readFileSync(join(cssDir, name), 'utf8').toLowerCase();
      for (const f of forbidden) if (css.includes(f)) hits.push(`${name}: ${f}`);
    }
    expect(hits).toEqual([]);
  });

  test('Die Markenfarbe #00E3F2 wird verwendet', () => {
    const cssDir = join(DIST, '_astro');
    const found = readdirSync(cssDir)
      .filter((n) => n.endsWith('.css'))
      .some((n) => readFileSync(join(cssDir, n), 'utf8').toLowerCase().includes('#00e3f2'));
    expect(found).toBe(true);
  });
});

test.describe('Relaunch – Struktur', () => {
  test('SEO/GEO-Route ist erreichbar und verlinkt', async ({ page }) => {
    const resp = await page.goto('/leistungen/seo-geo/');
    expect(resp?.status()).toBe(200);
    await expect(page.locator('h1')).toBeVisible();

    await page.goto('/leistungen/');
    await expect(page.locator('a[href="/leistungen/seo-geo/"]').first()).toBeVisible();
  });

  test('AccentWord-Markierungen erscheinen in großen Headlines', async ({ page }) => {
    await page.goto('/');
    const marks = page.locator('h1 .accent-word');
    await expect(marks).toHaveCount(2);
    await expect(marks.first()).toHaveText('mehr');
  });

  test('Der Hero zeigt das fotorealistische Poster, nicht die Vektorfigur', async ({ page }) => {
    await page.goto('/');
    // Es gibt keine gezeichnete Figur mehr.
    await expect(page.locator('svg.figure')).toHaveCount(0);
    const media = page.locator('[data-hero] .hero__asset');
    await expect(media).toHaveCount(1);
    const src = await media.getAttribute('src');
    expect(src).toContain('hero-kernseite-poster');
  });

  test('Der CRT-Bildschirm zeigt echten Text', async ({ page }) => {
    await page.goto('/');
    const word = page.locator('[data-crt-word]');
    await expect(word).toHaveText('KERNSEITE');
  });

  test('Konzeptstudien erscheinen nicht als Kundenprojekte', async ({ page }) => {
    for (const path of ['/', '/arbeiten/']) {
      await page.goto(path);
      await expect(page.getByText('Konzeptstudie', { exact: false })).toHaveCount(0);
      await expect(page.getByText('Meisterwerk', { exact: false })).toHaveCount(0);
    }
  });

  test('Alle öffentlichen Seiten antworten mit 200', async ({ page }) => {
    const paths = [
      '/',
      '/arbeiten/',
      '/arbeiten/kaya-doener-himmelstadt/',
      '/arbeiten/kinderkoerbchen/',
      '/leistungen/',
      '/leistungen/websites/',
      '/leistungen/seo-geo/',
      '/leistungen/google-unternehmensprofil/',
      '/leistungen/unternehmensvideo/',
      '/leistungen/social-media/',
      '/leistungen/ki-automatisierung/',
      '/branchen/',
      '/branchen/handwerk/',
      '/branchen/zahnarztpraxen/',
      '/branchen/gastronomie-hotels/',
      '/branchen/lokale-dienstleister/',
      '/branchen/b2b-mittelstand/',
      '/agentur/',
      '/prozess/',
      '/faq/',
      '/kontakt/',
      '/impressum/',
      '/datenschutz/',
      '/barrierefreiheit/',
      '/agb/',
      '/cookie-einstellungen/',
    ];
    for (const p of paths) {
      const resp = await page.goto(p);
      expect(resp?.status(), `${p} nicht erreichbar`).toBe(200);
      await expect(page.locator('h1'), `${p} ohne genau eine h1`).toHaveCount(1);
    }
  });

  test('Kein horizontaler Überlauf auf schmalen Displays', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const p of ['/', '/arbeiten/', '/leistungen/seo-geo/', '/branchen/handwerk/', '/agb/']) {
      await page.goto(p);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `${p} scrollt horizontal`).toBe(false);
    }
  });
});
