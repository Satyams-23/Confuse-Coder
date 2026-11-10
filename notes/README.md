# Reel notes ("Comment KEYWORD → DM notes")

Every reel gets a short notes file that we DM to anyone who comments the keyword.
More comments push the reel in the algorithm, and the DMs bring people back to the account.

## Folder layout
```
notes/
  confuse_coder.dev/
    01_redis_seat_lock.md      ← <reel number>_<topic>.md
  confuse_coder/
    ...
```

## Checklist for every new reel
1. **Keyword**: `NOTES` (the same word on every reel, so viewers learn it and one auto-DM rule works for all). Use it in all 4 places below.
2. **Video**: end the voice-over with *"Aur is topic ke notes chahiye, toh comment karo 'NOTES'!"* and add the outro sticker with
   `"comment": {"keyword": "NOTES", "at": "<cue of the word NOTES>"}` in the `devOutro` props (see projects/reel_004).
3. **Caption** (`projects/<reel>/output/post.md`): `💬 Comment "KEYWORD" and I'll DM you the full notes.`
4. **Notes file**: `notes/<account>/<NN>_<topic>.md`, using this template:
   1. Problem kya hai? (the story from the reel)
   2. Concept, in simple words
   3. The key command / code line, with a table explaining each part
   4. Full flow diagram (text arrows)
   5. Small real code snippet
   6. 3–5 interview gotchas (this is the "extra value" beyond the reel)
   7. One-line summary + follow CTA
5. **Share it**: export to PDF (or Notion/Drive link) and put the link in the post.md "DM reply" line. Use an auto-DM tool (e.g. ManyChat) or reply manually.
6. **Cover image** (both accounts, every reel): fill the `cover` block in scene_config.json, then run `npm run cover -- reel_NNN` → `projects/reel_NNN/output/<id>_cover.png`. Upload it as the reel's cover in Instagram.
7. **Pinned comment**: a question that makes people reply (an edge case from the gotchas section).

## Visual-style notes for future reels (from feedback)
- The Ramayan-style hook (current trend + cinematic effects) worked well. Keep a **trending-topic hook** for each reel.
- The explainer scenes after the hook need **more effects**: camera moves/zooms, particles, light sweeps, screen shake on impacts, motion trails and sound-synced pops. Don't just stamp static stickers.
