# Claude motion graphics to MP4, ₹0 mein
*@confuse__coder.dev · DEV 09 · Reel: Claude se motion graphics, ₹0 mein*

---

## 1. Prompt template (copy karo, brackets bharo)

```
Make a single-file HTML motion graphic, 1080x1920 (vertical), exactly [8] seconds long.

What it's for: [launch video for my chai delivery app "Tapri"]
Story in shape states: one shape morphs [dot -> pill -> cup -> card] using CSS keyframes.
Text: headline "[Chai in 10 minutes.]" drops in word by word. A counter counts up to [1,25,000] inside the card.
End with a button: "[Order on Tapri]".

Style rules:
- Dark background [#120a07], ONE accent colour [#ff5a36], one warm colour [#d98a3d]. Nothing else.
- One bold font (system-ui is fine). Big text, readable on a phone.
- Springy easing (overshoot) on things that appear. No random wobble.
- Everything happens inside the [8] seconds, then holds. The last frame should look close to the first so it can loop.
- No external files, no libraries, no images. Pure HTML + CSS + a little JS.
```

Tips:
- Bura result aaye toh poora prompt dobara mat likho. Bolo: "card ko 20% bada karo", "counter 1 second late shuru karo".
- Ek accent colour + shape states = 80% professional look.
- Duration fix rakho, warna MP4 banate time pata nahi chalega kitne second record karna hai.

## 2. Claude se HTML lo
Claude free plan → prompt paste → artifact preview chalega → Copy (ya Download) → `launch.html` naam se save.

## 3. HTML → MP4 (project 09_html_to_mp4)
```
npm install
node test.js                 # pehle FAIL aayega
# starter.js mein renderFrames() likho (~12 lines)
node test.js                 # TESTS PASSED
node render.js launch.html launch.mp4 --seconds 8
```
Needs: Node 18+ aur Chrome (nahi hai toh `npx playwright install chromium`). ffmpeg project ke saath aata hai.

## 4. Idea: time rok do
- Video = photos. 8 s × 30 fps = **240 photos**.
- Screen recording real time mein chalti hai. Laptop busy hua → photo miss → frame drop.
- Hum browser ki ghadi rok dete hain (Playwright `page.clock`: setTimeout, setInterval, requestAnimationFrame, Date, performance.now sab fake).
- CSS animations ko bhi pause karke `currentTime = t` set karte hain.
- Loop: ghadi ko t tak badhao → CSS ko t pe roko → screenshot → ffmpeg ko do. t = i × 1000/30 ≈ 33 ms ke steps.
- Isliye 8 second ki video ~56 second mein banti hai (hamare laptop pe), par **ek bhi frame drop nahi**. Same input = same pixels, har baar.

## Gotchas jo humne fix kiye
- Clock install ke baad time chalta rehta hai: `pauseAt(0)` page load se **pehle** karo.
- Pehla screenshot kabhi kabhi alag aata hai: ek warm-up screenshot phenk do.
- Animation baad mein shuru ho (class setTimeout se lagi) → jis frame pe pehli baar dikhi, wahan se count karo.

Practice / level-up:
1. `--fps 60` pe render karo, file size compare karo.
2. Transparent background ke liye `.webm` (VP9 + alpha) output banao.
3. Ek HTML mein `?text=` query param lo, aur ek loop mein 10 alag naam ke videos render karo (personalised videos!).
