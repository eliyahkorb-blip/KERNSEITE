#!/usr/bin/env python3
"""Bereitet die fünf Branchenmotive für die Auslieferung auf.

Eingang:  public/assets/branchen/source/<slug>.<jpg|jpeg|png|webp>
Ausgabe:  public/assets/branchen/<slug>-{640,960,1280,1600}.{webp,avif}

Alle Motive werden mittig auf 4:3 beschnitten, damit das Branchenraster ein
einheitliches Bildfenster behält. Die Originaldateien bleiben liegen und
werden nicht ausgeliefert.

Ablauf beim Einsetzen eines Motivs:

  1. Foto von unsplash.com herunterladen (kostenlos, kein Unsplash+).
  2. Als public/assets/branchen/source/<slug>.jpg ablegen.
  3. python3 scripts/build-industry-images.py
  4. Fotograf, Photo-ID und Quell-URL in docs/ASSET_LICENSES.md eintragen
     und den Eintrag aus docs/ASSET_TODO.md entfernen.

Benötigt: Pillow. AVIF wird nur geschrieben, wenn Pillow den Encoder
mitbringt – sonst bleibt es bei WebP, und `<picture>` liefert WebP aus.
"""

from __future__ import annotations

import sys
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/assets/branchen/source'
OUT = ROOT / 'public/assets/branchen'

SLUGS = [
    'handwerk',
    'zahnarztpraxen',
    'gastronomie-hotels',
    'lokale-dienstleister',
    'b2b-mittelstand',
]
WIDTHS = [640, 960, 1280, 1600]
ASPECT = 4 / 3
SUFFIXES = ('.jpg', '.jpeg', '.png', '.webp')


def find_source(slug: str) -> Path | None:
    for suffix in SUFFIXES:
        p = SRC / f'{slug}{suffix}'
        if p.exists():
            return p
    return None


def crop_to_aspect(im: Image.Image) -> Image.Image:
    w, h = im.size
    if w / h > ASPECT:
        new_w = round(h * ASPECT)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = round(w / ASPECT)
    top = (h - new_h) // 2
    return im.crop((0, top, w, top + new_h))


def avif_available() -> bool:
    try:
        Image.new('RGB', (4, 4)).save(ROOT / '.avif-probe', 'AVIF')
    except Exception:
        return False
    finally:
        (ROOT / '.avif-probe').unlink(missing_ok=True)
    return True


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    SRC.mkdir(parents=True, exist_ok=True)

    has_avif = avif_available()
    if not has_avif:
        print('Hinweis: Pillow ohne AVIF-Encoder – es wird nur WebP erzeugt.')

    missing: list[str] = []
    written = 0

    for slug in SLUGS:
        source = find_source(slug)
        if source is None:
            missing.append(slug)
            continue

        im = crop_to_aspect(Image.open(source).convert('RGB'))
        for width in WIDTHS:
            height = round(width / ASPECT)
            resized = im.resize((width, height), Image.LANCZOS)
            resized.save(OUT / f'{slug}-{width}.webp', 'WEBP', quality=80, method=6)
            written += 1
            if has_avif:
                resized.save(OUT / f'{slug}-{width}.avif', 'AVIF', quality=58)
                written += 1
        print(f'{slug}: {len(WIDTHS)} Breiten aus {source.name} ({im.size[0]}×{im.size[1]})')

    if missing:
        print(f'\nOhne Quelldatei ({len(missing)}): {", ".join(missing)}')
        print(f'Erwartet unter {SRC.relative_to(ROOT)}/<slug>.jpg – siehe docs/ASSET_TODO.md.')
    print(f'\n{written} Datei(en) geschrieben.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
