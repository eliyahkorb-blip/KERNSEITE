#!/usr/bin/env python3
"""Bereitet alle Fotos für die Auslieferung auf.

Eingang:
  assets-source/branchen/<name>.jpg
  assets-source/leistungen/<name>.jpg

Ausgabe je Motiv:
  <name>-{640,960,1280,1600}.webp
  <name>-{640,960,1280,1600}.avif

Alle Motive werden auf 4:3 beschnitten – dadurch bleibt das
Seitenverhältnis über die ganze Website hinweg berechenbar, auch wenn die
Bilder unterschiedlich groß eingesetzt werden. Die Quelldateien bleiben
liegen und werden nicht ausgeliefert (`.gitignore` schließt sie nicht aus,
weil sie als Nachweis im Repository bleiben sollen).

Der Ausschnitt sitzt standardmäßig mittig. Für Hochformate, bei denen die
Mitte das Motiv ungünstig anschneidet, steht in `FOCUS` eine abweichende
senkrechte Lage: 0 = oben, 0.5 = Mitte, 1 = unten. Ohne Eintrag bleibt es
bei der Mitte, sodass bestehende Motive unverändert erzeugt werden.

Aufruf: `pnpm assets:images`
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
GROUPS = [
    ROOT / 'public/assets/branchen',
    ROOT / 'public/assets/leistungen',
]
WIDTHS = [640, 960, 1280, 1600]
ASPECT = 4 / 3
SUFFIXES = ('.jpg', '.jpeg', '.png', '.webp')

# Senkrechte Lage des Ausschnitts je Motiv (0 = oben, 0.5 = Mitte, 1 = unten).
# Nur für Hochformate nötig, bei denen die Mitte das Motiv anschneidet.
FOCUS: dict[str, float] = {
    # Hochformat. Die Mitte würde die Augen an den oberen Rand schieben; weiter
    # oben käme der aufgestickte Name einer fremden Praxis ins Bild. Bei 0.42
    # stehen Gesicht, Hand, Instrument und Mundspiegel vollständig im Bild.
    'zahnarztpraxen': 0.42,
    # Die Reinigungskraft steht am unteren Bildrand.
    'lokale-dienstleister': 1.0,
}
DEFAULT_FOCUS = 0.5


def crop_to_aspect(im: Image.Image, focus: float = DEFAULT_FOCUS) -> Image.Image:
    w, h = im.size
    if abs(w / h - ASPECT) < 0.005:
        return im
    if w / h > ASPECT:
        new_w = round(h * ASPECT)
        left = (w - new_w) // 2
        return im.crop((left, 0, left + new_w, h))
    new_h = round(w / ASPECT)
    top = int((h - new_h) * focus)
    return im.crop((0, top, w, top + new_h))


def avif_available() -> bool:
    probe = ROOT / '.avif-probe'
    try:
        Image.new('RGB', (8, 8)).save(probe, 'AVIF')
        return True
    except Exception:
        return False
    finally:
        probe.unlink(missing_ok=True)


def save_verified(im: Image.Image, target: Path, format: str, **options) -> None:
    temporary = target.with_suffix(target.suffix + '.tmp')
    try:
        im.save(temporary, format, **options)
        if temporary.stat().st_size == 0:
            raise RuntimeError(f'Leere Bilddatei: {target}')
        with Image.open(temporary) as check:
            check.load()
            if check.size != im.size:
                raise RuntimeError(f'Falsche Bildabmessungen: {target}')
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)


def main() -> int:
    has_avif = avif_available()
    if not has_avif:
        print('Hinweis: Pillow ohne AVIF-Encoder – es wird nur WebP erzeugt.')

    total = 0
    for group in GROUPS:
        src_dir = ROOT / 'assets-source' / group.name
        if not src_dir.exists():
            continue
        group.mkdir(parents=True, exist_ok=True)

        sources = sorted(p for p in src_dir.iterdir() if p.suffix.lower() in SUFFIXES)
        for src in sources:
            im = crop_to_aspect(Image.open(src).convert('RGB'), FOCUS.get(src.stem, DEFAULT_FOCUS))
            for width in WIDTHS:
                height = round(width / ASPECT)
                resized = im.resize((width, height), Image.LANCZOS)
                save_verified(resized, group / f'{src.stem}-{width}.webp', 'WEBP', quality=80, method=6)
                total += 1
                if has_avif:
                    save_verified(resized, group / f'{src.stem}-{width}.avif', 'AVIF', quality=58)
                    total += 1
            print(f'{group.name}/{src.stem}: {len(WIDTHS)} Breiten aus {src.name}')

    print(f'\n{total} Datei(en) geschrieben.')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
