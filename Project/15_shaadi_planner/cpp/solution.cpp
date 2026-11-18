// ============================================================================
//  Shaadi Planner  ·  SOLUTION (C++)  ·  @confuse__coder
//  Pehle khud starter.cpp try karo!
// ============================================================================
#include <set>
#include "planner.h"

Plan topoDays(const vector<string>& tasks, map<string, vector<string>>& after) {
    map<string, int> indeg;
    for (auto& t : tasks) indeg[t] += 0;
    for (auto& t : tasks)
        for (auto& n : after[t]) indeg[n]++;
    Plan p;
    set<string> done;
    vector<string> today;
    for (auto& t : tasks)
        if (indeg[t] == 0) today.push_back(t);  // jiske pehle kuch nahi
    while (!today.empty()) {
        p.days.push_back(today);
        set<string> next;
        for (auto& t : today) {
            done.insert(t);
            for (auto& n : after[t])
                if (--indeg[n] == 0) next.insert(n);
        }
        today.clear();
        for (auto& t : tasks)
            if (next.count(t)) today.push_back(t);  // tasks wala order
    }
    for (auto& t : tasks)
        if (!done.count(t)) p.stuck.push_back(t);
    return p;
}

int main() { return runAll(); }
