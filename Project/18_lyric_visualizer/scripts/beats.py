"""Beat grid + onsets from the song (numpy/scipy only, no librosa).

    python scripts/beats.py <project> [--min-bpm 70 --max-bpm 180]

Writes <project>/beats.json = {bpm, beats:[s], downbeats:[s], onsets:[s]}
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

import numpy as np
from scipy.signal import find_peaks, stft

SR = 22050
HOP = 512


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def onset_envelope(y):
    _, _, Z = stft(y, fs=SR, nperseg=2048, noverlap=2048 - HOP, boundary=None)
    S = np.log1p(np.abs(Z) * 100)
    flux = np.maximum(0, np.diff(S, axis=1)).sum(axis=0)
    low = np.maximum(0, np.diff(S[:40], axis=1)).sum(axis=0)  # < ~430 Hz: kick/bass, used for downbeats
    k = np.hanning(7)
    k /= k.sum()
    env = np.convolve(flux, k, mode="same")
    env = (env - env.mean()) / (env.std() + 1e-9)
    return np.maximum(env, 0), np.convolve(low, k, mode="same")


def tempo(env, fr, lo, hi):
    ac = np.correlate(env, env, mode="full")[len(env) - 1:]
    lags = np.arange(len(ac))
    bpm = 60 * fr / np.maximum(lags, 1)
    mask = (bpm >= lo) & (bpm <= hi)
    w = np.exp(-0.5 * (np.log2(bpm / 115) / 0.9) ** 2)  # mild preference around 115 bpm
    lag = lags[mask][np.argmax(ac[mask] * w[mask])]
    return lag


def track(env, lag):
    """Phase that best fits a fixed grid, then each beat snapped to the local onset peak (±15%)."""
    best_phase = max(range(lag), key=lambda p: env[p::lag].sum())
    beats, tol = [], max(1, int(lag * 0.15))
    t = best_phase
    while t < len(env):
        a, b = max(0, t - tol), min(len(env), t + tol + 1)
        beats.append(a + int(np.argmax(env[a:b])) if env[a:b].max() > 0.5 else t)
        t = beats[-1] + lag
    return np.array(beats)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--min-bpm", type=float, default=70)
    ap.add_argument("--max-bpm", type=float, default=180)
    a = ap.parse_args()
    proj = os.path.abspath(a.project)
    cfg = json.load(open(os.path.join(proj, "project.json"), encoding="utf-8"))
    y = decode(os.path.join(proj, "public", cfg["audio"] or "song.mp3"))
    env, low = onset_envelope(y)
    fr = SR / HOP
    lag = tempo(env, fr, a.min_bpm, a.max_bpm)
    beats = track(env, lag)
    bar_phase = max(range(4), key=lambda p: low[beats[p::4]].sum()) if len(beats) >= 8 else 0
    peaks, _ = find_peaks(env, height=1.2, distance=int(0.12 * fr))
    t = lambda frames: [round(max(0.0, float(f) / fr - 0.01), 3) for f in frames]  # noqa: E731
    bpm = 60 / float(np.median(np.diff(beats))) * fr if len(beats) > 2 else 60 * fr / lag
    out = {"bpm": round(bpm, 1), "beats": t(beats), "downbeats": t(beats[bar_phase::4]), "onsets": t(peaks)}
    json.dump(out, open(os.path.join(proj, "beats.json"), "w"), indent=1)
    print(f"bpm {out['bpm']}  beats {len(out['beats'])}  downbeats {len(out['downbeats'])}  onsets {len(out['onsets'])}")


if __name__ == "__main__":
    main()
