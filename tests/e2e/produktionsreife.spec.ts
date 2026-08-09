import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Produktionsreife: Recht, Standortwahrheit, SEO-Zuordnung, Conversion.
 *
 * Die Prüfungen hier halten Zusagen fest, die sich nicht am Aussehen ablesen
 * lassen: dass keine unbelegte Tatsache behauptet wird, dass der Sitz nicht
 * nach Würzburg verlegt wird, dass Suchbegriffe auf der jeweils zuständigen
 * Seite stehen – und dass ein Produktions-Build ohne Freigabe gar nicht
 * entsteht.
 */

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

const htmlFiles = () => walk(DIST);
const readAll = () => htmlFiles().map((f) => ({ file: f, html: readFileSync(f, 'utf8') }));
/** Sichtbarer Text ohne Skripte, Stile und strukturierte Daten. */
const textOf = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');

test.describe('Recht – keine veralteten oder unbelegten Aussagen', () => {
  test('Kein Verweis auf die eingestellte EU-Streitbeilegungsplattform', () => {
    const treffer = readAll().filter(({ html }) =>
      /ec\.europa\.eu\/consumers\/odr|ec\.europa\.eu\/odr/i.test(html),
    );
    expect(treffer.map((t) => t.file)).toEqual([]);
  });

  test('Kein veralteter §§-8-bis-10-DDG-Boilerplate', () => {
    const treffer = readAll()
      .filter(({ html }) => /§§\s*8\s*bis\s*10\s*DDG|§\s*7\s*Abs\.\s*1\s*DDG/i.test(textOf(html)))
      .map((t) => t.file);
    expect(treffer).toEqual([]);
  });

  test('§ 5 DDG bleibt als Grundlage des Impressums stehen', () => {
    const html = readFileSync(join(DIST, 'impressum', 'index.html'), 'utf8');
    expect(textOf(html)).toContain('§ 5 DDG');
  });

  test('Kein Block „Redaktionell verantwortlich“ ohne redaktionelles Angebot', () => {
    const html = readFileSync(join(DIST, 'impressum', 'index.html'), 'utf8');
    expect(textOf(html)).not.toContain('Redaktionell verantwortlich');
  });

  test('Kein behaupteter Serverstandort ohne belegte Angabe', () => {
    // Solange hostingLocation/mailProvider Platzhalter sind, darf nirgends ein
    // Standort für Server oder Mailversand genannt werden.
    const verdacht = /Server(n|standort)?[^.]{0,60}\bin Deutschland\b/i;
    const treffer = readAll()
      .filter(({ html }) => verdacht.test(textOf(html)))
      .map((t) => t.file);
    expect(treffer, `Unbelegte Standortaussage in: ${treffer.join(', ')}`).toEqual([]);
  });

  test('Die lokale Speicherung des Schalters ist in der Datenschutzerklärung erklärt', () => {
    const text = textOf(readFileSync(join(DIST, 'datenschutz', 'index.html'), 'utf8'));
    expect(text).toContain('kernseite-accessibility');
    expect(text).toMatch(/Textgröße/);
    expect(text).toMatch(/Profilbildung|Werbung/);
    // Keine Verharmlosung der Rechtslage.
    expect(text).not.toMatch(/kein Cookie und deshalb/i);
  });

  test('Keine Erfolgs- oder Rankinggarantie im Text', () => {
    const verboten =
      /garantier(en|t|e)\s+(wir\s+)?(dir\s+)?(ein|die|den)?\s*(Platz\s*1|Top-?\d|Ranking|Umsatz)|Rankinggarantie|garantierte\s+(Platzierung|Sichtbarkeit)/i;
    const treffer = readAll()
      .filter(({ html }) => verboten.test(textOf(html)))
      .map((t) => t.file);
    expect(treffer).toEqual([]);
  });
});

