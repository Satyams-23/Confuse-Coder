# Cashback Trip Planner · ANSWER. Pehle starter.py khud try karo.
from trip import INF, run


def bellman_ford(cities, tickets, src):
    dist = {c: INF for c in cities}
    parent = {c: None for c in cities}
    dist[src] = 0
    for _ in range(len(cities) - 1):          # reel ka missing loop
        changed = False
        for u, v, w in tickets:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                changed = True
        if not changed:                        # koi round kuch na badle -> ruk jao
            break
    for u, v, w in tickets:                    # ek round aur: ab bhi sasta? loop!
        if dist[u] != INF and dist[u] + w < dist[v]:
            parent[v] = u
            x = v
            for _ in range(len(cities)):       # peeche chalo, loop ke andar pahuncho
                x = parent[x]
            loop, y = [x], parent[x]
            while y != x:
                loop.append(y)
                y = parent[y]
            loop.append(x)
            return dist, parent, loop[::-1]
    return dist, parent, None


if __name__ == "__main__":
    run(bellman_ford)
