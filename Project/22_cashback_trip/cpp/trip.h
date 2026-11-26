// ============================================================================
//  Cashback Trip Planner  ·  READY FILE (C++)  ·  @confuse__coder
//  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.cpp mein hai.
// ============================================================================
#pragma once
#include <bits/stdc++.h>
using namespace std;

const long long INF = LLONG_MAX / 4;
struct Ticket { string u, v; long long w; };
struct Result {
    map<string, long long> dist;
    map<string, string> parent;     // "" = koi parent nahi
    vector<string> loop;            // khaali = koi loop nahi
};

// tumhara function (starter.cpp / solution.cpp mein)
Result bellman_ford(const vector<string>& cities, const vector<Ticket>& tickets, const string& src);

// reel ka trip (list alphabetical, jaise reel ka code padhta hai)
inline vector<string> REEL_CITIES = {"Delhi", "Jaipur", "Ahmedabad", "Mumbai", "Goa"};
inline vector<Ticket> REEL_TICKETS = {{"Ahmedabad", "Mumbai", -1200}, {"Delhi", "Jaipur", 1000},
    {"Delhi", "Mumbai", 4000}, {"Jaipur", "Ahmedabad", 3200}, {"Mumbai", "Goa", 1500}};

// Bharat yatra: 8 cities, 2 cashback tickets, koi loop nahi (list alphabetical)
inline vector<string> YATRA_CITIES = {"Delhi", "Jaipur", "Ahmedabad", "Mumbai", "Pune",
    "Goa", "Hyderabad", "Bengaluru"};
inline vector<Ticket> yatra() {
    vector<Ticket> t = {{"Delhi", "Jaipur", 1000}, {"Delhi", "Mumbai", 4000},
        {"Delhi", "Hyderabad", 4500}, {"Jaipur", "Ahmedabad", 3200},
        {"Ahmedabad", "Mumbai", -1200}, {"Mumbai", "Pune", 600},
        {"Mumbai", "Goa", 1500}, {"Pune", "Goa", 1800},
        {"Pune", "Bengaluru", 2500}, {"Hyderabad", "Bengaluru", 1200},
        {"Goa", "Bengaluru", -300}, {"Hyderabad", "Pune", 2000}};
    sort(t.begin(), t.end(), [](const Ticket& a, const Ticket& b) {
        return tie(a.u, a.v, a.w) < tie(b.u, b.v, b.w);
    });
    return t;
}

inline string rs(long long v) {
    if (v >= INF) return "pahunch nahi";
    string s = to_string(llabs(v)), o;
    for (size_t i = 0; i < s.size(); i++) {
        if (i && (s.size() - i) % 3 == 0) o += ',';
        o += s[i];
    }
    return (v < 0 ? "-Rs " : "Rs ") + o;
}

inline vector<string> path_to(const map<string, string>& parent, const string& src, const string& dst) {
    vector<string> p = {dst};
    set<string> seen = {dst};
    while (p.back() != src) {
        auto it = parent.find(p.back());
        if (it == parent.end() || it->second.empty()) return {};
        p.push_back(it->second);
        if (seen.count(p.back())) return {};
        seen.insert(p.back());
    }
    reverse(p.begin(), p.end());
    return p;
}

// EP 06 wala Dijkstra (heap + pakka set). Negative ticket pe galat.
inline long long dijkstra_ep06(const vector<string>& cities, const vector<Ticket>& tickets, const string& src, const string& dst) {
    map<string, vector<pair<string, long long>>> adj;
    for (auto& t : tickets) adj[t.u].push_back({t.v, t.w});
    map<string, long long> dist;
    for (auto& c : cities) dist[c] = INF;
    dist[src] = 0;
    priority_queue<pair<long long, string>, vector<pair<long long, string>>, greater<>> pq;
    pq.push({0, src});
    set<string> done;
    while (!pq.empty()) {
        auto [d, u] = pq.top();
        pq.pop();
        if (done.count(u)) continue;
        done.insert(u);
        for (auto& [v, w] : adj[u])
            if (d + w < dist[v]) { dist[v] = d + w; pq.push({dist[v], v}); }
    }
    return dist[dst];
}

// reel ka bug: bahar wala loop hi nahi
inline long long ek_round(const vector<string>& cities, const vector<Ticket>& tickets, const string& src, const string& dst) {
    map<string, long long> dist;
    for (auto& c : cities) dist[c] = INF;
    dist[src] = 0;
    for (auto& t : tickets)
        if (dist[t.u] < INF && dist[t.u] + t.w < dist[t.v]) dist[t.v] = dist[t.u] + t.w;
    return dist[dst];
}

inline string join(const vector<string>& v) {
    string o;
    for (size_t i = 0; i < v.size(); i++) o += (i ? " > " : "") + v[i];
    return o;
}

inline string pad(const string& s, size_t n) { return s.size() >= n ? s : s + string(n - s.size(), ' '); }

inline void show(const string& title, const vector<string>& cities, const vector<Ticket>& tickets,
                 const string& src = "Delhi", const string& dst = "Goa") {
    cout << "\n=== " << title << " ===\n";
    Result r = bellman_ford(cities, tickets, src);
    if (!r.loop.empty()) {
        long long gain = 0;
        for (size_t i = 0; i + 1 < r.loop.size(); i++)
            for (auto& t : tickets)
                if (t.u == r.loop[i] && t.v == r.loop[i + 1]) gain -= t.w;
        cout << "  PAISE CHHAAPNE KI MACHINE!\n";
        cout << "  loop: " << join(r.loop) << "  (har chakkar " << rs(gain) << " bachte)\n";
        cout << "  sabse sasta trip: kabhi khatam nahi\n";
        return;
    }
    for (auto& c : cities)
        if (c != src) cout << "  " << pad(c, 10) << " " << rs(r.dist[c]) << "\n";
    cout << "  Bellman-Ford: " << dst << " " << rs(r.dist[dst]) << " via " << join(path_to(r.parent, src, dst)) << "\n";
    long long dj = dijkstra_ep06(cities, tickets, src, dst);
    cout << "  Dijkstra (EP 06): " << dst << " " << rs(dj) << (dj != r.dist[dst] ? "  (galat!)" : "") << "\n";
    long long one = ek_round(cities, tickets, src, dst);
    cout << "  bina loop (1 round): " << dst << " " << rs(one) << (one != r.dist[dst] ? "  (galat!)" : "") << "\n";
}

inline void run() {
    show("Reel ka trip", REEL_CITIES, REEL_TICKETS);
    show("Bharat yatra", YATRA_CITIES, yatra(), "Delhi", "Bengaluru");
    vector<Ticket> loopT = REEL_TICKETS;
    loopT.push_back({"Mumbai", "Ahmedabad", 1000});
    show("Wapas ka ticket Rs 1,000", REEL_CITIES, loopT);
}
