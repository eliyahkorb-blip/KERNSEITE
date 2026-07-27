import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

const SLUGS = [
  'handwerk',
  'zahnarztpraxen',
  'gastronomie-hotels',
  'lokale-dienstleister',
  'b2b-mittelstand',
];

/** Motive, die tatsächlich als Datei vorliegen. */
function presentMotifs(): string[] {
  const dir = join(ROOT, 'public/assets/branchen');
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir);
  return SLUGS.filter((s) => files.some((f) => f.startsWith(`${s}-`) && f.endsWith('.webp')));
}

test.describe('Branchen – Bilder und Herkunft', () => {
  test('Jede Branche hat ein Bild oder ist in ASSET_TODO dokumentiert', () => {
    const present = presentMotifs();
    const missing = SLUGS.filter((s) => !present.includes(s));
    if (missing.length === 0) return;

    // Fehlende Motive müssen namentlich in der Beschaffungsliste stehen.
    const todo = readFileSync(join(ROOT, 'docs/ASSET_TODO.md'), 'utf8');
    for (const slug of missing) {
      expect(todo, `${slug} fehlt und ist nicht in docs/ASSET_TODO.md dokumentiert`).toContain(
        `${slug}.jpg`,
      );
    }
  });

  test('Keine Kundenreferenz-Screenshots im Branchenraster', async ({ page }) => {
    await page.goto('/branchen/');
    const srcs = await page.evaluate(() =>
      [...document.querySelectorAll('.igrid img, .igrid source')].map(
        (el) => el.getAttribute('src') ?? el.getAttribute('srcset') ?? '',
      ),
    );
    for (const src of srcs) {
      expect(src, 'Kunden-Screenshot im Branchenraster').not.toMatch(
        /kaya-doener|kinderkoerbchen|assets\/references/,
      );
    }
  });

  test('Auch die Branchen-Detailseiten nutzen keine Kunden-Screenshots als Motiv', () => {
    for (const slug of SLUGS) {
      const file = join(DIST, 'branchen', slug, 'index.html');
      if (!existsSync(file)) continue;
      const html = readFileSync(file, 'utf8');
      const hero = html.match(/<section class="hero-img"[\s\S]*?<\/section>/)?.[0] ?? '';
      expect(hero, `${slug}: Kunden-Screenshot als Branchenmotiv`).not.toMatch(
        /kaya-doener|kinderkoerbchen/,
      );
    }
  });

  test('Keine schwarze Ersatzlinie und kein grauer Platzhalter', async ({ page }) => {
    await page.goto('/branchen/');
    await expect(page.locator('.igrid__rule')).toHaveCount(0);
    const filled = await page.evaluate(() =>
      [...document.querySelectorAll('.igrid__media')].filter((el) => !el.querySelector('img'))
        .length,
    );
    expect(filled, 'Bildfläche ohne Bild').toBe(0);
  });

  test('Alle vorhandenen Motive haben dasselbe Seitenverhältnis', async ({ page }) => {
    await page.goto('/branchen/');
    const ratios = await page.evaluate(() =>
      [...document.querySelectorAll('.igrid__media')].map((el) => {
        const r = el.getBoundingClientRect();
        return Math.round((r.width / r.height) * 100) / 100;
      }),
    );
    for (const r of ratios) {
      expect(Math.abs(r - 4 / 3), `Seitenverhältnis ${r} statt 4:3`).toBeLessThan(0.05);
    }
  });

  test('Vorhandene Motive laden tatsächlich', async ({ page }) => {
    await page.goto('/branchen/');
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images].map(async (img) => {
          img.loading = 'eager';
          try {
            await img.decode();
          } catch {
            // wird unten gemeldet
          }
        }),
      );
    });
    const broken = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLImageElement>('.igrid img')]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    );
    expect(broken).toEqual([]);
  });
});

test.describe('Branchen – geordnetes Raster', () => {
  test('Alle fünf Einträge haben denselben Aufbau', async ({ page }) => {
    await page.goto('/branchen/');
    const cells = page.locator('.igrid__cell');
    await expect(cells).toHaveCount(5);
    for (let i = 0; i < 5; i++) {
      await expect(cells.nth(i).locator('.igrid__name')).toHaveCount(1);
      await expect(cells.nth(i).locator('.igrid__arg')).toHaveCount(1);
      await expect(cells.nth(i).locator('.igrid__go')).toHaveCount(1);
    }
  });

  test('Desktop zeigt drei Spalten, Mobil eine', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/branchen/');
    const cols = async () =>
      page.evaluate(
        () => getComputedStyle(document.querySelector('.igrid')!).gridTemplateColumns.split(' ').length,
      );
    expect(await cols()).toBe(3);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/branchen/');
    expect(await cols()).toBe(1);
  });

  test('Keine Kartenoptik: kein Rahmen, kein Schatten um die Einträge', async ({ page }) => {
    await page.goto('/branchen/');
    const styles = await page.evaluate(() =>
      [...document.querySelectorAll('.igrid__cell, .igrid__link')].map((el) => {
        const cs = getComputedStyle(el);
        return { border: cs.borderTopWidth, shadow: cs.boxShadow, bg: cs.backgroundColor };
      }),
    );
    for (const s of styles) {
      expect(s.border).toBe('0px');
      expect(s.shadow).toBe('none');
      expect(s.bg).toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('Die Einträge tragen keine Nummer und kein Badge', async ({ page }) => {
    await page.goto('/branchen/');
    const texts = await page.locator('.igrid span').allInnerTexts();
    expect(texts.filter((t) => /^\d{1,2}$/.test(t.trim()))).toEqual([]);
  });
});
