// ============================================================================
//  UPI Change Maker  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <algorithm>
#include <cstdio>
#include <set>
#include <string>
#include <vector>
using namespace std;

// tumhari function (starter.cpp mein)
void backtrack(int amt, int start, const vector<int>& coins, vector<int>& path, vector<vector<int>>& out);

static long long countDP(int bill, const vector<int>& coins) {  // reference (Coin Change II), sirf tests ke liye
    vector<long long> ways(bill + 1, 0);
    ways[0] = 1;
    for (int c : coins)
        for (int x = c; x <= bill; x++) ways[x] += ways[x - c];
    return ways[bill];
}

static vector<vector<int>> findWays(int bill, vector<int> coins) {
    sort(coins.begin(), coins.end());
    vector<vector<int>> out;
    vector<int> path;
    backtrack(bill, 0, coins, path, out);
    return out;
}

static string show(const vector<int>& w) {
    string s;
    for (size_t i = 0; i < w.size(); i++) s += (i ? " + Rs" : "Rs") + to_string(w[i]);
    return s;
}

static bool check(const char* name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name);
    return ok;
}

static int sum(const vector<int>& w) { int s = 0; for (int x : w) s += x; return s; }

int main() {
    printf("=== 1. CHAI TAPRI (reel wala) ===\n");
    int bill = 8;
    vector<int> coins = {2, 3, 5};
    auto ways = findWays(bill, coins);
    printf("Bill Rs%d, galla mein coins [2, 3, 5]\n", bill);
    for (size_t i = 0; i < ways.size(); i++) printf("  %zu. %s\n", i + 1, show(ways[i]).c_str());
    if (!ways.empty()) {
        auto best = *min_element(ways.begin(), ways.end(), [](auto& a, auto& b) { return a.size() < b.size(); });
        printf("Shopkeeper ka favourite (kam se kam coins): %s  (%zu coins)\n", show(best).c_str(), best.size());
    }
    printf("Total: %zu tareeke\n", ways.size());

    printf("\n=== 2. TESTS ===\n");
    bool ok = true;
    auto sorted8 = ways;
    sort(sorted8.begin(), sorted8.end());
    ok &= check("Rs8 with 2,3,5 = 3 tareeke", sorted8 == vector<vector<int>>{{2, 2, 2, 2}, {2, 3, 3}, {3, 5}});
    set<vector<int>> uniq;
    for (auto w : ways) { sort(w.begin(), w.end()); uniq.insert(w); }
    ok &= check("koi duplicate nahi (2 3 3 / 3 2 3 / 3 3 2 = ek hi)", uniq.size() == ways.size());
    ok &= check("Rs4 with 1,2 = 3 tareeke (pinned comment wala)", findWays(4, {1, 2}).size() == 3);
    ok &= check("Rs7 with 2,4 = 0 tareeke (odd bill, even coins)", findWays(7, {2, 4}).empty());
    auto big = findWays(50, {1, 2, 5, 10, 20});
    long long exp = countDP(50, {1, 2, 5, 10, 20});
    string nm = "Rs50 with 1,2,5,10,20 = " + to_string(exp) + " tareeke";
    ok &= check(nm.c_str(), (long long)big.size() == exp);
    bool sums = true;
    for (auto& w : big) sums &= sum(w) == 50;
    for (auto& w : ways) sums &= sum(w) == 8;
    ok &= check("har tareeke ka total = bill", sums);
    printf(ok ? "\nTESTS PASSED\n" : "\nTESTS FAILED  (hint README mein hai)\n");
    return ok ? 0 : 1;
}
