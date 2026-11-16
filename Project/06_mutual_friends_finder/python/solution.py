# ============================================================================
#  Mutual Friends Finder  ·  SOLUTION (Python)  ·  @confuse__coder
#  Pehle khud try karo! Phir milaao.
# ============================================================================
from friends import run


def add_edge(adj, u, v):
    adj.setdefault(u, []).append(v)
    adj.setdefault(v, []).append(u)  # reel wali ek line: ulti taraf bhi


def suggest(adj, who):
    count = {}
    for f in adj.get(who, []):          # mere dost
        for ff in adj.get(f, []):       # unke dost
            if ff != who and ff not in adj[who]:
                count[ff] = count.get(ff, 0) + 1   # har common dost = +1 mutual
    return sorted(count, key=lambda n: (-count[n], n))


run(add_edge, suggest)