test.describe('Standortwahrheit', () => {
  test('Nirgends wird ein Sitz in der Stadt Würzburg behauptet', () => {
    const verboten = /(sitzt|Sitz|ansässig|Standort|Büro)\s+(ist\s+)?in\s+Würzburg\b/i;
    const treffer = readAll()
      .filter(({ html }) => verboten.test(textOf(html)))
      .map((t) => t.file);
    expect(treffer, `Behaupteter Sitz in Würzburg: ${treffer.join(', ')}`).toEqual([]);
  });

  test('Die strukturierte Anschrift nennt den echten Ort, nicht Würzburg', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const blocks = [...html.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    const adressen: Record<string, string>[] = [];
    for (const [, raw] of blocks) {
      const finde = (o: unknown): void => {
        if (!o || typeof o !== 'object') return;
        const rec = o as Record<string, unknown>;
        if (rec['@type'] === 'PostalAddress') adressen.push(rec as Record<string, string>);
        for (const v of Object.values(rec)) finde(v);
      };
      finde(JSON.parse(raw));
    }
    expect(adressen.length, 'keine PostalAddress im JSON-LD').toBeGreaterThan(0);
    for (const a of adressen) {
      expect(a.addressLocality, 'Würzburg als Sitz im strukturierten Datensatz').not.toBe(
        'Würzburg',
      );
      expect(a.addressCountry).toBe('DE');
    }
  });

  test('areaServed nennt Würzburg, Unterfranken, Bayern und Deutschland', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf8');
    const roh = [...html.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) =>
      JSON.parse(m[1]),
    );
    const org = roh.find((o) => o['@type'] === 'ProfessionalService');
    expect(org, 'kein ProfessionalService-Datensatz').toBeTruthy();
    expect(org.areaServed).toEqual(
      expect.arrayContaining(['Würzburg', 'Unterfranken', 'Bayern', 'Deutschland']),
    );
  });
});

test.describe('SEO – Suchintent je Seite', () => {
  const erwartet: Record<string, string[]> = {
    'index.html': ['Webdesign', 'KI-Agentur', 'Würzburg'],
    'leistungen/websites/index.html': ['Webdesign', 'Würzburg'],
    'leistungen/seo-geo/index.html': ['SEO', 'GEO', 'Würzburg'],
    'leistungen/ki-automatisierung/index.html': ['KI-Agentur', 'KI-Integration'],
    'agentur/index.html': ['Digital-', 'Medienagentur'],
    'branchen/handwerk/index.html': ['Handwerk'],
    'branchen/zahnarztpraxen/index.html': ['Zahnarztpraxen'],
    'branchen/gastronomie-hotels/index.html': ['Gastronomie'],
    'branchen/lokale-dienstleister/index.html': ['lokale Dienstleister'],
    'branchen/b2b-mittelstand/index.html': ['B2B', 'Mittelstand'],
  };

  for (const [datei, begriffe] of Object.entries(erwartet)) {
    test(`${datei}: Titel trägt den Suchintent`, () => {
      const html = readFileSync(join(DIST, datei), 'utf8');
      const title = (html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '').replace(/&amp;/g, '&');
      for (const b of begriffe) {
        expect(title, `„${b}“ fehlt im Titel: ${title}`).toContain(b);
      }
    });
  }

  test('Kein Keyword-Stuffing: „Würzburg“ steht nirgends übermäßig oft', () => {
    for (const { file, html } of readAll()) {
      const text = textOf(html);
      const anzahl = (text.match(/Würzburg/g) || []).length;
      expect(anzahl, `${file}: ${anzahl}× Würzburg`).toBeLessThanOrEqual(8);
    }
  });

  test('Keine dünnen Stadt-Landingpages', () => {
    const verboten = [
      'webdesign-wuerzburg',
      'webagentur-wuerzburg',
      'webseiten-agentur-wuerzburg',
      'medienagentur-wuerzburg',
    ];
    const vorhanden = htmlFiles().map((f) => f.replace(/\\/g, '/'));
    for (const slug of verboten) {
      expect(vorhanden.filter((f) => f.includes(slug))).toEqual([]);
    }
  });

  test('Kein versteckter Text und keine meta keywords', () => {
    for (const { file, html } of readAll()) {
      expect(html, `${file}: meta keywords`).not.toMatch(/<meta\s+name="keywords"/i);
      expect(html, `${file}: display:none-Textblock`).not.toMatch(
        /style="[^"]*display:\s*none[^"]*"[^>]*>[^<]{60,}/i,
      );
    }
  });
});

