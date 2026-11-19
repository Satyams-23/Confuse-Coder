"""python test.py            -> tests YOUR starter.py
   python test.py solution   -> tests solution.py"""
import random
import sys

mod = __import__("solution" if len(sys.argv) > 1 and sys.argv[1] == "solution" else "starter")
split_parts = mod.split_parts

passed = failed = 0


def check(name, cond):
    global passed, failed
    if cond:
        passed += 1
        print(f"  PASS  {name}")
    else:
        failed += 1
        print(f"  FAIL  {name}")


def safe(lines, n):
    try:
        return split_parts(lines, n)
    except Exception as e:  # noqa: BLE001
        print(f"        (crashed: {e!r})")
        return None


L = [(0, "a"), (50, "b"), (199, "c"), (200, "d"), (399, "e"), (400, "f"), (600, "g")]
def names(p, i):
    return [x[1] for x in p[i]] if p is not None and len(p) > i else None


p = safe(L, 3)
check("returns exactly n parts", p is not None and len(p) == 3)
check("part 1 = 0..199", names(p, 0) == ["a", "b", "c"])
check("200 starts part 2 (boundary goes right)", names(p, 1) == ["d", "e"])
check("last line is not lost", names(p, 2) == ["f", "g"])

# chatty start, quiet middle: split must be by TIME, not by line count
chatty = [(i, f"w{i}") for i in range(0, 100)] + [(5000, "mid"), (9999, "end")]
p = safe(chatty, 4)
check("split by time, not by line count", p is not None and len(p) == 4 and len(p[0]) == 100)
check("silent windows stay as empty parts", p is not None and len(p) == 4 and p[1] == [] and p[3][-1][1] == "end")
check("middle line lands in the middle", p is not None and len(p) == 4 and p[2] == [(5000, "mid")])

p = safe([], 5)
check("empty transcript -> 5 empty parts", p == [[], [], [], [], []])

p = safe([(0, "only")], 3)
check("single line at t=0 -> part 1", p is not None and len(p) == 3 and p[0] == [(0, "only")])

try:
    split_parts(L, 0)
    check("n=0 raises ValueError", False)
except ValueError:
    check("n=0 raises ValueError", True)
except Exception:  # noqa: BLE001
    check("n=0 raises ValueError", False)

random.seed(18)
ok_all = ok_order = True
for _ in range(200):
    lines = sorted((round(random.uniform(0, 10300), 2), str(i)) for i in range(random.randint(1, 400)))
    n = random.randint(1, 15)
    p = safe(lines, n)
    if p is None or len(p) != n or sorted(x for part in p for x in part) != lines:
        ok_all = False
        break
    flat = [x for part in p for x in part]
    if flat != lines:
        ok_order = False
check("random: every line exactly once (200 streams)", ok_all)
check("random: parts in time order", ok_all and ok_order)

# 11h35m GTA 6 stream like the reel: Bigfoot at 9:47:30 must be in part 17 of 20
stream = [(t, "x") for t in range(0, 41753, 3)] + [(35250, "I found him")]
stream.sort()
p = safe(stream, 20)
check("reel check: 9:47:30 lands in part 17 of 20", p is not None and len(p) == 20 and any(x[1] == "I found him" for x in p[16]))

print(f"\n{passed}/{passed + failed} passed ->", "TESTS PASSED" if failed == 0 else "TESTS FAILED")
sys.exit(0 if failed == 0 else 1)
