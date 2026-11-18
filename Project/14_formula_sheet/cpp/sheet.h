// ============================================================================
//  Formula Sheet  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
//  (C++ version = sirf dependency graph + loop. Formulas ka calculation Python version mein hai.)
// ============================================================================
#pragma once
#include <cstdio>
#include <map>
#include <set>
#include <string>
#include <vector>
using namespace std;
using Needs = vector<pair<string, vector<string>>>;  // cell -> jo cells use chahiye (order fixed)

// findCycle(needs): tumhara function. Loop mila toh {"B6","B8","B6"} (start = end), warna khaali.
vector<string> findCycle(const Needs& needs);

inline const vector<string>& depsOf(const Needs& n, const string& c) {
    static const vector<string> none;
    for (auto& p : n)
        if (p.first == c) return p.second;
    return none;
}

inline Needs GST_BILL = {{"B2", {}}, {"B3", {}}, {"B4", {}}, {"B6", {"B2", "B3", "B4"}}, {"B7", {"B6"}}, {"B8", {"B6", "B7"}}};
inline Needs GST_LOOP = {{"B2", {}}, {"B3", {}}, {"B4", {}}, {"B6", {"B8", "B7"}}, {"B7", {"B6"}}, {"B8", {"B6", "B7"}}};
inline Needs SELF_REF = {{"C1", {"C1"}}};
inline Needs HIDDEN = {{"A1", {}}, {"B1", {"A1"}}, {"C1", {"B1", "A1"}}, {"D1", {"F1"}}, {"E1", {"D1"}}, {"F1", {"E1", "C1"}}};
inline Needs QUIZ = {{"A", {"B", "C"}}, {"B", {"D"}}, {"C", {"D"}}, {"D", {"E"}}, {"E", {}}};

inline bool realLoop(const vector<string>& l, const Needs& n) {
    if (l.size() < 2 || l.front() != l.back()) return false;
    for (size_t i = 0; i + 1 < l.size(); i++) {
        auto& d = depsOf(n, l[i]);
        bool ok = false;
        for (auto& x : d) ok |= x == l[i + 1];
        if (!ok) return false;
    }
    return true;
}

inline void show(const char* name, const Needs& n) {
    auto l = findCycle(n);
    printf("\n=== %s ===\n  ", name);
    if (l.empty()) {
        printf("koi cycle nahi\n");
        return;
    }
    printf("#REF!  Circular reference: ");
    for (size_t i = 0; i < l.size(); i++) printf("%s%s", l[i].c_str(), i + 1 < l.size() ? " -> " : "\n");
}

inline bool check(const char* name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name);
    return ok;
}

inline int runAll() {
    show("gst_bill", GST_BILL);
    show("gst_loop", GST_LOOP);
    show("self_ref", SELF_REF);
    show("hidden_loop", HIDDEN);
    printf("\n=== TESTS ===\n");
    bool ok = true;
    ok &= check("gst_bill: koi cycle nahi (diamond)", findCycle(GST_BILL).empty());
    ok &= check("gst_loop: sahi loop mila", realLoop(findCycle(GST_LOOP), GST_LOOP));
    ok &= check("self_ref: C1 -> C1", findCycle(SELF_REF) == vector<string>{"C1", "C1"});
    auto h = findCycle(HIDDEN);
    ok &= check("hidden_loop: D1/E1/F1 wala loop", realLoop(h, HIDDEN) && set<string>(h.begin(), h.end()) == set<string>{"D1", "E1", "F1"});
    ok &= check("pinned quiz: koi cycle nahi", findCycle(QUIZ).empty());
    printf(ok ? "\nTESTS PASSED\n" : "\nKUCH TESTS FAIL  (hint: wapas aate waqt path se nikalo!)\n");
    return ok ? 0 : 1;
}
