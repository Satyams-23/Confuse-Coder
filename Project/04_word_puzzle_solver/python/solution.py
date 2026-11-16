# ============================================================================
#  Newspaper Word Puzzle Solver  ·  SOLUTION (Python)  ·  @confuse__coder
# ============================================================================
from puzzle import run


def dfs(g, word, r, c, k, path):
    if k == len(word):                                       # FOUND
        return True
    if r < 0 or c < 0 or r >= len(g) or c >= len(g[0]) or g[r][c] != word[k]:
        return False                                         # OUT / NO MATCH
    ch = g[r][c]
    g[r][c] = '#'                                            # line 1: MARK
    path.append((r, c))
    ok = (dfs(g, word, r + 1, c, k + 1, path) or dfs(g, word, r - 1, c, k + 1, path)
          or dfs(g, word, r, c + 1, k + 1, path) or dfs(g, word, r, c - 1, k + 1, path))
    g[r][c] = ch                                             # line 2: UNMARK
    if not ok:
        path.pop()
    return ok


run(dfs)
