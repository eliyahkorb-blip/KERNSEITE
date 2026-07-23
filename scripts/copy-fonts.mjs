#!/usr/bin/env node
/**
 * Kopiert die benötigten OFL-Schriftdateien aus den installierten @fontsource-Paketen
 * nach public/fonts/ (lokal, selbst gehostet – kein Google-Fonts-/CDN-Hotlink).
 *
 * Reproduzierbar: `pnpm install` lädt die Pakete aus der npm-Registry, dieses Skript
 * kopiert die konkreten woff2-Dateien. Die kopierten Dateien werden committet.
 *
 * Aufruf: node scripts/copy-fonts.mjs
 */
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public', 'fonts');
mkdirSync(outDir, { recursive: true });

/** [Quelle relativ zu node_modules, Zielname] */
const jobs = [
  ['@fontsource/inter/files/inter-latin-400-normal.woff2', 'inter-latin-400.woff2'],
  ['@fontsource/inter/files/inter-latin-500-normal.woff2', 'inter-latin-500.woff2'],
  ['@fontsource/inter/files/inter-latin-600-normal.woff2', 'inter-latin-600.woff2'],
  ['@fontsource/inter/files/inter-latin-700-normal.woff2', 'inter-latin-700.woff2'],
  [
    '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2',
    'ibm-plex-mono-latin-400.woff2',
  ],
  [
    '@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2',
    'ibm-plex-mono-latin-500.woff2',
  ],
  [
    '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2',
    'bricolage-grotesque-latin-var.woff2',
  ],
];

let copied = 0;
for (const [src, dest] of jobs) {
  const from = join(root, 'node_modules', src);
  if (!existsSync(from)) {
    console.error(`FEHLT: ${src} (pnpm install ausgeführt?)`);
    process.exitCode = 1;
    continue;
  }
  copyFileSync(from, join(outDir, dest));
  copied++;
  console.log(`kopiert: ${dest}`);
}

// Lizenzen zusammenführen (OFL) – Nachweis im Repo.
const licenseSources = [
  ['Inter', '@fontsource/inter/LICENSE'],
  ['IBM Plex Mono', '@fontsource/ibm-plex-mono/LICENSE'],
  ['Bricolage Grotesque', '@fontsource-variable/bricolage-grotesque/LICENSE'],
];
let combined =
  'SIL Open Font License (OFL) – Schriftlizenzen für KERNSEITE\n' +
  '===========================================================\n\n' +
  'Alle folgenden Schriften stehen unter der SIL Open Font License 1.1 und werden\n' +
  'lokal (selbst gehostet) ausgeliefert. Es besteht keine Laufzeitverbindung zu\n' +
  'Google Fonts oder anderen Font-CDNs.\n\n';
for (const [name, rel] of licenseSources) {
  const p = join(root, 'node_modules', rel);
  combined += `\n\n===================== ${name} =====================\n\n`;
  combined += existsSync(p) ? readFileSync(p, 'utf8') : '(Lizenzdatei nicht gefunden)\n';
}
writeFileSync(join(outDir, 'OFL.txt'), combined, 'utf8');
console.log(`Lizenzen geschrieben: public/fonts/OFL.txt`);
console.log(`Fertig: ${copied}/${jobs.length} Schriftdateien.`);
