# python test_seating.py          -> solution check
# python test_seating.py starter  -> tumhara code check
import sys, importlib
from seating import REEL_GUESTS, REEL_PAIRS, BIG_GUESTS, BIG_PAIRS, tables
DSU = importlib.import_module(sys.argv[1] if len(sys.argv) > 1 else "solution").DSU
ok = 0
def check(name, got, want):
    global ok
    ok += got == want
    print(("PASS " if got == want else "FAIL ") + name + ("" if got == want else f"  got={got} want={want}"))
def build(g, p):
    d = DSU(g)
    for a, b in p: d.union(a, b)
    return d
d = build(REEL_GUESTS, REEL_PAIRS)
check("reel: 2 tables", len(tables(REEL_GUESTS, d.find)), 2)
check("reel: Riya-Kabir same", d.find("Riya") == d.find("Kabir"), True)
check("reel: Riya-Aditi same", d.find("Riya") == d.find("Aditi"), True)
check("reel: Riya-Dev alag", d.find("Riya") == d.find("Dev"), False)
b = build(BIG_GUESTS, BIG_PAIRS)
check("badi: 4 tables", len(tables(BIG_GUESTS, b.find)), 4)
check("badi: Pinky-Mummy same", b.find("Pinky") == b.find("Mummy"), True)
check("union same family = False", b.union("Papa", "Mummy"), False)
c = DSU(list(range(1000)))
for i in range(999): c.parent[i] = i + 1
c.find(0); c.steps = 0; c.find(0)
check("compression: doosra find <= 1 kadam", c.steps <= 1, True)
e = DSU(["a", "b", "c", "d"]); e.union("a", "b"); e.union("a", "c")
check("bug order (a do baar): 2 tables", len(tables(["a", "b", "c", "d"], e.find)), 2)
print(f"\n{ok}/9 pass")
