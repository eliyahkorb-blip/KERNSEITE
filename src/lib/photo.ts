/**
 * Löst ein Motiv aus `src/config/photos.ts` zur Bauzeit auf.
 *
 * Es wird nur ausgeliefert, was tatsächlich als Datei vorliegt. Fehlt ein
 * Motiv, liefert `resolvePhoto` `null` – die aufrufende Seite lässt die
 * Bildfläche dann komplett weg, statt einen grauen Platzhalter zu zeigen.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { photos, type PhotoKey } from '../config/photos';

const WIDTHS = [640, 960, 1280, 1600] as const;
/** Alle Motive sind mittig auf 4:3 beschnitten. */
export const PHOTO_ASPECT = { width: 1600, height: 1200 } as const;

export interface ResolvedPhoto {
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly src: string;
  readonly webpSrcset: string;
  readonly avifSrcset: string;
}

const PUBLIC = join(process.cwd(), 'public');

function srcset(group: string, name: string, ext: 'webp' | 'avif'): string {
  return WIDTHS.filter((w) => existsSync(join(PUBLIC, 'assets', group, `${name}-${w}.${ext}`)))
    .map((w) => `/assets/${group}/${name}-${w}.${ext} ${w}w`)
    .join(', ');
}

export function resolvePhoto(key: PhotoKey, altOverride?: string): ResolvedPhoto | null {
  const entry = photos[key];
  if (!entry) return null;

  const webp = srcset(entry.group, key, 'webp');
  if (!webp) return null;

  const widest = [...WIDTHS]
    .reverse()
    .find((w) => existsSync(join(PUBLIC, 'assets', entry.group, `${key}-${w}.webp`)));

  return {
    alt: altOverride ?? entry.alt,
    width: PHOTO_ASPECT.width,
    height: PHOTO_ASPECT.height,
    src: `/assets/${entry.group}/${key}-${widest}.webp`,
    webpSrcset: webp,
    avifSrcset: srcset(entry.group, key, 'avif'),
  };
}

/** Für Tests und Berichte: welche Motive fehlen noch? */
export function missingPhotos(): string[] {
  return (Object.keys(photos) as PhotoKey[]).filter((k) => resolvePhoto(k) === null);
}
