# ============================================================================
#  Maze Race  ·  READY FILE (Python, terminal version)  ·  @confuse__coder
#  Maze, DFS (stack wala bug), printing, tests. Tumhara kaam starter.py mein hai.
#  (Browser wala visual version: ../web/index.html)
# ============================================================================

DIRS = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up

MAZES = {
    "OPEN": [
        "#######",
        "#S....#",
        "#.....#",
        "#.....#",
        "#....E#",
        "#######",
    ],
    "TWO_ROUTES": [
        "#######",
        "#S....#",
        "#.###.#",
        "#.###.#",
        "#E....#",
        "#######",
    ],
    "BLOCKED": [
        "#####",
        "#S#E#",
        "#.#.#",
        "#####",
    ],
    "COLLEGE": [
        "###############",
        "#S....#.......#",
        "#####.#.#.###.#",
        "#...#.#.#.#...#",
        "###.#.###.#..##",
        "#.........#...#",
        "#.###########.#",
        "#...........#.#",
        "#.#.###.###.#.#",
        "#.....#.#...#.#",
        "#.#.#.#.###.#.#",
        "#.....#.#.....#",
        "###.#.#.#.#####",
        "#.....#......E#",
        "###############",
    ],
}


def parse(lines):
    grid, start, end = [], None, None
    for r, row in enumerate(lines):
        grid.append([1 if ch == "#" else 0 for ch in row])
        for c, ch in enumerate(row):
            if ch == "S":
                start = (r, c)
            if ch == "E":
                end = (r, c)
    return grid, start, end


def trace_path(parent, end):
    """parent[(r,c)] = (pr,pc), start ka None. End se peeche chalo."""
    if end not in parent:
        return []
    path, cur = [], end
    while cur is not None:
        path.append(cur)
        cur = parent[cur]
    return path[::-1]


def dfs(grid, start, end):
    """STACK wala (reel ka pop() bug): ek raasta pakad ke gehra."""
    R, C = len(grid), len(grid[0])
    seen, parent, order = set(), {}, []
    stack = [(start, None)]
    while stack:
        (r, c), p = stack.pop()
        if (r, c) in seen:
            continue
        seen.add((r, c))
        parent[(r, c)] = p
        order.append((r, c))
        if (r, c) == end:
            break
        for dr, dc in reversed(DIRS):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] == 0 and (nr, nc) not in seen:
                stack.append(((nr, nc), (r, c)))
    return order, trace_path(parent, end)


def valid_path(grid, start, end, path):
    if not path or tuple(path[0]) != start or tuple(path[-1]) != end:
        return False
    for i, (r, c) in enumerate(path):
        if not (0 <= r < len(grid) and 0 <= c < len(grid[0])) or grid[r][c] != 0:
            return False
        if i and abs(r - path[i - 1][0]) + abs(c - path[i - 1][1]) != 1:
            return False
    return True


def _shortest(grid, s, e):  # trusted answer, sirf tests ke liye
    dist, q, h = {s: 0}, [s], 0
    while h < len(q):
        r, c = q[h]; h += 1
        for dr, dc in DIRS:
            n = (r + dr, c + dc)
            if 0 <= n[0] < len(grid) and 0 <= n[1] < len(grid[0]) and grid[n[0]][n[1]] == 0 and n not in dist:
                dist[n] = dist[(r, c)] + 1
                q.append(n)
    return dist.get(e, -1)


def show(lines, path):
    on = set(map(tuple, path))
    for r, row in enumerate(lines):
        print("  " + "".join("o" if (r, c) in on and ch == "." else ch for c, ch in enumerate(row)))


def steps(p):
    return len(p) - 1 if p else -1


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def run(bfs):
    grid, s, e = parse(MAZES["COLLEGE"])
    b_order, b_path = bfs(grid, s, e)
    d_order, d_path = dfs(grid, s, e)
    print("=== 1. RACE: COLLEGE maze ===")
    print(f"  BFS (queue): path {steps(b_path)} steps, visited {len(b_order)}")
    print(f"  DFS (stack): path {steps(d_path)} steps, visited {len(d_order)}")
    print("\n=== 2. BFS ka raasta (o) ===")
    show(MAZES["COLLEGE"], b_path)
    print("\n=== 3. DFS ka raasta (o) ===")
    show(MAZES["COLLEGE"], d_path)

    print("\n=== 4. TESTS ===")
    ok = True
    g, s1, e1 = parse(MAZES["OPEN"])
    o, p = bfs(g, s1, e1)
    ok &= _check("OPEN: path = 7 steps", steps(p) == 7 and valid_path(g, s1, e1, p))
    ok &= _check("order[0] = start", bool(o) and tuple(o[0]) == s1)
    ok &= _check("order mein koi cell do baar nahi (visited)", bool(o) and len(set(map(tuple, o))) == len(o))
    g, s1, e1 = parse(MAZES["TWO_ROUTES"])
    o, p = bfs(g, s1, e1)
    ok &= _check(f"TWO_ROUTES: BFS = 3 steps (DFS ka {steps(dfs(g, s1, e1)[1])})", steps(p) == 3 and valid_path(g, s1, e1, p))
    g, s1, e1 = parse(MAZES["BLOCKED"])
    o, p = bfs(g, s1, e1)
    ok &= _check("BLOCKED: path = [] (raasta nahi)", p == [] and len(o) > 0)
    ok &= _check(f"COLLEGE: path = {_shortest(grid, s, e)} steps (sabse chhota)", steps(b_path) == _shortest(grid, s, e) and valid_path(grid, s, e, b_path))
    print("\nTESTS PASSED" if ok else "\nTESTS FAILED  (hint README mein hai)")
