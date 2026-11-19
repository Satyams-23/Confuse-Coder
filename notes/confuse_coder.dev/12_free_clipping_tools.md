# Free AI clipping tools: kaunse sach mein free hain
*@confuse__coder.dev · DEV 12 · Reel: 7 "free" AI clipping tools → sach mein free: 2*

---

> Live check: 17 Nov 2026, har tool ka official pricing / help / GitHub page. Plans badalte rehte hain, use karne se pehle page khud kholo.

## Asli table
| Tool | Free plan (official page) | Watermark | Quality | Expiry / limit | Open source |
|---|---|---|---|---|---|
| **OpusClip** | 60 credits/month | ✅ haan ("Has watermark") | up to 1080p | 3 din baad clips export nahi hote, no editing | ❌ |
| **Vizard** | 60 credits/month | ✅ haan (no-watermark sirf paid) | 720p | 3-day storage | ❌ |
| **WayinVideo** | 100 credits **ek baar** | ❌ nahi (kisi plan pe nahi) | 720p | credits khatam = free khatam | ❌ |
| **Choppity** | 1 hour AI analysis/month | ✅ haan (download pe Choppity mark) | – | 3-day project storage | ❌ |
| **ClipShip** | free forever, local desktop app | ✅ haan (720p + ClipShip watermark) | 720p | – | ❌ |
| **OpenShorts Cloud** | pehli video 60 min, phir 20 min/month | ✅ haan | – | 20 min/month | – |
| **OpenShorts (self-host)** | free forever | ❌ nahi | – | koi cap nahi | ✅ MIT, ★ 8,753 |
| **AutoClip** | free forever | ❌ nahi | – | koi cap nahi | ✅ MIT, ★ 10,629 |

**Rule: free forever + bina watermark + apne laptop pe export → sirf 2: AutoClip aur OpenShorts (self-host).**

"Free" ke 4 matlab:
1. **Watermark:** OpusClip, Vizard, Choppity, ClipShip, OpenShorts Cloud.
2. **Ek baar ke credits:** WayinVideo (watermark nahi, par 100 credits ke baad paid).
3. **Saaf download = paid:** free download hota hai par watermark ke saath; bina mark ke file paid plan pe (Choppity help page).
4. **Expiry:** OpusClip clips 3 din baad export nahi hote, Vizard/Choppity 3-day storage.

## Dono open-source kaise chalayein
**AutoClip** (github.com/zhouxiaoka/autoclip)
- Windows 10/11 x64 ya Apple Silicon Mac: Releases se installer (Python + FFmpeg andar hi hai).
- Settings mein AI provider + API key, **ya** Ollama / LM Studio se local model (key nahi chahiye).
- Pehle "sample project" chalao: bina key ke chalta hai.

**OpenShorts self-host** (github.com/mutonby/openshorts)
- Docker + 8 GB+ RAM. `docker compose up`.
- Gemini API key, **ya** `LLM_BASE_URL` ko Ollama pe point karo (fully local).
- Bina GPU ke slow: README kehta hai ~5-8 min per 8-min video (CPU).

## Andar ka secret: sab ek hi pipeline
1. **Whisper**: awaaz → text, har word ka timestamp
2. **AI picks**: transcript padh ke best moments
3. **Crop**: 16:9 → 9:16, face tracking
4. **FFmpeg**: captions burn + clip cut

## Project: 12_mini_clipper (apna clipper)
[Mini Clipper](https://www.confuse-coder.site/projects/12_mini_clipper) (Python + FFmpeg + faster-whisper)
```
pip install faster-whisper numpy      # ffmpeg PATH pe
python test.py                         # pehle FAILED
# starter.py: pick_moments() likho (sliding window + no overlap)
python test.py                         # PASSED 15/15
python clip.py my_video.mp4 --k 3 --win 30
```
Humara run: 11 min video → 3 vertical clips, 1080x1920, no watermark. Transcription CPU pe ~20 min, moment picking < 0.1 sec.
Sirf apni / permission wali videos pe chalao.

## Sources (17 Nov 2026)
opus.pro/pricing · vizard.ai/pricing · WayinVideo help "How WayinVideo plans work" · help.choppity.com "Removing the watermark" · choppity.com/pricing · clipship.co · github.com/zhouxiaoka/autoclip · github.com/mutonby/openshorts (README)
