import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Liquid Glass – Schaltflächen.
 *
 * Der Effekt liegt ausschließlich auf `.btn`. Diese Datei sichert ab, dass er
 * dort wirkt, dass er sonst nirgends auftaucht und dass Form, Typografie,
 * Kontrast, Fokus und Bedienbarkeit unverändert bleiben.
 */

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const NEON = 'rgb(0, 227, 242)';
const INK = 'rgb(16, 18, 20)';

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

/** Relative Luminanz nach WCAG. */
function luminance(rgb: string): number {
  const m = rgb.match(/\d+(\.\d+)?/g);
  if (!m) return 0;
  const [r, g, b] = m.slice(0, 3).map((v) => {
    const c = Number(v) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const BUTTON_PAGES = ['/', '/leistungen/', '/leistungen/websites/', '/kontakt/', '/agentur/'];

test.describe('Typografie und Form bleiben unverändert', () => {
  test('Alle Schaltflächen verwenden weiterhin die Body-Schrift', async ({ page }) => {
    for (const path of BUTTON_PAGES) {
      await page.goto(path);
      const fonts = await page.evaluate(() =>
        [...document.querySelectorAll('.btn')].map((el) => getComputedStyle(el).fontFamily),
      );
      expect(fonts.length, `${path} ohne Schaltfläche`).toBeGreaterThan(0);
      for (const f of fonts) {
        expect(f, `${path}: fremde Schrift`).toContain('Inter');
        expect(f, `${path}: Display-Schrift im Button`).not.toContain('Bricolage');
      }
    }
  });

  test('Kein Button hat einen Radius über 8px', async ({ page }) => {
    for (const path of BUTTON_PAGES) {
      await page.goto(path);
      const radii = await page.evaluate(() =>
        [...document.querySelectorAll('.btn')].flatMap((el) => {
          const cs = getComputedStyle(el);
          return [
            cs.borderTopLeftRadius,
            cs.borderTopRightRadius,
            cs.borderBottomLeftRadius,
            cs.borderBottomRightRadius,
          ];
        }),
      );
      for (const r of radii) {
        expect(r, `${path}: prozentualer Radius`).not.toContain('%');
        expect(parseFloat(r), `${path}: Radius ${r}`).toBeLessThanOrEqual(8);
      }
    }
  });

  test('Keine Pillenform im ausgelieferten Button-CSS', () => {
    const hits: string[] = [];
    for (const file of cssFiles()) {
      // Ausgenommen: der Barrierefreiheits-Schalter (Systemelement, kein
      // Marketingelement) und sein Kontrastsymbol.
      const css = readFileSync(file, 'utf8')
        .replace(/\.a11y[^{}]*\{[^}]*\}/g, '')
        .replace(/\s+/g, '');
      for (const token of ['border-radius:999px', 'border-radius:50%', 'border-radius:9999px']) {
        if (css.includes(token)) hits.push(`${file}: ${token}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Die Mindesthöhe bleibt erhalten', async ({ page }) => {
    for (const path of BUTTON_PAGES) {
      await page.goto(path);
      // Nur sichtbare Schaltflächen: Der CTA im mobilen Menü ist auf Desktop
      // ausgeblendet und hätte rechnerisch die Höhe 0.
      const heights = await page.evaluate(() =>
        [...document.querySelectorAll('.btn')]
          .filter((el) => (el as HTMLElement).offsetParent !== null)
          .map((el) => el.getBoundingClientRect().height),
      );
      expect(heights.length, `${path} ohne sichtbare Schaltfläche`).toBeGreaterThan(0);
      for (const h of heights) expect(h, `${path}: Button ${h}px hoch`).toBeGreaterThanOrEqual(44);
    }
  });
});

test.describe('Farbrollen je Untergrund', () => {
  test('Primärbutton auf heller Fläche: Cyan-Fläche, schwarzer Text', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('.site-header__cta').first();
    const s = await cta.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color };
    });
    expect(s.bg).toBe(NEON);
    expect(s.color).toBe(INK);
    expect(contrast(s.bg, s.color)).toBeGreaterThanOrEqual(4.5);
  });

  test('Primärbutton auf der Cyan-Fläche: dunkle Fläche, Cyan-Text', async ({ page }) => {
    await page.goto('/');
    const cta = page.locator('.section--cyan .btn--primary').first();
    const s = await cta.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color };
    });
    expect(s.color).toBe(NEON);
    expect(luminance(s.bg), 'Fläche nicht dunkel genug').toBeLessThan(0.1);
    expect(contrast(s.bg, s.color)).toBeGreaterThanOrEqual(4.5);
  });

  test('Sekundärbutton auf heller Fläche: halbtransparent, dunkler Text', async ({ page }) => {
    await page.goto('/404.html');
    const btn = page.locator('.btn--secondary').first();
    const s = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color, border: cs.borderTopColor };
    });
    const alpha = Number(s.bg.match(/[\d.]+/g)?.[3] ?? '1');
    expect(alpha, 'Fläche ist nicht durchscheinend').toBeLessThan(1);
    expect(alpha, 'Fläche ist unsichtbar').toBeGreaterThan(0);
    expect(luminance(s.color), 'Text nicht dunkel').toBeLessThan(0.15);
    expect(Number(s.border.match(/[\d.]+/g)?.[3] ?? '1'), 'Kante unsichtbar').toBeGreaterThan(0.1);
  });

  test('Sekundärbutton auf dunkler Fläche: heller Text, sichtbare Kante', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('[data-hero] .btn--secondary').first();
    const s = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color, border: cs.borderTopColor };
    });
    expect(luminance(s.color), 'Text nicht hell').toBeGreaterThan(0.6);
    const borderAlpha = Number(s.border.match(/[\d.]+/g)?.[3] ?? '1');
    expect(borderAlpha, 'Kante unsichtbar').toBeGreaterThan(0.1);
    // Rauchglas: durchscheinend, keine deckende graue Plastikfläche.
    expect(Number(s.bg.match(/[\d.]+/g)?.[3] ?? '1')).toBeLessThan(0.35);
  });

  test('Es gibt weiterhin nur ein Türkis', () => {
    const suspicious: string[] = [];
    for (const file of cssFiles()) {
      const css = readFileSync(file, 'utf8');
      for (const m of css.matchAll(/#([0-9a-f]{6})\b/gi)) {
        const hex = m[1].toLowerCase();
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        if (b > r + 40 && g > r + 40 && Math.abs(g - b) < 90 && hex !== '00e3f2') {
          suspicious.push(`${file}: #${hex}`);
        }
      }
      // Auch als rgb()-Wert darf kein zweiter Türkiston auftauchen.
      for (const m of css.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)/g)) {
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
        const teal = b > r + 40 && g > r + 40 && Math.abs(g - b) < 90;
        if (teal && !(r === 0 && g === 227 && b === 242)) suspicious.push(`${file}: ${m[0]})`);
      }
    }
    expect(suspicious).toEqual([]);
  });
});

