#!/usr/bin/env python3
"""Erzeugt das finale CRT-Hero-Motiv aus dem Originalfoto.

Ausgangsmaterial:  public/assets/references/source/hero-kernseite-poster.png
Ergebnis:          public/assets/video/hero-kernseite-final*.webp
                   public/assets/references/source/hero-kernseite-final.png

Was das Skript am Bild verändert:

1. Die beiden leuchtenden „Augen“ verschwinden vollständig. Dafür wird die
   Glasscheibe als Fläche bestimmt und komplett neu aufgebaut – es bleibt weder
   die Augenform noch ihr Lichthof zurück.
2. Der Bildschirm bekommt KERNSEITE-Cyan (#00E3F2). Die Wölbung der Röhre
   bleibt erhalten: Die Maske stammt aus dem Foto, der Helligkeitsverlauf vom
   dunklen Rand zur hellen Mitte wird aus dem Original gemessen (Median je
   Abstandsring) und nur in der Helligkeit neu abgebildet. Richtungsgradient,
   Randreflexe und die gemessenen Scanlines (Periode 5 px) kommen ebenfalls
   aus dem Foto.
3. Der Schriftzug KERNSEITE steht in Schwarz mittig auf dem echten Bildschirm –
   in der gemessenen Ebene des Monitors, mit den Scanlines darüber, damit er
   Teil des Bildes bleibt und nicht aufgeklebt wirkt.
4. Der Cyan-Lichtsaum auf der Blende wird vereinheitlicht, damit dort keine
   zwei Lichtinseln der früheren Augen zurückbleiben.
5. Der Schriftzug auf dem Gehäuseschild wird retuschiert. Das Schild bleibt,
   das Wort steht danach nur noch einmal im Bild – auf dem Bildschirm.

Benötigt: Pillow + numpy (lokal, keine externen Dienste).
"""

from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'public/assets/references/source/hero-kernseite-poster.png'
OUT_DIR = ROOT / 'public/assets/video'
OUT_PNG = ROOT / 'public/assets/references/source/hero-kernseite-final.png'

CYAN = np.array([0x00, 0xE3, 0xF2], dtype=float)

FONT_CANDIDATES = [
    Path('/mnt/skills/examples/canvas-design/canvas-fonts/BricolageGrotesque-Bold.ttf'),
    Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'),
]

SS = 3
WORD = 'KERNSEITE'

# Suchfenster um den Monitorkopf (aus dem Motiv bestimmt).
MON = (120, 470, 800, 1260)  # y0, y1, x0, x1
SEED = (300, 1030)

# Gehäuseschild: Innenfläche und der zu retuschierende Schriftbereich.
PLATE_ROWS = (474, 496)
PLATE_TEXT = (962, 1060)
PLATE_LEFT = (944, 961)
PLATE_RIGHT = (1062, 1082)

SCAN_PERIOD = 5.0
SCAN_PHASE = 4.0

# Breite des schwarzen Röhrenrahmens im Foto – dieser Rand bleibt unangetastet.
RIM_INSET = 10.0
# Restleuchten direkt an der Kante der neu gezeichneten Fläche.
RIM_LEVEL = 0.06


# --------------------------------------------------------------------------
def box_blur(arr: np.ndarray, radius: int, passes: int = 3) -> np.ndarray:
    """Separierbarer Box-Blur (mehrfach ≈ Gauß) – ohne SciPy."""
    if radius < 1:
        return arr.astype(float)
    out = arr.astype(float)
    k = 2 * radius + 1
    for _ in range(passes):
        pad = np.pad(out, ((radius, radius), (0, 0)), mode='edge')
        cs = np.vstack([np.zeros((1, out.shape[1])), np.cumsum(pad, axis=0)])
        out = (cs[k:, :] - cs[:-k, :]) / k
        pad = np.pad(out, ((0, 0), (radius, radius)), mode='edge')
        cs = np.hstack([np.zeros((out.shape[0], 1)), np.cumsum(pad, axis=1)])
        out = (cs[:, k:] - cs[:, :-k]) / k
    return out


