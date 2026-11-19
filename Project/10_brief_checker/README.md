# Brief Checker (rule validation + earnings)
*@confuse__coder.dev · DEV 10 (MrBeast clip = ₹0? Clipping ka asli hisaab) ka project*

Clipping platforms (jaise Vyro) brand ke video ke clips pe **per view** paisa dete hain. Par post tabhi paisa banata hai
jab wo campaign ke **brief** ke rules follow kare: sahi source video, sahi length, vertical, `#ad` disclosure, no watermark.
Rejected post = mehnat zero. Is project mein tum ek checker likhoge jo har clip ko brief se milata hai **post karne se pehle**,
aur batata hai kitne views pe kitna paisa banega.

## Run
```
node test.js                    # pehli baar: TESTS FAILED (check() aur earnings() khaali hain)
# starter.js kholo, dono functions likho (~15 lines)
node test.js                    # TESTS PASSED (20/20)
node check.js demo/brief.json demo/clips.json --views 10000 --inr 88
```
Needs: Node 18+. Koi npm install nahi. (Optional: ffprobe, agar clips.json mein `"file": "clip.mp4"` doge.)

Options: `--views 10000` `--inr 88` (rupee rate, us din ka check karo) `--solution` (solution.js use karo).

## Files
| File | Kya hai |
|---|---|
| `common.js` | ready: JSON load, reason messages, `probe(file)` (ffprobe se duration/size), money format |
| `starter.js` | **tum likhoge**: `check(clip, brief)` aur `earnings(views, brief)` |
| `solution.js` | ek answer (pehle khud try karo) |
| `check.js` | CLI: brief + clips → ✓/✗ list + earning |
| `test.js` | 20 checks: locked, source, platform, length edges, 9:16, `#ad` vs `#adventure`, watermark, budget cap, min views |
| `demo/brief.json` | made-up open campaign ($2 per 1,000 views) |
| `demo/brief_locked.json` | made-up **locked** campaign (sab ✗) |
| `demo/clips.json` | 5 clips, jaise AI tool ne kaate (sirf 1 post karne layak) |

## Expected output (reel wala)
```
Brief: Demo Show: Funny Moments  (open, $2.00 per 1,000 views, budget left $500.00)

✓ clip1    32s  1080x1920  instagram → 10,000 views = $20.00 (≈ ₹1,760)
✗ clip2    28s  1080x1920  instagram → MISSING_TAG #ad: disclosure tag missing
✗ clip3    41s  1080x1920  instagram → NOT_A_CAMPAIGN_SOURCE: ye video campaign mein hai hi nahi: ₹0 + copyright risk
✗ clip4    75s  1080x1920  youtube   → TOO_LONG: clip brief se lamba hai
✗ clip5    22s  1920x1080  tiktok    → NOT_VERTICAL: vertical (9:16) nahi hai | WATERMARK: watermark hai (free plan?)

Post karne layak: 1/5
```

## Hint
- `#adventure` mein bhi "#ad" likha hai! `caption.includes('#ad')` galat hai. Caption se saare `#tags` nikaalo
  (regex `/#[\p{L}\p{N}_]+/gu`), lowercase karo, phir poora tag match karo.
- 9:16 check: `height / width` ko `16 / 9` se compare karo, 2% slack ke saath (720x1280 bhi sahi hai).
- Earning: `views / 1000 * cpm`, phir `Math.min(..., budgetLeft)`, phir cents tak round.

## Level-up
1. Apne real campaign ka brief `brief.json` mein likho, aur apne clips ke `file` path daalo (ffprobe se duration aayega).
2. Brief mein `bannedWords` add karo (jaise "free money") aur caption mein mile toh ✗.
3. `perPostCap` add karo: ek post se max kitna ban sakta hai.
4. Ek folder ke saare `.mp4` scan karo aur `clips.json` khud banao.

> Ye project kisi platform ka official tool nahi hai. Real rules hamesha campaign ke live brief mein padho.
