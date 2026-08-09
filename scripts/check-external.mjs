#!/usr/bin/env node
/**
 * Prüft, dass der Build KEINE externen Ressourcen lädt (kein Google Fonts/CDN,
 * keine fremden Skripte/Bilder). Externe <a>-Links sind erlaubt und werden ignoriert.
 *
 * Aufruf: node scripts/check-external.mjs [distDir=dist]
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');

const isExternal = (url) => /^(https?:)?\/\//i.test(url.trim());
const problems = [];

// Ressourcen-ladende Attribute (kein <a href>, keine Metadaten wie canonical/og)
const resourcePatterns = [
  /<script\b[^>]*\bsrc=["']([^"']+)["']/gi,
  /<img\b[^>]*\bsrc=["']([^"']+)["']/gi,
  /<(?:source|video|audio|iframe|embed|track)\b[^>]*\b(?:src|srcset)=["']([^"']+)["']/gi,
];

// Nur diese <link rel="…"> laden Subressourcen; canonical/alternate sind Metadaten.
const resourceLinkRels = new Set([
  'stylesheet',
  'preload',
  'prefetch',
  'preconnect',
  'dns-prefetch',
  'modulepreload',
  'icon',
  'shortcut icon',
  'apple-touch-icon',
  'mask-icon',
  'manifest',
]);

for (const file of walk(dist, ['.html'])) {
  const html = readFileSync(file, 'utf8');
  for (const re of resourcePatterns) {
    let m;
    while ((m = re.exec(html)) !== null) {
      for (const url of m[1].split(',').map((s) => s.trim().split(' ')[0])) {
        if (url && isExternal(url)) {
          problems.push(`${file}: externe Ressource -> ${url}`);
        }
      }
    }
  }
  // <link> nur bei subressourcen-ladenden rel-Werten prüfen
  for (const m of html.matchAll(/<link\b([^>]*)>/gi)) {
    const attrs = m[1];
    const relMatch = attrs.match(/\brel=["']([^"']+)["']/i);
    const hrefMatch = attrs.match(/\bhref=["']([^"']+)["']/i);
    if (!relMatch || !hrefMatch) continue;
    const rel = relMatch[1].toLowerCase();
    if (resourceLinkRels.has(rel) && isExternal(hrefMatch[1])) {
      problems.push(`${file}: externe <link rel="${rel}">-Ressource -> ${hrefMatch[1]}`);
    }
  }
}

// CSS: @import / url() auf externe Hosts
for (const file of walk(dist, ['.css'])) {
  const css = readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    if (isExternal(m[1])) problems.push(`${file}: externe CSS-Ressource -> ${m[1]}`);
  }
  for (const m of css.matchAll(/@import\s+['"]([^'"]+)['"]/gi)) {
    if (isExternal(m[1])) problems.push(`${file}: externer @import -> ${m[1]}`);
  }
}

// Bekannte Tracker/CDN-Hosts explizit ausschließen (Doppelprüfung)
const forbiddenHosts = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'googletagmanager.com',
  'google-analytics.com',
  'connect.facebook.net',
  'cdn.jsdelivr.net',
  'unpkg.com',
  'cdnjs.cloudflare.com',
  'youtube.com/embed',
  'player.vimeo.com',
];
for (const file of walk(dist, ['.html', '.css', '.js'])) {
  const text = readFileSync(file, 'utf8');
  for (const host of forbiddenHosts) {
    if (text.includes(host)) problems.push(`${file}: verbotener Host referenziert -> ${host}`);
  }
}

if (problems.length) {
  console.error(`✗ Externe Requests gefunden (${problems.length}):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('✓ Keine externen Ressourcen im Build.');
