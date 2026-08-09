import { test, expect } from '@playwright/test';

/**
 * Starker Browserzoom und Bildqualität.
 *
 * Zoom lässt sich in Chromium headless nicht direkt setzen; wirksam ist er
 * aber ohnehin eine Verkleinerung des CSS-Viewports. 200 % bei 1440 × 900
 * entspricht daher 720 × 450 – genau so wird hier geprüft.
 */

const ROUTEN = [
  '/',
  '/leistungen/',
  '/leistungen/websites/',
  '/leistungen/seo-geo/',
  '/leistungen/ki-automatisierung/',
  '/arbeiten/',
  '/branchen/',
  '/branchen/handwerk/',
  '/branchen/zahnarztpraxen/',
  '/agentur/',
  '/prozess/',
  '/faq/',
  '/kontakt/',
  '/impressum/',
  '/datenschutz/',
  '/barrierefreiheit/',
  '/agb/',
];

const ZOOMSTUFEN = [
  { name: '125 %', width: 1152, height: 720 },
  { name: '150 %', width: 960, height: 600 },
  { name: '200 %', width: 720, height: 450 },
];

test.describe('Starker Browserzoom', () => {
  for (const z of ZOOMSTUFEN) {
    test(`Kein waagerechter Überlauf bei ${z.name}`, async ({ page }) => {
      await page.setViewportSize({ width: z.width, height: z.height });
      const befunde: string[] = [];
      for (const route of ROUTEN) {
        await page.goto(route);
        await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));
        const over = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        if (over > 1) befunde.push(`${route}: ${over}px`);
      }
      expect(befunde, `Überlauf bei ${z.name}: ${befunde.join(', ')}`).toEqual([]);
    });
  }

  test('Bei 200 % bleibt der Barrierefreiheits-Schalter bedienbar', async ({ page }) => {
    await page.setViewportSize({ width: 720, height: 450 });
    await page.goto('/');
    const knopf = page.locator('[data-a11y-toggle]');
    await expect(knopf).toBeVisible();
    const box = (await knopf.boundingBox())!;
    // Vollständig im sichtbaren Bereich, nicht halb außerhalb.
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(450 + 1);
    await knopf.click();
    await expect(page.locator('[data-a11y-panel]')).toBeVisible();
  });

  test('Der Schalter verdeckt keinen Fließtext', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/impressum/');
    const box = (await page.locator('[data-a11y-toggle]').boundingBox())!;
    const verdeckt = await page.evaluate(
      ({ x, y }) => {
        const el = document.elementFromPoint(x, y);
        // Unter dem Schalter darf kein Textknoten des Hauptinhalts liegen.
        return el?.closest('main p, main li, main h1, main h2') !== null;
      },
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    expect(verdeckt, 'Der Schalter liegt über dem Fließtext').toBe(false);
  });
});

test.describe('Bilder', () => {
  const BILDSEITEN = [
    '/',
    '/branchen/',
    '/branchen/handwerk/',
    '/branchen/zahnarztpraxen/',
    '/branchen/gastronomie-hotels/',
    '/branchen/lokale-dienstleister/',
    '/branchen/b2b-mittelstand/',
    '/leistungen/websites/',
    '/leistungen/seo-geo/',
    '/leistungen/social-media/',
    '/leistungen/unternehmensvideo/',
    '/agentur/',
    '/kontakt/',
    '/arbeiten/',
  ];

  test('Jedes sichtbare Bild lädt und trägt feste Maße', async ({ page }) => {
    const befunde: string[] = [];
    for (const route of BILDSEITEN) {
      await page.goto(route);
      await page.evaluate(async () => {
        await Promise.all(
          [...document.images].map(async (i) => {
            i.loading = 'eager';
            try {
              await i.decode();
            } catch {
              /* fällt unten als naturalWidth 0 auf */
            }
          }),
        );
      });
      const s = await page.evaluate(() =>
        [...document.images].map((i) => ({
          src: i.getAttribute('src') ?? '?',
          natural: i.naturalWidth,
          hatMasse: Boolean(i.getAttribute('width') && i.getAttribute('height')),
          alt: i.getAttribute('alt'),
          inPicture: Boolean(i.closest('picture')),
          quellen: [...(i.closest('picture')?.querySelectorAll('source') ?? [])].map((q) =>
            q.getAttribute('type'),
          ),
        })),
      );
      for (const b of s) {
        if (b.natural === 0) befunde.push(`${route} ${b.src}: lädt nicht`);
        if (!b.hatMasse) befunde.push(`${route} ${b.src}: ohne width/height`);
        if (b.alt === null) befunde.push(`${route} ${b.src}: ohne alt-Attribut`);
        // Fotos aus dem Register kommen als <picture> mit AVIF und WebP.
        if (b.inPicture) {
          if (!b.quellen.includes('image/avif')) befunde.push(`${route} ${b.src}: kein AVIF`);
          if (!b.quellen.includes('image/webp')) befunde.push(`${route} ${b.src}: kein WebP`);
        }
      }
    }
    expect(befunde, befunde.join(' | ')).toEqual([]);
  });

  test('Alt-Texte beschreiben das Motiv statt Suchbegriffe zu stapeln', async ({ page }) => {
    await page.goto('/branchen/');
    const alts = await page.evaluate(() =>
      [...document.images].map((i) => i.getAttribute('alt') ?? ''),
    );
    for (const alt of alts) {
      if (!alt) continue; // dekorativ
      expect(alt.length, `Alt-Text zu lang: ${alt}`).toBeLessThan(125);
      // Kein Keyword-Stapel wie „Webdesign Würzburg Agentur Website“.
      expect(alt, `Keyword-Stapel im Alt-Text: ${alt}`).not.toMatch(/Webdesign|Agentur Würzburg/i);
    }
  });
});
