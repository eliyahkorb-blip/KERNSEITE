import { test, expect } from '@playwright/test';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

/**
 * Das Branchenmotiv für Zahnarztpraxen.
 *
 * Die Branche stand lange ohne Bild, weil die erste Lieferung an dieser
 * Stelle das Handwerksfoto enthielt. Diese Prüfungen halten fest, dass das
 * Feld gefüllt ist, dass dort das eigene Motiv liegt und dass die
 * Behandlungssituation im sichtbaren Ausschnitt bleibt.
 */

const ROOT = process.cwd();
const WIDTHS = [640, 960, 1280, 1600] as const;
/** Das frühere, mit dem Handwerksbild identische Zahnarztbild. */
const HANDWERK_MD5 = '96484aad8868e10d38508b9df6580933';

function md5(path: string): string {
  return createHash('md5').update(readFileSync(path)).digest('hex');
}

test.describe('Zahnarztmotiv – Dateien', () => {
  test('Alle acht Varianten liegen als WebP und AVIF vor', () => {
    const fehlen: string[] = [];
    for (const w of WIDTHS) {
      for (const ext of ['webp', 'avif'] as const) {
        const rel = `public/assets/branchen/zahnarztpraxen-${w}.${ext}`;
        if (!existsSync(join(ROOT, rel))) fehlen.push(rel);
      }
    }
    expect(fehlen).toEqual([]);
  });

  test('Die Quelldatei ist nicht das Handwerksbild', () => {
    const quelle = join(ROOT, 'public/assets/branchen/source/zahnarztpraxen.jpg');
    expect(existsSync(quelle), 'Quelldatei fehlt').toBe(true);
    expect(md5(quelle), 'Zahnarztquelle ist byte-identisch mit dem Handwerksbild').not.toBe(
      HANDWERK_MD5,
    );
    const handwerk = join(ROOT, 'public/assets/branchen/source/handwerk.jpg');
    if (existsSync(handwerk)) expect(md5(quelle)).not.toBe(md5(handwerk));
  });

  test('Auch die ausgelieferten Varianten unterscheiden sich vom Handwerksmotiv', () => {
    for (const w of WIDTHS) {
      const zahn = join(ROOT, `public/assets/branchen/zahnarztpraxen-${w}.webp`);
      const hand = join(ROOT, `public/assets/branchen/handwerk-${w}.webp`);
      if (!existsSync(zahn) || !existsSync(hand)) continue;
      expect(md5(zahn), `${w} px: Handwerksbild als Zahnarztmotiv`).not.toBe(md5(hand));
    }
  });
});

