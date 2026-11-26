// Cashback Trip Planner · ANSWER. Pehle starter.cpp khud try karo.
// g++ -std=c++17 solution.cpp -o solution && ./solution
#include "trip.h"

Result bellman_ford(const vector<string>& cities, const vector<Ticket>& tickets, const string& src) {
    Result r;
    for (auto& c : cities) { r.dist[c] = INF; r.parent[c] = ""; }
    r.dist[src] = 0;
    int n = cities.size();
    for (int i = 0; i < n - 1; i++) {                 // reel ka missing loop
        bool changed = false;
        for (auto& t : tickets)
            if (r.dist[t.u] < INF && r.dist[t.u] + t.w < r.dist[t.v]) {
                r.dist[t.v] = r.dist[t.u] + t.w;
                r.parent[t.v] = t.u;
                changed = true;
            }
        if (!changed) break;                          // koi round kuch na badle -> ruk jao
    }
    for (auto& t : tickets)                           // ek round aur: ab bhi sasta? loop!
        if (r.dist[t.u] < INF && r.dist[t.u] + t.w < r.dist[t.v]) {
            r.parent[t.v] = t.u;
            string x = t.v;
            for (int i = 0; i < n; i++) x = r.parent[x];   // peeche chalo, loop ke andar
            vector<string> loop = {x};
            for (string y = r.parent[x]; y != x; y = r.parent[y]) loop.push_back(y);
            loop.push_back(x);
            reverse(loop.begin(), loop.end());
            r.loop = loop;
            return r;
        }
    return r;
}

int main() { run(); }