test.describe('Glasebenen stören die Bedienung nicht', () => {
  test('Die Pseudo-Ebenen nehmen keine Klicks an', async ({ page }) => {
    await page.goto('/');
    const s = await page
      .locator('.btn')
      .first()
      .evaluate((el) => ({
        before: getComputedStyle(el, '::before').pointerEvents,
        after: getComputedStyle(el, '::after').pointerEvents,
        beforeZ: getComputedStyle(el, '::before').zIndex,
        afterZ: getComputedStyle(el, '::after').zIndex,
        isolation: getComputedStyle(el).isolation,
      }));
    expect(s.before).toBe('none');
    expect(s.after).toBe('none');
    // Negative Ebene: liegt über der Fläche, aber unter der Schrift.
    expect(Number(s.beforeZ)).toBeLessThan(0);
    expect(Number(s.afterZ)).toBeLessThan(0);
    expect(s.isolation).toBe('isolate');
  });

  test('Der Fokusring bleibt sichtbar', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('[data-hero] .btn--primary').first();
    await btn.evaluate((el) => el.focus());
    const s = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { width: cs.outlineWidth, style: cs.outlineStyle, color: cs.outlineColor };
    });
    expect(parseFloat(s.width)).toBeGreaterThanOrEqual(3);
    expect(s.style).not.toBe('none');
  });

  test('Kein Schaltflächentext wird abgeschnitten', async ({ page }) => {
    for (const [w, h] of [
      [1440, 900],
      [390, 844],
      [360, 780],
    ] as const) {
      await page.setViewportSize({ width: w, height: h });
      for (const path of BUTTON_PAGES) {
        await page.goto(path);
        const clipped = await page.evaluate(() =>
          [...document.querySelectorAll('.btn')]
            .filter((el) => el.scrollWidth > el.clientWidth + 1)
            .map((el) => el.textContent?.trim()),
        );
        expect(clipped, `${path} bei ${w}px`).toEqual([]);
      }
    }
  });

  test('Kein waagerechter Überlauf bei 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 780 });
    for (const path of BUTTON_PAGES) {
      await page.goto(path);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(over, `${path}: ${over}px Überlauf`).toBeLessThanOrEqual(1);
    }
  });

  test('Hover verändert das Layout nicht', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const btn = page.locator('[data-hero] .btn--primary').first();
    const read = () =>
      page.evaluate(() => {
        const el = document.querySelector('[data-hero] .btn--primary') as HTMLElement;
        const next = el.nextElementSibling as HTMLElement;
        return {
          w: el.offsetWidth,
          h: el.offsetHeight,
          top: el.offsetTop,
          left: el.offsetLeft,
          nextLeft: next?.offsetLeft ?? 0,
          nextTop: next?.offsetTop ?? 0,
          page: document.body.scrollHeight,
        };
      });
    const before = await read();
    await btn.hover();
    await page.waitForTimeout(320);
    expect(await read()).toEqual(before);
  });
});

