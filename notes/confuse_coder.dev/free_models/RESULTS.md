# Free model test — OpenRouter, 2026-11-13

Each model got the same 3 coding tasks. Its code was **run against hidden tests** (pass = all asserts ok).
1. merge_intervals (easy) 2. LRU cache (easy) 3. calculator with brackets, unary minus, trunc-division, no eval (hard)

| Model | Tasks passed | Speed (easy / hard) | Notes |
|---|---|---|---|
| **baidu/ernie-5.5-flash-preview:free** | 3/3 | 2s / 7s | Fastest and passed every time. "preview" means it may be removed later |
| **nvidia/nemotron-3-ultra-550b-a55b:free** | 3/3 (hard task on 2nd try) | 7s / 42s | Biggest famous name; 1st hard try returned no function |
| **recursive/flint-v1.0:free** | 3/3 | 2–4s / 20s | Fast, little-known |
| **particle-ai/particle-1:free** | 3/3 | 2–5s / 85s | Slow on the hard task |
| **cohere/north-mini-code:free** | 3/3 | 6s / 186s | Coding model; very wordy (63k tokens on hard) |
| nvidia/nemotron-3.5-super-vl:free | 3/3 (hard on 2nd try) | 5–10s / 33s | Flaky 1st try |
| nvidia/nemotron-3.5-lightning:free | 2/3 (1 timeout) | 8s / 54–110s | |
| nvidia/nemotron-3-nano-omni-30b:free | 3/3 (hard on 2nd try) | 3–4s / 46s | 1st hard try timed out at 8 min |
| dots-studio/dots-3-note-preview:free | 3/3 | 14–22s / 62s | Slow |
| liquid/lfm-3-1.7b:free | 2/3 | 8–20s / fail | Tiny model; failed the hard task |
| google/gemma-4-31b / 26b :free | 0/3 | — | **Rate-limited upstream on all 6 tries** (famous, but busy) |
| thinkingmachines/inkling-2-small:free | — | — | 403: only works inside agent apps (Cline/Kilo etc.) |
| google/lyria-3-* | — | — | Music models listed at $0; not for code |

Limits: free = 20 req/min, 50 req/day (1000/day after a one-time $10 credit buy).

## Proposed top 5 for NOTES
1. ERNIE 5.5 Flash: fastest, passed every time → **hero model for the footage**
2. Nemotron 3 Ultra (NVIDIA): the big famous one
3. Flint v1.0: fast all-rounder
4. Particle-1
5. Cohere North Mini Code: built for code
Bonus line: Gemma 4 (Google) is free too, but was too busy to answer today.

## Re-check before recording
The free list rotates. Run `python round2.py` (or bench.py run) on a fresh day. **Uses ~12–32 of the 50 daily requests.**
Script fix needed next time: save and print each row as it finishes (results only saved at the end now).
