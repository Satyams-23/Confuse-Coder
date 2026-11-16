# ============================================================================
#  Maze Race  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: bfs(grid, start, end) likho (~15 lines). Reel wala BFS, graph ki jagah maze.
#    grid[r][c] = 1 deewar, 0 khula. start/end = (r, c). Padosi = DIRS (maze.py mein).
#  return (order, path)
#    order = cells jis order mein queue se nikle (start pehla)
#    path  = [start, ..., end] sabse chhota raasta, ya [] agar raasta nahi
#  Yaad rakho: deque + popleft() (pop() = stack = DFS = bug), visited push karte waqt,
#    parent[(nr,nc)] = (r,c), start ka None, phir trace_path(parent, end).
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from collections import deque
from maze import DIRS, run, trace_path


def bfs(grid, start, end):
    # TODO: yahan likho
    return [], []


if __name__ == "__main__":
    run(bfs)
