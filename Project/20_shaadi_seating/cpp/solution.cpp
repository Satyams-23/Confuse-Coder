// Shaadi Seating · ANSWER (pehle khud try karo)
#include "seating.h"

int DSU::find(int x) {
    int root = x;
    while (parent[root] != root) { root = parent[root]; steps++; }
    while (parent[x] != root) { int nx = parent[x]; parent[x] = root; x = nx; }  // path compression
    return root;
}

bool DSU::unite(int a, int b) {
    int ra = find(a), rb = find(b);
    if (ra == rb) return false;
    if (sz[ra] < sz[rb]) swap(ra, rb);  // chhoti -> badi ke neeche
    parent[rb] = ra;
    sz[ra] += sz[rb];
    return true;
}

int main() { run(); }
