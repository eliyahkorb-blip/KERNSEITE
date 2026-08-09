#!/usr/bin/env node
/**
 * Setzt alle root-absoluten Verweise im Build auf ein Unterverzeichnis (Base-Pfad) um,
 * damit die Vorschau z. B. unter GitHub Pages auf `/<repo>/` funktioniert.
 *
 * Rewrites in HTML (href/src/action/srcset), CSS (url()/@import) und in site.webmanifest.
 * Übersprungen werden absolute (http/https), protokoll-relative (//), Anker (#),
 * mailto:/tel:/data:-URLs sowie bereits umgeschriebene Pfade.
 *
 * Aufruf: node scripts/rebase-dist.mjs /BASE [distDir=dist]
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let base = process.argv[2] || process.env.SITE_BASE || '';
const distArg = process.argv[3];
const dist = distArg
  ? isAbsolute(distArg)
    ? distArg
    : resolve(process.cwd(), distArg)
  : join(root, 'dist');

base = '/' + base.replace(/^\/+|\/+$/g, ''); // normalisieren -> "/KERNSEITE"
if (base === '/') {
  console.log('Kein Base-Pfad angegeben – nichts zu tun.');
  process.exit(0);
}

const skip = (url) =>
  /^(https?:|\/\/|#|mailto:|tel:|data:)/i.test(url) || url.startsWith(base + '/');
const prefix = (url) => (skip(url) ? url : base + url);

let files = 0;

// --- HTML ---
for (const file of walk(dist, ['.html'])) {
  let html = readFileSync(file, 'utf8');
  // href/src/action="/..."
  html = html.replace(
    /(\b(?:href|src|action)=)(["'])(\/(?!\/)[^"']*)\2/gi,
    (_m, attr, q, url) => `${attr}${q}${prefix(url)}${q}`,
  );
  // srcset="/... x, /... y"
  html = html.replace(/(\bsrcset=)(["'])([^"']+)\2/gi, (_m, attr, q, list) => {
    const rewritten = list
      .split(',')
      .map((part) => {
        const seg = part.trim().split(/\s+/);
        seg[0] = prefix(seg[0]);
        return seg.join(' ');
      })
      .join(', ');
    return `${attr}${q}${rewritten}${q}`;
  });
  writeFileSync(file, html, 'utf8');
  files++;
}

// --- CSS ---
for (const file of walk(dist, ['.css'])) {
  let css = readFileSync(file, 'utf8');
  css = css.replace(
    /url\(\s*(['"]?)(\/(?!\/)[^'")]*)\1\s*\)/gi,
    (_m, q, url) => `url(${q}${prefix(url)}${q})`,
  );
  css = css.replace(
    /(@import\s+)(['"])(\/(?!\/)[^'"]*)\2/gi,
    (_m, imp, q, url) => `${imp}${q}${prefix(url)}${q}`,
  );
  writeFileSync(file, css, 'utf8');
  files++;
}

// --- Webmanifest ---
const manifest = join(dist, 'site.webmanifest');
if (existsSync(manifest)) {
  let json = readFileSync(manifest, 'utf8');
  json = json.replace(
    /("(?:start_url|src)"\s*:\s*")(\/(?!\/)[^"]*)"/g,
    (_m, key, url) => `${key}${prefix(url)}"`,
  );
  writeFileSync(manifest, json, 'utf8');
  files++;
}

console.log(`✓ Base-Pfad "${base}" in ${files} Dateien gesetzt (${dist}).`);
