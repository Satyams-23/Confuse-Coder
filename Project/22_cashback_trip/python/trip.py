# ============================================================================
#  Cashback Trip Planner  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
import heapq

INF = float("inf")

# reel ka trip: one-way tickets (se, tak, Rs). Cashback wala ticket negative hai.
# list isi order mein hai jaise reel ka code padhta hai (alphabetical).
REEL_CITIES = ["Delhi", "Jaipur", "Ahmedabad", "Mumbai", "Goa"]
REEL_TICKETS = [("Ahmedabad", "Mumbai", -1200), ("Delhi", "Jaipur", 1000),
                ("Delhi", "Mumbai", 4000), ("Jaipur", "Ahmedabad", 3200),
                ("Mumbai", "Goa", 1500)]

# Bharat yatra: 8 cities, 2 cashback tickets, koi loop nahi (list alphabetical)
YATRA_CITIES = ["Delhi", "Jaipur", "Ahmedabad", "Mumbai", "Pune",
                "Goa", "Hyderabad", "Bengaluru"]
YATRA_TICKETS = sorted([("Delhi", "Jaipur", 1000), ("Delhi", "Mumbai", 4000),
                 ("Delhi", "Hyderabad", 4500), ("Jaipur", "Ahmedabad", 3200),
                 ("Ahmedabad", "Mumbai", -1200), ("Mumbai", "Pune", 600),
                 ("Mumbai", "Goa", 1500), ("Pune", "Goa", 1800),
                 ("Pune", "Bengaluru", 2500), ("Hyderabad", "Bengaluru", 1200),
                 ("Goa", "Bengaluru", -300), ("Hyderabad", "Pune", 2000)])

# reel ka twist: Mumbai -> Ahmedabad wapas ka ticket Rs 1,000
LOOP_CITIES = REEL_CITIES
LOOP_TICKETS = REEL_TICKETS + [("Mumbai", "Ahmedabad", 1000)]


def rs(v):
    if v == INF:
        return "pahunch nahi"
    s = f"{abs(v):,}"
    return ("-Rs " if v < 0 else "Rs ") + s


def path_to(parent, src, dst):
    if dst != src and parent.get(dst) is None:
        return []
    p, seen = [dst], {dst}
    while p[-1] != src:
        p.append(parent[p[-1]])
        if p[-1] in seen:          # safety: loop mein phans gaye
            return []
        seen.add(p[-1])
    return p[::-1]


def dijkstra_ep06(cities, tickets, src):
    """EP 06 wala Dijkstra (heap + pakka set). Negative ticket pe galat ho jaata hai."""
    adj = {c: [] for c in cities}
    for u, v, w in tickets:
        adj[u].append((v, w))
    dist = {c: INF for c in cities}
    dist[src] = 0
    pq, done = [(0, src)], set()
    while pq:
        d, u = heapq.heappop(pq)
        if u in done:
            continue
        done.add(u)
        for v, w in adj[u]:
            if d + w < dist[v]:
                dist[v] = d + w
                heapq.heappush(pq, (dist[v], v))
    return dist


def ek_round(cities, tickets, src):
    """Reel ka bug: bahar wala loop hi nahi, tickets sirf ek baar."""
    dist = {c: INF for c in cities}
    dist[src] = 0
    for u, v, w in tickets:
        if dist[u] != INF and dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
    return dist


def show(title, cities, tickets, bellman_ford, src="Delhi", dst="Goa"):
    print(f"\n=== {title} ===")
    dist, parent, loop = bellman_ford(cities, tickets, src)
    if loop:
        gain = -sum(w for u, v, w in tickets
                    for a, b in zip(loop, loop[1:]) if (u, v) == (a, b))
        print("  PAISE CHHAAPNE KI MACHINE!")
        print(f"  loop: {' > '.join(loop)}  (har chakkar Rs {gain:,} bachte)")
        print("  sabse sasta trip: kabhi khatam nahi")
        return
    for c in cities:
        if c != src:
            print(f"  {c:<10} {rs(dist[c])}")
    route = path_to(parent, src, dst)
    print(f"  Bellman-Ford: {dst} {rs(dist[dst])} via {' > '.join(route)}")
    dj = dijkstra_ep06(cities, tickets, src)[dst]
    print(f"  Dijkstra (EP 06): {dst} {rs(dj)}" + ("  (galat!)" if dj != dist[dst] else ""))
    one = ek_round(cities, tickets, src)[dst]
    print(f"  bina loop (1 round): {dst} {rs(one)}" + ("  (galat!)" if one != dist[dst] else ""))


def run(bellman_ford):
    show("Reel ka trip", REEL_CITIES, REEL_TICKETS, bellman_ford)
    show("Bharat yatra", YATRA_CITIES, YATRA_TICKETS, bellman_ford, dst="Bengaluru")
    show("Wapas ka ticket Rs 1,000", LOOP_CITIES, LOOP_TICKETS, bellman_ford)
