# Bijli Network · SOLUTION
from network import DSU, run


def kruskal(gaon, wires):
    d = DSU(gaon)
    chosen, skipped = [], []
    for a, b, w in sorted(wires, key=lambda x: x[2]):
        if d.find(a) != d.find(b):          # reel ka "ek if"
            d.union(a, b)
            chosen.append((a, b, w))
            if len(chosen) == len(gaon) - 1:
                break
        else:
            skipped.append((a, b, w))
    return chosen, skipped


if __name__ == "__main__":
    run(kruskal)
