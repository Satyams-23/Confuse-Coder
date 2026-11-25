// Auto Route Finder · ANSWER (pehle khud try karo)
#include "router.h"

Result dijkstra(Adj& adj, string src, string dst) {
    map<string, int> dist{{src, 0}};
    map<string, string> parent;
    set<string> done;
    priority_queue<pair<int, string>, vector<pair<int, string>>, greater<>> pq;
    pq.push({0, src});                        // (d, v): pehle distance
    while (!pq.empty()) {
        auto [d, v] = pq.top(); pq.pop();
        if (done.count(v)) continue;          // stale entry
        done.insert(v);                       // PAKKA
        if (v == dst) break;
        for (auto& [nxt, w] : adj[v])
            if (!dist.count(nxt) || d + w < dist[nxt]) {
                dist[nxt] = d + w;
                parent[nxt] = v;
                pq.push({d + w, nxt});
            }
    }
    if (!done.count(dst)) return {-1, {}};
    vector<string> path;
    for (string x = dst; ; x = parent[x]) { path.push_back(x); if (x == src) break; }
    reverse(path.begin(), path.end());
    return {dist[dst], path};
}

int main() { run(dijkstra); }
