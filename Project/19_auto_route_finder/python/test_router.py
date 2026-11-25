# python test_router.py            -> solution check
# python test_router.py starter    -> tumhara code check
import sys, importlib
from router import REEL_MAP, EVENING_MAP, build, bfs_route, minutes

mod = importlib.import_module(sys.argv[1] if len(sys.argv) > 1 else "solution")
dj = mod.dijkstra
ok = 0
def check(name, got, want):
    global ok
    good = got == want
    ok += good
    print(("PASS " if good else "FAIL ") + name + ("" if good else f"  got={got} want={want}"))

A = build(REEL_MAP)
check("reel: 13 min", dj(A, "Ghar", "College")[0], 13)
check("reel: path", dj(A, "Ghar", "College")[1], ["Ghar", "Market", "Station", "Mall", "College"])
check("reel: BFS 30 min wala", minutes(A, bfs_route(A, "Ghar", "College")), 30)
check("reel: flyover = 4", dj(A, "Ghar", "Flyover")[0], 4)
check("src = dst", dj(A, "Ghar", "Ghar"), (0, ["Ghar"]))
E = build(EVENING_MAP)
check("evening: 16 min", dj(E, "Office", "Ghar")[0], 16)
B = build(EVENING_MAP, closed=[("Mandir", "Ghar")])
check("gali band: 19 min", dj(B, "Office", "Ghar")[0], 19)
island = build([("A", "B", 1), ("C", "D", 1)])
check("koi raasta nahi", dj(island, "A", "D"), (None, None))
tie = build([("S", "X", 1), ("X", "T", 1), ("S", "T", 2)])
check("tie: 2 min", dj(tie, "S", "T")[0], 2)
print(f"\n{ok}/9 pass")
