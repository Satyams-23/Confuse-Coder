"""common.py: ready-made steps 1, 3 and 4 of an AI clipper (you don't need to change this file).

  step 1  transcribe()   speech -> words with timestamps (faster-whisper, runs on CPU)
  step 2  pick_moments() YOU write this in starter.py
  step 3  cut_clip()     crop 16:9 -> 9:16 (centre) + scale to 1080x1920
  step 4  cut_clip()     burn word-synced captions + cut with FFmpeg
Plus loudness(): how loud each second is (0..1), used as a hint for step 2.
"""
import json
import os
import re
import subprocess
import sys

# Words that usually mean "something just happened" (English + Hinglish). Lowercase, no punctuation.
HYPE = {
    "insane", "crazy", "wow", "omg", "what", "wait", "no", "yes", "boom", "bro", "dude", "unbelievable",
    "never", "best", "worst", "secret", "shocking", "free", "zero", "million", "crore", "lakh",
    "bhai", "arre", "kya", "pagal", "sach", "galti", "dhamaka", "kamaal", "zabardast",
    # Whisper often writes Hindi in Devanagari, so the same words in that script too
    "भाई", "अरे", "क्या", "पागल", "सच", "गलती", "धमाका", "कमाल", "ज़बरदस्त", "जबरदस्त",
    "फ्री", "जीरो", "ज़ीरो", "लाख", "करोड़", "मिलियन", "नहीं", "बस", "सिर्फ", "असली",
}


def norm(word):
    """'Insane!' -> 'insane', 'क्या?' -> 'क्या' (keeps Devanagari vowel signs, drops punctuation)"""
    return re.sub("[^\\wऀ-ॿ]", "", word.lower())


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, **kw)
    if r.returncode != 0:
        sys.exit(f"command failed: {' '.join(cmd[:3])} ...\n{r.stderr.decode(errors='ignore')[-800:]}")
    return r


def duration(video):
    out = run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video]).stdout
    return float(out.decode().strip())


def video_size(video):
    out = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", video]).stdout
    w, h = out.decode().strip().split(",")[:2]
    return int(w), int(h)


def transcribe(video, model="small", cache=True):
    """Step 1. Returns [{"w": "word", "start": 1.2, "end": 1.5}, ...]. Cached next to the video as <name>.words.json."""
    path = os.path.splitext(video)[0] + ".words.json"
    if cache and os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    from faster_whisper import WhisperModel  # imported here so tests don't need it

    print(f"[1/4] transcribing with whisper-{model} (CPU, first run downloads the model)...", flush=True)
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(video, word_timestamps=True, vad_filter=True)
    words = [{"w": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)} for s in segs for w in (s.words or [])]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(words, f, ensure_ascii=False)
    return words


def loudness(video):
    """How loud each second is, 0..1 (1 = among the loudest 5% of the video)."""
    import numpy as np

    raw = run(["ffmpeg", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", "16000", "-f", "s16le", "-"]).stdout
    a = np.frombuffer(raw, dtype=np.int16).astype(np.float32)
    n = len(a) // 16000
    if n == 0:
        return []
    rms = np.sqrt((a[: n * 16000].reshape(n, 16000) ** 2).mean(axis=1))
    top = np.percentile(rms, 95) or 1.0
    return [round(float(min(1.0, v / top)), 3) for v in rms]


def _ass_time(t):
    t = max(0.0, t)
    h, rem = divmod(t, 3600)
    m, s = divmod(rem, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def write_ass(words, start, end, path, per_line=3):
    """Captions for [start, end): groups of `per_line` words, times relative to the clip start."""
    inside = [w for w in words if w["start"] >= start and w["end"] <= end]
    lines = []
    for i in range(0, len(inside), per_line):
        g = inside[i : i + per_line]
        text = " ".join(w["w"] for w in g).upper().replace("{", "").replace("}", "")
        lines.append(f"Dialogue: 0,{_ass_time(g[0]['start'] - start)},{_ass_time(g[-1]['end'] - start)},Cap,,0,0,0,,{text}")
    head = (
        "[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n"
        "[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, OutlineColour, BackColour, Bold, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV\n"
        "Style: Cap,Arial,78,&H00FFFFFF,&H00000000,&H64000000,1,1,6,0,2,60,60,520\n\n"
        "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
    )
    with open(path, "w", encoding="utf-8") as f:
        f.write(head + "\n".join(lines) + "\n")


def cut_clip(video, start, end, words, out):
    """Steps 3 + 4: centre-crop to 9:16 (if the video is wider), scale to 1080x1920, burn captions, cut [start, end)."""
    w, h = video_size(video)
    crop = f"crop=ih*9/16:ih:(iw-ih*9/16)/2:0," if w / h > 9 / 16 + 0.01 else ""
    out_dir = os.path.dirname(os.path.abspath(out))
    ass = os.path.splitext(os.path.basename(out))[0] + ".ass"
    write_ass(words, start, end, os.path.join(out_dir, ass))
    # run inside out_dir so the subtitles filter gets a plain relative path (no Windows drive-letter escaping)
    run(["ffmpeg", "-v", "error", "-y", "-ss", f"{start:.2f}", "-to", f"{end:.2f}", "-i", os.path.abspath(video),
         "-vf", f"{crop}scale=1080:1920,subtitles={ass}", "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
         "-c:a", "aac", "-b:a", "128k", os.path.basename(out)], cwd=out_dir)
    return out
