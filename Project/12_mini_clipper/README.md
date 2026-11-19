# Mini Clipper (sliding window + greedy top-k)
*@confuse__coder.dev · DEV 12 (7 free AI clipping tools → sach mein free: 2) ka project*

OpusClip, Vizard, OpenShorts, AutoClip... sab andar se same 4 kaam karte hain:

| Step | Kya hota hai | Is project mein |
|---|---|---|
| 1 | Awaaz → text, har word ke time ke saath | `common.transcribe()` (faster-whisper, CPU) |
| 2 | **Best moments chunna** (sirf yahi "smart" part hai) | **tum likhoge: `pick_moments()`** |
| 3 | 16:9 → 9:16 crop | `common.cut_clip()` (centre crop) |
| 4 | Captions jalana + clip kaatna | `common.cut_clip()` (FFmpeg + libass) |

Step 2 ek classic **sliding window** problem hai: 30 second ki khidki video pe slide karo, har khidki ka score nikaalo,
aur sabse oonche k score bina overlap ke chuno. Watermark? Koi nahi. Credits? Koi nahi. Code tumhara hai.

## Run
```
pip install faster-whisper numpy        # + ffmpeg/ffprobe on PATH
python test.py                          # pehli baar: TESTS FAILED (pick_moments khaali hai)
# starter.py kholo, pick_moments() likho (~20 lines)
python test.py                          # TESTS PASSED (15/15)
python clip.py my_video.mp4 --k 3 --win 30
```
Options: `--k 3` (kitne clips) `--win 30` (clip length, sec) `--model small` (whisper: tiny/base/small/medium) `--out clips` `--solution`.

> Sirf apni ya permission wali videos pe chalao. Kisi aur ka stream/video kaat ke daalna = copyright risk.

## Score ka rule (starter.py mein detail)
```
score(t) = 3 × (hype words jinka start [t, t+win) mein hai) + (loud seconds, loud >= 0.7)
```
Hype words `common.HYPE` mein hain (English + Hinglish: insane, wow, bhai, kya, pagal...). Apne hisaab se badlo.

## Expected output (reel wala run)
Humne apni 7 dev reels jod ke ek 11 min ki video banayi, aur chalaya:
```
[1/4] 1557 words with timestamps
[2/4] picking the best 3 x 30s moments...
[3-4/4] clip_1: 1:53 - 2:23  score 43  -> clips/clip_1.mp4
[3-4/4] clip_2: 10:10 - 10:40  score 43  -> clips/clip_2.mp4
[3-4/4] clip_3: 3:51 - 4:21  score 39  -> clips/clip_3.mp4
done: 3 vertical clips, 1080x1920, captions burned, no watermark
```
Bina GPU ke laptop pe transcription ~20 min lagi (11 min video), baaki sab seconds mein. Poori detail: [RUN.md](RUN.md).
Whisper Hindi ko Devanagari mein likhta hai, isliye `HYPE` mein dono script ke words hain.

## Files
| File | Kya hai |
|---|---|
| `common.py` | ready: transcribe, loudness, 9:16 crop, captions (.ass), FFmpeg cut |
| `starter.py` | **tum likhoge**: `pick_moments(words, loud, duration, win, k)` |
| `solution.py` | ek answer (prefix-sum sliding window + greedy no-overlap) |
| `clip.py` | CLI: video → `clips/clip_1.mp4 ...` |
| `RUN.md` | humara real run: timings, kya chuna, kya seekha |
| `test.py` | 15 checks: scoring, punctuation, edges, no overlap, brute-force match, 10-hour stream < 2s |

## Hint
1. Har second ke points ek array mein daalo: `pts[sec] += 3` har hype word ke liye, `+1` agar second loud hai.
2. Pehli khidki ka sum nikaalo. Aage badhte waqt: `+ pts[naya second] - pts[purana second]`. Har khidki O(1).
3. Saare (score, start) sort karo (score bada pehle, tie pe start chhota), aur greedy uthao jo kisi picked se `win` se kam door na ho.

Har khidki ke liye saare words dobara gino toh 10-hour test fail hoga: 36,000 khidkiyan × 30,000 words = 1 arab checks.

## Level-up
1. **Face tracking:** centre crop ki jagah chehra dhoondho (OpenCV / MediaPipe) aur crop ko us taraf slide karo.
2. **LLM se score:** har khidki ka transcript ek local model (Ollama) ko do: "1-10, kitna viral?" aur `pts` mein jodo.
3. **Sentence pe kaato:** clip ka start/end nearest sentence boundary (`.` `?` `!`) pe snap karo.
4. **Variable length:** 15 se 60 sec tak, jo best fit ho.
