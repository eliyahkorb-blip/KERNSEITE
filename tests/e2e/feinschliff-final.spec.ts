import { test, expect } from '@playwright/test';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Abschließender Feinschliff.
 *
 * Vollbild-Neon-Hero, Footer-Wortmarke, globaler Barrierefreiheits-Schalter
 * sowie die Trennung von Vorschau und Produktion.
 */

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const CYAN = 'rgb(0, 227, 242)';
const CREAM = 'rgb(252, 250, 245)';

function walk(dir: string, match: (n: string) => boolean, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, match, acc);
    else if (match(e.name)) acc.push(p);
  }
  return acc;
}
const htmlFiles = () => walk(DIST, (n) => n.endsWith('.html'));

const MARKETING = [
  '/',
  '/leistungen/',
  '/leistungen/websites/',
  '/leistungen/seo-geo/',
  '/branchen/',
  '/branchen/handwerk/',
  '/arbeiten/',
  '/agentur/',
  '/prozess/',
  '/faq/',
];
const ALLE = [...MARKETING, '/kontakt/', '/impressum/', '/datenschutz/', '/barrierefreiheit/'];

async function neonBereit(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => document.querySelector('[data-neon]')?.getAttribute('data-neon-status') !== 'idle',
    null,
    { timeout: 20000 },
  );
  return page.locator('[data-neon]').getAttribute('data-neon-status');
}

test.describe('Neon-Hero über den gesamten Bildschirm', () => {
  test('Die Animation füllt die Hero-Fläche vollständig', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await neonBereit(page);
    const s = await page.evaluate(() => {
      const hero = document.querySelector('[data-hero]')!.getBoundingClientRect();
      const neon = document.querySelector('[data-neon]')!.getBoundingClientRect();
      const canvas = document.querySelector('[data-neon-canvas]')!.getBoundingClientRect();
      return {
        heroW: Math.round(hero.width),
        heroH: Math.round(hero.height),
        neonW: Math.round(neon.width),
        neonH: Math.round(neon.height),
        canvasW: Math.round(canvas.width),
        canvasH: Math.round(canvas.height),
        viewportH: window.innerHeight,
      };
    });
    // Deckungsgleich mit dem Hero, nicht ein Ausschnitt darin.
    expect(Math.abs(s.neonW - s.heroW), 'Neon schmaler als der Hero').toBeLessThanOrEqual(2);
    expect(Math.abs(s.neonH - s.heroH), 'Neon niedriger als der Hero').toBeLessThanOrEqual(2);
    expect(Math.abs(s.canvasW - s.heroW), 'Canvas schmaler als der Hero').toBeLessThanOrEqual(2);
    expect(Math.abs(s.canvasH - s.heroH), 'Canvas niedriger als der Hero').toBeLessThanOrEqual(2);
    // Der Hero füllt den ersten Bildschirm weitgehend aus.
    expect(s.heroH, 'Hero zu niedrig').toBeGreaterThan(s.viewportH * 0.7);
  });

  test('Keine kreisförmige Begrenzung und keine Maske mehr', async ({ page }) => {
    await page.goto('/');
    await neonBereit(page);
    const s = await page.evaluate(() => {
      const neon = document.querySelector<HTMLElement>('[data-neon]')!;
      const canvas = document.querySelector<HTMLElement>('[data-neon-canvas]')!;
      const cs = getComputedStyle(neon);
      const cc = getComputedStyle(canvas);
      return {
        maske: cs.maskImage || cs.webkitMaskImage || 'none',
        radius: cs.borderTopLeftRadius,
        clip: cs.clipPath,
        canvasRadius: cc.borderTopLeftRadius,
        canvasClip: cc.clipPath,
      };
    });
    expect(s.maske, 'Der Effekt ist noch maskiert').toBe('none');
    expect(s.radius, 'Runde Begrenzung').toBe('0px');
    expect(s.canvasRadius, 'Runde Begrenzung am Canvas').toBe('0px');
    expect(s.clip, 'Clip-Path begrenzt den Effekt').toBe('none');
    expect(s.canvasClip, 'Clip-Path am Canvas').toBe('none');
  });

  test('Im Hero steht keine zweite große KERNSEITE-Wortmarke', async ({ page }) => {
    await page.goto('/');
    const s = await page.evaluate(() => {
      const hero = document.querySelector('[data-hero]')!;
      return {
        text: (hero as HTMLElement).innerText,
        wortmarken: hero.querySelectorAll('.neon__mark, .ft__wordmark').length,
      };
    });
    expect(s.wortmarken, 'Wortmarke im Hero').toBe(0);
    for (const wort of ['Neon Flow', 'Move the cursor', 'Click to randomize']) {
      expect(s.text, `Demo-Text „${wort}“ im Hero`).not.toContain(wort);
    }
    // „KERNSEITE“ steht nur im Lead-Satz, nicht als eigener Schriftzug.
    expect(s.text.match(/KERNSEITE/g)?.length ?? 0).toBeLessThanOrEqual(1);
  });

  test('Der Zeiger wirkt über die gesamte Hero-Fläche', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    expect(await neonBereit(page)).toBe('ready');
    const hero = await page.locator('[data-hero]').boundingBox();

    // Zwei weit auseinanderliegende Punkte im Hero anfahren und prüfen, dass
    // sich das gezeichnete Bild jeweils ändert.
    const shot = async (x: number, y: number) => {
      await page.mouse.move(hero!.x + hero!.width * x, hero!.y + hero!.height * y, { steps: 12 });
      await page.waitForTimeout(800);
      return page.screenshot({
        clip: { x: hero!.x, y: hero!.y, width: hero!.width, height: hero!.height },
      });
    };
    const linksOben = await shot(0.12, 0.15);
    const rechtsUnten = await shot(0.88, 0.85);
    expect(Buffer.compare(linksOben, rechtsUnten), 'Zeiger wirkt nicht').not.toBe(0);
  });

  test('Beide Hero-Buttons bleiben trotz Vollbildanimation klickbar', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await neonBereit(page);
    for (const sel of ['[data-hero] a.btn--primary', '[data-hero] a.btn--secondary']) {
      const b = await page.locator(sel).boundingBox();
      const trifft = await page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest('a.btn') !== null,
        { x: b!.x + b!.width / 2, y: b!.y + b!.height / 2 },
      );
      expect(trifft, `${sel} ist verdeckt`).toBe(true);
    }
  });

  test('Kein waagerechter Überlauf auf schmalen Displays', async ({ page }) => {
    for (const w of [430, 390, 360]) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto('/');
      await neonBereit(page);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(over, `${w}px: ${over}px Überlauf`).toBeLessThanOrEqual(1);
    }
  });
});

