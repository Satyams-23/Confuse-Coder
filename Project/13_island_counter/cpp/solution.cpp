// ============================================================================
//  Island Counter  ·  SOLUTION (C++)  ·  @confuse__coder
//  Pehle khud starter.cpp try karo!
// ============================================================================
#include "islands.h"

int dfs(Grid& g, int r, int c, char label) {
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return 0;
    g[r][c] = label;  // jhanda: visited
    return 1 + dfs(g, r + 1, c, label) + dfs(g, r - 1, c, label) + dfs(g, r, c + 1, label) + dfs(g, r, c - 1, label);
}

int main() { return runAll(); }
