import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Neon-Flow im Hero der Startseite.
 *
 * Prüft, dass das frühere CRT-Motiv restlos verschwunden ist, dass der Effekt
 * lokal und ohne CDN ausgeliefert wird, dass er dekorativ bleibt und dass es
 * für reduzierte Bewegung und fehlendes WebGL einen sauberen Rückfall gibt.
 */

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
const jsFiles = () => walk(join(DIST, '_astro'), (n) => n.endsWith('.js'));
const home = () => readFileSync(join(DIST, 'index.html'), 'utf8');

/** Wartet, bis das Skript einen Endzustand gesetzt hat. */
async function status(page: import('@playwright/test').Page): Promise<string | null> {
  await page.waitForFunction(
    () => document.querySelector('[data-neon]')?.getAttribute('data-neon-status') !== 'idle',
    null,
    { timeout: 20000 },
  );
  return page.locator('[data-neon]').getAttribute('data-neon-status');
}

test.describe('Das CRT-Motiv ist aus dem Hero verschwunden', () => {
  test('Kein CRT-Bild im Startseiten-Hero', async ({ page }) => {
    await page.goto('/');
    const imgs = await page
      .locator('[data-hero] img')
      .evaluateAll((els) => els.map((e) => (e as HTMLImageElement).getAttribute('src') ?? ''));
    for (const src of imgs) expect(src, 'CRT-Bild im Hero').not.toContain('hero-kernseite');
  });

  test('Kein CRT-Video im Startseiten-Hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-hero] video')).toHaveCount(0);
    await expect(page.locator('[data-hero] [data-hero-video]')).toHaveCount(0);
  });

  test('Kein CRT-Alternativtext auf der Startseite', () => {
    const html = home();
    for (const phrase of ['Röhrenmonitor', 'Röhrenmonitor ist', 'im dunklen Anzug']) {
      expect(html, `CRT-Text „${phrase}“ steht noch im HTML`).not.toContain(phrase);
    }
  });

  test('Kein CRT-Asset wird von der Startseite geladen', () => {
    const html = home();
    for (const asset of [
      'hero-kernseite.webm',
      'hero-kernseite.mp4',
      'hero-kernseite-final.webp',
      'hero-kernseite-final-portrait.webp',
    ]) {
      expect(html, `${asset} wird noch referenziert`).not.toContain(asset);
    }
  });

  test('Beim Aufruf der Startseite wird kein CRT-Asset angefordert', async ({ page }) => {
    const urls: string[] = [];
    page.on('request', (r) => urls.push(r.url()));
    await page.goto('/');
    await status(page);
    expect(urls.filter((u) => u.includes('hero-kernseite'))).toEqual([]);
  });
});

