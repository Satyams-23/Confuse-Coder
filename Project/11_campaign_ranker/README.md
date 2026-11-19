# Campaign Ranker (payout caps + stable sort)
*@confuse__coder.dev · DEV 11 (GTA 6 clips = $1,000? Asli: $35) ka project*

Clipping campaigns per 1,000 views paisa dete hain, par teen cheezein kamai kaat deti hain:
1. **Max payout per clip**: GTA 6 wala campaign ek clip pe max $35 deta hai, views kitne bhi hon.
2. **Viewer country**: kai gaming campaigns mein India, Pakistan, Bangladesh ke views = **Not paid** (TikTok/YouTube).
3. **Platform**: har campaign har platform pe nahi chalta.

Is project mein tum ek ranker likhoge: campaigns ka data + **tumhare audience ka country split** → har campaign pe asli kamai, sorted.

## Run
```
node test.js                    # pehli baar: TESTS FAILED (earn() aur rank() khaali hain)
# starter.js kholo, dono functions likho (~20 lines)
node test.js                    # TESTS PASSED (15/15)
node rank.js data/campaigns_2026-11-17.json data/audience.json
```
Needs: Node 18+. Koi npm install nahi. Options: `--inr 88` (us din ka rupee rate) `--solution`.

## Files
| File | Kya hai |
|---|---|
| `common.js` | ready: JSON load, money / rupee / number format |
| `starter.js` | **tum likhoge**: `earn(row, audience, budgetLeft)` aur `rank(campaigns, audience, myPlatforms)` |
| `solution.js` | ek answer (pehle khud try karo) |
| `rank.js` | CLI: sorted list + CAP / country notes + rules |
| `test.js` | 15 checks: cap, country $0, `*` rate, min payout edge, budget cut, cents, sort, ties, skipped platforms |
| `data/campaigns_2026-11-17.json` | 4 real public campaigns, numbers jaise 17 Nov 2026 ko page pe the |
| `data/audience.json` | 1,00,000 views, India 85% (apna split daalo) |

## Expected output (reel wala)
```
#1   $150.00   ₹13,200  CoD MW4 DMZ           instagram
#2   $150.00   ₹13,200  SEGA Metaphor         instagram
#3   $100.00    ₹8,800  Expedia x IShowSpeed  youtube
#4   $100.00    ₹8,800  Expedia x IShowSpeed  instagram
#5    $35.00    ₹3,080  GTA 6 Tokyo Girl      instagram CAP
#6    $30.00    ₹2,640  SEGA Metaphor         youtube   85,000 views = $0 (country)
✗ GTA 6 Tokyo Girl: youtube pe nahi chalta
✗ CoD MW4 DMZ: youtube pe nahi chalta
```
Sabse hyped game, list mein neeche se doosra.

## Hint
- Rate: `row.countries ? (row.countries[country] ?? row.countries['*'] ?? 0) : row.cpm`
- `capped` = jo final usd hai wo total se kam hai (max ya budget ne kaata).
- Ties pe order mat badlo: JS ka `Array.prototype.sort` stable hai.

## Level-up
1. Apna asli country split YouTube Studio / Instagram Insights se `audience.json` mein daalo.
2. `views` ki jagah ek list do (`[5000, 20000, 1e5, 1e6]`) aur har campaign ka "kitne views pe CAP lagega" print karo.
3. Rules ko data banao (`needsSound`, `sourceOnly`) aur unhe ✓/✗ checklist bana do.

> Ye kisi platform ka official tool nahi hai. Data snapshot hai: rates roz badalte hain. Page pe country table na ho toh
> yahan sab countries paid maana hai; join karke asli brief padho.
