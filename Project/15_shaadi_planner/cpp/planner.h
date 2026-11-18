// ============================================================================
//  Shaadi Planner  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <algorithm>
#include <cstdio>
#include <map>
#include <string>
#include <vector>
using namespace std;
using Pairs = vector<pair<string, string>>;  // (pehle, baad)

struct Plan {
    vector<vector<string>> days;  // din 1, din 2, ...
    vector<string> stuck;         // gol chakkar mein phanse
};

// topoDays(tasks, after): tumhara function (Kahn's algorithm).
Plan topoDays(const vector<string>& tasks, map<string, vector<string>>& after);

inline Pairs SHAADI = {
    {"Venue book", "Card print"}, {"Guest list", "Card print"}, {"Card print", "Card baanto"},
    {"Venue book", "Caterer book"}, {"Caterer book", "Menu tasting"}, {"Venue book", "Decoration"},
    {"Shopping", "Mehendi"}, {"Shopping", "Sangeet"},
    {"Card baanto", "Shaadi"}, {"Menu tasting", "Shaadi"}, {"Decoration", "Shaadi"},
    {"Mehendi", "Shaadi"}, {"Sangeet", "Shaadi"},
};
inline Pairs KAPDE = {{"Shirt", "Tie"}, {"Shirt", "Belt"}, {"Pant", "Belt"}, {"Pant", "Joote"}, {"Mozey", "Joote"}};
inline Pairs LOOP = {{"Venue book", "Guest count"}, {"Guest count", "Menu final"}, {"Menu final", "Guest count"}, {"Menu final", "Shaadi"}};

inline Plan runPlan(const Pairs& pairs) {
    vector<string> tasks;
    map<string, vector<string>> after;
    for (auto& [a, b] : pairs) {
        for (auto& x : {a, b})
            if (!after.count(x)) {
                after[x];
                tasks.push_back(x);
            }
        after[a].push_back(b);
    }
    return topoDays(tasks, after);
}

inline bool valid(const Plan& p, const Pairs& pairs) {
    map<string, int> day;
    for (size_t i = 0; i < p.days.size(); i++)
        for (auto& t : p.days[i]) day[t] = (int)i;
    for (auto& [a, b] : pairs)
        if (!day.count(a) || !day.count(b) || day[a] >= day[b]) return false;
    return true;
}

inline void show(const char* name, const Plan& p) {
    printf("\n=== %s ===\n", name);
    for (size_t i = 0; i < p.days.size(); i++) {
        printf("  Din %zu: ", i + 1);
        for (size_t j = 0; j < p.days[i].size(); j++) printf("%s%s", p.days[i][j].c_str(), j + 1 < p.days[i].size() ? ", " : "\n");
    }
    if (!p.stuck.empty()) {
        printf("  Phanse hue kaam (gol chakkar): ");
        for (size_t j = 0; j < p.stuck.size(); j++) printf("%s%s", p.stuck[j].c_str(), j + 1 < p.stuck.size() ? ", " : "\n");
    }
}

inline bool check(const char* name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name);
    return ok;
}

inline int runAll() {
    Plan s = runPlan(SHAADI), k = runPlan(KAPDE), l = runPlan(LOOP);
    show("Shaadi", s);
    show("Interview ke kapde", k);
    show("Gol chakkar", l);
    printf("\n=== TESTS ===\n");
    bool ok = true;
    ok &= check("shaadi: har kaam apni dependency ke baad", valid(s, SHAADI) && s.stuck.empty());
    ok &= check("shaadi: 4 din mein ho jaata hai", s.days.size() == 4);
    ok &= check("shaadi: Din 1 = Venue book, Guest list, Shopping", !s.days.empty() && s.days[0] == vector<string>{"Venue book", "Guest list", "Shopping"});
    ok &= check("shaadi: Shaadi sabse aakhri din, akeli", !s.days.empty() && s.days.back() == vector<string>{"Shaadi"});
    ok &= check("kapde: Din 1 = Shirt, Pant, Mozey", !k.days.empty() && k.days[0] == vector<string>{"Shirt", "Pant", "Mozey"} && valid(k, KAPDE));
    vector<string> st = l.stuck;
    sort(st.begin(), st.end());
    ok &= check("loop: phanse kaam = Guest count, Menu final, Shaadi", st == vector<string>{"Guest count", "Menu final", "Shaadi"});
    ok &= check("loop: Venue book phir bhi ho jaata hai", !l.days.empty() && l.days[0] == vector<string>{"Venue book"});
    printf(ok ? "\nTESTS PASSED\n" : "\nKUCH TESTS FAIL  (hint: har din indegree 0 wale saare kaam ek saath)\n");
    return ok ? 0 : 1;
}
