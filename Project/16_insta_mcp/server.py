"""Your own READ-ONLY Instagram MCP server (no third-party company in between).

Run it inside Claude Code:
    claude mcp add insta --env IG_TOKEN=YOUR_TOKEN -- python server.py
Then ask Claude: "Use insta: which of my reels have the best save rate?"

Tools exposed to Claude (all read-only):
    my_profile()            -> username, followers, posts
    top_reels(limit=5)      -> your reels ranked by saves / views, using YOUR rank_reels()

Uses starter.py by default; set USE_SOLUTION=1 to use solution.py.
"""
import json
import os

from mcp.server.fastmcp import FastMCP

import insta_api

if os.environ.get("USE_SOLUTION") == "1":
    from solution import rank_reels
else:
    from starter import rank_reels

mcp = FastMCP("insta")
SAMPLE = os.environ.get("IG_SAMPLE") == "1"  # no token yet? IG_SAMPLE=1 reads data/sample_reels.json instead


def _reels():
    if SAMPLE:
        path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "sample_reels.json")
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return insta_api.recent_reels(insta_api.token_from_env())


@mcp.tool()
def my_profile() -> dict:
    """Read-only: the connected Instagram account's username, followers and post count."""
    if SAMPLE:
        return {"username": "confuse__coder.dev", "note": "SAMPLE MODE: data/sample_reels.json (18 Nov 2026), not live"}
    return insta_api.profile(insta_api.token_from_env())


@mcp.tool()
def top_reels(limit: int = 5) -> list[dict]:
    """Read-only: recent reels ranked by save rate (saves / views). Returns date, first caption line, views, saves, shares, save_rate."""
    ranked = rank_reels(_reels(), top=limit)
    return [
        {
            "date": r["date"],
            "reel": insta_api.first_line(r["caption"]),
            "views": r["views"],
            "saved": r["saved"],
            "shares": r["shares"],
            "save_rate": f'{r["save_rate"]}%',
            "link": r.get("permalink", ""),
        }
        for r in ranked
    ]


if __name__ == "__main__":
    mcp.run()  # stdio transport: Claude Code starts this process and talks to it over stdin/stdout