test.describe('Bewegung und Bedienpräferenzen', () => {
  test('Reduzierte Bewegung stoppt jede Bewegung, die Fassung bleibt', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');

    // Große Schaltfläche: Der Glanz läuft nicht mehr, die Chromfassung bleibt
    // sichtbar – sie ist Material, kein Bewegungselement.
    const gross = page.locator('.hero__ctas .btn--primary').first();
    await gross.hover();
    await page.waitForTimeout(200);
    const g = await gross.evaluate((el) => ({
      animation: getComputedStyle(el, '::after').animationName,
      opacity: getComputedStyle(el, '::after').opacity,
      transform: getComputedStyle(el).transform,
    }));
    expect(g.animation, 'Glanz läuft trotz reduzierter Bewegung').toBe('none');
    expect(Number(g.opacity), 'Chromfassung verschwindet').toBe(1);
    expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(g.transform);

    // Ruhige Schaltfläche: Die Spiegelung bleibt vollständig unsichtbar.
    const ruhig = page.locator('.site-header__cta').first();
    await ruhig.hover();
    await page.waitForTimeout(200);
    const r = await ruhig.evaluate((el) => ({
      animation: getComputedStyle(el, '::after').animationName,
      opacity: getComputedStyle(el, '::after').opacity,
    }));
    expect(r.animation).toBe('none');
    expect(Number(r.opacity)).toBe(0);
    await ctx.close();
  });

  test('Die Flächenspiegelung läuft nie ohne Hover', () => {
    const css = cssFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n')
      .replace(/\s+/g, ' ');
    expect(css, 'Flächenspiegelung fehlt').toContain('ks-glass-sheen');

    // `ks-glass-sheen` läuft über die Fläche und darf nur beim Hover starten.
    // `ks-rim-shine` läuft dauerhaft, sitzt aber ausschließlich auf dem Rand
    // der großen Schaltflächen – das ist der gewünschte Glanz.
    const withoutHover: string[] = [];
    for (const m of css.matchAll(/([^{}]+)\{[^{}]*ks-glass-sheen[^{}]*\}/g)) {
      const selector = m[1].split('}').pop()!.trim();
      if (selector.includes('@keyframes')) continue;
      if (!selector.includes(':hover')) withoutHover.push(selector);
    }
    expect(withoutHover, 'Flächenspiegelung läuft ohne Hover').toEqual([]);
  });

  test('Der Randglanz läuft nur auf den großen Schaltflächen', () => {
    const css = cssFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n')
      .replace(/\s+/g, ' ');
    expect(css, 'Randglanz fehlt').toContain('ks-rim-shine');

    const fremde: string[] = [];
    for (const m of css.matchAll(/([^{}]+)\{[^{}]*ks-rim-shine[^{}]*\}/g)) {
      const selector = m[1].split('}').pop()!.trim();
      if (selector.includes('@keyframes')) continue;
      const gross = selector.includes('.hero__ctas') || selector.includes('.cta__actions');
      if (!gross) fremde.push(selector);
    }
    expect(fremde, 'Randglanz auch außerhalb der großen Schaltflächen').toEqual([]);
  });

  test('Der Randglanz bewegt sich tatsächlich', async ({ page }) => {
    await page.goto('/');
    const btn = page.locator('.hero__ctas .btn--primary').first();
    const lies = () => btn.evaluate((el) => getComputedStyle(el, '::after').backgroundPosition);
    const a = await lies();
    await page.waitForTimeout(700);
    const b = await lies();
    expect(a, 'Randglanz steht still').not.toBe(b);
  });

  test('Auf den ruhigen Schaltflächen ist im Ruhezustand nichts sichtbar', async ({ page }) => {
    await page.goto('/');
    const s = await page.evaluate(() =>
      [...document.querySelectorAll('.btn')]
        .filter((el) => !el.closest('.hero__ctas') && !el.closest('.cta__actions'))
        .map((el) => ({
          animation: getComputedStyle(el, '::after').animationName,
          opacity: getComputedStyle(el, '::after').opacity,
        })),
    );
    expect(s.length).toBeGreaterThan(0);
    for (const one of s) {
      expect(one.animation, 'Spiegelung läuft im Ruhezustand').toBe('none');
      expect(Number(one.opacity), 'Spiegelung im Ruhezustand sichtbar').toBe(0);
    }
  });

  test('Deaktivierte Schaltflächen reagieren nicht auf Hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/kontakt/');
    const btn = page.locator('form .btn--primary').first();
    await btn.evaluate((el: HTMLButtonElement) => {
      el.disabled = true;
    });
    const rest = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color, transform: cs.transform };
    });
    await btn.hover({ force: true });
    await page.waitForTimeout(320);
    const hovered = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        bg: cs.backgroundColor,
        color: cs.color,
        transform: cs.transform,
        animation: getComputedStyle(el, '::after').animationName,
        opacity: cs.opacity,
      };
    });
    expect(hovered.bg, 'Fläche ändert sich beim Hover').toBe(rest.bg);
    expect(hovered.color, 'Schrift ändert sich beim Hover').toBe(rest.color);
    expect(hovered.transform, 'Button bewegt sich').toBe(rest.transform);
    expect(hovered.animation, 'Spiegelung läuft').toBe('none');
    expect(Number(hovered.opacity), 'nicht sichtbar abgeschwächt').toBeLessThan(0.8);
  });
});

