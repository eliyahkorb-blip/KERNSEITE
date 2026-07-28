import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
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
const cssFiles = () => walk(join(DIST, '_astro'), (n) => n.endsWith('.css'));

test.describe('Relaunch – keine dekorativen Nummern und Mini-Metadaten', () => {
  test('Keine der entfernten Klassen kommt im Build vor', () => {
    const forbidden = [
      'chapter-num',
      'rows__num',
      'igrid__num',
      'tl__num',
      'plist__num',
      'gbp__point-num',
      'scope__num',
      'steps__n',
      'focus__num',
      'rel__num',
      'wf__meta',
      'wf__cat',
      'label--meta',
      'beat__n',
      'chain__n',
    ];
    const hits: string[] = [];
    for (const file of [...htmlFiles(), ...cssFiles()]) {
      const text = readFileSync(file, 'utf8');
      for (const f of forbidden) if (text.includes(f)) hits.push(`${file}: ${f}`);
    }
    expect(hits).toEqual([]);
  });

  test('Kein Monospace und keine gesperrten Versalien in den Stylesheets', () => {
    const hits: string[] = [];
    for (const file of cssFiles()) {
      const css = readFileSync(file, 'utf8').toLowerCase().replace(/\s+/g, ' ');
      if (css.includes('ibm plex mono')) hits.push(`${file}: IBM Plex Mono`);
      if (css.includes('text-transform:uppercase') || css.includes('text-transform: uppercase')) {
        hits.push(`${file}: text-transform uppercase`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Die Monospace-Schriftdateien werden nicht mehr ausgeliefert', () => {
    const fonts = readdirSync(join(DIST, 'fonts'));
    expect(fonts.filter((f) => f.includes('plex-mono'))).toEqual([]);
  });

  test('Auf der Startseite steht keine zweistellige Dekonummer', async ({ page }) => {
    await page.goto('/');
    const texts = await page.locator('span, i, em').allInnerTexts();
    const deko = texts.filter((t) => /^0\d$/.test(t.trim()));
    expect(deko, `Dekonummern gefunden: ${deko.join(', ')}`).toEqual([]);
  });
});

test.describe('Relaunch – Bilder', () => {
  test('Alle Bilder laden auf den Kernseiten tatsächlich', async ({ page }) => {
    for (const path of ['/', '/arbeiten/', '/branchen/', '/agentur/', '/leistungen/']) {
      await page.goto(path);
      // Lazy-Bilder deterministisch anfordern und auf das Dekodieren warten.
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map(async (img) => {
            img.loading = 'eager';
            try {
              await img.decode();
            } catch {
              /* fehlerhafte Bilder fallen unten auf */
            }
          }),
        );
      });
      await page.waitForLoadState('networkidle');
      const broken = await page.evaluate(() =>
        [...document.images]
          .filter((i) => !i.complete || i.naturalWidth === 0)
          .map((i) => i.currentSrc || i.src),
      );
      expect(broken, `${path}: Bilder ohne Inhalt`).toEqual([]);
    }
  });

  test('Jedes Bild besitzt feste Maße (kein Layout Shift)', async ({ page }) => {
    await page.goto('/');
    const missing = await page.evaluate(() =>
      [...document.images]
        .filter((i) => !i.getAttribute('width') || !i.getAttribute('height'))
        .map((i) => i.getAttribute('src') ?? '(ohne src)'),
    );
    expect(missing).toEqual([]);
  });

  test('Keine gezeichnete Ersatzfigur und kein Platzhaltermotiv', () => {
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      if (html.includes('eliyah-portrait.svg')) hits.push(`${file}: Porträt-Platzhalter`);
      if (html.includes('hero__placeholder')) hits.push(`${file}: leere Heldenfläche`);
    }
    expect(hits).toEqual([]);
  });
});

test.describe('Relaunch – Sichtbarkeit beim Scrollen', () => {
  test('Alle Reveal-Abschnitte werden beim Scrollen sichtbar', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 300) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 100));
      }
    });
    await expect
      .poll(
        () =>
          page.evaluate(
            () =>
              [...document.querySelectorAll('.reveal')].filter(
                (e) => !e.classList.contains('is-visible'),
              ).length,
          ),
        { message: 'Reveal-Abschnitte bleiben unsichtbar', timeout: 10_000 },
      )
      .toBe(0);

    const count = await page.locator('.reveal').count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Relaunch – Aussagenband und Projekt-Schlagworte', () => {
  test('Unter dem Hero folgt kein zweites Aussagenband mehr', async ({ page }) => {
    await page.goto('/');
    // Der Vollbild-Hero trägt die Aussage selbst; ein zweites großes Band
    // direkt darunter wäre eine Wiederholung.
    await expect(page.locator('.statement')).toHaveCount(0);
    // Marquee gab es nie und soll es nicht geben.
    await expect(page.locator('.marquee, [data-marquee]')).toHaveCount(0);
    await expect(page.locator('[data-band]')).toHaveCount(0);
  });

  test('Projekte tragen ruhige Schlagworte in normaler Schreibweise', async ({ page }) => {
    await page.goto('/');
    const tags = page.locator('.wf__tags .tag');
    expect(await tags.count()).toBeGreaterThan(2);
    for (const text of await tags.allInnerTexts()) {
      expect(text.trim()).not.toBe(text.trim().toUpperCase());
    }
    const transform = await tags.first().evaluate((el) => getComputedStyle(el).textTransform);
    expect(transform).toBe('none');
  });
});
