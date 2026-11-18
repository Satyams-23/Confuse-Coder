"""Print the ranking table.

    python demo.py              -> uses data/sample_reels.json (no token needed)
    python demo.py --live       -> uses YOUR account (needs IG_TOKEN)
    add --solution to use solution.py instead of your starter.py
"""
import json
import pathlib
import sys

import insta_api

if "--solution" in sys.argv:
    from solution import rank_reels
else:
    from starter import rank_reels

if "--live" in sys.argv:
    reels = insta_api.recent_reels(insta_api.token_from_env())
    print(f"@{insta_api.profile(insta_api.token_from_env()).get('username')} · {len(reels)} reels\n")
else:
    reels = json.loads((pathlib.Path(__file__).parent / "data" / "sample_reels.json").read_text(encoding="utf-8"))
    print("sample data (@confuse__coder.dev, 18 Nov 2026)\n")

ranked = rank_reels(reels)
if not ranked:
    print("rank_reels() returned nothing yet. Write it in starter.py, then run python test.py")
    sys.exit(1)
print(f"{'#':>2}  {'reel':<50} {'views':>8} {'saves':>6} {'rate':>7}")
for i, r in enumerate(ranked, 1):
    print(f"{i:>2}  {insta_api.first_line(r.get('caption', '')):<50} {r['views']:>8,} {r['saved']:>6,} {r['save_rate']:>6.2f}%")
