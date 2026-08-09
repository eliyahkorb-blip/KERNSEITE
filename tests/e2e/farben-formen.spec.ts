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

const cssFiles = () => walk(join(DIST, '_astro'), (n) => n.endsWith('.css'));
const htmlFiles = () => walk(DIST, (n) => n.endsWith('.html'));

const NEON = 'rgb(0, 227, 242)';

test.describe('Marke – nur das helle Neon-Türkis', () => {
  test('Die abgeschwächten Türkistöne kommen im Build nicht vor', () => {
    const forbidden = [
      '#006b73',
      '#00757d',
      'rgb(0, 107, 115)',
      'rgb(0,107,115)',
      'rgb(0, 117, 125)',
      'rgb(0,117,125)',
      '#0c3d42',
      '#0a6a73',
    ];
    const hits: string[] = [];
    for (const file of [...cssFiles(), ...htmlFiles()]) {
      const text = readFileSync(file, 'utf8').toLowerCase();
      for (const f of forbidden) if (text.includes(f)) hits.push(`${file}: ${f}`);
    }
    expect(hits).toEqual([]);
  });

  test('Die Tokens für abgeschwächtes Türkis existieren nicht mehr', () => {
    const hits: string[] = [];
    for (const file of cssFiles()) {
      const css = readFileSync(file, 'utf8');
      for (const token of ['--ks-cyan-dark', '--ks-cyan-text']) {
        if (css.includes(token)) hits.push(`${file}: ${token}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Kein weiterer Türkis-/Petrolton im ausgelieferten CSS', () => {
    // Alle Farben einsammeln und blaugrüne Töne prüfen: erlaubt ist nur das
    // Neon-Türkis. Ein abgeschwächtes Türkis hat einen deutlich dunkleren
    // Grünanteil bei gleichzeitig kleinem Rotanteil.
    const suspicious: string[] = [];
    for (const file of cssFiles()) {
      const css = readFileSync(file, 'utf8');
      for (const m of css.matchAll(/#([0-9a-f]{6})\b/gi)) {
        const hex = m[1].toLowerCase();
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        const teal = b > r + 40 && g > r + 40 && Math.abs(g - b) < 90;
        if (teal && hex !== '00e3f2') suspicious.push(`${file}: #${hex}`);
      }
    }
    expect(suspicious).toEqual([]);
  });

  test('Das Neon-Türkis wird tatsächlich verwendet', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('[data-hero] a.btn--primary').first();
    await expect(cta).toHaveCSS('background-color', NEON);
    await expect(cta).toHaveCSS('color', 'rgb(16, 18, 20)');
  });

  test('Markierte Wörter sind selbst cyan – ohne Linie und ohne Fläche', async ({ page }) => {
    for (const path of ['/', '/leistungen/', '/branchen/', '/prozess/']) {
      await page.goto(path);
      const words = page.locator('.accent-word');
      const count = await words.count();
      expect(count, `${path} ohne markiertes Wort`).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const s = await words.nth(i).evaluate((el) => {
          const cs = getComputedStyle(el);
          const before = getComputedStyle(el, '::before');
          const after = getComputedStyle(el, '::after');
          return {
            color: cs.color,
            line: cs.textDecorationLine,
            bg: cs.backgroundColor,
            bgImage: cs.backgroundImage,
            shadow: cs.boxShadow,
            borderBottom: cs.borderBottomWidth,
            beforeContent: before.content,
            afterContent: after.content,
          };
        });
        expect(s.color, `${path}: Wort ${i} nicht cyan`).toBe(NEON);
        expect(s.line, `${path}: Wort ${i} unterstrichen`).toBe('none');
        expect(s.bg, `${path}: Wort ${i} mit Fläche`).toBe('rgba(0, 0, 0, 0)');
        expect(s.bgImage, `${path}: Wort ${i} mit Verlauf`).toBe('none');
        expect(s.shadow, `${path}: Wort ${i} mit Schatten`).toBe('none');
        expect(s.borderBottom, `${path}: Wort ${i} mit Unterkante`).toBe('0px');
        expect(['none', 'normal']).toContain(s.beforeContent);
        expect(['none', 'normal']).toContain(s.afterContent);
      }
    }
  });

  test('Markierte Wörter stehen auf ausreichend dunklem Grund', async ({ page }) => {
    for (const path of ['/', '/leistungen/', '/branchen/', '/prozess/']) {
      await page.goto(path);
      const dark = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of document.querySelectorAll('.accent-word')) {
          // Nächste Fläche mit gesetztem Hintergrund suchen.
          let node: HTMLElement | null = el as HTMLElement;
          let bg = 'rgba(0, 0, 0, 0)';
          while (node && bg === 'rgba(0, 0, 0, 0)') {
            bg = getComputedStyle(node).backgroundColor;
            node = node.parentElement;
          }
          const m = bg.match(/\d+/g);
          if (!m) continue;
          const [r, g, b] = m.map(Number);
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          if (lum > 0.35) out.push(`${el.textContent} auf ${bg}`);
        }
        return out;
      });
      expect(dark, `${path}: Cyan auf zu heller Fläche`).toEqual([]);
    }
  });
});

