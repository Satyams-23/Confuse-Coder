// ============================================================================
//  Formula Sheet  ·  SOLUTION (C++)  ·  @confuse__coder
//  Pehle khud starter.cpp try karo!
// ============================================================================
#include <functional>
#include "sheet.h"

vector<string> findCycle(const Needs& needs) {
    vector<string> path;     // khula dhaaga
    set<string> onPath, done;
    vector<string> loop;
    function<bool(const string&)> dfs = [&](const string& c) {
        if (onPath.count(c)) {  // apna hi khula dhaaga mila
            size_t i = 0;
            while (path[i] != c) i++;
            loop.assign(path.begin() + i, path.end());
            loop.push_back(c);
            return true;
        }
        if (done.count(c)) return false;  // purana raasta
        path.push_back(c);
        onPath.insert(c);
        for (auto& nx : depsOf(needs, c))
            if (dfs(nx)) return true;
        path.pop_back();  // wapas: dhaaga lapeto
        onPath.erase(c);
        done.insert(c);
        return false;
    };
    for (auto& p : needs)
        if (dfs(p.first)) return loop;
    return {};
}

int main() { return runAll(); }
