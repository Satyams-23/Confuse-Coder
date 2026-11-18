# 09 · HTML → MP4 (time rok ke photo kheencho)

Reel: @confuse__coder.dev DEV 09 · "₹20,000 vs ₹0: Claude se motion graphics"

Claude (free plan bhi) tumhe animation **HTML** mein deta hai. Instagram/YouTube ko **MP4** chahiye.
Screen record karoge toh slow laptop pe frames drop honge. Is project mein tum ek renderer likhoge jo
**browser ka time rok deta hai**, har frame ki photo leta hai, aur ffmpeg se MP4 bana deta hai. Zero frame drop.

## Run
```
npm install
node test.js                    # pehli baar: TESTS FAILED (renderFrames khaali hai)
# starter.js kholo, renderFrames() likho (~12 lines)
node test.js                    # TESTS PASSED (9/9)
node render.js demo/launch.html launch.mp4 --seconds 8
```
Needs: Node 18+ and Google Chrome. No Chrome? `npx playwright install chromium`. ffmpeg is included (ffmpeg-static).

Options: `--fps 30` `--seconds 8` `--size 1080x1920` `--solution` (use solution.js instead of yours).

## Files
| File | Kya hai |
|---|---|
| `common.js` | ready: page kholna (ghadi 0 pe paused), ffmpeg encoder, `seekCssAnimations(t)` |
| `starter.js` | **tum likhoge**: `renderFrames(page, {fps, seconds}, onFrame)` |
| `solution.js` | ek answer (pehle khud try karo) |
| `render.js` | CLI: HTML → MP4 |
| `test.js` | 9 checks: frame count, order, JS clock, CSS clock, setTimeout timing, rAF, determinism |
| `demo/launch.html` | our demo animation (made-up chai app "Tapri") |
| `demo/claude_tapri.html` | **real** claude.ai free-plan output for the NOTES prompt; try `node render.js demo/claude_tapri.html claude.mp4` |

## Expected output (reel wala)
```
done: launch.mp4  240 frames, 1080x1920 @ 30fps, took 56.6s
```
(time tumhare laptop pe alag hoga; frames hamesha 240)

## Hint
Har frame i ke liye: `t = Math.round(i * 1000 / fps)` → `page.clock.runFor(t - prevT)` → `page.evaluate(seekCssAnimations, t)` → `page.screenshot()` → `onFrame(png, i)`.

## Level-up
1. `--fps 60` render karo. Time aur file size kitna badha?
2. Progress bar + ETA print karo.
3. HTML mein `?name=` padho, aur ek loop mein 10 logon ke naam wale videos banao.
4. Transparent background: `.webm` (libvpx-vp9, `-pix_fmt yuva420p`) + `page.screenshot({ omitBackground: true })`.
