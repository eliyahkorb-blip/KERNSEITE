import { test, expect, type Page } from '@playwright/test';

/**
 * Der Barrierefreiheits-Schalter und sein Zurücksetzen.
 *
 * Der Reset muss mehr leisten, als die Darstellung zurückspringen zu lassen:
 * Nach einem Neuladen darf nichts von der alten Auswahl übrig sein. Deshalb
 * prüft jeder Ablauf hier bis über den Reload hinaus.
 */

const KEY = 'kernseite-accessibility';

interface Zustand {
  scale: string;
  contrast: string | undefined;
  motion: string | undefined;
  gespeichert: string | null;
}

async function zustand(page: Page): Promise<Zustand> {
  return page.evaluate((key) => {
    const root = document.documentElement;
    return {
      scale: getComputedStyle(root).getPropertyValue('--a11y-scale').trim(),
      contrast: root.dataset.a11yContrast,
      motion: root.dataset.a11yMotion,
      gespeichert: window.localStorage.getItem(key),
    };
  }, KEY);
}

async function oeffnen(page: Page) {
  await page.locator('[data-a11y-toggle]').click();
  await expect(page.locator('[data-a11y-panel]')).toBeVisible();
}

test.describe('Barrierefreiheits-Schalter – Zurücksetzen', () => {
  test('Alle drei Einstellungen greifen, überstehen den Reload und lassen sich zurücksetzen', async ({
    page,
  }) => {
    await page.goto('/');

    // 1.–4. Sehr große Schrift, hoher Kontrast, reduzierte Bewegung.
    await oeffnen(page);
    await page.locator('[data-a11y-size="1.25"]').click();
    await page.locator('[data-a11y-motion]').click();
    await page.locator('[data-a11y-contrast-toggle]').click();

    // 5. Die drei Zustände sind tatsächlich aktiv.
    let s = await zustand(page);
    expect(s.scale).toBe('1.25');
    expect(s.contrast).toBe('high');
    expect(s.motion).toBe('reduced');
    expect(s.gespeichert, 'nichts gespeichert').toBeTruthy();
    expect(JSON.parse(s.gespeichert!)).toMatchObject({
      size: 1.25,
      contrast: true,
      motion: true,
    });

    // 6.–7. Nach dem Neuladen unverändert.
    await page.reload();
    s = await zustand(page);
    expect(s.scale, 'Textgröße überlebt den Reload nicht').toBe('1.25');
    expect(s.contrast).toBe('high');
    expect(s.motion).toBe('reduced');

    // 8.–10. Zurücksetzen.
    await oeffnen(page);
    await page.locator('[data-a11y-reset]').click();

    s = await zustand(page);
    expect(s.scale).toBe('1');
    expect(s.contrast, 'Kontrastmerkmal bleibt am <html>').toBeFalsy();
    expect(s.motion, 'Bewegungsmerkmal bleibt am <html>').toBeFalsy();
    expect(JSON.parse(s.gespeichert!)).toEqual({ size: 1, contrast: false, motion: false });

    // aria-pressed folgt dem Zustand.
    const gedrueckt = await page.evaluate(() =>
      [...document.querySelectorAll('[aria-pressed]')].map((el) => el.getAttribute('aria-pressed')),
    );
    expect(gedrueckt.filter((v) => v === 'true')).toEqual(['true']); // nur „Standard“

    // 11.–12. Auch nach dem Neuladen bleibt es beim Standard.
    await page.reload();
    s = await zustand(page);
    expect(s.scale, 'Reset hält den Reload nicht durch').toBe('1');
    expect(s.contrast).toBeFalsy();
    expect(s.motion).toBeFalsy();
  });

  test('Beschädigter Speicherinhalt führt nicht zu einer kaputten Seite', async ({ page }) => {
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, '{kein gültiges JSON');
    }, KEY);

    const fehler: string[] = [];
    page.on('pageerror', (e) => fehler.push(e.message));

    await page.goto('/');
    const s = await zustand(page);
    expect(s.scale === '' || s.scale === '1', `Textgröße: ${s.scale}`).toBe(true);
    expect(s.contrast).toBeFalsy();
    expect(fehler, `Skriptfehler: ${fehler.join(' | ')}`).toEqual([]);

    // Der Schalter bleibt bedienbar und schreibt einen sauberen Wert.
    await oeffnen(page);
    await page.locator('[data-a11y-size="1.125"]').click();
    const danach = await zustand(page);
    expect(JSON.parse(danach.gespeichert!)).toMatchObject({ size: 1.125 });
  });

  test('Gesperrter Speicher legt die Seite nicht lahm', async ({ page }) => {
    // localStorage wirft – z. B. in bestimmten Datenschutzmodi.
    await page.addInitScript(() => {
      const werfen = () => {
        throw new DOMException('gesperrt', 'SecurityError');
      };
      Object.defineProperty(window, 'localStorage', {
        configurable: true,
        get: () => ({ getItem: werfen, setItem: werfen, removeItem: werfen }),
      });
    });

    const fehler: string[] = [];
    page.on('pageerror', (e) => fehler.push(e.message));

    await page.goto('/');
    await oeffnen(page);
    await page.locator('[data-a11y-size="1.25"]').click();

    // Die Darstellung ändert sich trotzdem, nur gespeichert wird nichts.
    const scale = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--a11y-scale').trim(),
    );
    expect(scale).toBe('1.25');
    expect(fehler, `Skriptfehler: ${fehler.join(' | ')}`).toEqual([]);
  });

  test('Escape, Klick außerhalb und Tastatur bedienen das Feld', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('[data-a11y-panel]');

    await oeffnen(page);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();

    await oeffnen(page);
    await page.mouse.click(900, 300);
    await expect(panel).toBeHidden();

    // Tastatur: fokussieren, mit Enter öffnen.
    await page.locator('[data-a11y-toggle]').focus();
    await page.keyboard.press('Enter');
    await expect(panel).toBeVisible();
  });

  test('Der Zustand wird für Screenreader gemeldet', async ({ page }) => {
    await page.goto('/');
    const live = page.locator('[data-a11y-status]');
    await expect(live).toHaveAttribute('aria-live', /polite|assertive/);

    await oeffnen(page);
    await page.locator('[data-a11y-size="1.25"]').click();
    await expect(live).not.toBeEmpty();

    await page.locator('[data-a11y-reset]').click();
    await expect(live).not.toBeEmpty();
  });
});
