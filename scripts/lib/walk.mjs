import { readdirSync } from 'node:fs';
import { join } from 'node:path';

/** Rekursiv Dateien mit passender Endung einsammeln. */
export function walk(dir, extensions) {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((rel) => extensions.some((ext) => rel.endsWith(ext)))
    .map((rel) => join(dir, rel));
}
