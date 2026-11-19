"""Ready-made helpers. You don't need to change this file.

fetch_captions(url)  -> list of (seconds, text) from YouTube auto/manual captions (via yt-dlp)
merge_lines(lines)   -> joins caption lines into ~20 s blocks (shorter paste, same timestamps)
hms(seconds)         -> "0:55:06"
make_prompt(...)     -> the copy-paste prompt that goes on top of every part
cut_commands(...)    -> yt-dlp + ffmpeg commands that cut one moment as a 9:16 clip
"""
import glob
import json
import os
import subprocess
import sys
import tempfile

PROMPT = """You are my shorts clipper. Below is PART {part} of {total} of a stream transcript. Every line starts with its real time [h:mm:ss].
Creator: {creator}  ·  Credit: @{handle}  ·  Caption language: {lang}
Pick the {k} best moments for vertical shorts: big reaction, funny line, shock, clutch play.
Rules: each clip 25-55 s · start on the hook line · end on the punchline · use ONLY times that appear in the text · never invent a line.
Answer as a table: start | end | first line (exact words) | hook caption (max 6 words) | why it will go viral.
Write start and end as plain h:mm:ss (like 7:46:39), without brackets, and never leave them empty.
TRANSCRIPT:
"""


def hms(t):
    t = int(t)
    return f"{t // 3600}:{t % 3600 // 60:02d}:{t % 60:02d}"


def to_seconds(s):
    sec = 0
    for x in s.strip().split(":"):
        sec = sec * 60 + float(x)
    return sec


def parse_json3(path):
    """YouTube json3 captions -> [(seconds, text), ...] sorted by time."""
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    lines = []
    for e in data.get("events", []):
        text = "".join(s.get("utf8", "") for s in e.get("segs") or []).replace("\n", " ").strip()
        if text:
            lines.append((e.get("tStartMs", 0) / 1000, text))
    lines.sort(key=lambda x: x[0])
    return lines


def fetch_captions(url, lang="auto"):
    """Downloads captions only (no video). Returns (video_id, lines). lines == [] means no captions.
    lang="auto" takes the video's ORIGINAL language track (hi-orig for a Hindi stream, en-orig for English).
    YouTube hides caption tracks unless yt-dlp can run its JavaScript, so we retry with Node if the first try finds nothing
    (CarryMinati's stream: 0 tracks without a JS runtime, Hindi captions with one)."""
    langs = r".*-orig" if lang == "auto" else f"{lang}-orig,{lang}"
    for runtime in (None, "node", "deno"):
        tmp = tempfile.mkdtemp(prefix="parts_")
        cmd = [sys.executable, "-m", "yt_dlp", "--skip-download", "--write-subs", "--write-auto-subs",
               "--sub-langs", langs, "--sub-format", "json3", "-o", os.path.join(tmp, "%(id)s.%(ext)s"), url]
        if runtime:
            cmd[3:3] = ["--js-runtimes", runtime]
        subprocess.run(cmd, capture_output=True, text=True, stdin=subprocess.DEVNULL)
        files = sorted(glob.glob(os.path.join(tmp, "*.json3")), key=lambda f: ("-orig" not in f, f))
        if files:
            vid = os.path.basename(files[0]).split(".")[0]
            return vid, parse_json3(files[0])
    return "video", []


def save_lines(lines, path):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(lines, f, ensure_ascii=False)


def load_lines(path):
    with open(path, encoding="utf-8") as f:
        return [tuple(x) for x in json.load(f)]


def whisper_lines(url, model="base", lang="hi", workdir="."):
    """No captions on YouTube? Download the audio and transcribe it on your own laptop (free, slow on CPU).
    Returns (video_id, [(seconds, text), ...])."""
    from faster_whisper import WhisperModel  # pip install faster-whisper (only needed for this path)
    os.makedirs(workdir, exist_ok=True)
    tpl = os.path.join(workdir, "%(id)s.audio.%(ext)s")
    subprocess.run([sys.executable, "-m", "yt_dlp", "-q", "-f", "ba", "-o", tpl, url], stdin=subprocess.DEVNULL, check=True)
    audio = sorted(glob.glob(os.path.join(workdir, "*.audio.*")))[-1]
    vid = os.path.basename(audio).split(".")[0]
    m = WhisperModel(model, device="cpu", compute_type="int8")
    segs, _ = m.transcribe(audio, language=lang, vad_filter=True, beam_size=1)
    lines = []
    for s in segs:
        text = s.text.strip()
        if text:
            lines.append((round(s.start, 2), text))
            if len(lines) % 200 == 0:
                print(f"  whisper: {hms(s.start)} done", flush=True)
    os.remove(audio)
    return vid, lines


def merge_lines(lines, every=20):
    """Join lines into blocks that start every `every` seconds. Keeps the first timestamp of each block."""
    out, start, buf = [], None, []
    for t, text in lines:
        if start is None or t - start >= every:
            if buf:
                out.append((start, " ".join(buf)))
            start, buf = t, []
        buf.append(text)
    if buf:
        out.append((start, " ".join(buf)))
    return out


def make_prompt(part, total, creator="[Creator Name]", handle="[handle]", lang="Hinglish / English", k=3):
    return PROMPT.format(part=part, total=total, creator=creator, handle=handle, lang=lang, k=k)


def cut_commands(url, start, end, name="clip"):
    """Two commands: download only that section, then crop the centre to 9:16 (1080x1920)."""
    return [
        f'python -m yt_dlp --download-sections "*{start}-{end}" -f "bv*[height<=1080]+ba/b" -o "{name}_raw.%(ext)s" "{url}"',
        f'ffmpeg -i {name}_raw.mp4 -vf "crop=ih*9/16:ih,scale=1080:1920" -c:a aac {name}_9x16.mp4',
    ]
