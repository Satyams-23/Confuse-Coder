// ============================================================================
//  Bijli Network  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

struct Wire { string a, b; int w; };

const vector<string> REEL_GAON = {"Rampur", "Sitapur", "Kheda", "Nandgaon", "Dhanpur", "Bela"};
const vector<Wire> REEL_WIRES = {{"Nandgaon", "Bela", 8}, {"Rampur", "Kheda", 4}, {"Sitapur", "Bela", 9},
                                 {"Rampur", "Sitapur", 2}, {"Dhanpur", "Bela", 11}, {"Kheda", "Nandgaon", 5},
                                 {"Rampur", "Dhanpur", 7}, {"Sitapur", "Kheda", 3}, {"Nandgaon", "Dhanpur", 6}};
const vector<string> ZILA_GAON = {"Rampur", "Sitapur", "Kheda", "Nandgaon", "Dhanpur", "Bela",
                                  "Gokul", "Moti Nagar", "Chandpur", "Lalganj"};
const vector<Wire> ZILA_WIRES = {{"Rampur", "Sitapur", 2}, {"Sitapur", "Kheda", 3}, {"Rampur", "Kheda", 4},
                                 {"Kheda", "Nandgaon", 5}, {"Nandgaon", "Dhanpur", 6}, {"Rampur", "Dhanpur", 7},
                                 {"Nandgaon", "Bela", 8}, {"Sitapur", "Bela", 9}, {"Dhanpur", "Bela", 11},
                                 {"Bela", "Gokul", 3}, {"Gokul", "Moti Nagar", 4}, {"Bela", "Moti Nagar", 6},
                                 {"Moti Nagar", "Chandpur", 10}, {"Gokul", "Chandpur", 12},
                                 {"Chandpur", "Lalganj", 5}, {"Dhanpur", "Lalganj", 15}};

// EP 07 wala Union-Find (path compression + size). Ready hai, bas use karo.
struct DSU {
    map<string, string> parent;
    map<string, int> sz;
    DSU(const vector<string>& items) { for (auto& x : items) parent[x] = x, sz[x] = 1; }
    string find(const string& x) {
        string r = x;
        while (parent[r] != r) r = parent[r];
        string c = x;
        while (parent[c] != r) { string n = parent[c]; parent[c] = r; c = n; }
        return r;
    }
    bool unite(const string& a, const string& b) {
        string ra = find(a), rb = find(b);
        if (ra == rb) return false;
        if (sz[ra] > sz[rb]) swap(ra, rb);
        parent[ra] = rb; sz[rb] += sz[ra];
        return true;
    }
};

// tumhara function (starter.cpp / solution.cpp): chosen + skipped bharo
void kruskal(const vector<string>& gaon, vector<Wire> wires, vector<Wire>& chosen, vector<Wire>& skipped);

inline pair<int, vector<string>> jude_hue(const vector<string>& gaon, const vector<Wire>& chosen) {
    DSU d(gaon);
    for (auto& e : chosen) d.unite(e.a, e.b);
    map<string, int> cnt;
    for (auto& g : gaon) cnt[d.find(g)]++;
    string best; int bn = 0;
    for (auto& g : gaon) { int c = cnt[d.find(g)]; if (c > bn) bn = c, best = d.find(g); }
    vector<string> dark;
    for (auto& g : gaon) if (d.find(g) != best) dark.push_back(g);
    return {bn, dark};
}

inline string joinv(const vector<string>& v) {
    string s;
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + v[i];
    return s;
}

inline void show(const string& title, const vector<string>& gaon, const vector<Wire>& wires) {
    vector<Wire> chosen, skipped;
    kruskal(gaon, wires, chosen, skipped);
    int total = 0;
    for (auto& e : chosen) total += e.w;
    auto [n, dark] = jude_hue(gaon, chosen);
    cout << "\n=== " << title << " ===\n";
    for (auto& e : chosen) cout << "  LAGAO   " << e.a << "-" << e.b << "  Rs " << e.w << "L\n";
    for (auto& e : skipped) cout << "  CHHODO  " << e.a << "-" << e.b << "  Rs " << e.w << "L  (pehle se jude)\n";
    cout << "  Total: Rs " << total << " lakh | " << n << "/" << gaon.size() << " jude";
    if (!dark.empty()) cout << " | andhere mein: " << joinv(dark);
    cout << "\n";
    vector<Wire> bug = wires;  // reel ka bug: bina if, bas saste (gaon - 1)
    stable_sort(bug.begin(), bug.end(), [](const Wire& x, const Wire& y) { return x.w < y.w; });
    bug.resize(min(bug.size(), gaon.size() - 1));
    int bt = 0;
    for (auto& e : bug) bt += e.w;
    auto [bn, bdark] = jude_hue(gaon, bug);
    cout << "  (bina if: Rs " << bt << " lakh | " << bn << "/" << gaon.size() << " jude";
    if (!bdark.empty()) cout << " | andhere mein: " << joinv(bdark);
    cout << ")\n";
}

inline void run() {
    show("Reel ke 6 gaon", REEL_GAON, REEL_WIRES);
    show("Poora zila", ZILA_GAON, ZILA_WIRES);
}
