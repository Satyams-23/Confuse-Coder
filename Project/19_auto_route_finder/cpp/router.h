// ============================================================================
//  Auto Route Finder  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

struct Road { string a, b; int w; };
using Adj = map<string, vector<pair<string, int>>>;
// return {minute, path}; raasta na ho toh {-1, {}}
using Result = pair<int, vector<string>>;

const vector<Road> REEL_MAP = {
    {"Ghar", "Flyover", 5}, {"Ghar", "Market", 2}, {"Market", "Flyover", 2},
    {"Flyover", "College", 25}, {"Market", "Station", 4}, {"Station", "Mall", 3},
    {"Mall", "College", 4}, {"Ghar", "Chowk", 6}, {"Chowk", "Mall", 9}};
const vector<Road> EVENING_MAP = {
    {"Office", "Metro", 4}, {"Office", "Ring Road", 3}, {"Ring Road", "Flyover", 2},
    {"Flyover", "Ghar", 28}, {"Metro", "Bus Stand", 6}, {"Bus Stand", "Ghar", 9},
    {"Metro", "Gali No 4", 5}, {"Gali No 4", "Mandir", 3}, {"Mandir", "Ghar", 4},
    {"Ring Road", "Mall", 7}, {"Mall", "Mandir", 6}, {"Office", "Highway", 10},
    {"Highway", "Ghar", 15}};

inline Adj build(const vector<Road>& roads, set<pair<string, string>> closed = {}) {
    Adj adj;
    for (auto& r : roads) {
        adj[r.a]; adj[r.b];
        if (closed.count({r.a, r.b}) || closed.count({r.b, r.a})) continue;
        adj[r.a].push_back({r.b, r.w});
        adj[r.b].push_back({r.a, r.w});
    }
    return adj;
}

inline string join(const vector<string>& p) {
    string s;
    for (size_t i = 0; i < p.size(); i++) s += (i ? " -> " : "") + p[i];
    return s;
}

inline void show(const string& title, const vector<Road>& roads, string src, string dst,
                 Result (*dijkstra)(Adj&, string, string), set<pair<string, string>> closed = {}) {
    Adj adj = build(roads, closed);
    cout << "\n=== " << title << " ===\n";
    Result r = dijkstra(adj, src, dst);
    if (r.first < 0) cout << "  Dijkstra       : koi raasta nahi\n";
    else cout << "  Dijkstra (fast): " << join(r.second) << "  = " << r.first << " min, " << r.second.size() - 1 << " stop\n";
}

inline void run(Result (*dijkstra)(Adj&, string, string)) {
    show("Reel ka map: Ghar -> College", REEL_MAP, "Ghar", "College", dijkstra);
    show("Shaam 6 baje: Office -> Ghar", EVENING_MAP, "Office", "Ghar", dijkstra);
    show("Mandir wali gali band", EVENING_MAP, "Office", "Ghar", dijkstra, {{"Mandir", "Ghar"}});
}