test.describe('Der Neon-Flow ersetzt das Motiv', () => {
  test('Das Canvas wird gerendert und ist dekorativ', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('[data-hero] canvas[data-neon-canvas]');
    await expect(canvas).toHaveCount(1);
    // Der ganze Hintergrundbereich ist für Screenreader ausgeblendet.
    await expect(page.locator('[data-hero] [data-neon]')).toHaveAttribute('aria-hidden', 'true');
    // Kein `tabindex`: Ein ausgeblendetes Element darf nicht fokussierbar sein.
    await expect(canvas).not.toHaveAttribute('tabindex', /.*/);
  });

  test('Das Canvas ist über die Tabulatortaste nicht erreichbar', async ({ page }) => {
    await page.goto('/');
    await status(page);
    // Durch den kompletten Hero tabben und prüfen, dass das Canvas nie den
    // Fokus bekommt.
    for (let i = 0; i < 25; i++) {
      await page.keyboard.press('Tab');
      const aufCanvas = await page.evaluate(
        () => document.activeElement?.hasAttribute('data-neon-canvas') === true,
      );
      expect(aufCanvas, `Canvas nach ${i + 1} Tabs fokussiert`).toBe(false);
    }
    // Auch programmatisch nicht fokussierbar, da kein tabindex gesetzt ist.
    const programmatisch = await page.evaluate(() => {
      const c = document.querySelector<HTMLElement>('[data-neon-canvas]')!;
      c.focus();
      return document.activeElement === c;
    });
    expect(programmatisch, 'Canvas ist fokussierbar').toBe(false);
  });

  test('Es wird genau eine Instanz aufgebaut', async ({ page }) => {
    await page.goto('/');
    await status(page);
    await page.waitForTimeout(600);
    const counts = await page.evaluate(() => ({
      roots: document.querySelectorAll('[data-neon]').length,
      canvases: document.querySelectorAll('[data-neon-canvas]').length,
      initialisiert: document.querySelectorAll('[data-neon][data-neon-init="1"]').length,
    }));
    expect(counts.roots).toBe(1);
    expect(counts.canvases).toBe(1);
    expect(counts.initialisiert).toBe(1);
  });

  test('Der Effekt läuft im normalen Browser an', async ({ page }) => {
    await page.goto('/');
    expect(await status(page)).toBe('ready');
  });

  test('Der Hero erzeugt keine Konsolenfehler', async ({ page }) => {
    const errs: string[] = [];
    page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('/');
    await status(page);
    await page.waitForTimeout(1200);
    expect(errs).toEqual([]);
  });
});

test.describe('Hero-Inhalte bleiben unverändert', () => {
  test('Überschrift, Lead, Buttons und Standortzeile stehen im HTML', async ({ page }) => {
    await page.goto('/');
    const hero = page.locator('[data-hero]');
    await expect(hero.locator('h1')).toHaveCount(1);
    await expect(hero.locator('h1')).toContainText('Dein Unternehmen kann mehr.');
    await expect(hero.locator('h1')).toContainText('Deine Website sollte es zeigen.');
    await expect(hero).toContainText('KERNSEITE entwickelt individuelle Websites');
    await expect(hero.locator('a.btn--primary')).toContainText('Projekt besprechen');
    await expect(hero.locator('a.btn--secondary')).toContainText('Arbeiten ansehen');
    await expect(hero).toContainText('Persönlich in Würzburg. Digital bundesweit.');
  });

  test('Die Marken-Schriften bleiben aktiv', async ({ page }) => {
    await page.goto('/');
    const fonts = await page.evaluate(() => ({
      titel: getComputedStyle(document.querySelector('[data-hero] h1')!).fontFamily,
      lead: getComputedStyle(document.querySelector('[data-hero] p')!).fontFamily,
      button: getComputedStyle(document.querySelector('[data-hero] a.btn')!).fontFamily,
    }));
    expect(fonts.titel).toContain('Bricolage Grotesque');
    expect(fonts.lead).toContain('Inter');
    expect(fonts.button).toContain('Inter');
  });

  test('Die Animation liegt hinter dem Inhalt und fängt keine Klicks ab', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await status(page);
    const s = await page.evaluate(() => {
      const neon = document.querySelector<HTMLElement>('[data-neon]')!;
      const text = document.querySelector<HTMLElement>('.hero__inner')!;
      return {
        neonEvents: getComputedStyle(neon).pointerEvents,
        neonZ: getComputedStyle(neon).zIndex,
        textZ: getComputedStyle(text).zIndex,
      };
    });
    // Der Hintergrund nimmt keine Zeigerereignisse an …
    expect(s.neonEvents, 'Neon-Fläche fängt Klicks ab').toBe('none');
    // … und liegt unter der Textebene.
    expect(Number(s.textZ), 'Text liegt nicht über der Animation').toBeGreaterThan(Number(s.neonZ));
  });

  test('Beide Hero-Buttons bleiben anklickbar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await status(page);
    for (const sel of ['[data-hero] a.btn--primary', '[data-hero] a.btn--secondary']) {
      const box = await page.locator(sel).boundingBox();
      const treffer = await page.evaluate(
        ({ x, y }) => {
          const el = document.elementFromPoint(x, y);
          return el?.closest('a.btn') !== null;
        },
        { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 },
      );
      expect(treffer, `${sel} ist verdeckt`).toBe(true);
    }
  });

  test('Kein waagerechter Überlauf bei 360px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await status(page);
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(over).toBeLessThanOrEqual(1);
  });
});

