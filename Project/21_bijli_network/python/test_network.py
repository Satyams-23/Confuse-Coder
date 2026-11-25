# python test_network.py          -> solution check
# python test_network.py starter  -> tumhara code check
import sys, importlib, itertools
from network import REEL_GAON, REEL_WIRES, ZILA_GAON, ZILA_WIRES, DSU, jude_hue
kruskal = importlib.import_module(sys.argv[1] if len(sys.argv) > 1 else "solution").kruskal
ok = 0
def check(name, got, want):
    global ok
    ok += got == want
    print(("PASS " if got == want else "FAIL ") + name + ("" if got == want else f"  got={got} want={want}"))
def total(ws): return sum(w for _, _, w in ws)
def brute_min(gaon, wires):
    best = None
    for comb in itertools.combinations(wires, len(gaon) - 1):
        if jude_hue(gaon, comb)[0] == len(gaon):
            best = total(comb) if best is None else min(best, total(comb))
    return best
c, s = kruskal(REEL_GAON, REEL_WIRES)
check("reel: total 24", total(c), 24)
check("reel: 5 wire (gaon - 1)", len(c), 5)
check("reel: sab 6 jude", jude_hue(REEL_GAON, c)[0], 6)
check("reel: Rampur-Kheda chhoda", ("Rampur", "Kheda", 4) in s, True)
check("reel: chosen saste se mehenge", [w for _, _, w in c] == sorted(w for _, _, w in c), True)
z, zs = kruskal(ZILA_GAON, ZILA_WIRES)
check("zila: sab 10 jude", jude_hue(ZILA_GAON, z)[0], 10)
check("zila: brute force jitna sasta", total(z), brute_min(ZILA_GAON, ZILA_WIRES))
t, _ = kruskal(["A", "B", "C", "D"], [("A", "B", 1), ("B", "C", 2), ("A", "C", 3), ("C", "D", 4), ("B", "D", 5)])
check("quiz graph: 7", total(t), 7)
one, _ = kruskal(["X"], [])
check("1 gaon: 0 wire", len(one), 0)
print(f"\n{ok}/9 pass")
