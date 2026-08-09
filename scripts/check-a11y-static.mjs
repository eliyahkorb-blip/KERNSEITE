#!/usr/bin/env node
/**
 * Statische Accessibility-Prüfungen auf dem Build:
 * - genau eine <h1> pro Seite
 * - keine übersprungenen Überschriftenebenen (h1->h3 ohne h2)
 * - <img> mit alt-Attribut (leeres alt für dekorativ ist erlaubt)
 * - keine leeren Links/Buttons ohne zugänglichen Namen
 * - <html lang> gesetzt
 *
 * Aufruf: node scripts/check-a11y-static.mjs [distDir=dist]
 */
import { readFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { walk } from './lib/walk.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = process.argv[2] ? join(process.cwd(), process.argv[2]) : join(root, 'dist');

const problems = [];
const stripTags = (s) =>
  s
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

for (const file of walk(dist, ['.html'])) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(dist, file);

  // <html lang>
  if (!/<html\b[^>]*\blang=["'][a-z-]+["']/i.test(html)) {
    problems.push(`${rel}: <html> ohne lang-Attribut`);
  }

  // Überschriften einsammeln
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    level: Number(m[1]),
    text: stripTags(m[2]),
  }));
  const h1s = headings.filter((h) => h.level === 1);
  if (h1s.length !== 1) {
    problems.push(`${rel}: ${h1s.length} <h1> (genau 1 erwartet)`);
  }
  let prev = 0;
  for (const h of headings) {
    if (prev !== 0 && h.level > prev + 1) {
      problems.push(
        `${rel}: Überschriftensprung h${prev} -> h${h.level} ("${h.text.slice(0, 40)}")`,
      );
    }
    prev = h.level;
  }

  // <img> ohne alt
  for (const m of html.matchAll(/<img\b([^>]*)>/gi)) {
    if (!/\balt=/.test(m[1])) {
      problems.push(`${rel}: <img> ohne alt-Attribut (${m[0].slice(0, 60)})`);
    }
  }

  // leere Links (kein Text, kein aria-label, kein Bild mit alt)
  for (const m of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    const attrs = m[1];
    const inner = m[2];
    const hasLabel = /\baria-label=/.test(attrs) || /\baria-labelledby=/.test(attrs);
    const hasImgAlt = /<img\b[^>]*\balt=["'][^"']+["']/.test(inner);
    if (!hasLabel && !hasImgAlt && stripTags(inner) === '') {
      problems.push(`${rel}: Link ohne zugänglichen Namen (${m[0].slice(0, 60)})`);
    }
  }

  // leere Buttons
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const attrs = m[1];
    const inner = m[2];
    const hasLabel = /\baria-label=/.test(attrs) || /\baria-labelledby=/.test(attrs);
    // Visually-hidden-Text zählt als Name
    if (!hasLabel && stripTags(inner) === '') {
      problems.push(`${rel}: Button ohne zugänglichen Namen (${m[0].slice(0, 60)})`);
    }
  }
}

if (problems.length) {
  console.error(`✗ A11y-Probleme (${problems.length}):`);
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('✓ Statische A11y-Prüfungen bestanden (H1/Hierarchie/Alt/Namen/lang).');