def masked_blur(arr: np.ndarray, mask: np.ndarray, radius: int) -> np.ndarray:
    """Weichzeichnen ohne Einfluss der Pixel außerhalb der Maske."""
    num = box_blur(arr * mask, radius)
    den = box_blur(mask.astype(float), radius)
    return np.where(den > 1e-6, num / np.maximum(den, 1e-6), 0.0)


def morph(mask: np.ndarray, size: int, grow: bool) -> np.ndarray:
    img = Image.fromarray((mask * 255).astype(np.uint8), 'L')
    f = ImageFilter.MaxFilter if grow else ImageFilter.MinFilter
    remaining = size
    while remaining >= 3:
        s = min(9, remaining if remaining % 2 else remaining - 1)
        img = img.filter(f(s))
        remaining -= s - 1
    return np.asarray(img) > 127


def polar_boundary(
    mask: np.ndarray, cx: float, cy: float, steps: int = 720
) -> np.ndarray:
    """Randradius der Fläche je Winkel – Grundlage für eine saubere Kontur.

    Das Foto zeigt am linken Blendenrand einen Lichtaustritt, der die
    Rohmaske ausbeult. Über den Radius je Winkel lassen sich solche Kerben
    und Beulen glätten, ohne die Wölbung der Röhre zu verlieren.
    """
    h, w = mask.shape
    ang = np.arange(steps) * (2 * np.pi / steps)
    ca, sa = np.cos(ang), np.sin(ang)
    rr = np.arange(0.0, max(h, w), 0.5)
    px = np.clip((cx + ca[:, None] * rr[None, :]).round().astype(int), 0, w - 1)
    py = np.clip((cy + sa[:, None] * rr[None, :]).round().astype(int), 0, h - 1)
    hit = mask[py, px]
    last = np.where(hit.any(axis=1), hit.shape[1] - 1 - np.argmax(hit[:, ::-1], axis=1), 0)
    radius = rr[last]

    def circ(arr: np.ndarray, k: int, fn) -> np.ndarray:
        pad = np.concatenate([arr[-k:], arr, arr[:k]])
        win = np.lib.stride_tricks.sliding_window_view(pad, 2 * k + 1)
        return fn(win, axis=-1)

    radius = circ(radius, 6, np.median)

    # Robuste Fourier-Näherung: Ausbeulungen nach außen (Lichtaustritt an der
    # Blende) werden abgewertet, die Wölbung der Röhre bleibt erhalten.
    phi = np.arange(steps) * (2 * np.pi / steps)
    cols = [np.ones(steps)]
    for k in range(1, 9):
        cols += [np.cos(k * phi), np.sin(k * phi)]
    A = np.stack(cols, axis=1)
    w = np.ones(steps)
    fit = radius
    for _ in range(4):
        coef, *_ = np.linalg.lstsq(A * w[:, None], radius * w, rcond=None)
        fit = A @ coef
        res = radius - fit
        sd = max(float(np.std(res)), 1e-6)
        w = np.clip(1.0 - np.clip(res / (1.6 * sd), 0.0, 1.0), 0.08, 1.0)
    return fit


