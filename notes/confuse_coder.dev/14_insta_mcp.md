# Apna Instagram MCP (DEV 14)

A 40-line, **read-only** MCP server that lets Claude read your Instagram stats straight from Meta's official API. No third-party company in between.

**Project:** [Project/16_insta_mcp](../../Project/16_insta_mcp/) · you write one function, `rank_reels()`, and 12 tests tell you when it's right.

## 1. Try it in 2 minutes (no Instagram needed)
```bash
pip install "mcp[cli]"
python test.py          # write rank_reels() in starter.py until 12/12 pass
python demo.py          # ranking table on sample data
```

## 2. Plug it into Claude (still no token)
```bash
claude mcp add insta --env IG_SAMPLE=1 -- python server.py
```
Ask Claude Code: *"Use insta: which reels have the best save rate?"*

## 3. Use YOUR account
1. Instagram → Settings → Account type and tools → **Creator** (free).
2. developers.facebook.com → Create app → Instagram use case.
3. App Dashboard → Instagram → **API setup with Instagram business login** → Generate token (lasts **60 days**).
4. Permissions: only `instagram_business_basic` + `instagram_business_manage_insights`.
5. `claude mcp add insta --env IG_TOKEN=your_token -- python server.py`

Never share the token or put it in a public repo.

## What the reel showed
- Claude (through a third-party connector) said my MrBeast reel's save rate was **5.04%**.
- 5,194 saves ÷ 1,03,165 views = 0.05034 → **5.03%**. My code got it right. Check AI maths.
- The demo used **sample data** (my real numbers from 18 Nov), not a live call.

## Why read-only
- `insta_api.py` only sends GET requests: it can't post, reply, delete or DM.
- Comments can carry hidden instructions for AI (prompt injection). A tool without write power can't be tricked into deleting things.
