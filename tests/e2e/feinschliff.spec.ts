import { test, expect } from '@playwright/test';

/**
 * Abschließende visuelle Qualitätsprüfung.
 *
 * Diese Datei sichert genau die Punkte ab, die in der Sichtprüfung
 * beanstandet wurden: türkise Unterstreichungen unter Textzeilen, ein
 * fehlendes Leerzeichen zwischen zwei markierten Wörtern, verrutschte
 * Überschriften im Branchenraster und große leere Flächen neben kurzen
 * Überschriften.
 */

const NEON = 'rgb(0, 227, 242)';

const SERVICE_PAGES = [
  '/leistungen/websites/',
  '/leistungen/seo-geo/',
  '/leistungen/google-unternehmensprofil/',
  '/leistungen/unternehmensvideo/',
  '/leistungen/social-media/',
  '/leistungen/ki-automatisierung/',
];

const ALL_PAGES = [
  '/',
  '/leistungen/',
  ...SERVICE_PAGES,
  '/agentur/',
  '/branchen/',
  '/branchen/handwerk/',
  '/branchen/zahnarztpraxen/',
  '/branchen/gastronomie-hotels/',
  '/branchen/lokale-dienstleister/',
  '/branchen/b2b-mittelstand/',
  '/arbeiten/',
  '/kontakt/',
];

test.describe('Keine türkisen Unterstreichungen', () => {
  test('Kein Textelement trägt eine Neon-Linie an der Unterkante', async ({ page }) => {
    for (const path of ALL_PAGES) {
      await page.goto(path);
      const hits = await page.evaluate((neon) => {
        const out: string[] = [];
        for (const el of document.querySelectorAll('main *')) {
          // Links dürfen unterstrichen sein – das ist eine Bedienhilfe,
          // keine Dekoration. Geprüft werden nur Nicht-Links.
          if (el.closest('a') || el.closest('button')) continue;
          const cs = getComputedStyle(el as HTMLElement);
          const width = parseFloat(cs.borderBottomWidth);
          // Ein umlaufender Rahmen ist keine Unterstreichung. Beanstandet
          // wird nur eine Linie, die ausschließlich unter dem Text sitzt.
          const onlyBottom = cs.borderTopWidth === '0px' && cs.borderTopColor !== neon;
          if (width > 0 && cs.borderBottomColor === neon && onlyBottom) {
            out.push(`${el.tagName.toLowerCase()}.${el.className}`);
          }
          if (cs.textDecorationLine.includes('underline') && cs.textDecorationColor === neon) {
            out.push(`${el.tagName.toLowerCase()}.${el.className} (text-decoration)`);
          }
        }
        return out;
      }, NEON);
      expect(hits, `${path}: türkise Unterstreichung`).toEqual([]);
    }
  });

  test('Die Ablaufschritte tragen ihre Linie über dem Wort', async ({ page }) => {
    for (const [path, selector] of [
      ['/leistungen/seo-geo/', '.seo__flowstep'],
      ['/leistungen/ki-automatisierung/', '.kflow__step'],
      ['/leistungen/unternehmensvideo/', '.vprod__item-title'],
    ] as const) {
      await page.goto(path);
      const first = page.locator(selector).first();
      await expect(first, `${path}: Schritt fehlt`).toBeVisible();
      const s = await first.evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          top: cs.borderTopColor,
          topWidth: parseFloat(cs.borderTopWidth),
          bottomWidth: parseFloat(cs.borderBottomWidth),
        };
      });
      expect(s.topWidth, `${path}: keine Linie über dem Wort`).toBeGreaterThan(0);
      expect(s.top, `${path}: Linie nicht in Markenfarbe`).toBe(NEON);
      expect(s.bottomWidth, `${path}: Linie unter dem Wort`).toBe(0);
    }
  });
});

test.describe('Begriffserklärung SEO und GEO', () => {
  test('Zwischen den beiden markierten Wörtern steht ein Leerzeichen', async ({ page }) => {
    await page.goto('/leistungen/seo-geo/');
    const text = await page.locator('.terms__text').innerText();
    expect(text).toContain('verstehen. GEO');
    expect(text).not.toContain('verstehen.GEO');
  });
});

