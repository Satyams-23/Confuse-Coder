"""test.py: checks your pick_moments().   python test.py   (or: python test.py --solution)"""
import random
import sys
import time

mod = __import__("solution" if "--solution" in sys.argv else "starter")
pick = mod.pick_moments

ok = bad = 0


def t(name, got, want):
    global ok, bad
    good = got == want
    ok += good
    bad += not good
    print(f"{'PASS' if good else 'FAIL'}  {name}" + ("" if good else f"   got {got}, want {want}"))


def score0(res):
    """score of the first result, or None if empty"""
    return res[0][2] if res else None


def W(word, at):
    return {"w": word, "start": at, "end": at + 0.4}


quiet = [0.1] * 100

t("no hype, quiet -> nothing", pick([W("hello", 5), W("there", 6)], quiet, 100, win=10, k=3), [])
t("one hype word -> one window starting where it fits first",
  pick([W("Insane!", 15.2)], quiet, 100, win=10, k=1), [(6, 16, 3)])
t("punctuation + case ignored ('WOW!!' is hype)", score0(pick([W("WOW!!", 50.0)], quiet, 100, win=10, k=1)), 3)
t("hype word counts by its START second", pick([W("boom", 9.9)], quiet, 100, win=10, k=1), [(0, 10, 3)])

loud = [0.1] * 100
for i in range(40, 45):
    loud[i] = 0.9
t("5 loud seconds = score 5", pick([], loud, 100, win=10, k=1), [(35, 45, 5)])
loud2 = [0.1] * 100
loud2[20] = 0.7
t("0.7 counts as loud (>=)", score0(pick([], loud2, 100, win=10, k=1)), 1)

words = [W("insane", 12), W("crazy", 13), W("bro", 70), W("wow", 71), W("what", 72)]
t("best first: 3 hype (score 9) before 2 hype (score 6)",
  [s for _, _, s in pick(words, quiet, 100, win=10, k=2)], [9, 6])
got = pick(words, quiet, 100, win=10, k=5)
t("picked windows never overlap", all(abs(a[0] - b[0]) >= 10 for i, a in enumerate(got) for b in got[i + 1:]), True)
t("stops when nothing scores > 0", len(got), 2)
t("returns (start, start+win, score)", all(e - s == 10 for s, e, _ in got), True)

near = [W("wow", 30), W("wow", 31), W("bro", 38)]
r = pick(near, quiet, 100, win=10, k=2)
t("all hype in one spot -> 1 clip (overlapping 2nd window skipped)", r, [(29, 39, 9)])
t("window must fit: last start = duration - win", [s for s, _, _ in pick([W("wow", 99.5)], quiet, 100, win=10, k=1)], [90])
t("video shorter than win -> nothing", pick([W("wow", 1)], [0.9] * 5, 5, win=10, k=1), [])

# brute force reference on random data
def brute(words, loud, duration, win, k):
    from common import HYPE, norm
    sc = []
    for s in range(0, int(duration) - win + 1):
        h = sum(1 for w in words if s <= int(w["start"]) < s + win and norm(w["w"]) in HYPE)
        l = sum(1 for i in range(s, s + win) if i < len(loud) and loud[i] >= 0.7)
        sc.append((3 * h + l, s))
    sc.sort(key=lambda x: (-x[0], x[1]))
    out = []
    for v, s in sc:
        if v <= 0 or len(out) == k:
            break
        if all(abs(s - p) >= win for p, _ in out):
            out.append((s, v))
    return [(s, s + win, v) for s, v in out]

random.seed(7)
vocab = ["hello", "insane", "the", "bhai", "code", "wow", "kya", "and", "crazy", "video"]
same = True
for _ in range(25):
    d = random.randint(40, 200)
    ws = sorted((W(random.choice(vocab), round(random.uniform(0, d - 0.5), 2)) for _ in range(random.randint(0, 120))), key=lambda w: w["start"])
    ld = [round(random.random(), 2) for _ in range(d)]
    win = random.randint(5, 30)
    if pick(ws, ld, d, win=win, k=3) != brute(ws, ld, d, win, 3):
        same = False
        break
t("matches brute force on 25 random videos", same, True)

# 10-hour stream: must be fast
d = 36000
ws = [W(random.choice(vocab), i * 1.2) for i in range(int(d / 1.2))]
ld = [random.random() for _ in range(d)]
t0 = time.time()
res = pick(ws, ld, d, win=30, k=5)
dt = time.time() - t0
t(f"10-hour stream in under 2s (took {dt:.2f}s)", dt < 2 and len(res) == 5, True)

print(f"\nTESTS PASSED ({ok}/{ok + bad})" if not bad else f"\nTESTS FAILED ({ok}/{ok + bad})")
sys.exit(1 if bad else 0)
