#!/usr/bin/env node
/**
 * Interne Linkprüfung: alle root-relativen Links/Ressourcen im Build müssen auf eine
 * existierende Datei zeigen. Externe Links (http/mailto/tel), Anker (#) und der
 * serverseitige PHP-Endpunkt (/api/) werden übersprungen.
 *
 * Aufruf: node scripts/check-links.mjs [distDir=dist]
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');

// Serverseitige Endpunkte, die nicht Teil von dist/ sind.
const ignorePrefixes = ['/api/'];

function resolveTarget(url) {
  let path = url.split('#')[0].split('?')[0];
  if (path === '') return null;
  if (ignorePrefixes.some((p) => path.startsWith(p))) return null;
  const candidates = [];
  if (path.endsWith('/')) {
    candidates.push(join(dist, path, 'index.html'));
  } else if (/\.[a-z0-9]+$/i.test(path)) {
    candidates.push(join(dist, path));
  } else {
    candidates.push(join(dist, path + '.html'), join(dist, path, 'index.html'));
  }
  return candidates;
}

const attrRe = /\b(?:href|src|action)=["']([^"']+)["']/gi;
const problems = new Set();
let checked = 0;

for (const file of walk(dist, ['.html'])) {
  const html = readFileSync(file, 'utf8');
  let m;
  while ((m = attrRe.exec(html)) !== null) {
    const url = m[1].trim();
    if (!url.startsWith('/')) continue; // nur root-relative prüfen
    if (/^\/\//.test(url)) continue; // protokoll-relativ = extern
    const candidates = resolveTarget(url);
    if (!candidates) continue;
    checked++;
    if (!candidates.some((c) => existsSync(c))) {
      problems.add(`${url}  (referenziert u. a. in ${file.replace(dist, 'dist')})`);
    }
  }
}

if (problems.size) {
  console.error(`✗ Defekte interne Links (${problems.size}):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log(`✓ ${checked} interne Links geprüft – keine defekten Verweise.`);
