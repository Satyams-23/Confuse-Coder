---
name: lyric-visualizer
description: Turn a song (mp3/wav) + its lyrics into a premium vertical 1080x1920 30fps animated lyric video with Remotion (React + SVG, code-drawn first, free licensed assets/libraries when they make it better), theme and style chosen per song, Hindi/Devanagari supported. Use when the user asks for a lyric video, lyrical reel, "song ke lyrics animate karo", kinetic typography for a song, or an animated music visualizer for Instagram Reels / Shorts.
---

# Lyric Visualizer

Song + lyrics → word-synced, hand-drawn, kinetic-typography lyric video (`final.mp4`, 1080x1920, 30fps, original audio).

Everything lives in this skill folder:
- `scripts/` – environment check, alignment, beats, stills, render, mux
- `template/` – Remotion project with the shared animation library (`src/lib/`)
- `examples/creative_direction.example.md` – how a creative direction doc should look

`<skill>` below means this folder (e.g. `.claude/skills/lyric-visualizer`).

## Pipeline

### 0. Check the machine
```
python <skill>/scripts/check_env.py
```
Needs ffmpeg, node ≥ 18, python ≥ 3.9 with `faster-whisper` (alignment) and optionally `demucs` (vocal separation). Fix anything red before continuing. Also check free disk (each render bundle can take ~1 GB in %TEMP%).

### 1. New project
```
node <skill>/scripts/new_project.mjs <song-slug> --audio path/to/song.mp3 [--node-modules path/to/existing/node_modules]
```
Creates `lyric-videos/<song-slug>/` from the template, copies the audio to `public/song.mp3`, and either junctions an existing Remotion 4.0.540 `node_modules` or tells you to `npm install`.

Write the lyrics to `lyric-videos/<song-slug>/lyrics.txt`: one line per sung phrase, in order. Mark the key word of a line with stars: `पाँच *रुपैया* दे दो`. Lines starting with `#` are comments. Repeat chorus lines as many times as they are sung.

Only part of the song needed (e.g. a 20–25 s hook)? Align the FULL song once (step 2), then cut it down without re-running Whisper:
`python <skill>/scripts/trim_window.py lyric-videos/<song-slug> --from 72.9 --to 97.85 --lines 13-18`, then `align.py --skip-asr` and `beats.py` again.

### 2. Alignment → phrases.json
```
python <skill>/scripts/align.py lyric-videos/<song-slug> [--vocals] [--model large-v3]
```
- `--vocals` runs demucs first (much better timing on songs with music; CPU ~1–3 min).
- faster-whisper word timestamps (`language=hi`, lyrics as prompt) are fuzzy-matched onto YOUR lyric words; unmatched words are interpolated inside their line.
- Writes `phrases.json`: `[{i, text, start, end, words:[{w, s, e, key}]}]`.
- Whisper sometimes echoes the lyrics prompt instead of hearing it (words come back in exactly your spelling): don't trust timings in that stretch.
- Fix a wrong line by editing `offsets.json` (`{"3": 0.25}` shifts line 3 by +0.25 s) and rerunning with `--skip-asr` (reuses the cached transcript).

Then beats + a sync picture:
```
python <skill>/scripts/beats.py lyric-videos/<song-slug>
python <skill>/scripts/waveform_check.py lyric-videos/<song-slug> [--from 0 --to 20]
```
`beats.json` = `{bpm, beats:[s...], downbeats:[s...], onsets:[s...]}`. The waveform PNG shows words, beats and the motion hits declared in scenes — LOOK at it.

