# Clipping ka asli hisaab: MrBeast clip ki kamaai
*@confuse__coder.dev · DEV 10 · Reel: MrBeast clip = ₹0?*

---

> Live check: 17 Nov 2026. Campaigns open aur band hote rehte hain, isliye post karne se pehle site khud kholo.

## Haan, comments sahi hain: India ke liye abhi sirf 1 campaign
vyro.com/campaigns, 17 Nov 2026 (re-check):

| Campaign | Rate | Status | Platforms | India (Insta/Shorts) |
|---|---|---|---|---|
| Scrubs: Humorous Clips Only | $2,000 / 1M | **Open** | TikTok, Shorts, Instagram | ✅ **yahi ek** |
| The Drop: TikTok Edits | $2,000 / 1M | Open | sirf TikTok | ❌ TikTok India mein ban |
| The Lowdown: TikTok Edits | $2,000 / 1M | Open | sirf TikTok | ❌ TikTok India mein ban |
| Scrubs Emotional, MrBeast, All's Fair, Behemoth!, CODM ×2, Victorian Psycho, Phony | $1,000–2,500 / 1M | 🔒 Locked | | ❌ |

**11 campaigns → 8 locked → 3 open → India ke liye 1.**
Matlab Vyro abhi "side income" nahi, "check karte raho" wala platform hai:
- Vyro ke **email / Discord alerts** on karo. Naya campaign aate hi day 1 pe post karo; MrBeast wala 2 din mein lock ho gaya tha.
- Card pe platform icons dekho: sirf TikTok icon = India se kaam ka nahi.
- Ek platform pe depend mat raho. Doosre clipping platforms bhi hain (jaise Content Rewards), par wahan kuch campaigns **India ke views ka paisa nahi dete** aur per-clip max cap hota hai. Join karne se pehle brief ki country table padho: notes/confuse_coder.dev/11_gta6_clipping_cap.md.

## Clipping kya hai
Brand / creator ek **campaign** daalta hai (apna video + rules = **brief**). Tum us video ke short clips banake
Instagram / TikTok / YouTube Shorts pe post karte ho, link platform pe submit karte ho, aur **har 1,000 views ka fixed rate (CPM)** milta hai.
Example platform: **Vyro** (MrBeast ki Viewstats team se, Oct 2025 launch).

## Asli hisaab
- Rate campaign pe likha hota hai, jaise **$2,000 per 1M views** = **$2 per 1,000 views ≈ ₹176** (₹88/$ pe; us din ka rate check karo).
- 10,000 views = $20 ≈ ₹1,760. 1M views wala sapna nahi, pehle 10k laake dikhao.
- Paisa milne ki shartein (Vyro FAQ):
  1. Post **approve** ho (brief follow karo, `#ad` disclosure, spam nahi).
  2. **Minimum view threshold** cross kare.
  3. Paisa **pending** rehta hai jab tak campaign khatam na ho + final view verification.
  4. Withdraw: minimum **$10**, hafte mein ek baar, Stripe ya PayPal (location ke hisaab se).
  5. Budget khatam = earning band. Fake/bot views = account ban.

## 3 galtiyan
1. **Locked campaign**: card pe "Locked for new posts" likha hai? Naye post ka paisa nahi. (17 Nov ko MrBeast wala locked tha.)
2. **Koi bhi viral video kaat dena**: jo campaign mein nahi hai uska ₹0, upar se copyright claim ka risk.
3. **AI ke clips bina check post karna**: watermark (free plan), galat length, landscape, `#ad` missing → reject.

## Developer setup (OpusClip + Claude Code)
```
claude mcp add --transport http opusclip https://mcp.opus.pro/mcp
```
Phir Claude Code mein `/mcp` → OpusClip → sign in (OAuth).
Claude.ai pe bhi OpusClip connector hai (Settings → Connectors).
OpusClip free plan: ~60 credits/month, watermark, export 3 din mein expire (opus.pro/pricing check karo). Agar brief "no watermark" bole toh free plan ke clips reject ho sakte hain.

> ⚠️ **Correction (17 Nov 2026, viewer ke comment ke baad):** MCP **connect** free account pe ho jaata hai, par **clip banwana** (render) MCP se **paid plan** maangta hai. Free account pe "Plan upgrade karo" aayega. Ye hamari galti thi, notes theek kar diye.
>
> **Free wala raasta (MCP ke bina):**
> 1. opus.pro website pe login, campaign ka source video ka link paste karo (free ~60 min/month).
> 2. Aspect ratio **9:16**, clip length brief ke hisaab se, "Get clips".
> 3. Clips download karo (3 din mein expire). Free plan pe watermark lagega.
> 4. Har clip `10_brief_checker` se check karo (source, length, 9:16, #ad, watermark).
> 5. Brief "no watermark" bole toh free OpusClip ke clips mat daalo. Free + bina watermark chahiye toh open-source raasta: [Mini Clipper](https://www.confuse-coder.site/projects/12_mini_clipper) (apne laptop pe, Whisper + FFmpeg).
> 6. Pass hue clip post karo, #ad ke saath, aur link Vyro pe submit karo.
>
> Claude ka kaam free mein bhi: brief paste karke captions + #ad + checker chalwana. Sirf clip render MCP se paid hai.

### Prompt template
```
Ye campaign ka source video hai: <campaign brief wala link>
Brief: <rules copy-paste karo>
Iska <N> vertical (9:16) clips banao, har clip <min>-<max> second, captions ke saath.
Har clip ka Instagram caption likho, aur har caption mein #ad zaroor ho.
Sirf <humorous / emotional / jo brief bole> moments chuno.
```

## Project: 10_brief_checker
[Brief Checker](https://www.confuse-coder.site/projects/10_brief_checker): tum `check(clip, brief)` aur `earnings(views, brief)` likhoge. 20 tests.
Trap: `#adventure` mein bhi "#ad" hai, par wo disclosure nahi hai.

## Sources
- vyro.com/campaigns, vyro.com/creators (FAQ), live 17 Nov 2026 (campaign list re-checked same day: 11 listed, 8 locked, 3 open, 2 of them TikTok-only)
- opus.pro/mcp, help.opus.pro (Claude connector)
