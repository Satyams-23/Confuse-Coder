# ============================================================================
#  Newspaper Word Puzzle Solver  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================

PUZZLE = [
    "CODEXS",
    "QLOOPT",
    "TREEZA",
    "GRAPHC",
    "MARKQK",
    "BUGNOD",
]
WORDS = ["CODE", "LOOP", "STACK", "GRAPH", "TREAP", "BUG", "QUEUE", "LOL"]

LC79 = ["ABCE", "SFCS", "ADEE"]  # reel wala grid (LeetCode 79)


def to_grid(rows):
    return [list(r) for r in rows]


def search(dfs, rows, word):
    """Har khaane se try karo. Mila toh path (list of (r, c)) return, warna None."""
    g = to_grid(rows)
    for r in range(len(g)):
        for c in range(len(g[0])):
            path = []
            if dfs(g, word, r, c, 0, path):
                return path
    return None


def draw(rows, path):
    on = {p: i for i, p in enumerate(path or [])}
    lines = []
    for r, row in enumerate(rows):
        cells = [f"[{ch}]" if (r, c) in on else f" {ch.lower()} " for c, ch in enumerate(row)]
        lines.append("    " + "".join(cells))
    return "\n".join(lines)


def valid_path(rows, word, path):
    if path is None or len(path) != len(word) or len(set(path)) != len(path):
        return False
    for i, (r, c) in enumerate(path):
        if not (0 <= r < len(rows) and 0 <= c < len(rows[0])) or rows[r][c] != word[i]:
            return False
        if i and abs(r - path[i - 1][0]) + abs(c - path[i - 1][1]) != 1:
            return False
    return True


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def run(dfs):
    print("=== 1. AAJ KA PUZZLE ===")
    found = 0
    for w in WORDS:
        p = search(dfs, PUZZLE, w)
        print(f"\n{w}: {'MILA' if p else 'nahi mila'}")
        if p:
            found += 1
            print(draw(PUZZLE, p))
    print(f"\n{found}/{len(WORDS)} words mile")

    print("\n=== 2. TESTS ===")
    ok = True
    for rows, w, exp in [(LC79, "ABCCED", True), (LC79, "SEE", True), (LC79, "ABCB", False),
                         (PUZZLE, "STACK", True), (PUZZLE, "TREAP", True), (PUZZLE, "QUEUE", False), (PUZZLE, "LOL", False)]:
        p = search(dfs, rows, w)
        good = (p is not None) == exp and (not exp or valid_path(rows, w, p))
        extra = "  (reel wala trap: ek hi B do baar)" if w == "ABCB" else "  (ek hi L do baar)" if w == "LOL" else ""
        ok &= _check(f"{w} -> {'HAAN' if exp else 'NAHI'}{extra}", good)
    g = to_grid(LC79)
    dfs(g, "ABCCED", 0, 0, 0, [])
    ok &= _check("unmark: search ke baad grid wapas original", ["".join(r) for r in g] == LC79)
    print("\nTESTS PASSED" if ok else "\nTESTS FAILED  (hint README mein hai)")
