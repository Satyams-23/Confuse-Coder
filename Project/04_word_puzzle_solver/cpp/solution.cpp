// ============================================================================
//  Newspaper Word Puzzle Solver  ·  SOLUTION (C++)  ·  @confuse__coder
// ============================================================================
#include "puzzle.h"

bool dfs(Grid& g, const string& word, int r, int c, int k, Path& path) {
    if (k == (int)word.size()) return true;                                   // FOUND
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != word[k])
        return false;                                                          // OUT / NO MATCH
    char ch = g[r][c];
    g[r][c] = '#';                                                             // line 1: MARK
    path.push_back({r, c});
    bool ok = dfs(g, word, r + 1, c, k + 1, path) || dfs(g, word, r - 1, c, k + 1, path) ||
              dfs(g, word, r, c + 1, k + 1, path) || dfs(g, word, r, c - 1, k + 1, path);
    g[r][c] = ch;                                                              // line 2: UNMARK
    if (!ok) path.pop_back();
    return ok;
}
