// ============================================================================
//  Island Counter  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <algorithm>
#include <cstdio>
#include <string>
#include <vector>
using namespace std;
using Grid = vector<string>;  // '1' = zameen, '0' = paani

// dfs(g, r, c, label): tumhara function. Return = kitne khaane paint kiye.
int dfs(Grid& g, int r, int c, char label);

inline Grid MAP_REEL = {
    "110000011",
    "100110001",
    "000100000",
    "000000100",
    "100001100",
    "110000001",
};

inline Grid MAP_ARCHI = {
    "1100000000011100000000001",
    "1110001100001000011000000",
    "0100011110000000011100110",
    "0000001100011111000000110",
    "0011000000010001000000000",
    "0011100000010101000111000",
    "0000100110010001000101000",
    "0000000110011111000111000",
    "1000000000000000000000000",
    "1100011000000110000110011",
    "1000011100001111000100011",
    "0000000000000110000000001",
};

struct Result {
    int n = 0;
    vector<int> areas;
    Grid g;
};

inline Result countIslands(Grid g) {
    Result res;
    for (int r = 0; r < (int)g.size(); r++)
        for (int c = 0; c < (int)g[0].size(); c++)
            if (g[r][c] == '1') res.areas.push_back(dfs(g, r, c, char('A' + res.n++ % 26)));
    res.g = g;
    return res;
}

inline void show(const Grid& g) {
    for (auto& row : g) {
        printf("  ");
        for (char ch : row) printf(ch == '0' ? "~~" : ch == '1' ? "??" : "%c ", ch);
        printf("\n");
    }
}

inline int biggest(const Result& r) { return r.areas.empty() ? 0 : *max_element(r.areas.begin(), r.areas.end()); }

inline bool check(const char* name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name);
    return ok;
}

inline int runAll() {
    // NOTE: C++ mein g[-1] Python ki tarah aakhri row nahi deta: ye out-of-bounds (undefined behaviour) hai,
    // crash ya kachra. Isliye r < 0 / c < 0 check C++ mein bhi zaroori hai.
    Result a = countIslands(MAP_REEL);
    printf("\n=== reel ===\n");
    show(a.g);
    printf("  Islands: %d   sabse bada: %d khaane\n", a.n, biggest(a));
    Result b = countIslands(MAP_ARCHI);
    printf("\n=== archipelago ===\n");
    show(b.g);
    printf("  Islands: %d   sabse bada: %d khaane\n", b.n, biggest(b));

    printf("\n=== TESTS ===\n");
    bool ok = true;
    vector<int> s = a.areas;
    sort(s.rbegin(), s.rend());
    ok &= check("reel map = 6 islands", a.n == 6);
    ok &= check("reel map areas = 3,3,3,3,3,1", s == vector<int>{3, 3, 3, 3, 3, 1});
    ok &= check("sirf paani = 0", countIslands({"000", "000"}).n == 0);
    Result all = countIslands({"1111", "1111", "1111"});
    ok &= check("sab zameen = 1 island, area 12", all.n == 1 && all.areas == vector<int>{12});
    ok &= check("diagonal judta nahi: 10/01 = 2", countIslands({"10", "01"}).n == 2);
    ok &= check("left-right kinaare alag: 1001 = 2  (c < 0 check)", countIslands({"1001"}).n == 2);
    ok &= check("upar-neeche kinaare alag: 1/0/1 = 2  (r < 0 check)", countIslands({"1", "0", "1"}).n == 2);
    ok &= check("archipelago = 16 islands", b.n == 16);
    ok &= check("sabse bada island = 16, jheel wala ring", biggest(b) == 16);
    printf(ok ? "\nTESTS PASSED\n" : "\nKUCH TESTS FAIL  (hint: bounds check mein r < 0 aur c < 0?)\n");
    return ok ? 0 : 1;
}