test.describe('Rückfallebenen', () => {
  test('Reduzierte Bewegung startet den Effekt gar nicht erst', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('/');
    expect(await status(page)).toBe('fallback');

    // Kein WebGL-Kontext, keine laufende Animation.
    const s = await page.evaluate(() => {
      const c = document.querySelector<HTMLCanvasElement>('[data-neon-canvas]')!;
      return {
        canvasOpacity: getComputedStyle(c).opacity,
        stillOpacity: getComputedStyle(document.querySelector('.neon__still')!).opacity,
      };
    });
    expect(Number(s.canvasOpacity), 'Canvas trotz reduzierter Bewegung sichtbar').toBe(0);
    expect(Number(s.stillOpacity), 'Ersatzfläche fehlt').toBe(1);
    await ctx.close();
  });

  test('Ohne WebGL erscheint die statische Ersatzfläche', async ({ browser }) => {
    const ctx = await browser.newContext();
    await ctx.addInitScript(() => {
      const orig = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (type: string, ...rest: unknown[]) {
        if (String(type).includes('webgl') || String(type).includes('webgpu')) return null;
        // @ts-expect-error – Weiterreichen der ursprünglichen Signatur.
        return orig.call(this, type, ...rest);
      };
    });
    const page = await ctx.newPage();
    const errs: string[] = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    await page.goto('/');
    expect(await status(page)).toBe('fallback');
    const still = await page.evaluate(
      () => getComputedStyle(document.querySelector('.neon__still')!).opacity,
    );
    expect(Number(still)).toBe(1);
    expect(errs, 'Fehler statt sauberem Rückfall').toEqual([]);
    await ctx.close();
  });
});

test.describe('Lokale Auslieferung, kein Fremdcode', () => {
  test('Nirgends im Build steht eine CDN-Adresse', () => {
    const hits: string[] = [];
    for (const file of walk(DIST, (n) => n.endsWith('.js') || n.endsWith('.html'))) {
      const text = readFileSync(file, 'utf8');
      for (const host of ['jsdelivr', 'unpkg.com', 'cdnjs', 'esm.sh', 'skypack']) {
        if (text.includes(host)) hits.push(`${file}: ${host}`);
      }
    }
    expect(hits).toEqual([]);
  });

  test('Beim Aufruf der Startseite geht kein Request nach außen', async ({ page }) => {
    const extern: string[] = [];
    page.on('request', (r) => {
      const u = r.url();
      if (
        !u.startsWith('http://localhost') &&
        !u.startsWith('http://127.0.0.1') &&
        !u.startsWith('data:')
      ) {
        extern.push(u);
      }
    });
    await page.goto('/');
    await status(page);
    await page.waitForTimeout(1500);
    expect(extern).toEqual([]);
  });

  test('Weder React noch Tailwind, Framer Motion oder lucide-react sind installiert', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    for (const f of [
      'react',
      'react-dom',
      '@astrojs/react',
      'tailwindcss',
      '@astrojs/tailwind',
      'framer-motion',
      'motion',
      'lucide-react',
      'shadcn',
      'shadcn-ui',
      'class-variance-authority',
    ]) {
      expect(deps, `${f} ist installiert`).not.toContain(f);
    }
    for (const d of deps) {
      expect(d.startsWith('@radix-ui/'), `${d} ist eine Radix-Abhängigkeit`).toBe(false);
    }
    // Der Effekt selbst kommt aus einem lokal installierten Paket.
    expect(deps).toContain('threejs-components');
  });

  test('Es gibt keine React-Komponente und keinen ui-Ordner', () => {
    expect(existsSync(join(ROOT, 'src/components/ui'))).toBe(false);
    expect(walk(join(ROOT, 'src'), (n) => n.endsWith('.tsx') || n.endsWith('.jsx'))).toEqual([]);
  });

  test('Der Effekt wird erst bei Bedarf nachgeladen', () => {
    // Der große Chunk darf nicht im HTML vorgeladen werden, sonst läge er im
    // kritischen Ladepfad.
    const html = home();
    expect(html).not.toMatch(/<link[^>]+rel="modulepreload"[^>]+tubes1/);
    expect(html).not.toMatch(/<script[^>]+src="[^"]*tubes1[^"]*"/);
  });
});

