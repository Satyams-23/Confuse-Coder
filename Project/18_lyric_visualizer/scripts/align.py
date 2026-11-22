"""Lyrics + song -> phrases.json with word-level timestamps.

    python scripts/align.py <project> [--vocals] [--model medium] [--language hi] [--skip-asr]

1. (--vocals) demucs separates the vocal stem -> far better timing on songs with music.
2. faster-whisper transcribes with word timestamps (lyrics given as the prompt).
3. The recognised words are aligned to YOUR lyric words (Needleman-Wunsch on a phonetic skeleton,
   so Devanagari vs romanised spellings still match). Unmatched words are interpolated in their line.
4. offsets.json ({"<line>": seconds}) nudges whole lines; rerun with --skip-asr to reuse the transcript.

lyrics.txt: one sung phrase per line, in order; *key* word in stars; '#' = comment.
"""
import sys as _sys
for _s in (_sys.stdout, _sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252 (Hindi text crashes)
    except Exception:
        pass
import argparse
import difflib
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _hindi import clean_word, skeleton  # noqa: E402


def load_lyrics(path):
    lines = []
    for raw in open(path, encoding="utf-8"):
        raw = raw.strip()
        if not raw or raw.startswith("#"):
            continue
        words = []
        for tok in raw.split():
            key = tok.startswith("*") or tok.endswith("*") or "*" in tok
            w = tok.replace("*", "")
            if clean_word(w):
                words.append({"w": w, "key": key})
        if words:
            lines.append({"text": raw, "words": words})
    return lines


def separate_vocals(audio, out_dir):
    target = os.path.join(out_dir, "htdemucs", os.path.splitext(os.path.basename(audio))[0], "vocals.wav")
    if os.path.exists(target):
        return target
    print("demucs: separating vocals (CPU, takes a few minutes)...")
    subprocess.run([sys.executable, "-m", "demucs", "--two-stems=vocals", "-n", "htdemucs", "-o", out_dir, audio], check=True)
    return target


def transcribe(audio, model_name, language, prompt):
    from faster_whisper import WhisperModel

    model = WhisperModel(model_name, device="cpu", compute_type="int8")
    segs, info = model.transcribe(
        audio, language=language, word_timestamps=True, beam_size=5, initial_prompt=prompt[:600],
        condition_on_previous_text=False, vad_filter=True, vad_parameters={"min_silence_duration_ms": 400},
    )
    words = []
    for s in segs:
        for w in s.words or []:
            cw = clean_word(w.word.strip())
            if cw:
                words.append({"w": cw, "s": round(w.start, 3), "e": round(w.end, 3), "p": round(w.probability, 3)})
        print(f"  {s.start:6.2f}-{s.end:6.2f}  {s.text.strip()[:70]}")
    return words


def sim(a, b):
    if not a or not b:
        return 0.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def align(lyric_words, asr_words):
    """Global alignment; returns list mapping lyric index -> asr index or None."""
    L = [skeleton(w["w"]) for w in lyric_words]
    A = [skeleton(w["w"]) for w in asr_words]
    n, m = len(L), len(A)
    GAP = -0.35
    score = [[0.0] * (m + 1) for _ in range(n + 1)]
    back = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        score[i][0], back[i][0] = score[i - 1][0] + GAP, 1
    for j in range(1, m + 1):
        score[0][j], back[0][j] = score[0][j - 1] + GAP * 0.6, 2  # extra ASR words are cheaper (ad-libs, hallucinations)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            s = sim(L[i - 1], A[j - 1])
            diag = score[i - 1][j - 1] + (s * 2 - 0.8)
            up = score[i - 1][j] + GAP
            left = score[i][j - 1] + GAP * 0.6
            best = max(diag, up, left)
            score[i][j] = best
            back[i][j] = 0 if best == diag else (1 if best == up else 2)
    mapping = [None] * n
    i, j = n, m
    while i > 0 or j > 0:
        b = back[i][j] if i > 0 and j > 0 else (1 if i > 0 else 2)
        if b == 0:
            if sim(L[i - 1], A[j - 1]) >= 0.5:
                mapping[i - 1] = j - 1
            i, j = i - 1, j - 1
        elif b == 1:
            i -= 1
        else:
            j -= 1
    return mapping


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument("--vocals", action="store_true", help="separate vocals with demucs first (recommended for songs)")
    ap.add_argument("--model", default="medium", help="tiny|base|small|medium|large-v3 (large-v3 best, slow on CPU)")
    ap.add_argument("--language", default="hi")
    ap.add_argument("--skip-asr", action="store_true", help="reuse out/transcript.json")
    a = ap.parse_args()

    proj = os.path.abspath(a.project)
    cfg = json.load(open(os.path.join(proj, "project.json"), encoding="utf-8"))
    audio = os.path.join(proj, "public", cfg["audio"] or "song.mp3")
    lines = load_lyrics(os.path.join(proj, "lyrics.txt"))
    if not lines:
        sys.exit("lyrics.txt is empty")
    out = os.path.join(proj, "out")
    os.makedirs(out, exist_ok=True)
    cache = os.path.join(out, "transcript.json")

    if a.skip_asr and os.path.exists(cache):
        asr = json.load(open(cache, encoding="utf-8"))
    else:
        src = separate_vocals(audio, os.path.join(out, "demucs")) if a.vocals else audio
        prompt = " ".join(" ".join(w["w"] for w in l["words"]) for l in lines)
        print(f"faster-whisper {a.model} on {os.path.basename(src)} ...")
        asr = transcribe(src, a.model, a.language, prompt)
        json.dump(asr, open(cache, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    flat = [(li, wi, w) for li, l in enumerate(lines) for wi, w in enumerate(l["words"])]
    mapping = align([w for _, _, w in flat], asr)
    times = [None] * len(flat)
    for k, j in enumerate(mapping):
        if j is not None:
            times[k] = [asr[j]["s"], asr[j]["e"]]

    # enforce monotonic anchors (drop anchors that go backwards)
    last = -1.0
    for k in range(len(times)):
        if times[k] is not None:
            if times[k][0] < last - 0.05:
                times[k] = None
            else:
                last = times[k][0]

    # interpolate gaps by character length between surrounding anchors
    total_dur = cfg.get("durationInSeconds") or (asr[-1]["e"] + 2 if asr else 10)
    k = 0
    while k < len(times):
        if times[k] is not None:
            k += 1
            continue
        j = k
        while j < len(times) and times[j] is None:
            j += 1
        t0 = times[k - 1][1] if k > 0 else max(0.0, (times[j][0] if j < len(times) else 0) - 0.4 * (j - k))
        t1 = times[j][0] if j < len(times) else min(total_dur, t0 + 0.4 * (j - k))
        lens = [max(1, len(flat[q][2]["w"])) for q in range(k, j)]
        span = max(0.08 * (j - k), t1 - t0)
        acc = t0
        for q, ln in zip(range(k, j), lens):
            d = span * ln / sum(lens)
            times[q] = [round(acc, 3), round(acc + d * 0.92, 3)]
            acc += d
        k = j

    offsets = {}
    off_path = os.path.join(proj, "offsets.json")
    if os.path.exists(off_path):
        offsets = {int(k): float(v) for k, v in json.load(open(off_path, encoding="utf-8")).items()}

    phrases, matched = [], sum(1 for x in mapping if x is not None)
    for li, l in enumerate(lines):
        ws = []
        for k, (fli, wi, w) in enumerate(flat):
            if fli != li:
                continue
            s, e = times[k]
            o = offsets.get(li, 0.0)
            ws.append({"w": w["w"], "s": round(s + o, 3), "e": round(max(e, s + 0.08) + o, 3), "key": w["key"], "anchored": mapping[k] is not None})
        conf = sum(1 for w in ws if w["anchored"]) / len(ws)
        phrases.append({"i": li, "text": l["text"], "start": ws[0]["s"], "end": ws[-1]["e"], "confidence": round(conf, 2), "words": ws})

    json.dump(phrases, open(os.path.join(proj, "phrases.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\nmatched {matched}/{len(flat)} lyric words to ASR timestamps ({100 * matched / max(1, len(flat)):.0f}%)")
    for p in phrases:
        flag = "  <-- check" if p["confidence"] < 0.5 else ""
        print(f"  L{p['i']:02d} {p['start']:7.2f}-{p['end']:7.2f}  conf {p['confidence']:.2f}  {p['text'][:50]}{flag}")
    print(f"-> {os.path.join(proj, 'phrases.json')}")


if __name__ == "__main__":
    main()
