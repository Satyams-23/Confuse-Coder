# Humara real run (17 Nov 2026)

Laptop: i5-11300H, 16 GB RAM, **no GPU**. Input: humari apni 7 dev reels jod ke ek video, 11.1 min (663 s).

```
> python clip.py our_dev_reels_long.mp4 --solution
video: our_dev_reels_long.mp4  11.1 min
[1/4] transcribing with whisper-small (CPU, first run downloads the model)...
[1/4] 1557 words with timestamps
[2/4] picking the best 3 x 30s moments...
[3-4/4] clip_1: 1:53 - 2:23  score 43  -> clips/clip_1.mp4
[3-4/4] clip_2: 10:10 - 10:40  score 43  -> clips/clip_2.mp4
[3-4/4] clip_3: 3:51 - 4:21  score 39  -> clips/clip_3.mp4
done: 3 vertical clips, 1080x1920, captions burned, no watermark
```

| | Time |
|---|---|
| Step 1 (whisper-small, CPU, 11 min audio) | ~20 min (pehli baar) |
| Step 2 (pick_moments, 634 windows) | < 0.1 s |
| Steps 3-4 (3 clips, FFmpeg) | ~15 s |
| Dobara chalao (transcript cached) | 19 s |

Kya chuna:
- **clip_1** (score 43): "free ka trap" wala part: "फ्री" 4 baar, "बस", "क्या"
- **clip_2** (score 43): "campaign mein nahi → ₹0" wala part: "गलती", "जीरो", "नहीं" ×4
- **clip_3** (score 39): server rollback wala part

Seekh:
1. Whisper Hindi ko **Devanagari** mein likhta hai, isliye `HYPE` mein dono script ke words hain. Pehle sirf romanised the, toh picks kamzor aaye.
2. Slow part AI "moment picking" nahi, **transcription** hai. GPU nahi toh `--model base` ya `tiny` try karo (tez, thoda kam accurate).
3. "नहीं" bahut common hai, score phula deta hai. Level-up: har word ka weight alag rakho.
