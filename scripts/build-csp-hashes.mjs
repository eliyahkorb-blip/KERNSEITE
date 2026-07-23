#!/usr/bin/env node
/**
 * Leitet die CSP-Hashes aus dem TATSÄCHLICHEN Build ab.
 *
 * Ausführbare Scripts werden extern ausgeliefert (script-src 'self'); inline verbleibt
 * nur nicht-ausführbares JSON-LD. Dieses Skript berechnet sha256-Hashes aller Inline-
 * <script>-Blöcke im dist/-Output und ersetzt den Platzhalter {{CSP_SCRIPT_HASHES}} in
 * dist/.htaccess. So passt die CSP exakt zum Build und blockiert die Seite nicht.
 *
 * Aufruf: node scripts/build-csp-hashes.mjs [distDir]
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');
const htaccessPath = join(dist, '.htaccess');
const PLACEHOLDER = '{{CSP_SCRIPT_HASHES}}';

if (!existsSync(htaccessPath)) {
  console.error(`Keine .htaccess in ${dist} gefunden. Wurde public/.htaccess mitgebaut?`);
  process.exit(1);
}

// Alle HTML-Dateien einsammeln
const htmlFiles = readdirSync(dist, { recursive: true, encoding: 'utf8' })
  .filter((f) => f.endsWith('.html'))
  .map((f) => join(dist, f));

const inlineScript = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
const hashes = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  let match;
  while ((match = inlineScript.exec(html)) !== null) {
    const content = match[1];
    if (content.trim() === '') continue;
    const digest = createHash('sha256').update(content, 'utf8').digest('base64');
    hashes.add(`'sha256-${digest}'`);
  }
}

const replacement = hashes.size ? ' ' + [...hashes].join(' ') : '';
let htaccess = readFileSync(htaccessPath, 'utf8');

if (!htaccess.includes(PLACEHOLDER)) {
  console.warn(`Platzhalter ${PLACEHOLDER} nicht in .htaccess gefunden – überspringe.`);
  process.exit(0);
}

htaccess = htaccess.replaceAll(PLACEHOLDER, replacement);
writeFileSync(htaccessPath, htaccess, 'utf8');

console.log(
  `CSP: ${hashes.size} Inline-Script-Hash(es) aus ${htmlFiles.length} HTML-Dateien in dist/.htaccess eingesetzt.`,
);
