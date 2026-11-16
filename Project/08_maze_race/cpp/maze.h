// ============================================================================
//  Maze Race  ·  READY FILE (C++, terminal version)  ·  @confuse__coder
//  Maze, DFS (stack wala bug), printing, tests. Tumhara kaam starter.cpp mein hai.
//  (Browser wala visual version: ../web/index.html)
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

using Cell = pair<int, int>;
using Grid = vector<vector<int>>;  // 1 = deewar, 0 = khula
static const int DR[4] = {0, 1, 0, -1}, DC[4] = {1, 0, -1, 0};  // right, down, left, up

static const map<string, vector<string>> MAZES = {
    {"OPEN", {"#######", "#S....#", "#.....#", "#.....#", "#....E#", "#######"}},
    {"TWO_ROUTES", {"#######", "#S....#", "#.###.#", "#.###.#", "#E....#", "#######"}},
    {"BLOCKED", {"#####", "#S#E#", "#.#.#", "#####"}},
    {"COLLEGE", {
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
        "###############"}},
};

// tumhara function (starter.cpp): order = queue se nikalne ka order, path = start..end ya {}
void bfs(const Grid& g, Cell start, Cell end, vector<Cell>& order, vector<Cell>& path);

inline void parse(const vector<string>& L, Grid& g, Cell& s, Cell& e) {
    g.assign(L.size(), vector<int>(L[0].size(), 0));
    for (int r = 0; r < (int)L.size(); r++)
        for (int c = 0; c < (int)L[r].size(); c++) {
            g[r][c] = L[r][c] == '#';
            if (L[r][c] == 'S') s = {r, c};
            if (L[r][c] == 'E') e = {r, c};
        }
}

// parent[cell] = kahan se aaye; start ka parent = {-1,-1}
inline vector<Cell> tracePath(const map<Cell, Cell>& parent, Cell end) {
    if (!parent.count(end)) return {};
    vector<Cell> p;
    for (Cell cur = end; cur.first != -1; cur = parent.at(cur)) p.push_back(cur);
    reverse(p.begin(), p.end());
    return p;
}

// STACK wala (reel ka pop() bug): ek raasta pakad ke gehra
inline void dfs(const Grid& g, Cell s, Cell e, vector<Cell>& order, vector<Cell>& path) {
    int R = g.size(), C = g[0].size();
    set<Cell> seen;
    map<Cell, Cell> parent;
    vector<pair<Cell, Cell>> st = {{s, {-1, -1}}};
    order.clear();
    while (!st.empty()) {
        auto [cur, p] = st.back();
        st.pop_back();
        if (seen.count(cur)) continue;
        seen.insert(cur);
        parent[cur] = p;
        order.push_back(cur);
        if (cur == e) break;
        for (int i = 3; i >= 0; i--) {
            int nr = cur.first + DR[i], nc = cur.second + DC[i];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && !g[nr][nc] && !seen.count({nr, nc})) st.push_back({{nr, nc}, cur});
        }
    }
    path = tracePath(parent, e);
}

inline bool validPath(const Grid& g, Cell s, Cell e, const vector<Cell>& p) {
    if (p.empty() || p.front() != s || p.back() != e) return false;
    for (size_t i = 0; i < p.size(); i++) {
        auto [r, c] = p[i];
        if (r < 0 || r >= (int)g.size() || c < 0 || c >= (int)g[0].size() || g[r][c]) return false;
        if (i && abs(r - p[i - 1].first) + abs(c - p[i - 1].second) != 1) return false;
    }
    return true;
}

inline int shortest_(const Grid& g, Cell s, Cell e) {  // trusted answer, sirf tests ke liye
    map<Cell, int> d = {{s, 0}};
    vector<Cell> q = {s};
    for (size_t h = 0; h < q.size(); h++)
        for (int i = 0; i < 4; i++) {
            Cell n = {q[h].first + DR[i], q[h].second + DC[i]};
            if (n.first >= 0 && n.first < (int)g.size() && n.second >= 0 && n.second < (int)g[0].size() && !g[n.first][n.second] && !d.count(n)) {
                d[n] = d[q[h]] + 1;
                q.push_back(n);
            }
        }
    return d.count(e) ? d[e] : -1;
}

inline void show(const vector<string>& L, const vector<Cell>& path) {
    set<Cell> on(path.begin(), path.end());
    for (int r = 0; r < (int)L.size(); r++) {
        string row = L[r];
        for (int c = 0; c < (int)row.size(); c++)
            if (row[c] == '.' && on.count({r, c})) row[c] = 'o';
        printf("  %s\n", row.c_str());
    }
}
inline int steps(const vector<Cell>& p) { return p.empty() ? -1 : (int)p.size() - 1; }
inline bool check(const string& n, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", n.c_str());
    return ok;
}

inline int run() {
    Grid g;
    Cell s, e;
    parse(MAZES.at("COLLEGE"), g, s, e);
    vector<Cell> bo, bp, dO, dp;
    bfs(g, s, e, bo, bp);
    dfs(g, s, e, dO, dp);
    printf("=== 1. RACE: COLLEGE maze ===\n");
    printf("  BFS (queue): path %d steps, visited %d\n", steps(bp), (int)bo.size());
    printf("  DFS (stack): path %d steps, visited %d\n", steps(dp), (int)dO.size());
    printf("\n=== 2. BFS ka raasta (o) ===\n");
    show(MAZES.at("COLLEGE"), bp);
    printf("\n=== 3. DFS ka raasta (o) ===\n");
    show(MAZES.at("COLLEGE"), dp);

    printf("\n=== 4. TESTS ===\n");
    bool ok = true;
    Grid g1;
    Cell s1, e1;
    vector<Cell> o, p;
    parse(MAZES.at("OPEN"), g1, s1, e1);
    bfs(g1, s1, e1, o, p);
    ok &= check("OPEN: path = 7 steps", steps(p) == 7 && validPath(g1, s1, e1, p));
    ok &= check("order[0] = start", !o.empty() && o[0] == s1);
    ok &= check("order mein koi cell do baar nahi (visited)", !o.empty() && set<Cell>(o.begin(), o.end()).size() == o.size());

    parse(MAZES.at("TWO_ROUTES"), g1, s1, e1);
    o.clear(); p.clear();
    bfs(g1, s1, e1, o, p);
    vector<Cell> x, dp2;
    dfs(g1, s1, e1, x, dp2);
    ok &= check("TWO_ROUTES: BFS = 3 steps (DFS ka " + to_string(steps(dp2)) + ")", steps(p) == 3 && validPath(g1, s1, e1, p));

    parse(MAZES.at("BLOCKED"), g1, s1, e1);
    o.clear(); p.clear();
    bfs(g1, s1, e1, o, p);
    ok &= check("BLOCKED: path = [] (raasta nahi)", p.empty() && !o.empty());
    ok &= check("COLLEGE: path = " + to_string(shortest_(g, s, e)) + " steps (sabse chhota)", steps(bp) == shortest_(g, s, e) && validPath(g, s, e, bp));
    printf("%s", ok ? "\nTESTS PASSED\n" : "\nTESTS FAILED  (hint README mein hai)\n");
    return ok ? 0 : 1;
}
