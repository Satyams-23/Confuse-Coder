"""YOUR TASK: write rank_reels().

Each reel is a dict like:
    {"id": "1", "caption": "7 FREE AI Clipping Tools...", "views": 77341, "saved": 5392, "shares": 2568, ...}

Return a NEW list of the reels that have views > 0, best first, where each item is the
original dict plus one extra key:
    "save_rate": saved / views * 100, rounded to 2 decimals   (5392 / 77341 * 100 -> 6.97)

Order:
  1. higher save_rate first
  2. if save_rate is equal, more saves first
  3. if still equal, keep their original order (Python's sort is stable)

Rules:
  - skip reels with views == 0 (a brand-new reel would divide by zero)
  - don't change the input list or the dicts inside it
  - if top is given, return only the first `top` reels

Run the tests:  python test.py
"""


def rank_reels(reels, top=None):
    # TODO: your code here (about 6-10 lines)
    return []
