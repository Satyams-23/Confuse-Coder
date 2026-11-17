// ============================================================================
//  Island Counter  ·  STARTER (C++)  ·  @confuse__coder
//
//  Kaam: sirf ek function likho, dfs(g, r, c, label)   (~8 lines, reel wala DFS)
//    - (r, c) map ke bahar hai (r < 0, c < 0, r >= rows, c >= cols), ya wahan '1' nahi  ->  return 0
//    - warna jhanda gaado:  g[r][c] = label      (dobara nahi aana)
//    - chaaron taraf jao: neeche, upar, right, left
//    - return: 1 + chaaron ka total
//
//  Run:  g++ -O2 -std=c++17 starter.cpp -o starter && ./starter   ->  "TESTS PASSED"
// ============================================================================
#include "islands.h"

int dfs(Grid& g, int r, int c, char label) {
    // TODO: yahan likho
    return 0;
}

int main() { return runAll(); }
