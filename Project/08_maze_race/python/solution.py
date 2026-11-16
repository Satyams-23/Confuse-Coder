# Maze Race · SOLUTION (Python) · @confuse__coder
from collections import deque
from maze import DIRS, run, trace_path


def bfs(grid, start, end):
    R, C = len(grid), len(grid[0])
    parent = {start: None}            # parent bhi = visited
    order = []
    q = deque([start])
    while q:
        r, c = q.popleft()            # queue: jo pehle aaya (pop() = BUG)
        order.append((r, c))
        if (r, c) == end:
            break
        for dr, dc in DIRS:
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and (nr, nc) not in parent:
                parent[(nr, nc)] = (r, c)
                q.append((nr, nc))
    return order, trace_path(parent, end)


if __name__ == "__main__":
    run(bfs)
