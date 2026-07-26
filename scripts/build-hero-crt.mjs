#!/usr/bin/env node
/**
 * Hinweis: Die eigentliche Rasterbearbeitung des CRT-Motivs erfolgt mit
 * `scripts/build-hero-crt.py` (Pillow). Dieses Wrapper-Skript startet den
 * Python-Prozess, damit der Vorgang aus dem Node-Toolchain heraus
 * reproduzierbar bleibt.
 *
 *   node scripts/build-hero-crt.mjs
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const script = join(here, 'build-hero-crt.py');

const res = spawnSync('python3', [script], { stdio: 'inherit', cwd: join(here, '..') });
if (res.status !== 0) {
  console.error('CRT-Bildaufbereitung fehlgeschlagen (python3 + Pillow erforderlich).');
  process.exit(res.status ?? 1);
}
