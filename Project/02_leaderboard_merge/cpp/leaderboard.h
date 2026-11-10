// ============================================================================
//  Leaderboard Merge  ·  READY FILE (C++)  ·  @confuse__coder
//  Data, comparison counter, bubble-sort race, printing, tests aur main() yahan hain.
//  Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <algorithm>
#include <chrono>
#include <cstdio>
#include <random>
#include <vector>
using namespace std;

static long long comparisons = 0;
// a < b ? Har comparison yahan se karo, taaki hum gin sakein.
inline bool less_(int a, int b) { comparisons++; return a < b; }

vector<int> merge(const vector<int>& left, const vector<int>& right);  // tum likhoge
vector<int> mergeSort(const vector<int>& a);                           // tum likhoge

static const char* NAMES[] = {"Aarav", "Diya", "Kabir", "Isha", "Rohan", "Meera", "Arjun", "Sara", "Vivaan", "Anaya"};

inline vector<int> bubbleSort(vector<int> a) {
    int n = a.size();
    for (int i = 0; i < n; i++)
        for (int j = 0; j + 1 < n - i; j++)
            if (less_(a[j + 1], a[j])) swap(a[j], a[j + 1]);
    return a;
}

inline void show(const char* label, const vector<int>& v) {
    printf("%s[", label);
    for (size_t i = 0; i < v.size() && i < 12; i++) printf(i ? ", %d" : "%d", v[i]);
    printf(v.size() > 12 ? ", ...]" : "]");
}

inline bool check(const char* name, const vector<int>& got, const vector<int>& want) {
    bool ok = got == want;
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name);
    if (!ok) { show("         chahiye: ", want); printf("\n"); show("         mila   : ", got); printf("\n"); }
    return ok;
}

int main() {
    mt19937 rng(23);
    auto rnd = [&](int lo, int hi) { return uniform_int_distribution<int>(lo, hi)(rng); };
    vector<int> A, B;
    for (int i = 0; i < 6; i++) { A.push_back(rnd(100, 999)); B.push_back(rnd(100, 999)); }
    sort(A.begin(), A.end()); sort(B.begin(), B.end());   // dono servers ALREADY sorted

    printf("\n=== 1. Do servers ke leaderboard MERGE karo ===\n");
    show("Server A: ", A); printf("\n"); show("Server B: ", B); printf("\n");
    comparisons = 0;
    vector<int> board = merge(A, B);
    show("Merged  : ", board); printf("   (%lld comparisons, 12 numbers)\n", comparisons);
    if (board.size() >= 3) {
        printf("\nTOP 3:\n");
        for (int r = 1; r <= 3; r++) { int s = board[board.size() - r]; printf("  #%d  %-7s %d\n", r, NAMES[s % 10], s); }
    }

    printf("\n=== 2. Tests ===\n");
    bool ok = true;
    ok &= check("merge({1,4,9}, {2,3,10})", merge({1, 4, 9}, {2, 3, 10}), {1, 2, 3, 4, 9, 10});
    ok &= check("merge({}, {5,6})", merge({}, {5, 6}), {5, 6});
    ok &= check("merge({7}, {})", merge({7}, {}), {7});
    ok &= check("merge duplicates", merge({2, 2, 5}, {2, 3}), {2, 2, 2, 3, 5});
    ok &= check("mergeSort reel wala array", mergeSort({38, 27, 43, 3, 9, 82, 10, 15}), {3, 9, 10, 15, 27, 38, 43, 82});
    ok &= check("mergeSort({})", mergeSort({}), {});
    ok &= check("mergeSort({5})", mergeSort({5}), {5});
    vector<int> big(5000); for (int& x : big) x = rnd(0, 1000000);
    vector<int> want = big; sort(want.begin(), want.end());
    ok &= check("mergeSort 5000 random", mergeSort(big), want);

    if (ok) {
        printf("\n=== 3. RACE: 20000 numbers ===\n");
        vector<int> data(20000); for (int& x : data) x = rnd(0, 1000000);
        using clk = chrono::steady_clock;
        comparisons = 0; auto t0 = clk::now(); bubbleSort(data); double tb = chrono::duration<double>(clk::now() - t0).count(); long long cb = comparisons;
        comparisons = 0; t0 = clk::now(); mergeSort(data); double tm = chrono::duration<double>(clk::now() - t0).count(); long long cm = comparisons;
        printf("  Bubble sort : %12lld comparisons  %.3fs\n", cb, tb);
        printf("  Merge sort  : %12lld comparisons  %.3fs\n", cm, tm);
        printf("  Merge sort ~%lldx kam kaam. 1 crore pe ye fark 2 lakh guna ho jaata hai!\n", cb / (cm ? cm : 1));
    }
    printf("\n%s\n", ok ? "TESTS PASSED  (comment karke batao kitne comparisons aaye!)" : "TESTS FAILED  (hint README mein hai)");
    return 0;
}
