// ============================================================================
//  Newspaper Word Puzzle Solver  ·  STARTER (C++)  ·  @confuse__coder
//
//  Kaam: dfs() likho (~15 lines). Reel ke teen steps + do line ka fix:
//    k == word.size()                    -> true (poora word mil gaya)
//    grid se bahar, ya letter match nahi  -> false
//    MARK   : char ch = g[r][c]; g[r][c] = '#';
//    chaaron direction mein recursion (upar, neeche, left, right)
//    UNMARK : g[r][c] = ch;
//  Bonus: path mein {r, c} push karo, fail ho toh pop - tabhi grid pe highlight dikhega.
//  Run:  g++ -O2 -std=c++17 starter.cpp -o starter && ./starter
// ============================================================================
#include "puzzle.h"

bool dfs(Grid& g, const string& word, int r, int c, int k, Path& path) {
    // TODO: yahan likho
    return false;
}
