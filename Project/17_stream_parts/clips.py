"""Gemini's answer -> finished 9:16 clips (download only those parts, face on top, captions, credit).

Used by parts.py --clips. Needs yt-dlp + ffmpeg on PATH.
"""
import os
import re
import subprocess
import sys

from common import hms, to_seconds

TIME = r"(\d{1,2}:\d{2}(?::\d{2})?)"
PAIR = re.compile(TIME + r"\s*(?:\||-|–|—|to|\t|,|\s)\s*\[?" + TIME)
DEVANAGARI = re.compile(r"[\u0900-\u097F]")


def parse_answer(text):
    """Finds every 'start ... end' pair in a pasted AI answer (table, list, anything).
    Returns [(start_sec, end_sec, label), ...] in the order they appear. Skips pairs longer than 4 min or reversed."""
    out = []
    for line in text.splitlines():
        clean = line.replace("[", " ").replace("]", " ")
        m = PAIR.search(clean)
        if not m:
            continue
        a, b = to_seconds(m.group(1)), to_seconds(m.group(2))
        if not (0 < b - a <= 240):
            continue
        rest = clean[m.end():]
        label = re.sub(r"[^a-zA-Z0-9\s]", " ", rest).split()  # ascii only: safe in file names + ffmpeg filters
        out.append((a, b, "_".join(label[:4]).lower()[:40] or "clip"))
    return out


def _run(cmd, **kw):
    r = subprocess.run(cmd, stdin=subprocess.DEVNULL, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        raise RuntimeError((r.stderr or r.stdout)[-800:])
    return r


def _ass_time(t):
    t = max(0.0, t)
    return f"{int(t // 3600)}:{int(t % 3600 // 60):02d}:{t % 60:05.2f}"


def write_ass(lines, start, end, path, credit, caption_y):
    """Caption lines inside [start, end) -> .ass file (big white text, black outline) + a credit chip on top."""
    hindi = any(DEVANAGARI.search(x) for _, x in lines)
    font = "Nirmala UI" if hindi else "Arial"
    head = (
        "[Script Info]\nScriptType: v4.00+\nPlayResX: 1080\nPlayResY: 1920\n\n[V4+ Styles]\n"
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, "
        "ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\n"
        f"Style: Cap,{font},68,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,1,0,0,0,100,100,0,0,1,6,2,5,60,60,0,1\n"
        "Style: Credit,Arial,34,&H00FFFFFF,&H00FFFFFF,&H00000000,&H96000000,1,0,0,0,100,100,0,0,3,10,0,8,0,0,40,1\n\n"
        "[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n"
    )
    ev = [f"Dialogue: 1,{_ass_time(0)},{_ass_time(end - start)},Credit,,0,0,0,,credit: @{credit}"]
    inside = [(t, x) for t, x in lines if start - 2 <= t < end]
    for i, (t, x) in enumerate(inside):
        nxt = inside[i + 1][0] if i + 1 < len(inside) else end
        a, b = max(t, start) - start, min(nxt, end) - start
        if b - a < 0.3:
            continue
        words = x.split()
        text = r"\N".join(" ".join(words[j:j + 4]) for j in range(0, min(len(words), 8), 4))
        ev.append(f"Dialogue: 0,{_ass_time(a)},{_ass_time(b)},Cap,,0,0,0,,{{" + rf"\pos(540,{caption_y})" + f"}}{text}")
    with open(path, "w", encoding="utf-8") as f:
        f.write(head + "\n".join(ev) + "\n")


def layout_filter(cam, w, h):
    """cam = (x, y, cw, ch) as fractions of the frame, or None for a centre crop.
    Split layout: facecam on top (1080x608), gameplay centre below (1080x1312)."""
    if not cam:
        return "crop=ih*9/16:ih,scale=1080:1920,setsar=1", 960
    x, y, cw, ch = (int(round(v * s)) for v, s in zip(cam, (w, h, w, h)))
    gw = int(h * 1080 / 1312) // 2 * 2
    gx = max(0, (w - gw) // 2)
    # fit the facecam to 1080 wide without stretching, then crop/pad to exactly 1080x608
    return (f"[0:v]crop={cw // 2 * 2}:{ch // 2 * 2}:{x}:{y},scale=1080:-2,crop=1080:'min(ih,608)',"
            f"pad=1080:608:0:'(oh-ih)/2',setsar=1[c];"
            f"[0:v]crop={gw}:{h}:{gx}:0,scale=1080:1312,setsar=1[g];[c][g]vstack"), 640  # make_clip adds the [v0] label


def make_clip(url, start, end, lines, out_path, credit="creator", cam=None, pad=3.0):
    """Download [start-pad, end] only, then trim exactly, lay out 9:16, burn captions + credit."""
    out_dir = os.path.dirname(os.path.abspath(out_path)) or "."
    base = os.path.splitext(os.path.basename(out_path))[0]
    raw = os.path.join(out_dir, base + "_raw.mp4")
    s0 = max(0.0, start - pad)
    _run([sys.executable, "-m", "yt_dlp", "-q", "--no-warnings", "--download-sections", f"*{hms(s0)}-{hms(end + 1)}",
          "-f", "bv*[height<=1080]+ba/b", "--merge-output-format", "mp4", "-o", raw, "--force-overwrites", url])
    probe = _run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", raw])
    w, h = (int(v) for v in probe.stdout.strip().split(",")[:2])
    vf, cap_y = layout_filter(cam, w, h)
    ass = base + ".ass"
    write_ass(lines, start, end, os.path.join(out_dir, ass), credit, cap_y)
    # yt-dlp cuts at the nearest keyframe before s0, so trim from the END of the file backwards
    dur_raw = float(_run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", raw]).stdout)
    ss = max(0.0, dur_raw - (end + 1 - start))
    if cam:
        flt = vf + f"[v0];[v0]subtitles={ass}[vout]"
    else:
        flt = "[0:v]" + vf + f",subtitles={ass}[vout]"
    _run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-ss", f"{ss:.2f}", "-t", f"{end - start:.2f}", "-i", os.path.basename(raw),
          "-filter_complex", flt, "-map", "[vout]", "-map", "0:a?", "-c:v", "libx264", "-preset", "veryfast", "-crf", "21", "-c:a", "aac", "-b:a", "128k",
          "-movflags", "+faststart", os.path.basename(out_path)], cwd=out_dir)
    os.remove(raw)
    os.remove(os.path.join(out_dir, ass))
    return out_path
