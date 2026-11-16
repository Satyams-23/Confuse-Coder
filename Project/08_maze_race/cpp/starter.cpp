// ============================================================================
//  Maze Race  ·  STARTER (C++)  ·  @confuse__coder
//  Kaam: bfs() likho (~18 lines). Reel wala BFS, graph ki jagah maze.
//    g[r][c] = 1 deewar, 0 khula. Padosi = DR/DC (maze.h mein).
//    order = cells jis order mein queue se nikle (start pehla). path = start..end, ya {} agar raasta nahi.
//  Yaad rakho: queue<Cell> + front() (stack = DFS = bug), visited push karte waqt,
//    parent[{nr,nc}] = cur, start ka {-1,-1}, phir path = tracePath(parent, end).
//  Build: g++ -O2 -std=c++17 starter.cpp -o starter && ./starter   ->  "TESTS PASSED"
// ============================================================================
#include "maze.h"

void bfs(const Grid& g, Cell start, Cell end, vector<Cell>& order, vector<Cell>& path) {
    // TODO: yahan likho
}

int main() { return run(); }
