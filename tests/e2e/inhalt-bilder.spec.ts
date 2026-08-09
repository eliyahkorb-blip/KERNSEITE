import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

function walk(dir: string, match: (name: string) => boolean, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) walk(p, match, acc);
    else if (match(entry.name)) acc.push(p);
  }
  return acc;
}
const htmlFiles = () => walk(DIST, (n) => n.endsWith('.html'));

/** Sichtbarer Text einer gebauten Seite (ohne Skripte und Styles). */
function visibleText(file: string): string {
  return readFileSync(file, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');
}

const SERVICE_PAGES = [
  '/leistungen/websites/',
  '/leistungen/seo-geo/',
  '/leistungen/google-unternehmensprofil/',
  '/leistungen/unternehmensvideo/',
  '/leistungen/social-media/',
  '/leistungen/ki-automatisierung/',
];

test.describe('Standort – nur Würzburg und bundesweit', () => {
  test('„Regensburg“ kommt im gesamten Build nicht vor', () => {
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      if (readFileSync(file, 'utf8').includes('Regensburg')) hits.push(file);
    }
    expect(hits).toEqual([]);
  });

  test('Die Standortaussage ist einheitlich', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero]')).toContainText('Würzburg');
    await expect(page.locator('footer')).toContainText('bundesweit');
  });
});

test.describe('Keine internen Hinweise auf der öffentlichen Website', () => {
  test('Weder Vorschau-Badge noch Entwurfshinweise erscheinen', () => {
    const forbidden = [
      'Vorschau – nicht produktiv',
      'preview-ribbon',
      'Screenshot folgt',
      'Konzeptstudie',
      'kein Kundenprojekt',
      'Platzhalter',
      'prüfpflichtiger Entwurf',
      'TODO',
      '[ERSETZEN]',
      'unverifiziert',
    ];
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      const text = visibleText(file);
      const raw = readFileSync(file, 'utf8');
      for (const f of forbidden) {
        if (text.includes(f) || raw.includes('preview-ribbon')) hits.push(`${file}: ${f}`);
      }
    }
    expect([...new Set(hits)]).toEqual([]);
  });
});