test.describe('Footer-Wortmarke', () => {
  test('Das Wort ist cremefarben, nur der Punkt ist cyan', async ({ page }) => {
    for (const path of ['/', '/leistungen/', '/branchen/handwerk/', '/kontakt/', '/impressum/']) {
      await page.goto(path);
      const s = await page.locator('.ft__wordmark').evaluate((el) => ({
        wort: getComputedStyle(el).color,
        punkt: getComputedStyle(el.querySelector('.ft__dot')!).color,
      }));
      expect(s.wort, `${path}: Wortmarke nicht cremefarben`).toBe(CREAM);
      expect(s.wort, `${path}: Wortmarke cyan`).not.toBe(CYAN);
      expect(s.punkt, `${path}: Punkt nicht cyan`).toBe(CYAN);
    }
  });

  test('404-Seite trägt denselben Footer', async ({ page }) => {
    await page.goto('/404.html');
    await expect(page.locator('.ft__wordmark')).toHaveCount(1);
    const wort = await page.locator('.ft__wordmark').evaluate((el) => getComputedStyle(el).color);
    expect(wort).toBe(CREAM);
  });
});

test.describe('Abschlussbereiche auf allen Seiten', () => {
  test('Jede Marketingseite trägt den Cyan-Block und den Footer', () => {
    for (const path of MARKETING) {
      const file = join(DIST, path.replace(/^\/|\/$/g, ''), 'index.html');
      const html = readFileSync(file, 'utf8');
      expect(html, `${path} ohne Cyan-Block`).toContain('class="cta section--cyan"');
      expect(html, `${path} ohne Footer`).toContain('class="ft section--dark');
    }
  });

  test('Alle öffentlichen Seiten tragen genau einen Footer', () => {
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      const anzahl = (html.match(/class="ft section--dark/g) ?? []).length;
      expect(anzahl, `${file}: ${anzahl} Footer`).toBe(1);
    }
  });
});

test.describe('Barrierefreiheits-Schalter', () => {
  test('Er erscheint auf jeder Seite unten links', async ({ page }) => {
    for (const path of ALLE) {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(path);
      const dock = page.locator('[data-a11y]');
      await expect(dock, `${path} ohne Schalter`).toHaveCount(1);
      const b = await dock.boundingBox();
      expect(b!.x, `${path}: nicht links`).toBeLessThan(80);
      expect(b!.y + b!.height, `${path}: nicht unten`).toBeGreaterThan(900 - 120);
    }
  });

  test('Die Bedienflächen sind groß genug', async ({ page }) => {
    await page.goto('/');
    for (const sel of ['[data-a11y-toggle]', '[data-a11y-contrast-toggle]']) {
      const b = await page.locator(sel).boundingBox();
      expect(b!.height, `${sel} zu flach`).toBeGreaterThanOrEqual(44);
      expect(b!.width, `${sel} zu schmal`).toBeGreaterThanOrEqual(44);
    }
    // Kapselmaß aus der Vorlage.
    const bar = await page.locator('.a11y__bar').boundingBox();
    expect(bar!.width).toBeGreaterThanOrEqual(88);
    expect(bar!.width).toBeLessThanOrEqual(108);
    expect(bar!.height).toBeGreaterThanOrEqual(42);
    expect(bar!.height).toBeLessThanOrEqual(48);
  });

  test('Textgröße, Kontrast und Bewegung lassen sich schalten', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await neonBereit(page);

    await page.locator('[data-a11y-toggle]').click();
    await expect(page.locator('[data-a11y-panel]')).toBeVisible();
    await expect(page.locator('[data-a11y-toggle]')).toHaveAttribute('aria-expanded', 'true');

    await page.locator('[data-a11y-size="1.25"]').click();
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue('--a11y-scale').trim(),
      ),
    ).toBe('1.25');
    // Größte Stufe erzeugt keinen waagerechten Überlauf.
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(over, 'Überlauf bei 125 Prozent').toBeLessThanOrEqual(1);

    await page.locator('[data-a11y-contrast-toggle]').click();
    expect(await page.evaluate(() => document.documentElement.dataset.a11yContrast)).toBe('high');
    await expect(page.locator('[data-a11y-contrast-toggle]')).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await page.locator('[data-a11y-motion]').click();
    expect(await page.evaluate(() => document.documentElement.dataset.a11yMotion)).toBe('reduced');
    // Der Neon-Hero hält an.
    await page.waitForTimeout(600);
    expect(await page.locator('[data-neon]').getAttribute('data-neon-status')).toBe('fallback');
  });

  test('Die Auswahl übersteht einen Seitenwechsel', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-a11y-toggle]').click();
    await page.locator('[data-a11y-size="1.125"]').click();
    await page.locator('[data-a11y-contrast-toggle]').click();

    await page.goto('/leistungen/');
    const s = await page.evaluate(() => ({
      scale: getComputedStyle(document.documentElement).getPropertyValue('--a11y-scale').trim(),
      contrast: document.documentElement.dataset.a11yContrast,
    }));
    expect(s.scale).toBe('1.125');
    expect(s.contrast).toBe('high');
  });

  test('Escape und Klick außerhalb schließen das Feld', async ({ page }) => {
    await page.goto('/');
    await page.locator('[data-a11y-toggle]').click();
    await expect(page.locator('[data-a11y-panel]')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('[data-a11y-panel]')).toBeHidden();

    await page.locator('[data-a11y-toggle]').click();
    await expect(page.locator('[data-a11y-panel]')).toBeVisible();
    await page.mouse.click(900, 300);
    await expect(page.locator('[data-a11y-panel]')).toBeHidden();
  });

  test('Der Schalter ist mit der Tastatur bedienbar', async ({ page }) => {
    await page.goto('/');
    const s = await page.evaluate(() => {
      const t = document.querySelector<HTMLButtonElement>('[data-a11y-toggle]')!;
      t.focus();
      const cs = getComputedStyle(t);
      return { tag: t.tagName, type: t.type, fokussiert: document.activeElement === t };
    });
    expect(s.tag).toBe('BUTTON');
    expect(s.type).toBe('button');
    expect(s.fokussiert).toBe(true);

    await page.keyboard.press('Enter');
    await expect(page.locator('[data-a11y-panel]')).toBeVisible();
  });

  test('Hoher Kontrast bleibt lesbar', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      document.documentElement.dataset.a11yContrast = 'high';
    });
    const s = await page.evaluate(() => {
      const lum = (c: string) => {
        const m = c.match(/\d+/g)!.slice(0, 3).map(Number);
        const [r, g, b] = m.map((v) => {
          const x = v / 255;
          return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const body = getComputedStyle(document.body);
      return { text: lum(body.color), bg: lum(body.backgroundColor) };
    });
    const kontrast = (Math.max(s.text, s.bg) + 0.05) / (Math.min(s.text, s.bg) + 0.05);
    expect(kontrast, 'Kontrast zu gering').toBeGreaterThanOrEqual(7);
  });

  test('Der Schalter verdeckt den Einwilligungsbanner nicht', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const hatBanner = await page.locator('.consent').count();
    if (!hatBanner) {
      // Ohne zustimmungspflichtige Dienste gibt es kein Banner.
      const dock = await page.locator('[data-a11y]').boundingBox();
      expect(dock!.y + dock!.height).toBeLessThanOrEqual(844);
      return;
    }
    const banner = await page.locator('.consent').boundingBox();
    const dock = await page.locator('[data-a11y]').boundingBox();
    const ueberlappt =
      dock!.x < banner!.x + banner!.width &&
      dock!.x + dock!.width > banner!.x &&
      dock!.y < banner!.y + banner!.height &&
      dock!.y + dock!.height > banner!.y;
    expect(ueberlappt, 'Schalter liegt über dem Banner').toBe(false);
  });
});

