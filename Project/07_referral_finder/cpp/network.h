// ============================================================================
//  Referral Finder  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

// Kaun kahan kaam karta hai ("" = student)
static const vector<pair<string, string>> COMPANY = {
    {"Sam", ""}, {"Riya", ""}, {"Dev", "Infosys"}, {"Kabir", ""}, {"Tara", "TCS"},
    {"Meera", ""}, {"Aditi", "Google"}, {"Neel", ""}, {"Zoya", "Microsoft"},
    {"Arjun", ""}, {"Ishaan", "Amazon"}, {"Kavya", "Google"}, {"Om", "Flipkart"},
};
// Dosti (dono taraf). Order matter karta hai: BFS isi order mein padosi dekhta hai. Om alag island hai.
static const vector<pair<string, string>> FRIENDS = {
    {"Sam", "Dev"}, {"Sam", "Riya"}, {"Riya", "Kabir"}, {"Kabir", "Tara"},
    {"Tara", "Meera"}, {"Meera", "Aditi"}, {"Dev", "Aditi"}, {"Riya", "Neel"},
    {"Neel", "Zoya"}, {"Kabir", "Arjun"}, {"Arjun", "Ishaan"}, {"Tara", "Ishaan"},
    {"Meera", "Kavya"},
};

using Adj = map<string, vector<string>>;
using Dist = map<string, int>;        // naam -> kitni dosti door (jahan pahunch nahi, woh key hi nahi)
using Parent = map<string, string>;   // naam -> kisse pahuncha (start ka "")

void bfs(const Adj& adj, const string& start, Dist& dist, Parent& parent);   // starter.cpp mein
vector<string> getPath(const Parent& parent, const string& target);          // starter.cpp mein

inline Adj build() {
    Adj adj;
    for (auto& c : COMPANY) adj[c.first];
    for (auto& e : FRIENDS) { adj[e.first].push_back(e.second); adj[e.second].push_back(e.first); }
    return adj;
}
inline string company(const string& n) { for (auto& c : COMPANY) if (c.first == n) return c.second; return ""; }
inline string badge(int d) { return d < 0 ? "no path" : d == 0 ? "you" : d == 1 ? "1st" : d == 2 ? "2nd" : "3rd+"; }
inline string join(const vector<string>& v) { string s; for (size_t i = 0; i < v.size(); i++) s += (i ? " -> " : "") + v[i]; return s; }
inline bool check(const string& name, bool ok) { printf("  [%s] %s\n", ok ? "PASS" : "FAIL", name.c_str()); return ok; }

inline int run(const string& me = "Sam") {
    Adj adj = build();
    Dist dist; Parent parent;
    bfs(adj, me, dist, parent);
    auto d = [&](const string& n) { return dist.count(n) ? dist.at(n) : -1; };

    printf("=== 1. %s se har insaan kitna door (LinkedIn badge) ===\n", me.c_str());
    for (auto& c : COMPANY) {
        if (c.first == me) continue;
        printf("  %-7s %2s  %-8s %s\n", c.first.c_str(), d(c.first) < 0 ? "-" : to_string(d(c.first)).c_str(), badge(d(c.first)).c_str(), c.second.c_str());
    }
    printf("\n=== 2. REFERRAL ROUTE (sabse kam dosti wala raasta) ===\n");
    for (string comp : {"Google", "Amazon", "Microsoft", "Flipkart"}) {
        string best; int bd = INT_MAX;
        for (auto& c : COMPANY) if (c.second == comp && d(c.first) >= 0 && (d(c.first) < bd || (d(c.first) == bd && c.first < best))) { bd = d(c.first); best = c.first; }
        if (best.empty()) printf("  %-9s: koi raasta nahi :(\n", comp.c_str());
        else printf("  %-9s: %s  (%d dosti door)\n", comp.c_str(), join(getPath(parent, best)).c_str(), bd);
    }
    printf("\n=== 3. TESTS ===\n");
    bool ok = true;
    ok &= check("Aditi = 2 (reel: pop() se 5 aata tha)", d("Aditi") == 2);
    ok &= check("Riya aur Dev = 1st", d("Riya") == 1 && d("Dev") == 1);
    ok &= check("Kabir = 2, Meera = 3, Kavya = 4", d("Kabir") == 2 && d("Meera") == 3 && d("Kavya") == 4);
    ok &= check("Ishaan = 4", d("Ishaan") == 4);
    ok &= check("Om tak raasta nahi (dist mein hi nahi)", !dist.count("Om"));
    ok &= check("path(Aditi) = Sam -> Dev -> Aditi", getPath(parent, "Aditi") == vector<string>{"Sam", "Dev", "Aditi"});
    ok &= check("path(Zoya) = Sam -> Riya -> Neel -> Zoya", getPath(parent, "Zoya") == vector<string>{"Sam", "Riya", "Neel", "Zoya"});
    ok &= check("path(Sam) = [Sam]", getPath(parent, "Sam") == vector<string>{"Sam"});
    bool lens = !dist.empty();
    for (auto& [n, dd] : dist) lens &= (int)getPath(parent, n).size() == dd + 1;
    ok &= check("har path ki length = dist + 1", lens);
    printf("%s", ok ? "\nTESTS PASSED\n" : "\nTESTS FAILED  (hint README mein hai)\n");
    return ok ? 0 : 1;
}