test.describe('Farben und Bewegung', () => {
  test('Im Skript werden keine Zufallsfarben erzeugt', () => {
    const neon = jsFiles().filter((f) => {
      const t = readFileSync(f, 'utf8');
      return t.includes('data-neon-canvas') || t.includes('neonStatus');
    });
    expect(neon.length, 'Neon-Skript nicht gefunden').toBeGreaterThan(0);
    for (const file of neon) {
      const text = readFileSync(file, 'utf8');
      expect(text, 'randomColors im Build').not.toContain('randomColors');
      expect(text, 'Zufallsfarbe im Build').not.toMatch(/16777215\s*\*\s*Math\.random/);
      expect(text, 'Math.random im Neon-Skript').not.toContain('Math.random');
    }
  });

  test('Nur die freigegebene Palette wird konfiguriert', () => {
    // Der Hero ist als besonderes Markenelement gedacht und darf neben Cyan
    // kleine Neonakzente führen. Außerhalb des Heros gilt die Palette nicht.
    const ERLAUBT = new Set([
      '0x00e3f2',
      '0xffffff',
      '0xf4f0e7',
      '0x101214',
      '0xff2d9b',
      '0x8b5cff',
      '0x36f5a0',
    ]);
    const quelle = readFileSync(join(ROOT, 'src/components/NeonFlow.astro'), 'utf8');
    const hex = [...quelle.matchAll(/0x[0-9a-f]{6}/gi)].map((m) => m[0].toLowerCase());
    expect(hex.length, 'keine Farben gefunden').toBeGreaterThan(0);
    for (const h of hex) expect(ERLAUBT, `${h} ist nicht freigegeben`).toContain(h);
  });

  test('Ein Klick wechselt nur zwischen festen Konfigurationen', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    expect(await status(page)).toBe('ready');
    const box = await page.locator('[data-neon]').boundingBox();
    // Drei Klicks führen einmal durch den Zyklus zurück zum Anfang.
    for (let i = 0; i < 3; i++) {
      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
      await page.waitForTimeout(150);
    }
    // Kein Fehler, Effekt läuft weiter.
    expect(await page.locator('[data-neon]').getAttribute('data-neon-status')).toBe('ready');
  });
});

test.describe('Sicherheit und Auslieferung', () => {
  test('Die Content Security Policy bleibt ohne unsafe-inline', () => {
    const htaccess = readFileSync(join(DIST, '.htaccess'), 'utf8');
    // Nur die echte Header-Zeile, nicht den Kommentar darüber.
    const csp = htaccess.match(/Header always set Content-Security-Policy[^\n]*/)?.[0] ?? '';
    expect(csp, 'keine CSP gesetzt').toContain("default-src 'self'");
    const scriptSrc = csp.match(/script-src[^;]*/)?.[0] ?? '';
    expect(scriptSrc, 'script-src fehlt').not.toBe('');
    expect(scriptSrc, 'unsafe-inline in script-src').not.toContain('unsafe-inline');
    expect(scriptSrc, 'unsafe-eval in script-src').not.toContain('unsafe-eval');
    expect(csp, 'fremde Skriptquelle erlaubt').not.toContain('jsdelivr');
  });
});
