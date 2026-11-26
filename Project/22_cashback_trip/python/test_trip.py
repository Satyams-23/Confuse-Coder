# python test_trip.py          -> solution check
# python test_trip.py starter  -> tumhara code check
import sys, importlib
from trip import (INF, REEL_CITIES, REEL_TICKETS, YATRA_CITIES, YATRA_TICKETS,
                  LOOP_TICKETS, path_to)
bellman_ford = importlib.import_module(sys.argv[1] if len(sys.argv) > 1 else "solution").bellman_ford
ok = 0
def check(name, got, want):
    global ok
    ok += got == want
    print(("PASS " if got == want else "FAIL ") + name + ("" if got == want else f"  got={got} want={want}"))
def brute(cities, tickets, src, dst):
    adj = {c: [] for c in cities}
    for u, v, w in tickets:
        adj[u].append((v, w))
    best = INF
    def go(u, seen, cost):
        nonlocal best
        if u == dst:
            best = min(best, cost)
            return
        for v, w in adj[u]:
            if v not in seen:
                go(v, seen | {v}, cost + w)
    go(src, {src}, 0)
    return best
d, p, loop = bellman_ford(REEL_CITIES, REEL_TICKETS, "Delhi")
check("reel: Goa 4,500", d["Goa"], 4500)
check("reel: Mumbai 3,000", d["Mumbai"], 3000)
check("reel: raasta 4 ticket", path_to(p, "Delhi", "Goa"), ["Delhi", "Jaipur", "Ahmedabad", "Mumbai", "Goa"])
check("reel: koi loop nahi", loop, None)
d, p, loop = bellman_ford(YATRA_CITIES, YATRA_TICKETS, "Delhi")
check("yatra: har city brute force jitni sasti",
      all(d[c] == brute(YATRA_CITIES, YATRA_TICKETS, "Delhi", c) for c in YATRA_CITIES), True)
d, p, loop = bellman_ford(REEL_CITIES, LOOP_TICKETS, "Delhi")
check("loop pakda", loop is not None and set(loop) == {"Ahmedabad", "Mumbai"} and loop[0] == loop[-1], True)
d, p, loop = bellman_ford(["A", "B", "C", "D"], [("A", "B", 4), ("A", "C", 5), ("C", "B", -3), ("B", "D", 2)], "A")
check("quiz: A se D = 4", d["D"], 4)
d, p, loop = bellman_ford(["A", "B", "Z"], [("A", "B", 7)], "A")
check("na pahunche = INF", d["Z"], INF)
d, p, loop = bellman_ford(["A", "B", "Z"], [("Z", "B", -5), ("B", "Z", 2), ("A", "B", 1)], "A")
check("loop A se pahunchne wala hi ho", loop is not None, True)
print(f"\n{ok}/9 pass")
