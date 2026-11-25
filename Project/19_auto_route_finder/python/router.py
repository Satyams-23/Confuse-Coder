# ============================================================================
#  Auto Route Finder  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
from collections import deque

# reel wala map: (jagah, jagah, minute), dono taraf ki sadak
REEL_MAP = [
    ("Ghar", "Flyover", 5), ("Ghar", "Market", 2), ("Market", "Flyover", 2),
    ("Flyover", "College", 25), ("Market", "Station", 4), ("Station", "Mall", 3),
    ("Mall", "College", 4), ("Ghar", "Chowk", 6), ("Chowk", "Mall", 9),
]

# shaam 6 baje ka bada map (office se ghar)
EVENING_MAP = [
    ("Office", "Metro", 4), ("Office", "Ring Road", 3), ("Ring Road", "Flyover", 2),
    ("Flyover", "Ghar", 28), ("Metro", "Bus Stand", 6), ("Bus Stand", "Ghar", 9),
    ("Metro", "Gali No 4", 5), ("Gali No 4", "Mandir", 3), ("Mandir", "Ghar", 4),
    ("Ring Road", "Mall", 7), ("Mall", "Mandir", 6), ("Office", "Highway", 10),
    ("Highway", "Ghar", 15),
]


def build(roads, closed=()):
    """roads -> adj = {jagah: [(padosi, minute), ...]}; closed = band sadkein [(a, b)]"""
    band = {frozenset(c) for c in closed}
    adj = {}
    for a, b, w in roads:
        adj.setdefault(a, [])
        adj.setdefault(b, [])
        if frozenset((a, b)) in band:
            continue
        adj[a].append((b, w))
        adj[b].append((a, w))
    return adj


def bfs_route(adj, src, dst):
    """EP 02 wala BFS: sabse kam STOPS (minute nahi ginta)."""
    par = {src: None}
    q = deque([src])
    while q:
        u = q.popleft()
        for v, _ in adj[u]:
            if v not in par:
                par[v] = u
                q.append(v)
    if dst not in par:
        return None
    path, x = [], dst
    while x is not None:
        path.append(x)
        x = par[x]
    return path[::-1]


def minutes(adj, path):
    w = {(a, b): m for a in adj for b, m in adj[a]}
    return sum(w[(path[i], path[i + 1])] for i in range(len(path) - 1))


def show(title, roads, src, dst, dijkstra, closed=()):
    adj = build(roads, closed)
    print(f"\n=== {title} ===")
    b = bfs_route(adj, src, dst)
    if b:
        print(f"  BFS (kam stop) : {' -> '.join(b)}  = {minutes(adj, b)} min, {len(b) - 1} stop")
    dist, path = dijkstra(adj, src, dst)
    if path is None:
        print("  Dijkstra       : koi raasta nahi")
    else:
        print(f"  Dijkstra (fast): {' -> '.join(path)}  = {dist} min, {len(path) - 1} stop")


def run(dijkstra):
    show("Reel ka map: Ghar -> College", REEL_MAP, "Ghar", "College", dijkstra)
    show("Shaam 6 baje: Office -> Ghar", EVENING_MAP, "Office", "Ghar", dijkstra)
    show("Mandir wali gali band", EVENING_MAP, "Office", "Ghar", dijkstra, closed=[("Mandir", "Ghar")])
