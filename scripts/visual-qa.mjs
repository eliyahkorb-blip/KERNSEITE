#!/usr/bin/env node
/**
 * Sichtprüfung: erzeugt Vollseiten-Screenshots aus `dist/` und meldet
 * horizontalen Überlauf sowie Bilder ohne Inhalt.
 *
 *   node scripts/visual-qa.mjs <ausgabeordner> [pfade] [breiten]
 *   node scripts/visual-qa.mjs .visual-qa "/,/arbeiten/" "1920,1440,768,430,390"
 *
 * Reveal-Animationen werden für die Aufnahme abgeschaltet, damit der
 * Screenshot den Endzustand zeigt und nicht den Startzustand der Animation.
 * Lazy-Bilder werden gezielt angefordert und dekodiert – sonst prüft man den
 * Ladezustand statt der Seite.
 */
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const OUT = process.argv[2] ?? join(ROOT, '.visual-qa');
const PAGES = (process.argv[3] ?? '/').split(',');
const WIDTHS = (process.argv[4] ?? '1440').split(',').map(Number);
const PORT = Number(process.env.VISUAL_QA_PORT ?? 4517);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

if (!existsSync(DIST)) {
  console.error('dist/ fehlt – vorher `pnpm build:ci` oder `pnpm build:preview` ausführen.');
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const server = createServer((req, res) => {
  let p = join(DIST, decodeURIComponent(req.url.split('?')[0]));
  if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
  if (!existsSync(p)) {
    res.writeHead(404);
    res.end('404');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch({
  executablePath: process.env.PW_EXECUTABLE_PATH ?? '/opt/pw-browsers/chromium',
});
const issues = [];

for (const width of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();
  for (const path of PAGES) {
    await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });

    await page.evaluate(async () => {
      document.documentElement.classList.remove('has-reveal');
      window.scrollTo(0, 0);
      await Promise.all(
        [...document.images].map(async (img) => {
          img.loading = 'eager';
          try {
            await img.decode();
          } catch {
            // Fehlerhafte Bilder werden weiter unten gemeldet.
          }
        }),
      );
    });
    await page.waitForLoadState('networkidle');

    const info = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
      broken: [...document.images]
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.currentSrc || i.src),
    }));

    const name =
      (path === '/' ? 'home' : path.replace(/\//g, '_').replace(/^_|_$/g, '')) + `_${width}`;
    await page.screenshot({ path: join(OUT, `${name}.png`), fullPage: true });

    if (info.overflow) issues.push(`${path} @${width}: horizontaler Überlauf`);
    for (const b of info.broken) issues.push(`${path} @${width}: Bild ohne Inhalt – ${b}`);
  }
  await ctx.close();
}

await browser.close();
server.close();

if (issues.length) {
  console.error('PROBLEME:\n' + issues.join('\n'));
  process.exit(1);
}
console.log(
  `✓ ${PAGES.length} Seite(n) × ${WIDTHS.length} Breite(n): kein Überlauf, alle Bilder geladen.`,
);
console.log(`  Screenshots: ${OUT}`);