test.describe('Conversion – keine Preise, funktionierender Kontext', () => {
  test('Nirgends stehen öffentliche Eurobeträge', () => {
    const treffer: string[] = [];
    for (const { file, html } of readAll()) {
      const text = textOf(html);
      if (/\d[\d.\s]*\s*(€|EUR\b)/.test(text)) treffer.push(file);
    }
    expect(treffer, `Preisangabe in: ${treffer.join(', ')}`).toEqual([]);
  });

  test('Das Formular kennt keine Budgetklassen mehr', async ({ page }) => {
    await page.goto('/kontakt/');
    await expect(page.locator('[name="budget"]')).toHaveCount(0);
    await expect(page.locator('#cf-scope')).toHaveCount(1);
  });

  test('?leistung= wählt die passende Leistung vor', async ({ page }) => {
    await page.goto('/kontakt/?leistung=seo-geo');
    await expect(page.locator('#cf-service')).toHaveValue('SEO & GEO');
  });

  test('?branche= wird übernommen, aber nur aus der Whitelist', async ({ page }) => {
    await page.goto('/kontakt/?branche=handwerk');
    await expect(page.locator('[data-branch-field]')).toHaveValue('Handwerk');

    // Fremdwert wird ignoriert – kein Text aus der Adresszeile im Formular.
    await page.goto('/kontakt/?branche=<img src=x onerror=alert(1)>');
    await expect(page.locator('[data-branch-field]')).toHaveValue('');
    await page.goto('/kontakt/?leistung=erfunden');
    await expect(page.locator('#cf-service')).toHaveValue('');
  });

  test('Die kontextbezogenen CTA-Links zeigen auf die Kontaktseite', async ({ page }) => {
    const seiten = [
      ['/leistungen/websites/', 'leistung=websites'],
      ['/leistungen/seo-geo/', 'leistung=seo-geo'],
      ['/leistungen/ki-automatisierung/', 'leistung=ki'],
      ['/branchen/handwerk/', 'branche=handwerk'],
    ] as const;
    for (const [pfad, param] of seiten) {
      await page.goto(pfad);
      const cta = page.locator(`.cta a[href*="${param}"]`);
      await expect(cta, `${pfad}: kontextbezogener CTA fehlt`).toHaveCount(1);
      await expect(cta).toBeVisible();
    }
  });

  test('Kein Abschluss-CTA führt ins Leere', async ({ page }) => {
    await page.goto('/leistungen/websites/');
    const ziele = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLAnchorElement>('.cta a[href]')].map((a) =>
        a.getAttribute('href')!,
      ),
    );
    expect(ziele.length).toBeGreaterThan(0);
    for (const z of ziele) {
      expect(z === '#' || z === '', `toter CTA: ${z}`).toBe(false);
    }
  });
});

test.describe('Produktions-Gate', () => {
  test('Ohne Freigabe entsteht kein Produktions-Build', () => {
    // Eigenes Ausgabeverzeichnis: `astro build` leert sein outDir zu Beginn.
    // Gegen `dist` gestartet, würde diese Prüfung dem laufenden Vorschau-
    // Server und den übrigen Tests die Dateien unter den Füßen wegziehen.
    const outDir = join(ROOT, '.gate-check');
    let abgebrochen = false;
    let ausgabe = '';
    try {
      ausgabe = execFileSync('pnpm', ['exec', 'astro', 'build', '--outDir', outDir, '--silent'], {
        cwd: ROOT,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, KERNSEITE_BUILD_MODE: 'production' },
      });
    } catch (err) {
      abgebrochen = true;
      const e = err as { stdout?: string; stderr?: string };
      ausgabe = `${e.stdout ?? ''}${e.stderr ?? ''}`;
    } finally {
      rmSync(outDir, { recursive: true, force: true });
    }
    expect(abgebrochen, 'build:production lief trotz offener Punkte durch').toBe(true);
    expect(ausgabe).toContain('PRODUKTIONS-BUILD ABGEBROCHEN');
    // Die Meldung benennt beide Ursachen.
    expect(ausgabe).toMatch(/hostingProvider|hostingLocation|mailProvider|formRetentionPeriod/);
    expect(ausgabe).toMatch(/legalReviewApproved|canonicalDomainConfirmed/);
  });

  test('Die Freigabeschalter erscheinen nirgends im Output', () => {
    for (const { file, html } of readAll()) {
      expect(html, `${file}: interner Schalter sichtbar`).not.toContain('legalReviewApproved');
      expect(html, `${file}: interner Schalter sichtbar`).not.toContain('canonicalDomainConfirmed');
    }
  });

  test('Der CI-Build ist als nicht deploybar markiert und trägt keine Platzhalter', () => {
    expect(existsSync(join(DIST, '.ci-fixture'))).toBe(true);
    for (const { file, html } of readAll()) {
      expect(html, `${file}: [ERSETZEN] im Output`).not.toContain('[ERSETZEN');
    }
  });
});