test.describe('Bilder – alle gelieferten Motive werden verwendet', () => {
  const SERVICE_PHOTOS = ['social-media', 'unternehmensvideo', 'seo-geo', 'standort-wuerzburg'];
  const INDUSTRY_PHOTOS = [
    'handwerk',
    'gastronomie-hotels',
    'lokale-dienstleister',
    'b2b-mittelstand',
  ];

  test('Die vier Leistungsbilder erscheinen im Build', () => {
    const all = htmlFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    for (const name of SERVICE_PHOTOS) {
      expect(all, `${name} wird nicht verwendet`).toContain(`/assets/leistungen/${name}-`);
    }
  });

  test('Die vorhandenen Branchenbilder erscheinen im Build', () => {
    const all = htmlFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    for (const name of INDUSTRY_PHOTOS) {
      expect(all, `${name} wird nicht verwendet`).toContain(`/assets/branchen/${name}-`);
    }
  });

  test('Zusatzmotive liegen nicht ungenutzt im Repository', () => {
    const all = htmlFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    for (const name of ['restaurant-ambiente', 'hotelzimmer', 'garten-landschaftsbau']) {
      if (!existsSync(join(ROOT, 'public/assets/branchen', `${name}-960.webp`))) continue;
      expect(all, `${name} liegt ungenutzt im Repository`).toContain(`/assets/branchen/${name}-`);
    }
  });

  test('Alle Motive werden als AVIF und WebP mit srcset ausgeliefert', () => {
    const all = htmlFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    expect(all).toContain('type="image/avif"');
    expect(all).toContain('type="image/webp"');
    expect(all).toMatch(/srcset="[^"]*640w/);
    expect(all).toMatch(/srcset="[^"]*1600w/);
  });

  test('Kein Bild wird von einem fremden Server geladen', () => {
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      for (const m of html.matchAll(/(?:src|srcset)="(https?:\/\/[^"]+)"/g)) {
        hits.push(`${file}: ${m[1]}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Alle Bilder laden und tragen feste Maße', async ({ page }) => {
    for (const path of ['/', '/branchen/', '/agentur/', '/kontakt/', ...SERVICE_PAGES]) {
      await page.goto(path);
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
      const bad = await page.evaluate(() =>
        [...document.images]
          .filter((i) => !i.complete || i.naturalWidth === 0 || !i.width || !i.height)
          .map((i) => i.currentSrc || i.src || '(ohne src)'),
      );
      expect(bad, `${path}: Bild fehlerhaft`).toEqual([]);
    }
  });
});

test.describe('Leistungsseiten – eigener Aufbau statt Template', () => {
  test('Keine zwei Seiten haben dieselbe Abschnittsfolge', () => {
    const signatures = new Map<string, string>();
    for (const path of SERVICE_PAGES) {
      const file = join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html');
      const html = readFileSync(file, 'utf8');
      // Signatur: Reihenfolge der Abschnittsklassen im Hauptbereich.
      const sig = [...html.matchAll(/<section class="([^"]+)"/g)]
        .map((m) => m[1].split(' ')[0])
        .join('|');
      signatures.set(path, sig);
    }
    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const [path, sig] of signatures) {
      if (seen.has(sig)) duplicates.push(`${path} = ${seen.get(sig)}`);
      else seen.set(sig, path);
    }
    expect(duplicates, 'Identische Abschnittsfolge').toEqual([]);
  });

  test('Jede Leistungsseite besitzt mindestens einen eigenen Abschnittstyp', () => {
    const classesPerPage = new Map<string, Set<string>>();
    for (const path of SERVICE_PAGES) {
      const file = join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html');
      const html = readFileSync(file, 'utf8');
      const classes = new Set(
        [...html.matchAll(/<(?:section|header) class="([^"]+)"/g)]
          .map((m) => m[1].split(' ')[0])
          // Gemeinsame Bausteine zählen nicht als eigener Aufbau.
          .filter((c) => !['section', 'cta', 'rel', 'page-hero'].includes(c)),
      );
      classesPerPage.set(path, classes);
    }

    for (const [path, classes] of classesPerPage) {
      const others = new Set<string>();
      for (const [p2, c2] of classesPerPage) {
        if (p2 !== path) for (const c of c2) others.add(c);
      }
      const unique = [...classes].filter((c) => !others.has(c));
      expect(unique.length, `${path} hat keinen eigenen Abschnittstyp`).toBeGreaterThan(0);
    }
  });

  test('Die Seiten sind deutlich kürzer als zuvor', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    for (const path of SERVICE_PAGES) {
      await page.goto(path);
      await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));
      const height = await page.evaluate(() => document.body.scrollHeight);
      // Vor dem Umbau lagen die Seiten bei 9.000 bis 12.000 px auf 390 px.
      expect(height, `${path} zu lang: ${height}px`).toBeLessThan(8000);
    }
  });

  test('Kein Abschnitt erzwingt unnötig volle Bildschirmhöhe', async ({ page }) => {
    for (const path of SERVICE_PAGES) {
      await page.goto(path);
      const tall = await page.evaluate(() =>
        [...document.querySelectorAll('main section, main header')]
          .filter((el) => {
            const cs = getComputedStyle(el);
            return cs.minHeight.includes('vh') || cs.height.includes('vh');
          })
          .map((el) => el.className),
      );
      expect(tall, `${path}: Abschnitt mit vh-Höhe`).toEqual([]);
    }
  });

  test('Die gemeinsamen Abschlussbereiche bleiben auf allen Seiten', async ({ page }) => {
    for (const path of SERVICE_PAGES) {
      await page.goto(path);
      await expect(page.locator('.cta'), `${path} ohne CTA-Band`).toHaveCount(1);
      await expect(page.locator('.ft__wordmark'), `${path} ohne Footer-Wortmarke`).toHaveCount(1);
    }
  });

  test('Höchstens drei FAQ-Fragen je Leistungsseite', async ({ page }) => {
    for (const path of SERVICE_PAGES) {
      await page.goto(path);
      const count = await page.locator('.faq__item').count();
      expect(count, `${path}: zu viele FAQ-Fragen`).toBeLessThanOrEqual(3);
    }
  });

  test('Die Verweisliste bleibt kompakt', async ({ page }) => {
    for (const path of SERVICE_PAGES) {
      await page.goto(path);
      const count = await page.locator('.rel__link').count();
      expect(count, `${path}: zu viele Verweise`).toBeLessThanOrEqual(4);
    }
  });
});

test.describe('Verwurzelt in Würzburg', () => {
  test('Überschrift, Bild und Text stehen sauber nebeneinander', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/agentur/');
    const title = page.locator('.region__title');
    await expect(title).toBeVisible();
    await expect(title).toContainText('Würzburg');

    const boxes = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s)?.getBoundingClientRect();
      return { t: q('.region__title'), p: q('.region__photo'), x: q('.region__text') };
    });
    // Überschrift darf weder Bild noch Text überlappen.
    const overlap = (a: DOMRect, b: DOMRect) =>
      a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
    expect(overlap(boxes.t as DOMRect, boxes.p as DOMRect), 'Titel über Bild').toBe(false);
    expect(overlap(boxes.t as DOMRect, boxes.x as DOMRect), 'Titel über Text').toBe(false);
  });

  test('Auf Mobil steht die Überschrift nicht Wort für Wort untereinander', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/agentur/');
    const lines = await page.locator('.region__title').evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      return range.getClientRects().length;
    });
    expect(lines, 'Überschrift zerfällt in zu viele Zeilen').toBeLessThanOrEqual(3);
  });
});