def polar_fields(
    shape: tuple[int, int], cx: float, cy: float, radius: np.ndarray, feather: float = 3.0
) -> tuple[np.ndarray, np.ndarray]:
    """Liefert (alpha, s): weiche Maske und normierten Radius 0…1."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    dy, dx = yy - cy, xx - cx
    rho = np.hypot(dx, dy)
    phi = np.arctan2(dy, dx) % (2 * np.pi)
    steps = len(radius)
    pos = phi * steps / (2 * np.pi)
    i0 = np.floor(pos).astype(int) % steps
    i1 = (i0 + 1) % steps
    t = pos - np.floor(pos)
    R = radius[i0] * (1 - t) + radius[i1] * t
    alpha = np.clip((R - rho) / feather + 0.5, 0.0, 1.0)
    s = np.clip(rho / np.maximum(R, 1e-6), 0.0, 1.0)
    return alpha, s


def load_font(px: int) -> ImageFont.FreeTypeFont:
    for path in FONT_CANDIDATES:
        if path.exists():
            return ImageFont.truetype(str(path), px)
    raise SystemExit('Keine geeignete TTF-Schrift gefunden.')


def flood(mask: np.ndarray, seed: tuple[int, int]) -> np.ndarray:
    seen = np.zeros_like(mask)
    if not mask[seed]:
        raise SystemExit('Startpunkt der Glasfläche liegt nicht in der Maske.')
    q = deque([seed])
    seen[seed] = True
    h, w = mask.shape
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and mask[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                q.append((ny, nx))
    return seen


# --------------------------------------------------------------------------
def main() -> int:
    if not SRC.exists():
        print(f'Quelle fehlt: {SRC}', file=sys.stderr)
        return 1

    im = Image.open(SRC).convert('RGB')
    W, H = im.size
    a = np.asarray(im).astype(float)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = 0.2126 * r + 0.7152 * g + 0.0722 * b

    # ---- 1. Glasscheibe als Fläche bestimmen -----------------------------
    box = np.zeros((H, W), bool)
    box[MON[0]:MON[1], MON[2]:MON[3]] = True
    candidate = box & (((lum < 24) & (b >= r - 8)) | (b > r + 15))
    pane = flood(candidate, SEED)

    img = Image.fromarray((pane * 255).astype(np.uint8), 'L')
    img = img.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(9))
    raw = np.asarray(img) > 127

    ys, xs = np.nonzero(raw)
    cx, cy = float(xs.mean()), float(ys.mean())
    radius = polar_boundary(raw, cx, cy)

    # Der schwarze Rahmen der Röhre bleibt aus dem Foto stehen: neu gezeichnet
    # wird nur die Fläche innerhalb davon. So bleibt die Gehäusekante
    # unberührt und der neue Verlauf geht nahtlos in den echten Rand über.
    paint = radius - RIM_INSET
    alpha, s = polar_fields(raw.shape, cx, cy, paint)
    glass = alpha > 0.5

    ys, xs = np.nonzero(glass)
    print(f'Scheibe gesamt: Radius {radius.min():.0f}..{radius.max():.0f} px, '
          f'{int(raw.sum())} px')
    print(f'Neu gezeichnete Fläche: x {xs.min()}..{xs.max()}, y {ys.min()}..{ys.max()}, '
          f'{int(glass.sum())} px, Mitte ({cx:.1f}, {cy:.1f}), Rand {RIM_INSET} px eingerückt')

    # ---- 2. Lichtverlauf aus dem Original messen -------------------------

    eye = glass & (lum > 95)
    eye_dil = morph(eye, 45, True)
    keep = glass & ~eye_dil
    print(f'Augen: {int(eye.sum())} px, mit Lichthof {int(eye_dil.sum())} px, '
          f'Messfläche {int(keep.sum())} px')

    # Profil P(s): Median der Original-Luminanz je Abstandsring
    bins = np.linspace(0.0, 1.0, 41)
    centers, values = [], []
    for i in range(len(bins) - 1):
        sel = keep & (s >= bins[i]) & (s < bins[i + 1])
        if sel.sum() >= 60:
            centers.append((bins[i] + bins[i + 1]) / 2)
            values.append(float(np.median(lum[sel])))
    centers = np.array(centers)
    values = np.array(values)
    print(f'Profil gemessen für s = {centers.min():.2f}..{centers.max():.2f} '
          f'({len(centers)} Ringe), Luminanz {values.min():.0f}..{values.max():.0f}')
    # Monotone Glättung und flache Fortsetzung zur Mitte hin
    values = np.convolve(values, np.ones(3) / 3, mode='same')
    values[0], values[-1] = values[1], values[-2]
    prof = np.interp(s, centers, values, left=values[0], right=values[-1])

    # Richtungsgradient (asymmetrische Ausleuchtung) aus dem Original
    ky, kx = np.nonzero(keep)
    u = (kx - cx) / 180.0
    v = (ky - cy) / 140.0
    A = np.stack([np.ones(len(ky)), u, v], axis=1)
    coef, *_ = np.linalg.lstsq(A, lum[ky, kx] - prof[ky, kx], rcond=None)
    lin = coef[0] + coef[1] * (np.arange(W)[None, :] - cx) / 180.0 \
        + coef[2] * (np.arange(H)[:, None] - cy) / 140.0
    print(f'Richtungsgradient: {coef[1]:+.1f} horizontal, {coef[2]:+.1f} vertikal')

    # Feinstruktur (Randreflexe der Glasscheibe) ohne den Scanline-Anteil
    resid = np.where(keep, lum - prof - lin, 0.0)
    resid = masked_blur(resid, keep, 13)
    fade = np.clip(box_blur(keep.astype(float), 13, passes=2), 0, 1)
    structure = np.clip(resid, -7, 7) * fade

    shade = prof + lin + structure
    lo = float(np.percentile(shade[glass], 1))
    hi = float(np.percentile(shade[glass], 99))
    norm = np.clip((shade - lo) / max(hi - lo, 1e-6), 0.0, 1.0)

    # ---- 3. Neue Bildschirmfläche ---------------------------------------
    # Leuchtdichte: an der Kante fast schwarz, damit der Übergang in den
    # stehengebliebenen Röhrenrahmen unsichtbar bleibt; Mitte volles Cyan.
    factor = RIM_LEVEL + (1.0 - RIM_LEVEL) * (norm ** 0.85) * (1.0 - 0.10 * s ** 2)
    factor *= np.clip((1.0 - s) / 0.08, 0.0, 1.0)
    yy = np.arange(H, dtype=float)[:, None] * np.ones((1, W))
    scan = 1.0 + 0.05 * np.cos(2 * np.pi * (yy - SCAN_PHASE) / SCAN_PERIOD)

    # Glasreflexion: breiter, sehr flacher Streifen über die gewölbte Scheibe.
    xxg = np.arange(W, dtype=float)[None, :] * np.ones((H, 1))
    proj = ((xxg - cx) * 0.64 + (yy - cy) * -0.77) / 150.0
    sheen = np.exp(-((proj + 0.55) ** 2) / 0.30) * 0.085

    f = np.clip(factor * scan + sheen, 0.0, 1.25)

    screen = CYAN[None, None, :] * f[..., None]
    bloom = np.clip((f - 0.9) / 0.25, 0, 1)[..., None]
    screen = screen * (1 - 0.22 * bloom) + 255.0 * 0.22 * bloom
    screen = np.clip(screen, 0, 255)

    out = a * (1 - alpha[..., None]) + screen * alpha[..., None]

    # ---- 4. Schriftzug auf dem Glas --------------------------------------
    safe = morph(glass, 41, False)
    sm = Image.fromarray((safe * 255).astype(np.uint8), 'L')

    best = None
    for ang in np.arange(-9.0, 9.01, 0.25):
        bb = sm.rotate(ang, resample=Image.BILINEAR, center=(cx, cy)).getbbox()
        area = (bb[2] - bb[0]) * (bb[3] - bb[1])
        if best is None or area < best[1]:
            best = (float(ang), area)
    theta = best[0]

    rot = np.asarray(sm.rotate(theta, resample=Image.BILINEAR, center=(cx, cy))) > 127
    rys, rxs = np.nonzero(rot)
    ry0, ry1 = int(rys.min()), int(rys.max())
    rcy = (ry0 + ry1) / 2.0
    band_h = (ry1 - ry0) * 0.30
    lo_y, hi_y = int(rcy - band_h / 2), int(rcy + band_h / 2) + 1
    left = max(int(np.nonzero(rot[y])[0].min()) for y in range(lo_y, hi_y))
    right = min(int(np.nonzero(rot[y])[0].max()) for y in range(lo_y, hi_y))
    rcx = (left + right) / 2.0
    avail_w = (right - left) * 0.80
    avail_h = band_h * 0.72
    print(f'Bildschirmneigung {theta:+.2f}°, Textfeld {right - left}×{int(band_h)} px')

    size, font = 10, load_font(10 * SS)
    while size < 400:
        cand = load_font((size + 2) * SS)
        bb = cand.getbbox(WORD)
        if (bb[2] - bb[0]) / SS > avail_w or (bb[3] - bb[1]) / SS > avail_h:
            break
        size += 2
        font = cand
    bb = font.getbbox(WORD)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    print(f'Schriftgröße {size} px, Schriftzug {tw / SS:.0f}×{th / SS:.0f} px')

    layer = Image.new('L', (W * SS, H * SS), 0)
    ImageDraw.Draw(layer).text(
        (rcx * SS - tw / 2 - bb[0], rcy * SS - th / 2 - bb[1]), WORD, fill=255, font=font
    )
    layer = layer.rotate(-theta, resample=Image.BICUBIC, center=(cx * SS, cy * SS))
    layer = layer.resize((W, H), Image.LANCZOS)
    txt = np.clip(np.asarray(layer).astype(float) / 255.0, 0, 1) * (alpha > 0.5)

    outside = int(((txt > 0.02) & ~safe).sum())
    print(f'Textpixel außerhalb der sicheren Glasfläche: {outside}')
    if outside:
        print('Warnung: Der Schriftzug berührt den Bildschirmrand.', file=sys.stderr)

    peak = np.clip(np.cos(2 * np.pi * (yy - SCAN_PHASE) / SCAN_PERIOD), 0, 1)
    ink = CYAN[None, None, :] * (0.11 * peak)[..., None]
    out = out * (1 - txt[..., None]) + ink * txt[..., None]

    # ---- 5. Lichtsaum auf der Blende vereinheitlichen --------------------
    ring = morph(glass, 33, True) & ~glass
    old = np.clip(b - r, 0.0, 255.0) * ring
    smooth = masked_blur(old, ring, 11)
    falloff = np.clip(box_blur(glass.astype(float), 11, passes=3), 0, 1)
    fmax = max(float(falloff[ring].max()), 1e-6)
    target = np.clip(smooth / max(float(smooth[ring].max()), 1e-6), 0, 1)
    target = target * (falloff / fmax) * float(np.percentile(old[ring], 97))
    delta = (target - old) * ring
    out[..., 1] += delta * 0.55
    out[..., 2] += delta

    # ---- 6. Schriftzug auf dem Gehäuseschild retuschieren ----------------
    ry_a, ry_b = PLATE_ROWS
    tx_a, tx_b = PLATE_TEXT
    for y in range(ry_a, ry_b):
        lref = np.median(out[y, PLATE_LEFT[0]:PLATE_LEFT[1] + 1, :], axis=0)
        rref = np.median(out[y, PLATE_RIGHT[0]:PLATE_RIGHT[1] + 1, :], axis=0)
        t = np.linspace(0.0, 1.0, tx_b - tx_a)[:, None]
        out[y, tx_a:tx_b, :] = lref[None, :] * (1 - t) + rref[None, :] * t
    # Kanten der Retusche weich einbetten
    patch = out[ry_a - 4:ry_b + 4, tx_a - 6:tx_b + 6, :]
    ph, pw, _ = patch.shape
    soft = np.zeros((ph, pw))
    soft[4:-4, 6:-6] = 1.0
    soft = box_blur(soft, 2, passes=2)[..., None]
    blurred = np.stack([box_blur(patch[..., c], 1, passes=1) for c in range(3)], axis=-1)
    out[ry_a - 4:ry_b + 4, tx_a - 6:tx_b + 6, :] = patch * (1 - 0.35 * soft) + blurred * 0.35 * soft
    print(f'Gehäuseschild retuschiert: x {tx_a}..{tx_b}, y {ry_a}..{ry_b}')

    # ---- 7. Ausgabe ------------------------------------------------------
    final = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB')
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    final.save(OUT_PNG)

    pw = 1052
    px = max(0, min(W - pw, int(round(cx - pw / 2))))
    targets = [
        ('hero-kernseite-final.webp', final),
        ('hero-kernseite-final-1280.webp', final.resize((1280, round(1280 * H / W)), Image.LANCZOS)),
        ('hero-kernseite-final-900.webp', final.resize((900, round(900 * H / W)), Image.LANCZOS)),
        ('hero-kernseite-final-portrait.webp', final.crop((px, 0, px + pw, H))),
    ]
    for name, img in targets:
        p = OUT_DIR / name
        img.save(p, 'WEBP', quality=88, method=6)
        print(f'{name}: {img.size[0]}×{img.size[1]} px, {p.stat().st_size // 1024} KB')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
