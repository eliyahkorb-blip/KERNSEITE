#!/usr/bin/env node
/**
 * Prüft versehentlich eingecheckte Secrets:
 * - keine getrackte `.env` (nur `.env.example` erlaubt)
 * - keine bekannten Secret-Muster in getrackten Textdateien
 *
 * Aufruf: node scripts/check-secrets.mjs
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

let tracked = [];
try {
  tracked = execFileSync('git', ['ls-files'], { cwd: root, encoding: 'utf8' })
    .split('\n')
    .filter(Boolean);
} catch {
  console.error('git ls-files fehlgeschlagen.');
  process.exit(1);
}

const problems = [];

// 1. Keine echte .env getrackt
for (const f of tracked) {
  const base = f.split('/').pop();
  if (base === '.env' || (base.startsWith('.env.') && base !== '.env.example')) {
    problems.push(`Getrackte Umgebungsdatei: ${f} (nur .env.example erlaubt)`);
  }
}

// 2. Secret-Muster
const patterns = [
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/, 'Privater Schlüssel'],
  [/AKIA[0-9A-Z]{16}/, 'AWS Access Key'],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub-Token'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack-Token'],
  [/sk-[A-Za-z0-9]{20,}/, 'API-Secret-Key'],
];
// Werte, die als Platzhalter gelten und NICHT beanstandet werden
const placeholder =
  /(__NUR_AUF_DEM_SERVER_SETZEN__|DEIN_ECHTES_PASSWORT|ERSETZEN|example|changeit|xxxx)/i;

const textExt = /\.(ts|tsx|js|mjs|cjs|astro|css|md|json|php|txt|yml|yaml|htaccess|env|example)$/i;

for (const f of tracked) {
  if (!textExt.test(f) && !f.endsWith('.env.example')) continue;
  const full = join(root, f);
  let size = 0;
  try {
    size = statSync(full).size;
  } catch {
    continue;
  }
  if (size > 512 * 1024) continue;
  const text = readFileSync(full, 'utf8');
  for (const [re, label] of patterns) {
    const m = text.match(re);
    if (m && !placeholder.test(m[0])) {
      problems.push(`${f}: mögliches Secret (${label}): ${m[0].slice(0, 12)}…`);
    }
  }
  // SMTP_PASS mit echtem Wert (kein Platzhalter)
  for (const m of text.matchAll(/SMTP_PASS\s*=\s*(.+)/gi)) {
    const val = m[1].trim();
    if (val && !placeholder.test(val)) {
      problems.push(`${f}: SMTP_PASS mit möglichem Klartextwert`);
    }
  }
}

if (problems.length) {
  console.error(`✗ Mögliche Secrets gefunden (${problems.length}):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log(`✓ Keine Secrets in ${tracked.length} getrackten Dateien.`);
