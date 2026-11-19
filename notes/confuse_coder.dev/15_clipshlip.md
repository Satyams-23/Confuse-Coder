# ClipShlip review: free AI clipper
*@confuse__coder.dev · DEV 15 · Reel: ClipShlip, worth it?*

---

Checked on 18 Nov 2026. Free tools change fast, so re-check the links yourself.

## What it is
- **ClipShlip** by Haris Ai: a free **desktop** app (Windows 10/11, Apple Silicon Mac) that turns a long video into short vertical clips.
- Official site: https://theharisai.com/clipshlip/
- Official downloads (ONLY here): https://github.com/Ai-Haris/ClipShlip-Releases/releases/latest

| | |
|---|---|
| Price | Free, commercial use allowed (no resale / rebranding) |
| Watermark | None, unless you add your own |
| Account / card / API key | None |
| Runs | On your laptop (bundles whisper.cpp + FFmpeg) |
| Finds moments | Scores every part and says *why* a clip was picked |
| Crop | 9:16, 4:5, 1:1, follows whoever is talking |
| Captions | Word by word, 74 styles, 15 languages; Hindi, Urdu, Hinglish first-class |
| Missing | No auto-posting, no mobile app yet, export resolution not stated |
| Code | Closed source (the GitHub repo only has installers) |
| Privacy policy | Not linked on the site |
| Latest | v1.4.0 (Windows, 20 Sep 2026, marked **Pre-release** on GitHub) · Mac v1.3.0 |

## Why can it be free?
- Cloud clipping tools run your video on **their** GPUs. Every minute costs them money → credits, and a watermark on free plans.
- ClipShlip runs on **your** GPU/CPU and electricity. The developer's cost per video is about ₹0, so free is possible.
- You pay in **time**: transcription on a laptop without a good GPU is slow.

## 3 checks before you install
1. **Official source only.** Download from the GitHub releases link above, never from a link in comments or DMs.
   Windows SmartScreen will say "Unknown publisher" because the installer isn't code-signed. That alone doesn't mean it's a virus, but don't click "Run anyway" blindly: right-click the .exe → **Scan with Microsoft Defender** first.
2. **Verify the download count yourself.** The site shows ~30,000. Add up GitHub's own numbers:
   ```bash
   curl -s "https://api.github.com/repos/Ai-Haris/ClipShlip-Releases/releases?per_page=100" \
     | python -c "import json,sys; print(sum(a['download_count'] for r in json.load(sys.stdin) for a in r['assets'] if a['name'].endswith(('.exe','.zip','.dmg'))))"
   ```
   On 18 Nov: site 29,978, API 29,979. They match, so the counter is honest.
3. **Privacy test.** Turn WiFi off and render one clip. If it works offline, your video didn't need to be uploaded for that render.
   (The first launch may need internet once, to set things up.)

## Verdict
**Worth it** if your laptop has the power, you download from the official GitHub, and you're OK trusting closed-source software.
Don't put private videos in it without thinking: there's no open code and no privacy policy to check.
