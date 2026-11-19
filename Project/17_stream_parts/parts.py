"""Stream link -> transcript parts with the clip prompt on top -> (paste into free AI) -> finished 9:16 clips.

  STEP 1  python parts.py "<link>" --parts 20 --creator "Kai Cenat" --handle kaicenat
          (no captions on the video? add --whisper : transcribes the audio on your laptop, slow but free)
  STEP 2  paste out/<id>/partNN.txt into Gemini / ChatGPT / Claude, one part per message.
          Copy the AI's answer into out/<id>/answer.txt (you can keep adding answers to the same file).
  STEP 3  python parts.py "<link>" --clips out/<id>/answer.txt --handle kaicenat --cam 0,0.4,0.21,0.21
          -> out/<id>/clips/01_....mp4  (9:16, face on top, captions, credit). Leave out --cam for a centre crop.

  --frame 9:47:30   saves frame.jpg from that time with a grid, so you can read your --cam numbers
  --json3 file      use a captions file you already have
  --solution        use solution.py instead of your starter.py
"""
import argparse
import os
import re
import subprocess
import sys

from common import fetch_captions, hms, load_lines, make_prompt, merge_lines, parse_json3, save_lines, to_seconds, whisper_lines

ap = argparse.ArgumentParser()
ap.add_argument("url", nargs="?")
ap.add_argument("--parts", type=int, default=10)
ap.add_argument("--creator", default="[Creator Name]")
ap.add_argument("--handle", default="[handle]")
ap.add_argument("--lang", default="auto", help="caption language: auto = the video's original (hi for Hindi streams), or en, hi, ...")
ap.add_argument("--caption-lang", default="Hinglish / English")
ap.add_argument("--json3")
ap.add_argument("--whisper", nargs="?", const="base", help="transcribe audio with faster-whisper (model: tiny/base/small)")
ap.add_argument("--clips")
ap.add_argument("--cam", help="facecam box as fractions x,y,w,h of the frame, e.g. 0,0.4,0.21,0.21")
ap.add_argument("--frame")
ap.add_argument("--solution", action="store_true")
a = ap.parse_args()


def vid_of(url):
    m = re.search(r"(?:v=|youtu\.be/|live/)([\w-]{11})", url or "")
    return m.group(1) if m else None


if a.frame:
    t = to_seconds(a.frame)
    subprocess.run([sys.executable, "-m", "yt_dlp", "-q", "--download-sections", f"*{hms(t)}-{hms(t + 2)}", "-f", "bv*[height<=1080]",
                    "-o", "frame_src.%(ext)s", "--force-overwrites", a.url], stdin=subprocess.DEVNULL, check=True)
    src = [f for f in os.listdir(".") if f.startswith("frame_src.")][0]
    grid = "drawgrid=w=iw/10:h=ih/10:t=2:c=yellow@0.7"
    subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-y", "-i", src, "-frames:v", "1", "-vf", grid, "frame.jpg"], check=True)
    os.remove(src)
    sys.exit("frame.jpg saved. Each yellow box = 0.1. Read your facecam's left, top, width, height, e.g. --cam 0,0.4,0.2,0.2")

if a.clips:
    from clips import make_clip, parse_answer
    vid = vid_of(a.url)
    if not vid:
        sys.exit("--clips needs the video link too")
    tpath = os.path.join("out", vid, "transcript.json")
    lines = load_lines(tpath) if os.path.exists(tpath) else []
    with open(a.clips, encoding="utf-8") as f:
        picks = parse_answer(f.read())
    if not picks:
        sys.exit("answer file mein koi 'start | end' time nahi mila. AI ka poora table paste karo.")
    cam = tuple(float(x) for x in a.cam.split(",")) if a.cam else None
    out = os.path.join("out", vid, "clips")
    os.makedirs(out, exist_ok=True)
    print(f"{len(picks)} clips banenge -> {out}/")
    for i, (s, e, label) in enumerate(picks, 1):
        path = os.path.join(out, f"{i:02d}_{label}.mp4")
        print(f"  [{i}/{len(picks)}] {hms(s)}-{hms(e)} ({e - s:.0f}s) ...", end=" ", flush=True)
        try:
            make_clip(a.url, s, e, lines, path, credit=a.handle.strip("@"), cam=cam)
            print("ready")
        except Exception as ex:  # noqa: BLE001
            print("FAILED:", str(ex).strip().splitlines()[-1][:120])
    sys.exit(0)

split_parts = __import__("solution" if a.solution else "starter").split_parts

if a.json3:
    vid, lines = os.path.basename(a.json3).split(".")[0], parse_json3(a.json3)
elif a.url and a.whisper:
    print(f"audio download + whisper '{a.whisper}' (CPU par lamba time lagta hai)...")
    vid, lines = whisper_lines(a.url, a.whisper, a.lang if a.lang != "auto" else "hi", workdir=os.path.join("out", "_audio"))
elif a.url:
    print("captions download ho rahe hain (video nahi)...")
    vid, lines = fetch_captions(a.url, a.lang)
else:
    sys.exit("link do:  python parts.py <youtube link>")

if not lines:
    sys.exit("Is video pe captions nahi mile. AI ke paas padhne ko kuch nahi hai.\n"
             "Try: --lang hi, ya --whisper (audio ko apne laptop par transcribe karta hai).")

parts = split_parts(lines, a.parts)
if len(parts) != a.parts:
    sys.exit(f"split_parts() ne {len(parts)} parts diye, {a.parts} chahiye the. Pehle `python test.py` pass karo.")

out = os.path.join("out", vid)
os.makedirs(out, exist_ok=True)
save_lines(lines, os.path.join(out, "transcript.json"))
print(f"stream: {hms(lines[-1][0])} | {len(lines)} caption lines | {a.parts} parts -> {out}/")
for i, part in enumerate(parts, 1):
    path = os.path.join(out, f"part{i:02d}.txt")
    body = "\n".join(f"[{hms(t)}] {txt}" for t, txt in merge_lines(part))
    with open(path, "w", encoding="utf-8") as f:
        f.write(make_prompt(i, a.parts, a.creator, a.handle, a.caption_lang) + (body or "(is hisse mein koi baat nahi hui)") + "\n")
    span = f"{hms(part[0][0])} - {hms(part[-1][0])}" if part else "khaali"
    print(f"  part{i:02d}.txt  {span:<19}  {len(body):>6} chars")
print(f"\nAb: ek part kholo -> poora copy -> Gemini mein paste. AI ka jawab {out}/answer.txt mein daalo, phir --clips.")
