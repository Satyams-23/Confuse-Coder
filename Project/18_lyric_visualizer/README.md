# lyric-visualizer: a Claude Skill

Give Claude a song and its lyrics. You get back a **vertical 1080x1920, 30fps, hand-drawn animated lyric video** with the original audio, ready for Reels or Shorts. Hindi (Devanagari) works out of the box.

Each word appears exactly when it is sung. The key word turns red, an underline draws itself under it, and it gets a small punch-in. Every line has its own visual metaphor: a coin dropping into a hand, a clock that won't stop. Every shape is drawn in SVG code, so the video needs no images, no stock footage and no After Effects.

## Install
1. Copy this folder into `.claude/skills/` of your project (or `~/.claude/skills/` to use it everywhere) and name it `lyric-visualizer`, so the path is `.claude/skills/lyric-visualizer/SKILL.md`.
2. Install the tools:
   - [ffmpeg](https://ffmpeg.org/) (on PATH)
   - Node.js 18+
   - Python 3.9+, then: `pip install faster-whisper numpy scipy soundfile pillow`
   - Optional, for much better timing on songs: `pip install demucs`
3. Check the setup: `python .claude/skills/lyric-visualizer/scripts/check_env.py`

## Use
Ask Claude:

> make a lyric video for song.mp3, here are the lyrics: …

Claude follows `SKILL.md`:

1. Creates `lyric-videos/<song>/` from `template/` (then `npm install` once).
2. Aligns your lyrics to the song with word timestamps (`phrases.json`) and finds the beats (`beats.json`).
3. Writes `creative_direction.md`: a **theme** picked from the lyrics' mood (5 presets or custom), a **style** (glow line-art, ink brush, chalk, paper cut-out, watercolour, neon, kinetic poster, 3D, …) that doesn't repeat your last songs, and one metaphor per line.
4. Builds **one scene**, renders 5 sample frames and waits for your OK on the look.
5. Renders a **20-second test clip** and waits for your OK.
6. Renders the full video and outputs `out/final.mp4`.

## Commands (if you drive it yourself)
| step | command |
|---|---|
| check tools | `python scripts/check_env.py` |
| new project | `node scripts/new_project.mjs my-song --audio song.mp3` |
| align lyrics | `python scripts/align.py lyric-videos/my-song --vocals` |
| beats | `python scripts/beats.py lyric-videos/my-song` |
| sync picture | `python scripts/waveform_check.py lyric-videos/my-song --to 20` |
| preview | `cd lyric-videos/my-song && npm run preview` |
| sample frames | `node scripts/stills.mjs lyric-videos/my-song --line 0 --count 5` |
| linear-motion check | `node scripts/lint_motion.mjs lyric-videos/my-song` |
| 20 s test | `node scripts/render.mjs lyric-videos/my-song --from 0 --to 20` |
| full video | `node scripts/render.mjs lyric-videos/my-song` |

## lyrics.txt format
```
# one sung phrase per line, in order
सिर्फ़ *पाँच* रुपैये की बात
पर वक़्त *रुकता* नहीं
```
`*word*` marks the key word of a line. Repeat chorus lines each time they are sung.

## What's inside
```
SKILL.md                     instructions Claude follows (pipeline + quality rules)
scripts/                     check_env, new_project, align, beats, waveform_check, stills, render, lint_motion
template/src/lib/anim.ts     springIn, ease, drawStroke, punchWord, cameraDrift, dropBounce, overshootRotate, beatPulse
template/src/lib/*.tsx       Paper/FilmGrain/Vignette, Camera+Layer parallax, KineticLine, SketchPath, Transition
template/src/scenes/demo/    two reference scenes: coin drops into a hand, then match-cut into a clock
examples/                    creative direction example
```

## Downloads it may use
Visuals are drawn in code first. When a real asset or library would look better, Claude can download free, license-safe ones: Google Fonts, `roughjs`, `perfect-freehand`, `flubber`, Lottie animations, three.js, CC0 vector art (Open Peeps), and CC0 textures/3D models (Poly Haven, Kenney). Every asset is logged in the project's `CREDITS.md`. It asks you before anything paid. No copyrighted characters, logos or artwork.

## Troubleshooting
- **Words are early or late:** run align with `--vocals`, or try `--model large-v3`. To nudge a single line, add it to `offsets.json` (`{"4": -0.2}`) and run again with `--skip-asr`.
- **Render crashes partway** ("browser disconnected"): use `--concurrency 1`. The render runs in chunks and picks up where it stopped.
- **Disk fills up:** every render bundle goes to your temp folder. The scripts delete their own bundles, but old `remotion-*` folders from other tools can pile up.
- **Hindi letters look broken:** animate whole words only. Never split a word into separate characters.

Made with Claude Code by @confuse__coder.dev
