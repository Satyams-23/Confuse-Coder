# Auto Route Finder · ANSWER (pehle khud try karo)
import heapq
from router import run


def dijkstra(adj, src, dst):
    dist = {src: 0}
    parent = {src: None}
    done = set()
    pq = [(0, src)]                      # (d, v): pehle distance
    while pq:
        d, v = heapq.heappop(pq)
        if v in done:
            continue                     # purani (stale) entry
        done.add(v)                      # PAKKA
        if v == dst:
            break
        for nxt, w in adj[v]:
            if d + w < dist.get(nxt, float("inf")):
                dist[nxt] = d + w
                parent[nxt] = v
                heapq.heappush(pq, (d + w, nxt))
    if dst not in done:
        return None, None
    path, x = [], dst
    while x is not None:
        path.append(x)
        x = parent[x]
    return dist[dst], path[::-1]


if __name__ == "__main__":
    run(dijkstra)
