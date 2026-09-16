#!/usr/bin/env node
/**
 * Prüft Überschriften auf Überschneidung, Beschnitt und Überlauf.
 *
 *   node scripts/check-headings.mjs [pfade] [breiten] [zoomstufen]
 *
 * Gemeldet wird, wenn
 *  - sich die Kästen zweier Überschriften überlappen,
 *  - eine Überschrift breiter ist als ihr Container (Beschnitt),
 *  - eine Überschrift aus dem Viewport ragt,
 *  - ein Bindestrich aus automatischer Silbentrennung entsteht,
 *  - die Seite horizontal scrollt.
 *
 * Zoom wird über `deviceScaleFactor` nicht abgebildet – stattdessen wird die
 * Viewport-Breite geteilt, was der Layoutwirkung von Browser-Zoom entspricht.
 */
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.HEADING_CHECK_PORT ?? 4623);

const PAGES = (process.argv[2] ?? '/').split(',');
const WIDTHS = (process.argv[3] ?? '1440').split(',').map(Number);
const ZOOMS = (process.argv[4] ?? '1').split(',').map(Number);

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
};

if (!existsSync(DIST)) {
  console.error('dist/ fehlt – vorher `pnpm build:ci` ausführen.');
  process.exit(1);
}

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
let checked = 0;

for (const zoom of ZOOMS) {
  for (const width of WIDTHS) {
    // Browser-Zoom wirkt aufs Layout wie eine schmalere CSS-Viewport-Breite.
    const cssWidth = Math.round(width / zoom);
    const ctx = await browser.newContext({ viewport: { width: cssWidth, height: 900 } });
    const page = await ctx.newPage();

    for (const path of PAGES) {
      await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        document.documentElement.classList.remove('has-reveal');
      });

      const found = await page.evaluate(() => {
        const out = { overlaps: [], clipped: [], outside: [], hyphenated: [], scroll: false };
        const heads = [...document.querySelectorAll('h1, h2, h3, h4, h5')].filter((el) => {
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') return false;
          // Nur für Screenreader gesetzte Überschriften haben kein Layout.
          if (el.classList.contains('visually-hidden') || cs.clip === 'rect(0px, 0px, 0px, 0px)') {
            return false;
          }
          const r = el.getBoundingClientRect();
          return r.width > 2 && r.height > 2 && el.textContent.trim().length > 0;
        });

        const label = (el) => `${el.tagName.toLowerCase()} „${el.textContent.trim().slice(0, 40)}“`;

        for (let i = 0; i < heads.length; i++) {
          const a = heads[i];
          const ra = a.getBoundingClientRect();

          // Aus dem Container beschnitten?
          if (a.scrollWidth > Math.ceil(a.clientWidth) + 1 && a.clientWidth > 0) {
            out.clipped.push(`${label(a)} (${a.scrollWidth}px in ${a.clientWidth}px)`);
          }
          // Aus dem Viewport gelaufen?
          if (ra.left < -1 || ra.right > window.innerWidth + 1) {
            out.outside.push(`${label(a)} (${Math.round(ra.left)}…${Math.round(ra.right)})`);
          }
          // Automatische Silbentrennung?
          if (getComputedStyle(a).hyphens === 'auto') {
            out.hyphenated.push(label(a));
          }

          for (let j = i + 1; j < heads.length; j++) {
            const b = heads[j];
            if (a.contains(b) || b.contains(a)) continue;
            const rb = b.getBoundingClientRect();
            const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left);
            const oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
            // 2px Toleranz für Rundung und Unterlängen.
            if (ox > 2 && oy > 2) {
              out.overlaps.push(`${label(a)} ↔ ${label(b)}`);
            }
          }
        }

        // Sichtbar getrennte Wörter erkennen (weicher Trennstrich am Zeilenende).
        for (const el of heads) {
          const range = document.createRange();
          range.selectNodeContents(el);
          if (range.getClientRects().length > 1 && getComputedStyle(el).hyphens !== 'none') {
            out.hyphenated.push(`${el.tagName.toLowerCase()} mit aktiver Trennung`);
          }
        }

        out.scroll = document.documentElement.scrollWidth > window.innerWidth + 1;
        return out;
      });

      checked++;
      const at = `${path} @${width}px${zoom !== 1 ? ` / ${Math.round(zoom * 100)}%` : ''}`;
      for (const o of found.overlaps) issues.push(`${at}: Überschriften überlappen – ${o}`);
      for (const c of found.clipped) issues.push(`${at}: Überschrift beschnitten – ${c}`);
      for (const o of found.outside) issues.push(`${at}: Überschrift außerhalb – ${o}`);
      for (const h of new Set(found.hyphenated)) issues.push(`${at}: Silbentrennung – ${h}`);
      if (found.scroll) issues.push(`${at}: horizontaler Überlauf`);
    }
    await ctx.close();
  }
}

await browser.close();
server.close();

if (issues.length) {
  console.error(`PROBLEME (${issues.length}):\n` + [...new Set(issues)].join('\n'));
  process.exit(1);
}
console.log(`✓ ${checked} Seitenaufrufe geprüft: keine Überschneidung, kein Beschnitt,`);
console.log('  kein Überlauf, keine automatische Silbentrennung in Überschriften.');
