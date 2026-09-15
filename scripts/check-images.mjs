#!/usr/bin/env node
import { readFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const credits = JSON.parse(readFileSync(resolve(root, 'assets-source/photo-credits.json'), 'utf8'));
const failures = [];
const keys = new Set();
for (const credit of credits) {
  try {
    if (keys.has(credit.key)) throw new Error('doppelter Bildschlüssel');
    keys.add(credit.key);
    if (
      !credit.photographer ||
      !credit.sourceUrl.startsWith('https://unsplash.com/photos/') ||
      !credit.licenseUrl
    ) {
      throw new Error('unvollständiger Herkunftsnachweis');
    }
    const source = readFileSync(resolve(root, credit.sourceFile));
    if (createHash('sha256').update(source).digest('hex') !== credit.sha256) {
      throw new Error('Quelle stimmt nicht mit dokumentiertem SHA-256 überein');
    }
    for (const width of [640, 960, 1280, 1600]) {
      for (const format of ['avif', 'webp']) {
        const file = resolve(
          root,
          `public/assets/${credit.group}/${credit.key}-${width}.${format}`,
        );
        if (statSync(file).size < 100) throw new Error(`leere/beschädigte Variante: ${file}`);
      }
    }
  } catch (error) {
    failures.push(`${credit.key}: ${error.message}`);
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(
  `✓ ${credits.length} Bildquellen mit Hash und jeweils 8 Auslieferungsvarianten geprüft.`,
);