test.describe('Metall sitzt nur auf dem Rand', () => {
  const GROSS = ['.hero__ctas .btn--primary', '.hero__ctas .btn--secondary', '.cta__actions .btn'];
  const RUHIG = ['.site-header__cta'];

  test('Nur die großen Schaltflächen tragen die Chromfassung', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const lies = (sel: string) =>
      page
        .locator(sel)
        .first()
        .evaluate((el) => {
          const cs = getComputedStyle(el, '::after');
          return {
            maske: cs.maskImage || cs.webkitMaskImage || 'none',
            komposit: cs.maskComposite || cs.webkitMaskComposite || 'none',
            padding: parseFloat(cs.paddingTop),
            animation: cs.animationName,
          };
        });

    for (const sel of GROSS) {
      const s = await lies(sel);
      // Zwei Maskenebenen plus Ausschluss ergeben den Ring.
      const ebenen = (s.maske.match(/gradient\(/g) ?? []).length;
      expect(ebenen, `${sel}: keine Ringmaske`).toBe(2);
      // Der Browser meldet den Modus je Maskenebene: „exclude, exclude“.
      for (const modus of s.komposit.split(',').map((m) => m.trim())) {
        expect(['exclude', 'xor'], `${sel}: falscher Maskenmodus`).toContain(modus);
      }
      expect(s.padding, `${sel}: keine Ringdicke`).toBeGreaterThan(0);
      expect(s.animation, `${sel}: kein laufender Glanz`).toBe('ks-rim-shine');
    }

    for (const sel of RUHIG) {
      const s = await lies(sel);
      expect(s.maske, `${sel}: trägt eine Chromfassung`).toBe('none');
      expect(s.animation, `${sel}: Glanz läuft`).toBe('none');
    }
  });

  test('Die ruhigen Schaltflächen bleiben ohne Fassung', async ({ page }) => {
    for (const [path, selector] of [
      ['/kontakt/', 'form .btn--primary'],
      ['/404.html', '.btn--secondary'],
    ] as const) {
      await page.goto(path);
      const s = await page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const cs = getComputedStyle(el, '::after');
          return {
            maske: cs.maskImage || cs.webkitMaskImage || 'none',
            animation: cs.animationName,
          };
        });
      expect(s.maske, `${path}: ${selector} trägt eine Chromfassung`).toBe('none');
      expect(s.animation, `${path}: ${selector} glänzt`).toBe('none');
    }
  });

  test('Die Fläche bleibt flach – kein Verlauf quer darüber', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    for (const sel of GROSS) {
      const layers = await page
        .locator(sel)
        .first()
        .evaluate(
          (el) =>
            getComputedStyle(el, '::before')
              .backgroundImage.split(/,(?![^(]*\))/)
              .filter((s) => s.includes('gradient')).length,
        );
      // Genau eine ruhige Lichtebene, keine gerichtete Bänderung darüber.
      expect(layers, `${sel}: Verlauf auf der Fläche`).toBe(1);
    }
  });

  test('Die Markenfarbe bleibt unter der Fassung exakt erhalten', async ({ page }) => {
    await page.goto('/');
    const bg = await page
      .locator('.hero__ctas .btn--primary')
      .first()
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bg).toBe(NEON);
  });

  test('Die Fassung bleibt rechteckig und läuft nicht über den Button hinaus', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    for (const sel of GROSS) {
      const s = await page
        .locator(sel)
        .first()
        .evaluate((el) => {
          const cs = getComputedStyle(el, '::after');
          return {
            radius: cs.borderTopLeftRadius,
            top: cs.top,
            left: cs.left,
            overflow: getComputedStyle(el).overflow,
          };
        });
      expect(parseFloat(s.radius), `${sel}: Fassung zu rund`).toBeLessThanOrEqual(8);
      expect(s.radius, `${sel}: prozentualer Radius`).not.toContain('%');
      // Bündig am Rand, nicht darüber hinaus.
      expect(parseFloat(s.top), `${sel}: Fassung ragt heraus`).toBe(0);
      expect(parseFloat(s.left), `${sel}: Fassung ragt heraus`).toBe(0);
      expect(s.overflow, `${sel}: Fassung nicht beschnitten`).toBe('hidden');
    }
  });
});

