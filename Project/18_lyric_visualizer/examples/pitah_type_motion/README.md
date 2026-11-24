# Example: Pitah Se Hai Naam Tera, type + motion only

Reference scenes from a real song project (emotional verse + chorus, 62 s). These files are examples to read and copy from, not part of the template build. They expect the template `lib/` (with `Lyric.tsx`) and a `wordFrame(line, prefix, fallback)` helper that returns the scene-relative frame of the first word starting with `prefix`.

- `TypeScenes.tsx`: 5 verse lines. Halo ring tunnel + a giant word behind a small one, a glowing diagonal stack where नहीं goes out of focus, a mandala behind प्यार, a diya for कभी, a brass पिता plate + सब on sunrise rays.
- `Chorus.tsx`: 4 chorus lines. Names of god orbiting रब on a night sky, a नूर light burst that gathers into one point, two brass plates merging into one, and halo rings closing back to the first frame (loop).
- `Showcase.tsx`: a .dev showcase composition built on the user's phone recording of the video on a laptop. Song tile + Claude tile, "Comment SKILL" chip, a zoom into the screen with a cross-fade to the clean render, then a zoom back out.

Register scenes the usual way in `src/scenes/index.ts` (`SCENES`, `TRANSITIONS`).
