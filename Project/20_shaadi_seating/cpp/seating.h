// ============================================================================
//  Shaadi Seating  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

const vector<string> REEL_GUESTS = {"Riya", "Kabir", "Sam", "Tara", "Aditi", "Meera", "Dev", "Arjun"};
const vector<pair<string, string>> REEL_PAIRS = {{"Riya", "Kabir"}, {"Sam", "Tara"}, {"Kabir", "Sam"},
                                                 {"Meera", "Dev"}, {"Riya", "Aditi"}, {"Arjun", "Dev"}};
const vector<string> BIG_GUESTS = {"Dadi", "Papa", "Mummy", "Chacha", "Chachi", "Bunty", "Pinky",
                                   "Nanaji", "Mama", "Mami", "Golu", "Rohan", "Sneha", "Ishaan"};
const vector<pair<string, string>> BIG_PAIRS = {{"Papa", "Dadi"}, {"Mummy", "Papa"}, {"Chacha", "Dadi"}, {"Chachi", "Chacha"},
                                                {"Bunty", "Chachi"}, {"Pinky", "Bunty"}, {"Mama", "Nanaji"}, {"Mami", "Mama"},
                                                {"Golu", "Mami"}, {"Rohan", "Sneha"}};

// DSU on ints 0..n-1 (names map to ids). steps = kitni baar "upar chalo".
struct DSU {
    vector<int> parent, sz;
    long long steps = 0;
    DSU(int n) : parent(n), sz(n, 1) { iota(parent.begin(), parent.end(), 0); }
    int find(int x);
    bool unite(int a, int b);
};

inline void show(const string& title, const vector<string>& g, const vector<pair<string, string>>& pairs,
                 vector<pair<string, string>> asks) {
    map<string, int> id;
    for (size_t i = 0; i < g.size(); i++) id[g[i]] = i;
    DSU d(g.size());
    for (auto& [a, b] : pairs) d.unite(id[a], id[b]);
    vector<int> order;
    map<int, vector<string>> groups;
    for (auto& x : g) {
        int r = d.find(id[x]);
        if (!groups.count(r)) order.push_back(r);
        groups[r].push_back(x);
    }
    cout << "\n=== " << title << " ===\n  Tables: " << order.size() << "\n";
    for (size_t i = 0; i < order.size(); i++) {
        cout << "  Table " << i + 1 << ": ";
        auto& v = groups[order[i]];
        for (size_t k = 0; k < v.size(); k++) cout << (k ? ", " : "") << v[k];
        cout << "\n";
    }
    for (auto& [a, b] : asks)
        cout << "  " << a << " aur " << b << " ek family? " << (d.find(id[a]) == d.find(id[b]) ? "haan" : "nahi") << "\n";
}

inline void run() {
    show("Reel ki shaadi", REEL_GUESTS, REEL_PAIRS, {{"Riya", "Kabir"}, {"Riya", "Dev"}});
    show("Badi shaadi", BIG_GUESTS, BIG_PAIRS, {{"Pinky", "Mummy"}, {"Golu", "Papa"}});
    int n = 100000;
    DSU d(n);
    for (int i = 0; i < n - 1; i++) d.parent[i] = i + 1;
    d.steps = 0; d.find(0); long long first = d.steps;
    d.steps = 0; d.find(0);
    cout << "\n=== 1 lakh ki chain ===\n  pehla find(0): " << first << " kadam\n  doosra find(0): " << d.steps << " kadam\n";
}
