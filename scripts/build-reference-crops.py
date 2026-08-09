#!/usr/bin/env python3
"""Erzeugt Bildausschnitte in wechselnden Formaten aus vorhandenem Echtmaterial.

Grundlage sind ausschließlich Dateien aus `public/assets/references/source/`:
die beiden Projekt-Screenshots und das eigene CRT-Motiv der Marke. Es wird
nichts erfunden und nichts von fremden Servern geladen – die Ausschnitte
sorgen nur dafür, dass die Seite nicht überall dasselbe 16:9-Format zeigt.

Ausgabe:
  public/assets/references/kernseite-crt-square.webp (1:1, eigenes Motiv)
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/assets/references/source'
REF = ROOT / 'public/assets/references'
IND = ROOT / 'public/assets/branchen'

# (Quelle, Ziel, Ausschnitt (l, o, r, u), Zielbreite)
#
# Screenshots von Kundenprojekten gehören ausschließlich in den Bereich
# „Arbeiten“. Sie werden NICHT als Branchen-Stimmungsbilder zweckentfremdet –
# ein Website-Ausschnitt zeigt nicht das Gewerk, sondern nur unsere Arbeit.
JOBS = [
    # Eigenes Markenmotiv, quadratischer Ausschnitt auf den Monitorkopf.
    ('hero-kernseite-final.png', REF / 'kernseite-crt-square.webp', (735, 55, 1385, 705), 900),
]


def main() -> int:
    IND.mkdir(parents=True, exist_ok=True)
    REF.mkdir(parents=True, exist_ok=True)
    for name, out, box, width in JOBS:
        src = SRC / name
        if not src.exists():
            print(f'FEHLT: {src}')
            return 1
        im = Image.open(src).convert('RGB')
        box = (box[0], box[1], min(box[2], im.size[0]), min(box[3], im.size[1]))
        crop = im.crop(box)
        height = round(width * crop.size[1] / crop.size[0])
        crop = crop.resize((width, height), Image.LANCZOS)
        crop.save(out, 'WEBP', quality=86, method=6)
        print(f'{out.relative_to(ROOT)}: {width}×{height} px, {out.stat().st_size // 1024} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
