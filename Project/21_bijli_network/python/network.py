# ============================================================================
#  Bijli Network  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================

# reel ke 6 gaon: (gaon1, gaon2, kharcha Rs lakh)
REEL_GAON = ["Rampur", "Sitapur", "Kheda", "Nandgaon", "Dhanpur", "Bela"]
REEL_WIRES = [("Nandgaon", "Bela", 8), ("Rampur", "Kheda", 4), ("Sitapur", "Bela", 9),
              ("Rampur", "Sitapur", 2), ("Dhanpur", "Bela", 11), ("Kheda", "Nandgaon", 5),
              ("Rampur", "Dhanpur", 7), ("Sitapur", "Kheda", 3), ("Nandgaon", "Dhanpur", 6)]

# poora zila: 10 gaon, 16 jagah wire bichh sakta hai
ZILA_GAON = ["Rampur", "Sitapur", "Kheda", "Nandgaon", "Dhanpur", "Bela",
             "Gokul", "Moti Nagar", "Chandpur", "Lalganj"]
ZILA_WIRES = [("Rampur", "Sitapur", 2), ("Sitapur", "Kheda", 3), ("Rampur", "Kheda", 4),
              ("Kheda", "Nandgaon", 5), ("Nandgaon", "Dhanpur", 6), ("Rampur", "Dhanpur", 7),
              ("Nandgaon", "Bela", 8), ("Sitapur", "Bela", 9), ("Dhanpur", "Bela", 11),
              ("Bela", "Gokul", 3), ("Gokul", "Moti Nagar", 4), ("Bela", "Moti Nagar", 6),
              ("Moti Nagar", "Chandpur", 10), ("Gokul", "Chandpur", 12),
              ("Chandpur", "Lalganj", 5), ("Dhanpur", "Lalganj", 15)]


class DSU:
    """EP 07 wala Union-Find (path compression + size). Ready hai, bas use karo."""
    def __init__(self, items):
        self.parent = {x: x for x in items}
        self.size = {x: 1 for x in items}

    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
        while self.parent[x] != root:
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] > self.size[rb]:
            ra, rb = rb, ra
        self.parent[ra] = rb
        self.size[rb] += self.size[ra]
        return True


def jude_hue(gaon, chosen):
    """chosen wires se kitne gaon ek hi network mein (sabse bada group) aur kaun andhere mein."""
    d = DSU(gaon)
    for a, b, _ in chosen:
        d.union(a, b)
    groups = {}
    for g in gaon:
        groups.setdefault(d.find(g), []).append(g)
    main = max(groups.values(), key=len)
    return len(main), [g for g in gaon if g not in main]


def bina_if(gaon, wires):
    """Reel ka bug: check hi nahi, bas saste se saste (gaon - 1) wire."""
    return sorted(wires, key=lambda w: w[2])[:len(gaon) - 1]


def show(title, gaon, wires, kruskal):
    chosen, skipped = kruskal(gaon, wires)
    total = sum(w for _, _, w in chosen)
    n, dark = jude_hue(gaon, chosen)
    print(f"\n=== {title} ===")
    for a, b, w in chosen:
        print(f"  LAGAO   {a}-{b}  Rs {w}L")
    for a, b, w in skipped:
        print(f"  CHHODO  {a}-{b}  Rs {w}L  (pehle se jude)")
    print(f"  Total: Rs {total} lakh | {n}/{len(gaon)} jude" + (f" | andhere mein: {', '.join(dark)}" if dark else ""))
    bug = bina_if(gaon, wires)
    bn, bdark = jude_hue(gaon, bug)
    print(f"  (bina if: Rs {sum(w for _, _, w in bug)} lakh | {bn}/{len(gaon)} jude"
          + (f" | andhere mein: {', '.join(bdark)})" if bdark else ")"))


def run(kruskal):
    show("Reel ke 6 gaon", REEL_GAON, REEL_WIRES, kruskal)
    show("Poora zila", ZILA_GAON, ZILA_WIRES, kruskal)
