"""solution.py: one possible answer. Try starter.py yourself first!"""
from common import HYPE, norm


def pick_moments(words, loud, duration, win=30, k=3):
    n = int(duration)  # whole seconds
    if n < win:
        return []

    # points per second: 3 per hype word starting in that second + 1 if that second is loud
    pts = [0] * n
    for w in words:
        s = int(w["start"])
        if 0 <= s < n and norm(w["w"]) in HYPE:
            pts[s] += 3
    for i in range(min(n, len(loud))):
        if loud[i] >= 0.7:
            pts[i] += 1

    # sliding window: score of [t, t+win) in O(1) each
    scores = []
    cur = sum(pts[:win])
    for t in range(0, n - win + 1):
        if t > 0:
            cur += pts[t + win - 1] - pts[t - 1]
        scores.append((cur, t))

    # best first, earlier start on ties; greedily keep non-overlapping ones
    scores.sort(key=lambda x: (-x[0], x[1]))
    picked = []
    for sc, t in scores:
        if sc <= 0 or len(picked) == k:
            break
        if all(abs(t - p) >= win for p, _ in picked):
            picked.append((t, sc))
    return [(t, t + win, sc) for t, sc in picked]
