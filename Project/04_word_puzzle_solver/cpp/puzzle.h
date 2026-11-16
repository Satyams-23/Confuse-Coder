// ============================================================================
//  Newspaper Word Puzzle Solver  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <cctype>
#include <cstdio>
#include <cstdlib>
#include <set>
#include <string>
#include <utility>
#include <vector>
using namespace std;

using Grid = vector<string>;
using Path = vector<pair<int, int>>;

// tumhari function (starter.cpp mein)
bool dfs(Grid& g, const string& word, int r, int c, int k, Path& path);

static const Grid PUZZLE = {"CODEXS", "QLOOPT", "TREEZA", "GRAPHC", "MARKQK", "BUGNOD"};
static const vector<string> WORDS = {"CODE", "LOOP", "STACK", "GRAPH", "TREAP", "BUG", "QUEUE", "LOL"};
static const Grid LC79 = {"ABCE", "SFCS", "ADEE"};  // reel wala grid (LeetCode 79)

static bool search(const Grid& rows, const string& word, Path& out) {
    Grid g = rows;
    for (int r = 0; r < (int)g.size(); r++)
        for (int c = 0; c < (int)g[0].size(); c++) {
            Path p;
            if (dfs(g, word, r, c, 0, p)) { out = p; return true; }
        }
    return false;
}

static void draw(const Grid& rows, const Path& path) {
    set<pair<int, int>> on(path.begin(), path.end());
    for (int r = 0; r < (int)rows.size(); r++) {
        printf("    ");
        for (int c = 0; c < (int)rows[0].size(); c++) {
            if (on.count({r, c})) printf("[%c]", rows[r][c]);
            else printf(" %c ", tolower(rows[r][c]));
        }
        printf("\n");
    }
}

static bool validPath(const Grid& rows, const string& w, const Path& p) {
    if (p.size() != w.size()) return false;
    set<pair<int, int>> seen(p.begin(), p.end());
    if (seen.size() != p.size()) return false;
    for (size_t i = 0; i < p.size(); i++) {
        auto [r, c] = p[i];
        if (r < 0 || c < 0 || r >= (int)rows.size() || c >= (int)rows[0].size() || rows[r][c] != w[i]) return false;
        if (i && abs(r - p[i - 1].first) + abs(c - p[i - 1].second) != 1) return false;
    }
    return true;
}

static bool check(const string& name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name.c_str());
    return ok;
}

int main() {
    printf("=== 1. AAJ KA PUZZLE ===\n");
    int found = 0;
    for (auto& w : WORDS) {
        Path p;
        bool f = search(PUZZLE, w, p);
        printf("\n%s: %s\n", w.c_str(), f ? "MILA" : "nahi mila");
        if (f) { found++; draw(PUZZLE, p); }
    }
    printf("\n%d/%zu words mile\n", found, WORDS.size());

    printf("\n=== 2. TESTS ===\n");
    bool ok = true;
    struct T { const Grid* g; string w; bool exp; string extra; };
    vector<T> tests = {{&LC79, "ABCCED", true, ""}, {&LC79, "SEE", true, ""}, {&LC79, "ABCB", false, "  (reel wala trap: ek hi B do baar)"},
                       {&PUZZLE, "STACK", true, ""}, {&PUZZLE, "TREAP", true, ""}, {&PUZZLE, "QUEUE", false, ""}, {&PUZZLE, "LOL", false, "  (ek hi L do baar)"}};
    for (auto& t : tests) {
        Path p;
        bool f = search(*t.g, t.w, p);
        bool good = f == t.exp && (!t.exp || validPath(*t.g, t.w, p));
        ok &= check(t.w + " -> " + (t.exp ? "HAAN" : "NAHI") + t.extra, good);
    }
    Grid g = LC79;
    Path tmp;
    dfs(g, "ABCCED", 0, 0, 0, tmp);
    ok &= check("unmark: search ke baad grid wapas original", g == LC79);
    printf(ok ? "\nTESTS PASSED\n" : "\nTESTS FAILED  (hint README mein hai)\n");
    return ok ? 0 : 1;
}