test.describe('Der Effekt bleibt auf Schaltflächen beschränkt', () => {
  test('Hamburger, Textlinks und FAQ-Toggles bekommen kein Glas', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const others = await page.evaluate(() => {
      const out: { sel: string; backdrop: string; isolation: string; sheen: string }[] = [];
      const check = (sel: string) => {
        for (const el of document.querySelectorAll(sel)) {
          if (el.classList.contains('btn')) continue;
          const cs = getComputedStyle(el);
          out.push({
            sel,
            backdrop: cs.backdropFilter || cs.webkitBackdropFilter || 'none',
            isolation: cs.isolation,
            sheen: getComputedStyle(el, '::after').animationName,
          });
        }
      };
      check('[data-menu-toggle]');
      check('.link-arrow');
      check('.faq__summary');
      check('.site-nav a');
      check('footer a');
      return out;
    });
    expect(others.length, 'keine Vergleichselemente gefunden').toBeGreaterThan(0);
    for (const o of others) {
      expect(o.backdrop, `${o.sel} hat Hintergrund-Blur`).toBe('none');
      expect(o.isolation, `${o.sel} bildet eine Glasebene`).toBe('auto');
      expect(o.sheen, `${o.sel} hat eine Spiegelung`).toBe('none');
    }
  });

  test('Kein Abschnitt und keine Karte bekommt eine Glasfläche', async ({ page }) => {
    for (const path of BUTTON_PAGES) {
      await page.goto(path);
      const glass = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .filter((el) => {
            const cs = getComputedStyle(el);
            const bf = cs.backdropFilter || cs.webkitBackdropFilter || 'none';
            return bf !== 'none' && !el.classList.contains('btn');
          })
          .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
      );
      expect(glass, `${path}: Glas außerhalb der Schaltflächen`).toEqual([]);
    }
  });
});

