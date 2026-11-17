"""clip.py: long video in, vertical captioned clips out.

  python clip.py my_video.mp4 [--k 3] [--win 30] [--model small] [--out clips] [--solution]

Needs: Python 3.9+, `pip install faster-whisper numpy`, and ffmpeg + ffprobe on PATH.
Only run it on videos you own or have permission to use.
"""
import argparse
import os
import time

import common

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("--k", type=int, default=3)
ap.add_argument("--win", type=int, default=30)
ap.add_argument("--model", default="small")
ap.add_argument("--out", default="clips")
ap.add_argument("--solution", action="store_true")
a = ap.parse_args()

pick_moments = __import__("solution" if a.solution else "starter").pick_moments
t0 = time.time()
dur = common.duration(a.video)
print(f"video: {os.path.basename(a.video)}  {dur / 60:.1f} min")

words = common.transcribe(a.video, a.model)
print(f"[1/4] {len(words)} words with timestamps")
loud = common.loudness(a.video)
print(f"[2/4] picking the best {a.k} x {a.win}s moments...")
moments = pick_moments(words, loud, dur, win=a.win, k=a.k)
if not moments:
    raise SystemExit("no moments found (starter.py still empty? run: python test.py)")

os.makedirs(a.out, exist_ok=True)
for i, (s, e, score) in enumerate(moments, 1):
    out = os.path.join(a.out, f"clip_{i}.mp4")
    print(f"[3-4/4] clip_{i}: {int(s // 60)}:{int(s % 60):02d} - {int(e // 60)}:{int(e % 60):02d}  score {score}  -> {out}", flush=True)
    common.cut_clip(a.video, s, e, words, out)

print(f"done: {len(moments)} vertical clips, 1080x1920, captions burned, no watermark  ({time.time() - t0:.0f}s total)")
