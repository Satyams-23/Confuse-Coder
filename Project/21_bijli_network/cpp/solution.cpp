// Bijli Network · SOLUTION
// g++ -std=c++17 solution.cpp -o solution && ./solution
#include "network.h"

void kruskal(const vector<string>& gaon, vector<Wire> wires, vector<Wire>& chosen, vector<Wire>& skipped) {
    DSU d(gaon);
    stable_sort(wires.begin(), wires.end(), [](const Wire& x, const Wire& y) { return x.w < y.w; });
    for (auto& e : wires) {
        if (d.find(e.a) != d.find(e.b)) {   // reel ka "ek if"
            d.unite(e.a, e.b);
            chosen.push_back(e);
            if (chosen.size() == gaon.size() - 1) break;
        } else {
            skipped.push_back(e);
        }
    }
}

int main() { run(); }
