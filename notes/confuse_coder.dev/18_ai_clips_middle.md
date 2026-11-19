# Long stream se AI clips: beech wala hissa bhi
*@confuse__coder.dev · DEV 18 · Reel: CarryMinati ka 9 ghante ka GTA 6 stream → clips ready, ₹0, 3 steps*

---

Free tool + my prompt. Tested on 19 Nov 2026 with free Gemini (gemini.google.com, India, no VPN) and CarryMinati's stream
"CARRYMINATI PLAYS GTA VI | NO PROMOTIONS" (9h45m, 1.6 crore views).

## Why "paste the link into AI" fails
| Test | What I sent | What came back |
|---|---|---|
| 1 | Link + "10 best moments, real timestamps" | 9 of 10 picks from the **first 41 minutes**. The 10th said `9:47:09`, but the video is only 9:45:59 (that line is really at 9:45:18). **Middle ~9 hours: 0 clips.** |
| 2 | Link + "10 equal parts, 1 clip from EACH" | Gemini wrote *"No transcript line in Part 2"* … *"Part 9"*, i.e. nothing between 0:58 and 8:47. |
| 3 | **Our tool's part 16 pasted** (7:19 to 7:48) | 3 real middle moments: `7:25:12` longest streak ends in one crash · `7:31:07` "broke even in Vice City" · `7:44:58` "chachi ka beta Rockstar mein hai" → bus on the beach → 4 stars → helicopter |

YouTube's real Hindi captions have **6,389 lines (37,786 words)** in the stretch Gemini called empty. The middle never reached the AI.
Pasting everything at once doesn't fully fix it either: long inputs get "Lost in the Middle" ([Liu et al., Stanford, 2023](https://arxiv.org/abs/2307.03172)). So: **small parts, one at a time**.

The same thing happened on Kai Cenat's 11h35m GTA 6 stream ("gaps in the middle hours (01:47:20–11:28:25)"; its Bigfoot hunt at 9:44 was missed) and IShowSpeed's 2h51m Obama stream.

## The 3 steps (tool: Stream Parts)
Install once: Python, `pip install yt-dlp`, [Node.js](https://nodejs.org), [ffmpeg](https://ffmpeg.org).
1. **Link → 20 parts with my prompt on top** (4.6 seconds for Carry's 9h45m):
   `python parts.py "https://www.youtube.com/live/irNhWMG560k" --parts 20 --creator CarryMinati --handle carryminati --caption-lang Hinglish`
2. **Paste one part per message into Gemini.** Copy its answer table into `out/<id>/answer.txt` (answers from several parts can go in one file).
3. **Answer → finished clips:** `python parts.py "<link>" --clips out/<id>/answer.txt --handle carryminati --cam 0.009,0.446,0.19,0.222`
   It downloads only those sections, puts the facecam on top and the game below (1080×1920), and burns in captions (Hindi works) plus `credit: @handle`. About 1-1.5 minutes per clip.

`--cam` = where the facecam sits (fractions of the frame: left, top, width, height). Carry: `0.009,0.446,0.19,0.222` · Kai Cenat: `0,0.40,0.206,0.204`.
Find yours: `python parts.py "<link>" --frame 2:30:00` saves `frame.jpg` with a 10×10 grid.

Rough time for 10 clips from a 10-hour stream: under a minute for the parts, ~10 min of pasting into Gemini, ~15 min of the laptop cutting clips.

## Copy-paste prompt (the tool already adds it; fill the [brackets] if you use it by hand)
```
You are my shorts clipper. Below is PART [16] of [20] of a stream transcript. Every line starts with its real time [h:mm:ss].
Creator: [CarryMinati]  ·  Credit: @[carryminati]  ·  Caption language: [Hinglish]
Pick the [3] best moments for vertical shorts: big reaction, funny line, shock, clutch play.
Rules: each clip 25-55 s · start on the hook line · end on the punchline · use ONLY times that appear in the text · never invent a line.
Answer as a table: start | end | first line (exact words) | hook caption (max 6 words) | why it will go viral.
Write start and end as plain h:mm:ss (like 7:46:39), without brackets, and never leave them empty.
TRANSCRIPT:
[paste part here]
```
The last rule matters: without it, Gemini once wrote the times as `[7:25:12]` and its table showed them empty.

## When it won't work
- **CC button grey on YouTube = no captions.** Use `--whisper`: it transcribes the audio on your laptop, free, ~40 minutes for a 10-hour stream.
- The AI reads words, not the picture: a silent crash or jump scare gets missed.
- Always check a clip before you post it.

## Money reminder
Clipping pays only on creators who run a campaign, and only at the campaign's rate (DEV 10: whether it pays · DEV 11: how much). Credit the creator on every clip.