test.describe('Kein Fremdcode, kein aggressiver Filter', () => {
  test('Weder React noch Tailwind, shadcn, Radix oder CVA sind installiert', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    const forbidden = [
      'react',
      'react-dom',
      '@astrojs/react',
      'tailwindcss',
      '@astrojs/tailwind',
      'shadcn',
      'shadcn-ui',
      '@radix-ui/react-slot',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ];
    for (const f of forbidden) {
      expect(deps, `${f} ist installiert`).not.toContain(f);
    }
    for (const d of deps) {
      expect(d.startsWith('@radix-ui/'), `${d} ist eine Radix-Abhängigkeit`).toBe(false);
    }
  });

  test('Es gibt keine React-Buttonkomponente und keinen ui-Ordner', () => {
    expect(existsSync(join(ROOT, 'src/components/ui'))).toBe(false);
    const tsx = walk(join(ROOT, 'src'), (n) => n.endsWith('.tsx') || n.endsWith('.jsx'));
    expect(tsx).toEqual([]);
  });

  test('Der Build enthält keinen doppelten SVG-Filter und kein feTurbulence', () => {
    const ids = new Map<string, number>();
    const hits: string[] = [];
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      for (const m of html.matchAll(/<filter[^>]*\sid="([^"]+)"/g)) {
        ids.set(m[1], (ids.get(m[1]) ?? 0) + 1);
      }
      if (/feTurbulence|feDisplacementMap/.test(html)) hits.push(file);
    }
    for (const [id, count] of ids) {
      expect(count, `SVG-Filter "${id}" kommt ${count}-mal vor`).toBeLessThanOrEqual(1);
    }
    expect(hits, 'Verzerrungsfilter im Build').toEqual([]);
  });

  test('Nirgends steht eine Verzerrung mit scale 70', () => {
    const all = [...htmlFiles(), ...cssFiles()].map((f) => readFileSync(f, 'utf8')).join('\n');
    expect(all).not.toMatch(/feDisplacementMap[^>]*scale=["']?\s*(?:[1-9]\d|70)/);
  });

  test('Die Buttonoberfläche liegt in genau einer eigenen CSS-Datei', () => {
    expect(existsSync(join(ROOT, 'src/styles/button-metal.css'))).toBe(true);
    expect(existsSync(join(ROOT, 'src/styles/liquid-glass.css'))).toBe(false);
    const layout = readFileSync(join(ROOT, 'src/layouts/BaseLayout.astro'), 'utf8');
    const globalAt = layout.indexOf('styles/global.css');
    const metalAt = layout.indexOf('styles/button-metal.css');
    expect(metalAt, 'button-metal.css wird nicht eingebunden').toBeGreaterThan(-1);
    expect(metalAt, 'button-metal.css steht vor global.css').toBeGreaterThan(globalAt);
  });

  test('Die Schaltflächen tragen kein Milchglas mehr', () => {
    // Liquid Glass wurde verworfen: kein `backdrop-filter` auf Buttons.
    const css = cssFiles()
      .map((f) => readFileSync(f, 'utf8'))
      .join('\n');
    expect(css, 'backdrop-filter im ausgelieferten CSS').not.toContain('backdrop-filter');
  });

  test('Es wird kein zusätzliches Skript für den Effekt ausgeliefert', () => {
    const inline: string[] = [];
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      if (/on(?:mouse|pointer|touch)[a-z]+=/i.test(html)) inline.push(file);
    }
    expect(inline, 'Inline-Eventhandler im Build').toEqual([]);
  });
});

test.describe('Deckende Flächen ohne Blur', () => {
  test('Die Sekundärflächen sind auch ohne Hintergrund-Blur lesbar', async ({ page }) => {
    // Ohne `backdrop-filter` muss die Fläche selbst genug Deckung mitbringen.
    await page.goto('/404.html');
    const s = await page
      .locator('.btn--secondary')
      .first()
      .evaluate((el) => {
        const cs = getComputedStyle(el);
        return { bg: cs.backgroundColor, blur: cs.backdropFilter || 'none' };
      });
    expect(s.blur, 'Button traegt noch einen Blur').toBe('none');
    const alpha = Number(s.bg.match(/[\d.]+/g)?.[3] ?? '1');
    expect(alpha, 'Flaeche zu durchsichtig ohne Blur').toBeGreaterThanOrEqual(0.6);
  });
});
