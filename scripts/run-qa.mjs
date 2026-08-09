#!/usr/bin/env node
/**
 * Führt alle QA-Skripte gegen den Build (dist/) und das Repository aus.
 * Voraussetzung: zuvor `pnpm build:ci` (oder build:production) ausführen.
 *
 * Aufruf: node scripts/run-qa.mjs [distDir=dist]
 */
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] || 'dist';

if (!existsSync(join(root, dist, 'index.html'))) {
  console.error(`✗ ${dist}/index.html fehlt. Zuerst \`pnpm build:ci\` ausführen.`);
  process.exit(1);
}

const checks = [
  ['check-no-inline.mjs', [dist]],
  ['check-external.mjs', [dist]],
  ['check-links.mjs', [dist]],
  ['check-a11y-static.mjs', [dist]],
  ['check-seo.mjs', [dist]],
  ['check-secrets.mjs', []],
];

let failed = 0;
for (const [script, args] of checks) {
  process.stdout.write(`\n▶ ${script} ${args.join(' ')}\n`);
  try {
    execFileSync(process.execPath, [join(root, 'scripts', script), ...args], { stdio: 'inherit' });
  } catch {
    failed++;
  }
}

console.log('\n' + '─'.repeat(60));
if (failed > 0) {
  console.error(`✗ QA fehlgeschlagen: ${failed} Prüfung(en) mit Fehlern.`);
  process.exit(1);
}
console.log('✓ Alle QA-Prüfungen bestanden.');
