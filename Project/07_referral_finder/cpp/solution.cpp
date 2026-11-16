// Referral Finder · SOLUTION (C++) · @confuse__coder
#include "network.h"

void bfs(const Adj& adj, const string& start, Dist& dist, Parent& parent) {
    queue<string> q;
    dist[start] = 0;
    parent[start] = "";
    q.push(start);
    while (!q.empty()) {
        string node = q.front();  // queue: jo pehle aaya, woh pehle (BFS)
        q.pop();
        for (const string& nb : adj.at(node)) {
            if (!dist.count(nb)) {  // visited check
                dist[nb] = dist[node] + 1;
                parent[nb] = node;
                q.push(nb);
            }
        }
    }
}

vector<string> getPath(const Parent& parent, const string& target) {
    vector<string> path;
    for (string cur = target; !cur.empty(); cur = parent.at(cur)) path.push_back(cur);
    reverse(path.begin(), path.end());
    return path;
}

int main() { return run(); }
