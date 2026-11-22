"""Check that the machine can run the lyric-visualizer pipeline.

Usage: python scripts/check_env.py
"""
import sys as _sys
for _s in (_sys.stdout, _sys.stderr):
    try:
        _s.reconfigure(encoding='utf-8', errors='replace')  # Windows consoles default to cp1252 (Hindi text crashes)
    except Exception:
        pass
import importlib
import shutil
import subprocess
import sys

OK, BAD, WARN = "\033[32m OK \033[0m", "\033[31mMISS\033[0m", "\033[33mWARN\033[0m"
problems = 0


def run(cmd):
    try:
        return subprocess.run(cmd, capture_output=True, text=True, timeout=30, shell=False).stdout.strip()
    except Exception:
        return ""


def line(status, name, info):
    print(f"[{status}] {name:<16} {info}")


# ffmpeg
if shutil.which("ffmpeg") and shutil.which("ffprobe"):
    line(OK, "ffmpeg", run(["ffmpeg", "-version"]).splitlines()[0][:60])
else:
    line(BAD, "ffmpeg", "install ffmpeg + ffprobe and put them on PATH")
    problems += 1

# node
node = shutil.which("node")
if node:
    v = run([node, "-v"])
    major = int(v.lstrip("v").split(".")[0] or 0)
    line(OK if major >= 18 else BAD, "node", v + ("" if major >= 18 else "  (need >= 18)"))
    problems += major < 18
else:
    line(BAD, "node", "install Node.js 18+")
    problems += 1

# python
pv = sys.version_info
line(OK if pv >= (3, 9) else BAD, "python", sys.version.split()[0])
problems += pv < (3, 9)

# python packages
for mod, need, hint in [
    ("numpy", True, "pip install numpy"),
    ("scipy", True, "pip install scipy"),
    ("soundfile", True, "pip install soundfile"),
    ("faster_whisper", True, "pip install faster-whisper"),
    ("demucs", False, "optional, better timing on songs: pip install demucs"),
    ("matplotlib", False, "optional, waveform PNG: pip install matplotlib (falls back to a PIL drawing)"),
    ("PIL", True, "pip install pillow"),
]:
    try:
        m = importlib.import_module(mod)
        line(OK, mod, getattr(m, "__version__", ""))
    except Exception:
        line(BAD if need else WARN, mod, hint)
        problems += need

# disk
try:
    total, used, free = shutil.disk_usage(".")
    gb = free / 1e9
    line(OK if gb > 5 else WARN, "free disk", f"{gb:.1f} GB" + ("" if gb > 5 else "  (renders need a few GB; clear old %TEMP%/remotion-* folders)"))
except Exception:
    pass

print("\nAll required tools found." if not problems else f"\n{problems} required item(s) missing.")
sys.exit(1 if problems else 0)