test.describe('Branchenraster – gemeinsame Grundlinie', () => {
  for (const path of ['/', '/branchen/']) {
    test(`Auf ${path} stehen die Branchennamen einer Reihe auf einer Linie`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));

      const rows = await page.evaluate(() => {
        const cells = [...document.querySelectorAll('.igrid__cell')];
        const groups = new Map<number, { name: number; go: number }[]>();
        for (const cell of cells) {
          const cellTop = Math.round(cell.getBoundingClientRect().top);
          const name = cell.querySelector('.igrid__name');
          const go = cell.querySelector('.igrid__go');
          if (!name || !go) continue;
          const list = groups.get(cellTop) ?? [];
          list.push({
            // Letzte Zeile des Namens – zweizeilige Namen sitzen tiefer.
            name: Math.round(name.getBoundingClientRect().bottom),
            go: Math.round(go.getBoundingClientRect().top),
          });
          groups.set(cellTop, list);
        }
        return [...groups.values()];
      });

      expect(rows.length, 'Kein Branchenraster gefunden').toBeGreaterThan(0);
      for (const row of rows) {
        // Innerhalb einer Rasterzeile stehen Namensgrundlinie und Pfeil auf
        // derselben Höhe – auch beim Eintrag ohne Bildmotiv.
        const names = row.map((r) => r.name);
        const gos = row.map((r) => r.go);
        expect(
          Math.max(...names) - Math.min(...names),
          `Namen versetzt: ${names}`,
        ).toBeLessThanOrEqual(4);
        expect(Math.max(...gos) - Math.min(...gos), `Pfeile versetzt: ${gos}`).toBeLessThanOrEqual(
          4,
        );
      }
    });
  }

  test('Die Branche ohne Motiv trägt weder Rahmen noch graue Fläche', async ({ page }) => {
    await page.goto('/branchen/');
    const cell = page.locator('.igrid__link--nomedia').first();
    await expect(cell, 'Eintrag ohne Motiv fehlt').toBeVisible();
    const s = await cell.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        border: parseFloat(cs.borderTopWidth),
        images: el.querySelectorAll('img').length,
      };
    });
    expect(s.bg).toBe('rgba(0, 0, 0, 0)');
    expect(s.border).toBe(0);
    expect(s.images).toBe(0);
  });
});

test.describe('Keine großen Leerflächen neben kurzen Überschriften', () => {
  test('„Verwurzelt in Würzburg“ – der Text folgt direkt auf die Überschrift', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/agentur/');
    await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));
    const gap = await page.evaluate(() => {
      const t = document.querySelector('.region__title')?.getBoundingClientRect();
      const x = document.querySelector('.region__text')?.getBoundingClientRect();
      return t && x ? x.top - t.bottom : Number.NaN;
    });
    expect(gap).toBeGreaterThan(0);
    expect(gap, `Leerfläche zwischen Überschrift und Text: ${gap}px`).toBeLessThan(80);
  });

  test('„Was wir übernehmen“ – der Hinweis steht in derselben Spalte', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/leistungen/social-media/');
    await page.evaluate(() => document.documentElement.classList.remove('has-reveal'));
    const boxes = await page.evaluate(() => {
      const q = (s: string) => document.querySelector(s)?.getBoundingClientRect();
      const t = q('.sscope__title');
      const n = q('.sscope__note');
      const l = q('.sscope__list');
      return t && n && l
        ? { gap: n.top - t.bottom, sameColumn: Math.abs(n.left - t.left) < 4, listLeft: l.left }
        : null;
    });
    expect(boxes, 'Abschnitt nicht gefunden').not.toBeNull();
    expect(boxes!.sameColumn, 'Hinweis steht nicht unter der Überschrift').toBe(true);
    expect(boxes!.gap, `Leerfläche unter der Überschrift: ${boxes!.gap}px`).toBeLessThan(80);
    expect(boxes!.listLeft, 'Liste steht nicht in der zweiten Spalte').toBeGreaterThan(400);
  });
});
