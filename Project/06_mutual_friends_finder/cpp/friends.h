// ============================================================================
//  Mutual Friends Finder  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <algorithm>
#include <cstdio>
#include <map>
#include <set>
#include <string>
#include <utility>
#include <vector>
using namespace std;

using Adj = map<string, vector<string>>;

// tumhari functions (starter.cpp mein)
void addEdge(Adj& adj, const string& u, const string& v);
vector<string> suggest(Adj& adj, const string& who);

// College ka friend group (dosti = dono taraf, undirected graph)
static const vector<pair<string, string>> FRIENDS = {
    {"Riya", "Kabir"}, {"Riya", "Sam"}, {"Kabir", "Tara"}, {"Sam", "Tara"}, {"Riya", "Aman"},
    {"Aman", "Zoya"}, {"Kabir", "Zoya"}, {"Tara", "Neel"}, {"Sam", "Neel"},
};

static vector<string> friendsOf(Adj& adj, const string& who) {
    vector<string> v = adj.count(who) ? adj[who] : vector<string>{};
    sort(v.begin(), v.end());
    return v;
}

static vector<string> mutualOf(Adj& adj, const string& a, const string& b) {
    vector<string> x = friendsOf(adj, a), y = friendsOf(adj, b), out;
    set_intersection(x.begin(), x.end(), y.begin(), y.end(), back_inserter(out));
    return out;
}

static string join(const vector<string>& v) {
    string s;
    for (size_t i = 0; i < v.size(); i++) s += (i ? ", " : "") + v[i];
    return s.empty() ? "(koi nahi)" : s;
}

static bool has(Adj& adj, const string& a, const string& b) {
    if (!adj.count(a)) return false;
    return find(adj[a].begin(), adj[a].end(), b) != adj[a].end();
}

static bool check(const string& name, bool ok) {
    printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name.c_str());
    return ok;
}

int main() {
    Adj adj;
    for (auto& [u, v] : FRIENDS) addEdge(adj, u, v);

    printf("=== 1. ADJACENCY LIST ===\n");
    for (auto& [who, _] : adj) printf("  %-6s -> %s\n", who.c_str(), join(friendsOf(adj, who)).c_str());

    printf("\n=== 2. MUTUAL FRIENDS ===\n");
    for (auto [a, b] : vector<pair<string, string>>{{"Riya", "Tara"}, {"Kabir", "Sam"}})
        printf("  %s + %s: %s\n", a.c_str(), b.c_str(), join(mutualOf(adj, a, b)).c_str());

    printf("\n=== 3. SUGGESTED FOR YOU ===\n");
    for (string who : {"Kabir", "Zoya"}) {
        vector<string> out = suggest(adj, who), shown;
        for (auto& n : out) shown.push_back(n + " (" + to_string(mutualOf(adj, who, n).size()) + " mutual)");
        printf("  %s: %s\n", who.c_str(), join(shown).c_str());
    }

    printf("\n=== 4. TESTS ===\n");
    bool ok = true;
    ok &= check("Kabir ke dost = Riya, Tara, Zoya  (reel wala bug: Riya dono taraf)", friendsOf(adj, "Kabir") == vector<string>{"Riya", "Tara", "Zoya"});
    ok &= check("Tara ke dost = Kabir, Neel, Sam", friendsOf(adj, "Tara") == vector<string>{"Kabir", "Neel", "Sam"});
    bool both = true;
    for (auto& [u, v] : FRIENDS) both &= has(adj, u, v) && has(adj, v, u);
    ok &= check("har edge dono taraf (u in adj[v] aur v in adj[u])", both);
    bool nodup = true;
    for (auto& [w, l] : adj) nodup &= set<string>(l.begin(), l.end()).size() == l.size();
    ok &= check("koi duplicate dost nahi", nodup);
    ok &= check("suggest(Kabir) = Aman, Sam, Neel", suggest(adj, "Kabir") == vector<string>{"Aman", "Sam", "Neel"});
    ok &= check("suggest(Zoya)  = Riya, Tara", suggest(adj, "Zoya") == vector<string>{"Riya", "Tara"});
    bool clean = true;
    for (auto& [w, _] : adj)
        for (auto& n : suggest(adj, w)) clean &= n != w && !has(adj, w, n);
    ok &= check("suggest mein khud ya pehle se dost nahi", clean);
    printf(ok ? "\nTESTS PASSED\n" : "\nTESTS FAILED  (hint README mein hai)\n");
    return 0;
}
