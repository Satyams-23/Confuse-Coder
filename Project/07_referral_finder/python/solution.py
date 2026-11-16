# Referral Finder · SOLUTION (Python) · @confuse__coder
from collections import deque
from network import run


def bfs(adj, start):
    dist = {start: 0}
    parent = {start: None}
    q = deque([start])
    while q:
        node = q.popleft()          # queue: jo pehle aaya, woh pehle (BFS)
        for nb in adj[node]:
            if nb not in dist:      # visited check
                dist[nb] = dist[node] + 1
                parent[nb] = node
                q.append(nb)
    return dist, parent


def get_path(parent, target):
    path = []
    while target is not None:
        path.append(target)
        target = parent[target]
    return path[::-1]


if __name__ == "__main__":
    run(bfs, get_path)