test.describe('Zahnarztmotiv – Branchenraster', () => {
  for (const [breite, hoehe] of [
    [1440, 900],
    [390, 844],
  ] as const) {
    test(`Bei ${breite}×${hoehe} ist das Bildfeld gefüllt`, async ({ page }) => {
      await page.setViewportSize({ width: breite, height: hoehe });
      await page.goto('/branchen/');
      await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));

      const zelle = page.locator('.igrid__cell').filter({ hasText: 'Zahnarztpraxen' }).first();
      await expect(zelle, 'Zahnarzt-Eintrag fehlt').toBeVisible();

      // Kein leeres Bildfeld mehr: die Zelle trägt jetzt ein echtes Motiv.
      await expect(zelle.locator('.igrid__gap')).toHaveCount(0);
      const bild = zelle.locator('img');
      await expect(bild).toHaveCount(1);

      const s = await bild.evaluate(async (el: HTMLImageElement) => {
        el.loading = 'eager';
        try {
          await el.decode();
        } catch {
          /* fällt unten als naturalWidth 0 auf */
        }
        const r = el.getBoundingClientRect();
        return {
          natural: el.naturalWidth,
          alt: el.alt,
          width: el.getAttribute('width'),
          height: el.getAttribute('height'),
          quelle: el.currentSrc,
          seiten: r.width / r.height,
          fit: getComputedStyle(el).objectFit,
        };
      });

      expect(s.natural, 'Bild lädt nicht').toBeGreaterThan(0);
      expect(s.alt).toBe('Zahnärztliche Untersuchung einer Patientin in einer Praxis');
      expect(s.width, 'feste Breite fehlt (Layout Shift)').toBeTruthy();
      expect(s.height, 'feste Höhe fehlt (Layout Shift)').toBeTruthy();
      expect(s.quelle).toMatch(/zahnarztpraxen-\d+\.(avif|webp)$/);
      expect(s.quelle, 'Handwerksbild bei Zahnarztpraxen').not.toContain('handwerk');
      expect(s.fit).toBe('cover');
      expect(Math.abs(s.seiten - 4 / 3), `Seitenverhältnis ${s.seiten}`).toBeLessThan(0.05);
    });
  }

  test('Der Eintrag hat denselben Aufbau wie Handwerk und Gastronomie', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/branchen/');
    for (const name of ['Handwerk', 'Zahnarztpraxen', 'Gastronomie']) {
      const zelle = page.locator('.igrid__cell').filter({ hasText: name }).first();
      await expect(zelle.locator('img'), `${name}: Bild`).toHaveCount(1);
      await expect(zelle.locator('.igrid__name'), `${name}: Überschrift`).toHaveCount(1);
      await expect(zelle.locator('.igrid__arg'), `${name}: Beschreibung`).toHaveCount(1);
      await expect(zelle.locator('.igrid__go'), `${name}: Pfeil`).toHaveCount(1);
    }
  });

  test('picture, srcset und sizes werden verwendet', async ({ page }) => {
    await page.goto('/branchen/');
    const s = await page.evaluate(() => {
      const img = [...document.querySelectorAll<HTMLImageElement>('.igrid img')].find((i) =>
        i.src.includes('zahnarztpraxen'),
      );
      const pic = img?.closest('picture');
      const quellen = [...(pic?.querySelectorAll('source') ?? [])].map((q) => ({
        type: q.type,
        srcset: q.srcset,
        sizes: q.sizes,
      }));
      return { hatPicture: Boolean(pic), quellen };
    });
    expect(s.hatPicture, '<picture> fehlt').toBe(true);
    expect(s.quellen.map((q) => q.type)).toEqual(
      expect.arrayContaining(['image/avif', 'image/webp']),
    );
    for (const q of s.quellen) {
      for (const w of [640, 960, 1280, 1600]) expect(q.srcset).toContain(`${w}w`);
      expect(q.sizes, 'sizes fehlt').toBeTruthy();
    }
  });
});

test.describe('Zahnarztmotiv – Detailseite', () => {
  test('Das Motiv steht als Hauptbild auf /branchen/zahnarztpraxen/', async ({ page }) => {
    await page.goto('/branchen/zahnarztpraxen/');
    const bild = page.locator('.hero-img img').first();
    await expect(bild).toBeVisible();
    const s = await bild.evaluate(async (el: HTMLImageElement) => {
      el.loading = 'eager';
      try {
        await el.decode();
      } catch {
        /* siehe naturalWidth */
      }
      return { natural: el.naturalWidth, alt: el.alt, quelle: el.currentSrc };
    });
    expect(s.natural).toBeGreaterThan(0);
    expect(s.quelle).toContain('zahnarztpraxen-');
    expect(s.quelle).not.toContain('handwerk');
    expect(s.alt).toBe('Zahnärztliche Untersuchung einer Patientin in einer Praxis');
  });

  test('Das Bild füllt sein Fenster, statt oben bündig abzulaufen', async ({ page }) => {
    // Das Fenster ist 21:9, die Datei 4:3. Ragt das Bild über das Fenster
    // hinaus, wird es oben bündig abgeschnitten – die Behandlung läge dann
    // unterhalb der Kante.
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/branchen/zahnarztpraxen/');
    const s = await page
      .locator('.hero-img .photo')
      .first()
      .evaluate((f) => {
        const img = f.querySelector('img')!;
        const fr = f.getBoundingClientRect();
        const ir = img.getBoundingClientRect();
        return {
          ueberstand: Math.round(ir.height - fr.height),
          fit: getComputedStyle(img).objectFit,
        };
      });
    expect(s.fit).toBe('cover');
    expect(
      Math.abs(s.ueberstand),
      `Bild ragt ${s.ueberstand}px aus dem Fenster`,
    ).toBeLessThanOrEqual(1);
  });

  test('Kein waagerechter Überlauf auf schmalen Displays', async ({ page }) => {
    for (const breite of [360, 390, 430]) {
      await page.setViewportSize({ width: breite, height: 844 });
      await page.goto('/branchen/zahnarztpraxen/');
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${breite}px: waagerechter Überlauf`).toBeLessThanOrEqual(1);
    }
  });
});
