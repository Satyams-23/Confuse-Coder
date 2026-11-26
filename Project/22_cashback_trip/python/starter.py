# Cashback Trip Planner · TUMHARA KAAM: bellman_ford() likho. Phir: python starter.py
from trip import INF, run


def bellman_ford(cities, tickets, src):
    """tickets = [(se, tak, Rs)]   (cashback wala ticket negative)
    Lautao: (dist, parent, loop)
      dist   = {city: sabse sasta kharcha src se}   (na pahunche toh INF)
      parent = {city: kis city se aaye}             (raasta banane ke liye)
      loop   = None, ya cashback loop ki cities jaise ["Mumbai", "Ahmedabad", "Mumbai"]
    Steps:
      1. dist[src] = 0, baaki INF
      2. (cities - 1) rounds: har ticket u->v: dist[u] + w < dist[v] ? update + parent
      3. ek round aur: ab bhi kuch sasta hua? -> loop hai, cities nikaalo
    """
    dist = {c: INF for c in cities}
    parent = {c: None for c in cities}
    dist[src] = 0
    # TODO
    return dist, parent, None


if __name__ == "__main__":
    run(bellman_ford)
