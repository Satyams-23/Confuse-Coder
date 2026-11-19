# Stream Parts (split a long transcript by time)
*@confuse__coder.dev · DEV 18 (AI ko long stream ka beech wala hissa padhwao) ka project*

I pasted Kai Cenat's 11h35m GTA 6 stream link into free Gemini and asked for the 10 best clips. 9 came from the first 1h47m and 1 from the last 6 minutes.
The middle 9h43m got 0 clips, including the Bigfoot hunt at 9:44. When pushed, Gemini itself said the transcript it got "has gaps in the middle hours (01:47:20–11:28:25)".
Fix: give the AI the transcript **one part at a time**. This tool makes those parts, each with the clip prompt already on top.

**You write one function:** `split_parts()` in `starter.py`: cut the transcript into N equal **time** windows.

## 1. Tests (no internet needed)
```bash
python test.py            # your starter.py (fails until you write split_parts)
python test.py solution   # the reference answer: 13/13
```

## 2. Use it on a real stream (free)
Needs Python 3.9+, `pip install yt-dlp`, [Node.js](https://nodejs.org) (so yt-dlp can see the captions) and [ffmpeg](https://ffmpeg.org) (for step 3). Step 1 downloads **captions only**, not the video.
```bash
python parts.py "https://youtu.be/VZqAPdUvqnQ" --parts 20 --creator "Kai Cenat" --handle kaicenat
```
Expected (19 Nov 2026):
```
stream: 11:35:53 | 14034 caption lines | 20 parts -> out/VZqAPdUvqnQ/
  part01.txt  0:00:00 - 0:34:46     25365 chars
  ...
  part17.txt  9:16:43 - 9:51:23     16192 chars     <- the Bigfoot hunt is in here
  ...
```
Open `part17.txt`, copy all of it, and paste it into Gemini (free, works in India, no VPN). ChatGPT or Claude work too. **One part per message.**
Rule of thumb: about 30-35 minutes of stream per part (10 parts for 5 hours, 20 for 11 hours).
In our test, all 3 answers for part 17 were the Bigfoot hunt. #1: `9:47:30` "I found him!"

## 3. Gemini's answer → finished clips (needs ffmpeg)
Copy Gemini's whole answer (the table) into `out/<id>/answer.txt`. You can paste answers from several parts into the same file. Then:
```bash
python parts.py "https://youtu.be/VZqAPdUvqnQ" --clips out/VZqAPdUvqnQ/answer.txt --handle kaicenat --cam 0,0.40,0.206,0.204
```
For each `start | end` it finds, the tool:
- downloads **only that part** of the video (not the whole 11 hours),
- puts the facecam on top and the gameplay below (1080×1920),
- burns in captions from the transcript, plus a `credit: @handle` chip,
- saves `out/<id>/clips/01_....mp4`.

About **1 minute per clip** on our laptop (i5, no GPU, 19 Nov). Leave out `--cam` for a plain centre crop.

**Finding your `--cam` numbers:** `python parts.py "<link>" --frame 2:30:00` saves `frame.jpg` with a yellow grid (each box = 0.1).
Read the facecam's left, top, width and height. Kai Cenat: `0,0.40,0.206,0.204` · CarryMinati: `0.009,0.446,0.19,0.222`. You set it once per streamer.

## Hindi streams (CarryMinati) and "captions nahi mile"
YouTube hides caption tracks from yt-dlp unless it can run YouTube's JavaScript. **Install Node.js** (nodejs.org) and the tool uses it automatically.
CarryMinati's GTA 6 stream showed 0 captions without it, and full Hindi captions with it:
```bash
python parts.py "https://www.youtube.com/live/irNhWMG560k" --parts 20 --creator CarryMinati --handle carryminati --caption-lang Hinglish
# stream: 9:45:54 | 7910 caption lines | 20 parts   (4.6 s on 19 Nov)
```
`--lang auto` (the default) takes the stream's original language (Hindi here). Gemini reads the Hindi fine; for part 16 it picked the "chachi ka beta Rockstar mein hai" moment at 7:44:58.

**Really no captions** (the CC button is grey on YouTube)? Add `--whisper`:
```bash
pip install faster-whisper
python parts.py "<link>" --whisper --lang hi --parts 20 --creator "<name>" --handle <handle>
```
It downloads the audio only and transcribes it on your laptop with Whisper `base` (free). On our i5 laptop: about **15× faster than real time**, so a 10-hour stream takes about 40 minutes. Let it run while you do something else.

## The prompt (it's already inside every part; the [brackets] are yours to fill)
```
You are my shorts clipper. Below is PART [17] of [20] of a stream transcript. Every line starts with its real time [h:mm:ss].
Creator: [Kai Cenat]  ·  Credit: @[kaicenat]  ·  Caption language: [Hinglish / English]
Pick the [3] best moments for vertical shorts: big reaction, funny line, shock, clutch play.
Rules: each clip 25-55 s · start on the hook line · end on the punchline · use ONLY times that appear in the text · never invent a line.
Answer as a table: start | end | first line (exact words) | hook caption (max 6 words) | why it will go viral.
TRANSCRIPT:
```

## Hint
Window size = (time of the last line) ÷ n. A line at time t goes to part `t // size`, but the very last line would land in part n+1, so clamp it to n.
Don't split by line count: a chatty hour and a quiet hour have the same length in time.

## Level up
- Overlap: give each part the last 30 s of the previous part, so a moment that crosses a border isn't cut in half.
- Split on silences (a gap of 10 s or more) instead of exact borders.
- Ask for a score from 1 to 10 for each moment, then merge the 10 answers and keep the top 10 overall.

Credit the creator on every clip. You only get paid on clips of creators who run a campaign (see DEV 10 / DEV 11).
