/**
 * Ermittelt zur Bauzeit, welche Branchenmotive tatsächlich vorliegen.
 *
 * Es wird nur gerendert, was da ist: keine grauen Platzhalter, keine
 * schwarzen Ersatzlinien, kein zweckentfremdeter Kunden-Screenshot. Liegt
 * ein Motiv nicht vor, erscheint der Eintrag ohne Bildfläche – das Raster
 * bleibt dabei gleichmäßig, weil alle Einträge denselben Aufbau haben.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { INDUSTRY_ASPECT, INDUSTRY_WIDTHS, industryMotifs } from '../config/media';

export interface ResolvedMotif {
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  /** Fallback-Quelle (größtes WebP). */
  readonly src: string;
  readonly webpSrcset: string;
  /** Leer, wenn keine AVIF-Varianten vorliegen. */
  readonly avifSrcset: string;
  readonly sizes: string;
}

const DIR = join(process.cwd(), 'public', 'assets', 'branchen');

function srcset(name: string, ext: 'webp' | 'avif'): string {
  return INDUSTRY_WIDTHS.filter((w) => existsSync(join(DIR, `${name}-${w}.${ext}`)))
    .map((w) => `/assets/branchen/${name}-${w}.${ext} ${w}w`)
    .join(', ');
}

/**
 * Liefert das Motiv einer Branche oder `null`, wenn keine Datei vorliegt.
 * `sizes` beschreibt das dreispaltige Raster.
 */
export function resolveIndustryMotif(slug: string): ResolvedMotif | null {
  const motif = industryMotifs[slug];
  if (!motif) return null;

  const webp = srcset(motif.name, 'webp');
  if (!webp) return null;

  const widest = [...INDUSTRY_WIDTHS]
    .reverse()
    .find((w) => existsSync(join(DIR, `${motif.name}-${w}.webp`)));

  return {
    alt: motif.alt,
    width: INDUSTRY_ASPECT.width,
    height: INDUSTRY_ASPECT.height,
    src: `/assets/branchen/${motif.name}-${widest}.webp`,
    webpSrcset: webp,
    avifSrcset: srcset(motif.name, 'avif'),
    sizes: '(min-width: 69rem) 30vw, (min-width: 48rem) 46vw, 100vw',
  };
}

/** Für Tests und Berichte: welche Motive fehlen noch? */
export function missingIndustryMotifs(): string[] {
  return Object.keys(industryMotifs).filter((slug) => resolveIndustryMotif(slug) === null);
}
