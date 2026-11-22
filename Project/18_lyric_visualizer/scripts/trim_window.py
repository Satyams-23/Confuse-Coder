"""Cut a project down to one section of the song (e.g. a 20-25 s hook) WITHOUT re-running Whisper.

    python scripts/trim_window.py <project> --from 72.9 --to 97.85 --lines 13-18 [--fade 0.3]

- keeps the full song as public/song_full.mp3 and the full lyrics as lyrics_full.txt (first run only)
- public/song.mp3 = the window (short fade in/out), project.json duration updated
- out/transcript.json = only the ASR words inside the window, shifted to start at 0
- lyrics.txt = only the chosen lyric lines (1-based, inclusive, counted in lyrics_full.txt ignoring # comments)
Then: python scripts/align.py <project> --skip-asr  and  python scripts/beats.py <project>
"""
import sys as _sys
for _s in (_sys.stdout, _sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass
import argparse
import json
import os
import shutil
import subprocess


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--from", dest="t0", type=float, required=True)
    ap.add_argument("--to", dest="t1", type=float, required=True)
    ap.add_argument("--lines", required=True, help="lyric line range in the FULL lyrics, 1-based inclusive, e.g. 13-18")
    ap.add_argument("--fade", type=float, default=0.3)
    a = ap.parse_args()
    proj = os.path.abspath(a.project)
    pub = os.path.join(proj, "public")
    full_mp3, mp3 = os.path.join(pub, "song_full.mp3"), os.path.join(pub, "song.mp3")
    full_lyr, lyr = os.path.join(proj, "lyrics_full.txt"), os.path.join(proj, "lyrics.txt")
    out = os.path.join(proj, "out")
    full_tr, tr = os.path.join(out, "transcript_full.json"), os.path.join(out, "transcript.json")
    if not os.path.exists(full_mp3):
        shutil.copy(mp3, full_mp3)
    if not os.path.exists(full_lyr):
        shutil.copy(lyr, full_lyr)
    if not os.path.exists(full_tr) and os.path.exists(tr):
        shutil.copy(tr, full_tr)

    dur = a.t1 - a.t0
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(a.t0), "-t", str(dur), "-i", full_mp3,
                    "-af", f"afade=t=in:d={a.fade},afade=t=out:st={dur - a.fade - 0.05:.3f}:d={a.fade}",
                    "-ar", "44100", "-b:a", "256k", mp3], check=True)

    cfg_path = os.path.join(proj, "project.json")
    cfg = json.load(open(cfg_path, encoding="utf-8"))
    cfg["durationInSeconds"] = round(dur, 3)
    cfg["window"] = {"from": a.t0, "to": a.t1, "source": "song_full.mp3"}
    json.dump(cfg, open(cfg_path, "w", encoding="utf-8"), indent=2, ensure_ascii=False)

    if os.path.exists(full_tr):
        words = json.load(open(full_tr, encoding="utf-8"))
        win = [dict(w, s=round(w["s"] - a.t0, 3), e=round(min(w["e"], a.t1) - a.t0, 3)) for w in words if a.t0 - 0.05 <= w["s"] < a.t1]
        json.dump(win, open(tr, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        print(f"transcript: {len(win)} words in window")

    lines = [l for l in open(full_lyr, encoding="utf-8") if l.strip() and not l.strip().startswith("#")]
    lo, hi = (int(x) for x in a.lines.split("-"))
    keep = lines[lo - 1:hi]
    open(lyr, "w", encoding="utf-8").write(f"# window {a.t0}-{a.t1}s, lines {a.lines} of lyrics_full.txt\n" + "".join(keep))
    print(f"lyrics: {len(keep)} lines kept;  audio: {dur:.2f}s -> {mp3}")


if __name__ == "__main__":
    main()
