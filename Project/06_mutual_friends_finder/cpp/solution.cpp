// ============================================================================
//  Mutual Friends Finder  ·  SOLUTION (C++)  ·  @confuse__coder
//  Pehle khud try karo! Phir milaao.
// ============================================================================
#include "friends.h"

void addEdge(Adj& adj, const string& u, const string& v) {
    adj[u].push_back(v);
    adj[v].push_back(u);  // reel wali ek line: ulti taraf bhi
}

vector<string> suggest(Adj& adj, const string& who) {
    map<string, int> count;
    for (auto& f : adj[who])          // mere dost
        for (auto& ff : adj[f])       // unke dost
            if (ff != who && find(adj[who].begin(), adj[who].end(), ff) == adj[who].end())
                count[ff]++;          // har common dost = +1 mutual
    vector<string> out;
    for (auto& [n, _] : count) out.push_back(n);
    sort(out.begin(), out.end(), [&](const string& a, const string& b) {
        return count[a] != count[b] ? count[a] > count[b] : a < b;
    });
    return out;
}
