// Maze Race · SOLUTION (C++) · @confuse__coder
#include "maze.h"

void bfs(const Grid& g, Cell start, Cell end, vector<Cell>& order, vector<Cell>& path) {
    int R = g.size(), C = g[0].size();
    map<Cell, Cell> parent = {{start, {-1, -1}}};  // parent bhi = visited
    queue<Cell> q;
    q.push(start);
    order.clear();
    while (!q.empty()) {
        Cell cur = q.front();  // queue: jo pehle aaya (stack = BUG)
        q.pop();
        order.push_back(cur);
        if (cur == end) break;
        for (int i = 0; i < 4; i++) {
            int nr = cur.first + DR[i], nc = cur.second + DC[i];
            if (nr >= 0 && nr < R && nc >= 0 && nc < C && !g[nr][nc] && !parent.count({nr, nc})) {
                parent[{nr, nc}] = cur;
                q.push({nr, nc});
            }
        }
    }
    path = tracePath(parent, end);
}

int main() { return run(); }
