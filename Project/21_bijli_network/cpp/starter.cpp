// Bijli Network · TUMHARA KAAM: kruskal() likho.
// g++ -std=c++17 starter.cpp -o starter && ./starter
#include "network.h"

void kruskal(const vector<string>& gaon, vector<Wire> wires, vector<Wire>& chosen, vector<Wire>& skipped) {
    // 1. wires ko kharche (w) se stable_sort karo
    // 2. har wire: d.find(a) != d.find(b) -> d.unite, chosen mein; warna skipped mein
    // 3. chosen.size() == gaon.size() - 1 -> ruk jao
    DSU d(gaon);
    // TODO
}

int main() { run(); }
