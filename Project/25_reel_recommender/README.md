# Reel Recommender (Embeddings)
*@confuse__coder.dev · AI/ML EP 03 · Reel: Instagram tumhari baatein nahi sunta*

Har reel ka ek "address" hai: teen numbers (kitna comedy, kitna coding, kitna cricket). Tumhara address = tumne jo dekha uska average. Feed = jo reels tumhare sabse paas hain. Tum teen chhote functions likhoge aur apna mini Explore feed bana loge.

---

## Reel se connection
| Reel | Code |
|---|---|
| Har reel ka address = kuch numbers | `REELS["dev meme"] = [8, 9, 0]` |
| Yahi numbers ki list = embedding | each value in `REELS` |
| Tumhara address = jo dekha uska average | `my_address(watched, reels)` → `[4.5, 9.0, 0.0]` |
| Coding joke teen door, Virat edit terah door | `distance(you, reel)` → 2.7 vs 13.2 |
| Jo sabse paas, wahi agla reel | `recommend(watched, reels, k=3)` |

## Files (Python)
| Ready file | Your job | Answer |
|---|---|---|
| `python/feed.py` (8 reels, printing, tests) | `python/starter.py`: `distance()` + `my_address()` + `recommend()` (~9 lines) | `python/solution.py` |

## Run
```bash
cd python
python starter.py
```

## Expected output (solution)
```
=== 1. TUMNE DEKHE: dev meme + python tutorial ===
  tumhara address = [4.5, 9.0, 0.0]
=== 2. HAR REEL KITNA DOOR? ===
  coding joke        2.7
  ...
  virat edit        13.2
=== 3. TUMHARA FEED (top 3, jo dekh liye woh nahi) ===
  1. coding joke
  2. dsa short
  3. standup clip
=== 4. TESTS ===
  [PASS] ... (7 tests)
Sab pass! Tumne apna mini Explore bana liya.
```

## Hint
`zip(*vecs)` gives you the columns: all comedy numbers together, all coding numbers together, and so on. Average each column.

## Try these after it passes
1. Add a fourth number, "music", to every reel. Does anything in your code need to change? (It shouldn't.)
2. Replace `distance` with cosine similarity (`a·b / (|a| × |b|)`, sort highest first). Does the feed change?
3. Watch one cricket meme after the two coding reels. How many cricket reels does it take before cricket shows up in your top 3?