### 3. Creative direction (before any scene code)
Write `lyric-videos/<song-slug>/creative_direction.md` (see example). Required:
- **Theme picked from the lyrics' mood** (`project.json` `"theme"`, presets in `src/lib/theme.ts`: `inkPaper` nostalgia/simple · `nightGold` love/longing · `monsoon` rain/separation · `dusk` heartbreak/dreamy · `notebook` happy/friendship, or a custom object). A theme = 2 neutrals + ONE accent (key word + key object only) + an optional LIGHT colour (only as glow/beams/dust). A line may switch theme (`LINE_THEMES`) when the lyric's mood turns, e.g. paper verse → night chorus. Never add other colours.
- **One style** across the video, picked per song from the Styles section below (separate from theme: theme = colours/mood, style = how things are drawn and move). Read `lyric-videos/STYLE_LOG.md` first and do NOT reuse the style or the set pieces of the last 2 songs.
- **One motif** that travels through the lines if the song allows (e.g. a red thread for "raabta").
- **One strong visual metaphor per line.** Literal when the words are drawable (*5 rupaya* → a hand, a coin drops, bounces on the palm, settles). Symbolic when they are not (time → clock, comparison → ruler, an ending → curtains).
- For each line: metaphor, key word, motion hit (which word/beat it lands on), how it transitions into the next line (match-cut / wipe / morph — which object becomes the next scene's object).

Show it to the user if they want to review it.

### 4. Build scenes (Remotion, React + SVG; external assets only per "External resources")
One file per line in `src/scenes/LineNN.tsx`, registered in `src/scenes/index.ts`. Build motion from the helpers in `src/lib/` (add new ones there), plus any library/asset from "External resources" when it makes the scene better:

| helper | use |
|---|---|
| `springIn(frame, fps, {delay, config})` | every entrance (overshoot + settle) |
| `ease(frame, [f0,f1], [v0,v1], Easing.x)` | any timed value — easing is REQUIRED |
| `drawStroke(progress, length)` | stroke-dashoffset line drawing |
| `punchWord(frame, fps, atFrame)` | small scale punch on a hit |
| `cameraDrift(frame, dur, opts)` | slow continuous zoom/pan, every scene |
| `dropBounce(frame, fps, at, {height})` | anticipation → fall → bounce → settle |
| `overshootRotate(frame, fps, at, from, to)` | clock-hand style overshoot then settle |
| `beatPulse(frame, fps, beats)` | subtle pulse on beats |
| `<Camera>` + `<Layer depth>` | parallax between bg / mid / fg |
| `<Stage>` / `<NightStage spot beams dust flare>` | theme background; dark themes = spotlight that breathes on beats, light beams, glowing dust |
| `flareAt(frame, hit)` | light flare on a hit (pass to Stage `flare`, glows) |
| `useTheme()` / `alpha()` | theme colours (`bg, bg2, ink, accent, light`) |
| `filter="url(#glow)"` / `url(#wobbleGlow)` | glowing line / glowing + boiling line (neon thread, light trails) |
| `<BigWord word at y>` | giant key word: scales in from big+blur+wide spacing, glow flares, underline draws |
| `<SpiralText text start dur>` | the line on a turning spiral, sliding into the centre (repeated lines, trance, time) |
| `<WordFlood word start end heroAt>` | the word multiplies until it fills the screen (overwhelm, echo, "everyone says") |
| `<FilmGrain>`, `<Vignette>` | texture (already in the root) |
| `<Sketchy>` / `filter="url(#wobble)"` | boiling hand-drawn line wobble |
| `<SketchPath d=...>` | double sketchy outline + self-drawing stroke |
| `<KineticLine words=...>` | word-on-timestamp typography, key word accent + self-drawing underline + punch |
| `<Transition kind="wipe"\|"iris"\|"ink">` | scene entrance; `morph()` for shape→shape |
| `{kind: 'zoom', at: [x,y]}` transition | zoom THROUGH an object: the old scene dives into an eye's iris / a rose's centre / a window and the new scene grows out of it (story mode) |
| `{kind: 'paint'}` transition, `<PaintReveal>` | the new scene / a colour is painted on with big brush strokes (a wall turning blue, colour flooding a sketch) |
| `<Bloom points start dur>` | a vine grows along a path, leaves unfold, flowers spring open one by one (flowers spreading over a house, a garland, a rose bush) |
| `<SparkTrail from to start dur>` | glowing sparkle ribbon flying from A to B (words leaving a mouth, a wish going to someone) |
| `<StoryImage src focus>` | full-bleed illustration/photo with a slow move toward the thing the lyric names |
| `<CornerLyric words corner color>` | small lyric in a corner, word by word, coloured from the scene (story mode: the picture is the hero) |

Every major motion hit (impact, snap, jump) also goes in `hits.json` (`[{"t": 1.5, "label": "coin lands"}]`, seconds), so `waveform_check.py` can show whether it lands on a beat or word.

Process (do not skip):
1. Build ONE scene fully → `node <skill>/scripts/stills.mjs lyric-videos/<song-slug> --line N --count 5` → look at the contact sheet yourself, fix, then show the user and **wait for approval of the look**.
2. Build scenes covering the first ~20 s → `node <skill>/scripts/render.mjs lyric-videos/<song-slug> --from 0 --to 20` → check the waveform PNG + watch → **wait for approval**.
3. Then everything → full render.
4. Append the song to `lyric-videos/STYLE_LOG.md` (song, theme, style, motif, set pieces, assets used).

### 5. Render + mux
```
node <skill>/scripts/render.mjs lyric-videos/<song-slug> [--from s --to s] [--concurrency 2]
```
Renders muted video in 300-frame chunks (fresh browser per chunk → no RAM crash), concatenates with ffmpeg and muxes the ORIGINAL audio → `out/final.mp4` (or `out/clip_<from>-<to>.mp4`). Then verify: `ffprobe` shows 1080x1920, 30 fps, an audio stream, duration = audio.

## Styles (pick ONE per song, never the same as the last 2 songs)
Theme = colours + mood. Style = drawing + motion language. Any style works with any theme; choose what the lyrics *feel* like.

| style | fits | how to build it |
|---|---|---|
| **Glow line-art** (Raabta) | love, night, longing | thin cream strokes + `#wobbleGlow` accent object, `NightStage` spotlight/beams/dust, serif lines + `BigWord` |
| **Ink sketch on paper** | nostalgia, simple life, humour | `inkPaper`, `SketchPath` double outlines, boiling `#wobble`, hatching (`Hatch`), Kalam notes |
| **Ink brush / calligraphy** | devotion, Sufi, classical, pain | variable-width strokes (`perfect-freehand` → filled path), ink-bleed filter (feTurbulence + feMorphology), sumi wash blobs that spread (mask grow); fonts Amita / Rozha One / Tiro |
| **Chalk on blackboard** | school, memories, friendship | dark slate bg, dusty strokes (turbulence mask on the stroke), `roughjs` hachure fills, smudge wipes as transitions; Kalam / Gotu |
| **Paper cut-out (diorama)** | childhood, village, folk, fairy-tale | layered flat shapes with `feDropShadow`, torn edges (displacement), real parallax depth (or `@remotion/three` planes), "on twos" timing (`Math.floor(frame/2)*2` fed into eased motion) |
| **Watercolour** | rain, monsoon, softness, separation | blotchy fills (turbulence + displacement + blur, multiply), darker wet edges, colour blooming in through a growing noisy mask, paper texture |
| **Neon sign** | party, city night, heartbreak bar, retro | double-stroke tube glow, flicker-on entrance (seeded random steps), brick/wall bg, buzz pulse on beats; Yatra One / Baloo |
| **Kinetic poster (type only)** | rap, fast songs, motivation, anger | no illustrations: giant words, grids, split screens, hard cuts ON beats, `WordFlood`, `SpiralText`, words stacking/falling, bold sans + serif contrast |
| **Cinematic 3D** | epic, big chorus, journey | `@remotion/three` (three.js) paper planes / low-poly worlds, camera dolly, lights synced to beats; tasteful, never toy-like |
| **Rough sketch / storyboard** | storytelling verses, comedy | `roughjs` shapes (sloppy boxes/circles, hachure), storyboard panels, arrows and hand notes |
| **Illustrated story** | romantic, folk, nostalgic, ghazal, any song with drawable nouns | see "Story mode" below: painted scenes that show each lyric literally, things grow, zoom-through transitions, small corner lyrics |

Every style still follows ALL animation quality rules (springs/easing only, timestamp-exact words, camera drift + parallax, no plain fades, safe zones). Mixing is fine inside one song only when the lyric's mood turns (like a theme switch), and the switch itself is a designed transition.

## Story mode (illustrated story reels)
Reference look the user liked: every line becomes a small painted scene that SHOWS the words. Don't copy any reel; use the ideas.
- **Literal first.** Underline the drawable nouns/verbs in each line and show them: *ghar* → a house, *neele rang* → a wall being painted blue, *dua* → a diya in cupped hands, *khat* → a letter, *neele phool* → an eye whose iris is blue flowers, then a field of them. Only go symbolic when nothing is drawable.
- **Something grows or changes in every scene**, timed to the words: flowers spread over the roof (`Bloom`), paint covers a wall (`PaintReveal`), a diya lights, petals fall, a sparkle flies from one person to another (`SparkTrail`), a cloth flutters. A still picture with a slow zoom is not enough.
- **Transitions go THROUGH an object** (`{kind:'zoom', at}`): into an eye, a flower's centre, a window, a diya flame, a moon. Or the next scene is painted on (`{kind:'paint'}`), or flowers grow until they fill the frame and become the next scene.
- **One painting style for the whole song**, chosen from the mood: Indian miniature (Rajasthani/Mughal: flat colour, gold borders, arches, profile faces) for classical/romantic Hindi songs, soft watercolour for rain/longing, paper cut-out for folk/childhood, glowing silhouettes for sad night songs. Keep a recurring couple/character and colour so it feels like one story.
- **Lyrics small, in a corner** (`CornerLyric`), word by word on the timestamps, coloured from the scene (blue Devanagari on the blue-house scene, gold on dark scenes). One giant key word at most once or twice per song.
- **Optional real-life moments** fit this mode too: a phone showing a chat or the song's lyrics, a hand writing the letter.

How to make the pictures (pick per song, tell the user which):
1. **Code-painted** (default, free): layered flat SVG shapes with light/shade planes, the `#ink` edge filter, paper texture, `Bloom`/`PaintReveal`/`SparkTrail` for motion. Reference: `template/src/scenes/demo/StoryScenes.tsx` (house → flowers bloom → zoom through window → wall painted blue).
2. **Free licensed art**: CC0 illustrations/photos (see External resources) used as `StoryImage` layers, cut into fg/bg layers for parallax, recoloured to one palette, with code-drawn growth and sparkles on top.
3. **AI-generated images/clips** (best match for detailed painted characters): only if the user has an image/video tool (an MCP server or their own account). Write `prompts.md` with one prompt per line (same style words, same characters, same palette in every prompt, aspect 9:16, what moves in the clip), the user generates or you call the tool, save to `public/assets/gen/`, then build the scene around them: `StoryImage` + code growth + `CornerLyric` + zoom/paint transitions, all synced to the words. Ask before any paid generation. Never generate real people, celebrities or copyrighted characters.

## Big stacked lyrics + type-only reels (Pitah, Nov 2026)
From the user's trend references: when the corner lyric is too quiet, the words become the hero.
- **`StackLyric`** (`lib/Lyric.tsx`): rows = words before the key / the key word alone / words after, each row indented a bit more. The key word is in Yatra One saffron with a dark edge and glow; the rest are bold cream serif. Words pop in on their sung time (motion-blur streak) and the stack blurs away before the next scene. `soft` = a slow blur-in for emotional songs. Put it in the picture's empty space (`pos` tl/tr/bl/br) over a soft scrim on that side.
- **Transitions** (`lib/Transition.tsx`): `split` (2–3 panels slide in from alternate sides), `polaroid` (the next scene flies in as a tilted photo print, then fills the frame; good for a time jump or memory), `whip` (fast blurred pan; `OutPush` whips the old scene out).
- **Painted-shot kit** (`lib/Painted.tsx`): `PaintedShot` cover-fits an AI/illustrated still and moves a camera between image-pixel focus points; `LightBloom`, `Motes`, `StarField`, `Mist`, `PlateText` (a word carved on a nameplate) stick to the picture.
- **Type + motion only** (no pictures, when the user doesn't want images): see `examples/pitah_type_motion/` (`TypeScenes.tsx`, `Chorus.tsx`). The language: a giant tone-on-tone word behind a small front word, a halo ring tunnel that opens from a dot, corner petals, a glowing diagonal word stack where a word goes out of focus, a mandala bloom, a diya whose flame dips on a sad word, brass nameplates in 3D, sunrise rays, names orbiting a key word. Light cream-gold scenes alternate with deep dark ones; transitions dive through the key object; the last scene closes back into frame 1 so the reel loops.
- **Laptop showcase for .dev** (`examples/pitah_type_motion/Showcase.tsx`): the user's phone recording of the video playing on the laptop. Sync the clean song by audio cross-correlation, trim the proxy to the song start, put a song tile + Claude tile on top and a "Comment SKILL" chip on the keyboard. A phone filming a screen gives moiré, so zoom into the screen (measure the video rect from bright-area bboxes) and cross-fade to the clean render for the middle, then zoom back out at the end.

## External resources (download when it makes the video better)
Code-drawn SVG is the default. When a real library or asset would clearly look or move better (complex characters, organic brush strokes, 3D, detailed props, textures), download it. Free + license-safe items need no permission; ASK the user before anything paid or needing a sign-up.

**Libraries** (install inside the song project with an exact version, e.g. `npm install roughjs@4.6.6`; if one proves useful for every song, add it to `template/` + `src/lib/`):
- `roughjs`: hand-drawn rectangles/circles/paths, hachure fills · `perfect-freehand`: brush/pen strokes with pressure · `flubber`: smooth morph between ANY two shapes
- `@remotion/lottie`: Lottie animations, frame-accurate · `@remotion/three` + `three`: 3D · `@remotion/motion-blur`: real motion blur on whip moves (slow; short hits only)
- `@remotion/shapes`, `@remotion/paths` (morph/measure), `@remotion/noise` (organic drift), `@remotion/transitions`, `@remotion/light-leaks`, `d3-shape` (smooth curves)
- NOT allowed: GSAP / anime.js / CSS animations / `setTimeout`. They are not frame-deterministic in Remotion; drive everything from `useCurrentFrame()`.

**Fonts:** any Google Font through `@remotion/google-fonts/<Name>` (OFL). Devanagari options: Tiro Devanagari Hindi, Noto Serif/Sans Devanagari, Mukta, Hind, Rozha One, Amita, Kalam, Yatra One, Baloo 2, Martel, Eczar, Sura.

**Assets** (prefer vector, prefer CC0 / MIT / OFL):
- Vector art and icons: Open Peeps / Open Doodles (CC0 hand-drawn people), SVG Repo (check each file's license), Lucide / Tabler / Phosphor (MIT), unDraw (free license), OpenMoji (CC BY-SA, credit)
- Animations: LottieFiles free animations (Lottie Simple License); recolour the JSON to the theme
- Textures, HDRIs, 3D models: Poly Haven (CC0), Kenney (CC0), Quaternius (CC0), Sketchfab (CC0 / CC-BY filter only, credit)
- Photos as texture overlays (paper, grain, dust) and, in story mode, as scene layers: Unsplash / Pexels (free license)
- Inspiration only (look, never copy): Pinterest, Behance, Dribbble, motion-design reels. Study timing, composition, transitions.

**Rules for anything downloaded:**
1. License must allow commercial use. Log every asset in the project's `CREDITS.md` (name, URL, author, license); CC BY assets get credited in the post caption.
2. Never use copyrighted characters, film stills, logos, celebrity faces, album/cover art, or another creator's video or artwork, and never trace a specific artwork.
3. Save to `public/assets/<source>/`, open and inspect SVG/JSON before use (no `<script>`, no external links), load with `staticFile()`. Keep files small (vectors, small PNGs).
4. Make it belong: recolour to the theme, apply the style's filters (wobble, grain, glow, rim light) and ANIMATE it (draw-on, spring in, parallax, react to hits). Never paste a static asset.
5. An asset serves the per-line metaphor in `creative_direction.md`; it never replaces the idea.

## Animation quality rules (most important)
1. **No linear motion anywhere.** Only `spring()` and `Easing` curves. Never call `interpolate()` without an `easing` (run `node <skill>/scripts/lint_motion.mjs <project>`; it fails on bare interpolate).
2. **Overshoot and settle** on every entrance; **anticipation and follow-through** on every object (the coin lifts a little before it falls, bounces twice on the palm, settles; the clock hand overshoots then settles).
3. **Kinetic typography:** each word appears exactly at its timestamp with scale + blur + slide-in. The key word: red accent, an underline that draws itself, a small punch-in.
4. **Hand-drawn feel:** stroke-dashoffset drawing, wobble via turbulence/displacement (boiling lines, seed changes every 3 frames), sketchy double outlines, slightly imperfect shapes.
5. **Camera:** slow continuous zoom or pan on every scene + parallax between background and foreground layers.
6. **Transitions:** match-cuts, wipes, morphs. An object of one scene becomes the next scene's object where possible. **No plain fades.**
7. **Theme + texture:** palette from the theme only (2 neutrals + 1 accent + light). Paper grain on light themes; on dark themes there must be a LIGHT SOURCE (spotlight, beams, dust) and the light reacts to hits (flare). Film grain + vignette always.
8. **Sync:** major motion hits land on beats and word timestamps — check them on the waveform PNG.
9. **Instagram safe zone:** top 250 px and bottom 380 px hold no key text (`SAFE` in `src/lib/palette.ts`; `KineticLine` respects it).
10. **Hindi:** show lyrics in Devanagari (convert Roman lyrics; alignment still matches). Lines in a literary serif (Tiro Devanagari Hindi / Noto Serif Devanagari), punchy words in Mukta or Noto Serif bold; never split a word into characters (breaks conjuncts/matras), animate whole words.
11. **Typography is part of the visual, not a caption:** contrast of scale (small serif line + one giant key word), and at least one typographic set piece per video (spiral, flood, split-screen giant word, words falling/stacking) on a line that fits it (repeats, overwhelm, confusion).
12. **Line art quality:** thin elegant strokes (3–6 px at 1080w), rim light on the side facing the light, a fill one tone off the background. A drawn object must read at a glance (check stills: if a hand looks like a loaf, redraw it).

## Reuse
Keep the helper library small and shared. If a scene needs a new motion, add it to `src/lib/anim.ts` with a name, not inline in the scene.
