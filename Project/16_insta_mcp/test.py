"""Checks rank_reels() with no internet and no token.

    python test.py              -> tests YOUR starter.py
    python test.py --solution   -> tests solution.py
"""
import copy
import json
import pathlib
import sys

if "--solution" in sys.argv:
    from solution import rank_reels
else:
    from starter import rank_reels

SAMPLE = json.loads((pathlib.Path(__file__).parent / "data" / "sample_reels.json").read_text(encoding="utf-8"))
passed = failed = 0


def check(name, cond, got=None):
    global passed, failed
    if cond:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}" + (f"   got: {got}" if got is not None else ""))


print("rank_reels() tests\n")
out = rank_reels(SAMPLE)
ids = [r.get("id") for r in out]
check("returns all 10 sample reels", len(out) == 10, len(out))
check("#1 is the clipping-tools reel (6.97%)", ids[:1] == ["r10"], ids[:1])
check("#2 is MrBeast (5.04%)", ids[1:2] == ["r08"], ids[1:2])
check("save_rate rounded to 2 decimals: 6.97", out and out[0].get("save_rate") == 6.97, out and out[0].get("save_rate"))
check("full order matches Claude's table", ids == ["r10", "r08", "r07", "r09", "r04", "r01", "r02", "r03", "r06", "r05"], ids)
check("Microsoft reel is last (0.06%)", out and out[-1].get("save_rate") == 0.06, out and out[-1].get("save_rate"))

before = copy.deepcopy(SAMPLE)
rank_reels(SAMPLE)
check("input list + dicts not changed", SAMPLE == before)

zero = [{"id": "new", "views": 0, "saved": 0}, {"id": "a", "views": 100, "saved": 5}]
check("skips views == 0 (no ZeroDivisionError)", [r["id"] for r in rank_reels(zero)] == ["a"])

tie = [{"id": "small", "views": 100, "saved": 5}, {"id": "big", "views": 1000, "saved": 50}]
check("same rate -> more saves first", [r["id"] for r in rank_reels(tie)] == ["big", "small"])

stable = [{"id": "x", "views": 10, "saved": 1}, {"id": "y", "views": 10, "saved": 1}]
check("full tie keeps original order", [r["id"] for r in rank_reels(stable)] == ["x", "y"])

check("top=3 returns 3", len(rank_reels(SAMPLE, top=3)) == 3)
check("empty list -> empty list", rank_reels([]) == [])

print(f"\n{passed} passed, {failed} failed")
print("TESTS PASSED" if failed == 0 else "Keep going: fix starter.py and run again.")
sys.exit(0 if failed == 0 else 1)