test.describe('Formen – keine Pillen und keine kreisigen Chips', () => {
  test('Kein Pillen-Radius im ausgelieferten CSS', () => {
    const hits: string[] = [];
    for (const file of cssFiles()) {
      // Der Barrierefreiheits-Schalter ist ein funktionaler Systemschalter und
      // darf vollrund sein. Geprüft wird alles außerhalb seiner Regeln.
      const css = readFileSync(file, 'utf8')
        .replace(/\.a11y[^{}]*\{[^}]*\}/g, '')
        .replace(/\s+/g, '');
      if (css.includes('border-radius:999px')) hits.push(`${file}: 999px`);
      if (css.includes('--radius-pill')) hits.push(`${file}: --radius-pill`);
    }
    expect(hits).toEqual([]);
  });

  test('Marketing-Buttons sind rechteckig mit kleinem Radius', async ({ page }) => {
    await page.goto('/');
    const buttons = page.locator('a.btn');
    const count = await buttons.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const radius = await buttons
        .nth(i)
        .evaluate((el) => parseFloat(getComputedStyle(el).borderTopLeftRadius));
      expect(radius, `Button ${i} zu rund`).toBeLessThanOrEqual(8);
    }
  });

  test('Der primäre CTA hat die geforderte Höhe und Innenabstände', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('[data-hero] a.btn--primary').first();
    const box = await cta.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(48);
    const pad = await cta.evaluate((el) => parseFloat(getComputedStyle(el).paddingLeft));
    expect(pad).toBeGreaterThanOrEqual(20);
    const shadow = await cta.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toBe('none');
  });

  test('Schlagworte sind Text – ohne Rahmen, Fläche und Rundung', async ({ page }) => {
    await page.goto('/');
    const tags = page.locator('.tag');
    const count = await tags.count();
    expect(count).toBeGreaterThan(2);
    for (let i = 0; i < count; i++) {
      const s = await tags.nth(i).evaluate((el) => {
        const cs = getComputedStyle(el);
        return {
          radius: parseFloat(cs.borderTopLeftRadius),
          border: cs.borderTopWidth,
          bg: cs.backgroundColor,
        };
      });
      expect(s.radius, `Tag ${i} rund`).toBe(0);
      expect(s.border, `Tag ${i} mit Rahmen`).toBe('0px');
      expect(s.bg, `Tag ${i} mit Fläche`).toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('Keine kreisrunden Marketingflächen auf der Startseite', async ({ page }) => {
    await page.goto('/');
    const round = await page.evaluate(() => {
      const out: string[] = [];
      for (const el of document.querySelectorAll('main *')) {
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) continue;
        const radius = parseFloat(cs.borderTopLeftRadius);
        const isPercent = cs.borderTopLeftRadius.includes('%');
        const hasSurface =
          cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || parseFloat(cs.borderTopWidth) > 0;
        if (hasSurface && (isPercent || radius > 8)) {
          out.push(`${el.tagName.toLowerCase()}.${el.className} r=${cs.borderTopLeftRadius}`);
        }
      }
      return out;
    });
    expect(round).toEqual([]);
  });
});
