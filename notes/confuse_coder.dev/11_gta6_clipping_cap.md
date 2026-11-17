# DEV 11 · GTA 6 clips = $1,000? Asli: $35

> Live check: 17 Nov 2026 (contentrewards.com public pages, logged out). Campaigns roz badalte hain: 19 Nov ko naye GTA campaigns aa sakte hain, isliye khud page kholo.

## Asli kamai ka formula
```
kamai = min( views × rate (viewer country ke hisaab se) / 1000 ,  max payout per clip ,  budget left )
min payout se kam = $0      platform fee ≈ 10%
```
Teen cheezein rate se zyada matter karti hain: **max payout**, **viewer country**, **platform**.

## GTA 6 campaign (17 Nov)
| | |
|---|---|
| Naam | GTA 6 Clipping Campaign - Tokyo Girl (Placements) |
| Category | **Music**: clip mein "Tokyo Girl" by Passive lagana zaroori |
| Rate | **$0.70 / 1,000 views** (TikTok + Instagram) |
| Max payout | **$35 per clip** → 50,000 views pe cap lag jaata hai |
| Budget | $2,000 total, sab clippers ke beech |

## Bade gaming campaigns, par country rule
| Campaign | Rate | Max/clip | India views |
|---|---|---|---|
| Call of Duty MW4 DMZ | TikTok up to $2, IG $1.50 | $1,200 | TikTok: **Not paid** (Pak, Ind, Ban) |
| SEGA Metaphor ReFantazio | TikTok/YT up to $2, IG $1.50 | $800 | TikTok + YouTube: **Not paid** |
| Expedia x IShowSpeed | $1 (sab platforms) | $500 | country table nahi dikha; sirf 6 Nov wali stream ke clips |

Instagram un country tables mein listed nahi hai. Join karke brief padho, phir decide karo.

## GTA launch week ke 2 rules
1. **Rockstar policy**: cutscenes lambe play-through ke andar chalte hain, par *isolated cinematics*, ending aur bade story reveal wale videos hataaye ja sakte hain. Policy "non-commercial" use ke liye hai (game footage se paisa = non-commercial nahi).
2. **X paid clipping** (9 Nov 2026): Premium + eligibility, sirf pre-recorded videos (2 min+), clip 5-60 sec, max 30% video. **Live streams abhi clip nahi hote.**

## Project: 11_campaign_ranker
`viewer-projects/11_campaign_ranker` (Node 18+, no install)
```
node test.js                     # pehle FAILED
# starter.js: earn() + rank() likho
node test.js                     # PASSED 15/15
node rank.js data/campaigns_2026-11-17.json data/audience.json
```
Demo: 1,00,000 views, 85% India, YouTube + Instagram → GTA 6 = #5, $35 (CAP). Apna country split Insights se `audience.json` mein daalo.

## Free clipping tool
OpenShorts (github.com/mutonby/openshorts, MIT): Docker + Gemini API key se self-host. Lambi video → 9:16 clips + captions.

## Sources
- contentrewards.com campaign pages (GTA 6 Tokyo Girl, CoD MW4 DMZ, SEGA Metaphor, Expedia x IShowSpeed), 17 Nov 2026
- support.rockstargames.com: "Policy on posting copyrighted Rockstar Games material" (updated 10 Jan 2025)
- digitaltrends.com: "X finally lets you clip videos without downloading them…" (Nov 2026)
