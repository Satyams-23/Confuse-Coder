// ============================================================================
//  Referral Finder  ·  STARTER (C++)  ·  @confuse__coder
//  Kaam: do functions likho.
//   1. bfs(adj, start, dist, parent)  ~12 lines. queue<string> lo, front() + pop() (stack nahi!).
//        dist[start] = 0, parent[start] = "". Push karte waqt hi dist + parent set karo (= visited).
//   2. getPath(parent, target)        ~5 lines. parent ke peeche start tak jao, phir reverse.
//  Build: g++ -O2 -std=c++17 starter.cpp -o starter && ./starter   ->  "TESTS PASSED"
// ============================================================================
#include "network.h"

void bfs(const Adj& adj, const string& start, Dist& dist, Parent& parent) {
    // TODO: yahan likho
}

vector<string> getPath(const Parent& parent, const string& target) {
    // TODO: yahan likho
    return {};
}

int main() { return run(); }
