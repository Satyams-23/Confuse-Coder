// ============================================================================
//  Shaadi Planner  ·  STARTER (C++)  ·  @confuse__coder
//
//  Kaam: sirf ek function likho, topoDays(tasks, after)   (~20 lines, Kahn's algorithm)
//    Plan.days  = {{din 1 ke kaam}, {din 2 ke kaam}, ...}  (har din `tasks` wale order mein)
//    Plan.stuck = jo kaam kabhi ho hi nahi paaye (gol chakkar)
//  Tips: indeg[kaam] gino. Aaj = saare indeg 0. Unke baad walon ka indeg-- ; naye 0 = agla din.
//
//  Run:  g++ -O2 -std=c++17 starter.cpp -o starter && ./starter   ->  "TESTS PASSED"
// ============================================================================
#include "planner.h"

Plan topoDays(const vector<string>& tasks, map<string, vector<string>>& after) {
    // TODO: yahan likho
    return {{}, tasks};
}

int main() { return runAll(); }
