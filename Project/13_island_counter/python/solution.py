# ============================================================================
#  Island Counter  ·  SOLUTION (Python)  ·  @confuse__coder
#  Pehle khud starter.py try karo!
# ============================================================================
from islands import run


def dfs(g, r, c, label):
    if r < 0 or c < 0 or r >= len(g) or c >= len(g[0]) or g[r][c] != "1":
        return 0
    g[r][c] = label  # jhanda: visited
    return 1 + dfs(g, r + 1, c, label) + dfs(g, r - 1, c, label) + dfs(g, r, c + 1, label) + dfs(g, r, c - 1, label)


if __name__ == "__main__":
    run(dfs)
