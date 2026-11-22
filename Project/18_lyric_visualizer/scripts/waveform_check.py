"""Sync picture: waveform + beats + word timestamps + declared motion hits.

    python scripts/waveform_check.py <project> [--from 0 --to 20] [--out out/sync.png]

Rows: waveform (grey) with beat ticks (thin) and downbeats (thick); word blocks per line (red = key word);
motion hits from <project>/hits.json ([{"t": 1.5, "label": "coin lands"}]) as red triangles.
A hit that is not on a beat tick or a word start is visibly off — fix the scene.
"""
import sys as _sys
for _s in (_sys.stdout, _sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252 (Hindi text crashes)
    except Exception:
        pass
import argparse
import json
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _hindi import romanise  # noqa: E402

PAPER, INK, SOFT, RED = (243, 234, 215), (42, 39, 36), (160, 150, 135), (200, 53, 43)


def font(size):
    for f in ["arial.ttf", "DejaVuSans.ttf", "Helvetica.ttc"]:
        try:
            return ImageFont.truetype(f, size)
        except OSError:
            pass
    return ImageFont.load_default()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--from", dest="t0", type=float, default=0)
    ap.add_argument("--to", dest="t1", type=float, default=None)
    ap.add_argument("--out", default=None)
    a = ap.parse_args()
    proj = os.path.abspath(a.project)
    cfg = json.load(open(os.path.join(proj, "project.json"), encoding="utf-8"))
    phrases = json.load(open(os.path.join(proj, "phrases.json"), encoding="utf-8"))
    beats = json.load(open(os.path.join(proj, "beats.json"), encoding="utf-8"))
    hits_path = os.path.join(proj, "hits.json")
    hits = json.load(open(hits_path, encoding="utf-8")) if os.path.exists(hits_path) else []
    t0 = a.t0
    t1 = a.t1 or cfg["durationInSeconds"]

    sr = 8000
    raw = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t0), "-t", str(t1 - t0), "-i", os.path.join(proj, "public", cfg["audio"]),
                          "-ac", "1", "-ar", str(sr), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    y = np.frombuffer(raw, dtype=np.float32)

    W = max(1600, int((t1 - t0) * 120))
    H = 520
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img)
    f_small, f_mid = font(13), font(16)
    X = lambda t: int((t - t0) / (t1 - t0) * (W - 40)) + 20  # noqa: E731

    # waveform
    cols = W - 40
    if len(y):
        chunks = np.array_split(np.abs(y), cols)
        amp = np.array([c.max() if len(c) else 0 for c in chunks])
        amp = amp / (amp.max() + 1e-9)
        for i, v in enumerate(amp):
            d.line([(20 + i, 150 - v * 110), (20 + i, 150 + v * 110)], fill=SOFT)
    # seconds grid
    for s in range(int(t0), int(t1) + 1):
        d.line([(X(s), 20), (X(s), H - 10)], fill=(225, 214, 192))
        d.text((X(s) + 2, 22), f"{s}s", fill=INK, font=f_small)
    # beats
    for b in beats.get("beats", []):
        if t0 <= b <= t1:
            d.line([(X(b), 40), (X(b), 260)], fill=INK, width=1)
    for b in beats.get("downbeats", []):
        if t0 <= b <= t1:
            d.line([(X(b), 40), (X(b), 260)], fill=INK, width=3)
    # words
    for p in phrases:
        if p["end"] < t0 or p["start"] > t1:
            continue
        row = 290 + (p["i"] % 2) * 70
        d.text((X(max(t0, p["start"])), row - 20), f"L{p['i']}  conf {p.get('confidence', 1):.2f}", fill=INK, font=f_small)
        for w in p["words"]:
            c = RED if w["key"] else INK
            d.rectangle([X(w["s"]), row, max(X(w["s"]) + 2, X(w["e"])), row + 22], outline=c, width=2)
            d.line([(X(w["s"]), row), (X(w["s"]), 260)], fill=c if w["key"] else (200, 190, 170), width=1)
            d.text((X(w["s"]) + 3, row + 3), romanise(w["w"])[:10], fill=c, font=f_small)
    # motion hits
    for h in hits:
        if t0 <= h["t"] <= t1:
            x = X(h["t"])
            d.polygon([(x - 8, 440), (x + 8, 440), (x, 425)], fill=RED)
            d.line([(x, 40), (x, 425)], fill=RED, width=2)
            d.text((x + 10, 445), h.get("label", "hit"), fill=RED, font=f_mid)
    d.text((20, H - 30), f"{cfg['title']}  {t0:.1f}-{t1:.1f}s   bpm {beats.get('bpm')}   thin=beat thick=downbeat  box=word (red=key)  red triangle=motion hit", fill=INK, font=f_mid)

    out = a.out or os.path.join(proj, "out", f"sync_{t0:.0f}-{t1:.0f}.png")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print(f"-> {out}")


if __name__ == "__main__":
    main()
