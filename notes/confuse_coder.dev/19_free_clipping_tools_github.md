# Free clipping tools on GitHub: which one fits you
*@confuse__coder.dev · DEV 19 · Reel: GTA 6 ke clips: kaunsa free tool use karein?*

---

## 1. Idea in one line
Chaar free, open-source clipping tools hain, aur sahi tool tumhare **video type aur PC** pe depend karta hai: gaming, no-setup, podcast ya apna server.

Sab details 20 Nov 2026 ko har tool ke GitHub README aur LICENSE file se check ki hain. Free tools jaldi badalte hain, install se pehle README ek baar dekh lo.

## 2. Jaldi chuno
| Tumhara case | Tool | Kyun |
|---|---|---|
| GTA / gaming stream, facecam | **Clips Kitty** | Facecam + game layout built-in, sab PC pe |
| Docker nahi aata, simple chahiye | **Cutawan** | Normal installer |
| Podcast, 2 log baat kar rahe | **OpenShorts** | Dono speakers upar-neeche |
| Apna server chala sakte ho | **SupoClip** | Self-host, no watermark (license padho) |

## 3. Clips Kitty (gaming streams)
- **Kya karta hai:** stream ya video se best moments dhoondh ke vertical clips. Gaming / Reaction mode mein webcam ek half mein, game doosre mein.
- **Chahiye:** Windows 10/11, **16 GB RAM** (8 GB pe render nahi hota), ~20 GB disk. Graphics card optional (bina GPU slow, par chalta hai).
- **Install:** Microsoft Store mein "Clips Kitty", ya [GitHub releases](https://github.com/ColinGPT9/clips-studio/releases).
- **AI:** default local Ollama (video upload nahi hoti), ya OpenRouter (README: 2 ghante ka video ~11 cents).
- **Price:** free, koi paid tier nahi, watermark kabhi nahi. License AGPL-3.0.
- Repo: [github.com/ColinGPT9/clips-studio](https://github.com/ColinGPT9/clips-studio)

## 4. Cutawan (no tech setup)
- **Kya karta hai:** AI se viral moments, animated captions, speaker ke hisaab se 9:16 crop.
- **Chahiye:** Windows `.exe`, Mac (Apple Silicon) ya Linux `.AppImage`. Docker, Python, Node kuch nahi.
- **Install:** [latest release](https://github.com/JeremySNR/cutawan/releases/latest) se download → open → setup wizard.
- **AI:** wizard mein chuno: ChatGPT sign-in (Codex, beta, tumhare plan se), OpenAI-compatible API key, ya OpenRouter. API route ka andaaza ~$0.36 per ghanta video.
- **Bina AI:** "Local captions only" mode: poori video pe captions, free, kuch connect nahi karna.
- **Price:** free, no watermark. License MIT.
- Repo: [github.com/JeremySNR/cutawan](https://github.com/JeremySNR/cutawan)

## 5. OpenShorts (podcasts)
- **Kya karta hai:** long video → 9:16 clips, face tracking, captions. Do log camera pe ho toh dono ko upar-neeche stack karta hai.
- **Chahiye (self-host):** Docker, 8 GB+ RAM, apni Gemini API key (ElevenLabs / fal.ai optional). CPU pe 8 min video ≈ 5-8 min.
- **Setup nahi karna?** [openshorts.app](https://www.openshorts.app): free plan = pehla video 60 min tak, phir 20 min/mahina, watermark ke saath. Paid $12/mo se.
- **Price:** self-host free, no watermark. License MIT.
- Repo: [github.com/mutonby/openshorts](https://github.com/mutonby/openshorts)

## 6. SupoClip (self-host, license dhyaan se)
- **Kya karta hai:** best 3-7 moments, face-centred crop, word-synced subtitles, hook titles, no watermark.
- **Chahiye:** Docker, AssemblyAI API key (transcription) + ek LLM key (Gemini / OpenAI / Claude, ya local Ollama). Setup ke baad `localhost:3107`.
- **License (18 Nov 2026 ko badla, v1.1 19 Nov):**
  - **Bina pooche chalega:** tum akele, apne self-hosted copy pe, apne channels pe clips daal ke kamao, ya authorized clipping campaign mein hissa lo.
  - **Pehle written permission:** kisi creator / agency ke liye paise lekar clipping, team use, company use, paid hosting. Contact: support@supoclip.com.
- Repo: [github.com/FujiwaraChoki/supoclip](https://github.com/FujiwaraChoki/supoclip)

Legal advice nahi hai. Final baat hamesha repo ki LICENSE file ki.

## 7. Kisi bhi free tool se pehle 3 checks
1. **Requirements:** RAM, OS, Docker chahiye ya nahi (README ka "Requirements" section).
2. **AI ka kharcha:** local model hai ya API key? API key = thoda paisa per video.
3. **License:** repo ke right side "About" mein, aur `commits/main/LICENSE` pe uski history.