test.describe('Vorschau, Produktion und Rechtstexte', () => {
  test('Die Vorschau bleibt für Suchmaschinen gesperrt', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
    expect(html).toMatch(/<meta name="robots" content="[^"]*noindex/);
    expect(robots).toContain('Disallow: /');
  });

  test('Zwischen Postleitzahl und Ort steht ein Leerzeichen', () => {
    // Der CI-Build nutzt Fixture-Daten, der Produktionsbuild die echte
    // Anschrift. Geprüft wird deshalb die Form, nicht der konkrete Ort.
    for (const seite of ['impressum', 'datenschutz', 'agb']) {
      const html = readFileSync(join(DIST, seite, 'index.html'), 'utf8');
      const sichtbar = html.replace(/<script[\s\S]*?<\/script>/g, '');
      expect(sichtbar, `${seite}: PLZ und Ort kleben zusammen`).not.toMatch(
        /\b\d{5}[A-Za-zÄÖÜäöü]/,
      );
      expect(sichtbar, `${seite}: keine Anschrift gefunden`).toMatch(/\b\d{5} [A-ZÄÖÜ]/);
    }
  });

  test('Der Verweis auf die eingestellte OS-Plattform ist entfernt', () => {
    for (const file of htmlFiles()) {
      const html = readFileSync(file, 'utf8');
      expect(html, `${file}: OS-Plattform`).not.toContain('ec.europa.eu/consumers/odr');
      expect(html, `${file}: OS-Plattform`).not.toContain('Online-Streitbeilegung');
    }
  });

  test('Die Barrierefreiheitserklärung nennt einen echten Stand', () => {
    const html = readFileSync(join(DIST, 'barrierefreiheit', 'index.html'), 'utf8');
    expect(html).not.toContain('wird nach einer strukturierten Prüfung ergänzt');
    expect(html).not.toContain('werden hier nach der Prüfung transparent aufgeführt');
    expect(html).toContain('teilweise geprüft');
    expect(html).toContain('Letzte Prüfung');
    expect(html).toContain('Bekannte Einschränkungen');
  });

  test('Das Kontaktformular fragt nur drei Pflichtangaben ab', async ({ page }) => {
    await page.goto('/kontakt/');
    const pflicht = await page.evaluate(() =>
      [...document.querySelectorAll('form [required]')].map((el) => el.id),
    );
    expect(pflicht.sort()).toEqual(['cf-email', 'cf-message', 'cf-name']);
  });

  test('Die Budgetauswahl beginnt nicht bei 5.000 Euro', async ({ page }) => {
    await page.goto('/kontakt/');
    const werte = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLOptionElement>('#cf-budget option')].map((o) => o.text),
    );
    expect(werte).toContain('Bis 2.500 €');
    expect(werte).toContain('2.500–5.000 €');
    expect(werte.some((w) => w.includes('unter 5.000'))).toBe(false);
  });
});
