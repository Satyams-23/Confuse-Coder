# Cinematic Skill: documentary-style videos from code
*@confuse__coder.dev · DEV 08 · Reel: Ye documentary code hai*

---

## 1. Ek line mein idea
**Cinematic Skill** ek open-source *agent skill* hai (MIT). Tum agent ko topic do, wo narrated documentary banata hai. Koi frame AI video se generate nahi hota: **har frame Python + Skia se draw hota hai**, aur camera voice ki timing pe chalta hai.

Repo: `github.com/Moh4696/cinematic-skill`
Kaam karta hai: Claude Code, Codex, Cursor, Gemini CLI, OpenCode.

---

## 2. Setup

**Zaroori cheezein**
- **Node 22.20+** (npx wale install ke liye)
- **Python** + `pip install -r requirements.txt` (skia-python, numpy, pillow; scipy optional)
- **ffmpeg** PATH pe
- Skill ka `check_setup.py` batata hai kya missing hai.

**Install (ek command)**
```bash
npx skills add Moh4696/cinematic-skill
```
Phir agent ka **naya session** kholo.

Dusre raaste (README se):
- Claude Code plugin: `/plugin marketplace add Moh4696/cinematic-skill` → `/plugin install cinematic-skill@cinematic-skill`
- Gemini CLI: `gemini extensions install https://github.com/Moh4696/cinematic-skill`

**Pehli film**
Agent ko likho: *"a 90 second documentary about the Mughal Empire"*.
Agent 3 jagah rukega aur tumse poochega: **beat table** (script), **look**, aur **30 second ka draft**.

---

## 3. Andar kya hota hai (reel ke 5 rooms)
1. **Research:** topic padhta hai, facts check karta hai, scene-by-scene script + chronology check. *Tumhara approval.*
2. **Awaaz:** pehle ek free robot voice (macOS `say` / `espeak-ng`) se sirf **timing** set hoti hai.
3. **Photos:** Wikimedia Commons se sirf free-license images. Non-free file reject. `credits.md` khud banta hai.
4. **Scene:** ek chhoti Python file. `doc.W(line, "word")` = "ye cheez is line ke is word pe aaye". Camera ke keys bhi yahin.
5. **Finish:** stills + contact strip se khud check, sound effects, captions (+ SRT), render.

---

## 4. Ye interesting kyun hai (dev angle)
- **Generated video vs drawn video:** AI video har run mein alag ho sakta hai. Code se bana frame **deterministic** hai: same input → same frame.
- **Debug jaisa edit:** galti dikhi → ek line badlo → re-render. Film bhi ab ek *codebase* hai (git, diff, review sab chalega).
- **Voice = clock:** sab kuch narration ke words se timed hai. Main apne reels bhi isi idea pe banata hoon (Remotion + word timestamps).

---

## 5. Catch
Robot voice sirf timing ke liye hai. **Final awaaz tumhe khud record karni hogi** (ya koi TTS lagao). Sections mein record karo, skill unhe timed lines mein split kar deta hai.

Windows pe: `say` nahi hai, toh scratch voice ke liye **espeak-ng** install karna padega.

---

## 6. Try karo
Ek 30-second film banao apne college / sheher ke itihaas pe. Script approve karne se pehle facts khud ek baar check karna. Agent bhi galti kar sakta hai.
