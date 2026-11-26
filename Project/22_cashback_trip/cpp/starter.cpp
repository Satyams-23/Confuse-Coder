// Cashback Trip Planner · TUMHARA KAAM: bellman_ford() likho.
// g++ -std=c++17 starter.cpp -o starter && ./starter
#include "trip.h"

Result bellman_ford(const vector<string>& cities, const vector<Ticket>& tickets, const string& src) {
    // 1. dist[src] = 0, baaki INF; parent = ""
    // 2. (cities - 1) rounds: har ticket: dist[u] + w < dist[v] ? update dist + parent
    // 3. ek round aur: ab bhi sasta hua? -> r.loop mein loop ki cities daalo
    Result r;
    for (auto& c : cities) { r.dist[c] = INF; r.parent[c] = ""; }
    r.dist[src] = 0;
    // TODO
    return r;
}

int main() { run(); }
