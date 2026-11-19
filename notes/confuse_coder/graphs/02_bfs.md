# BFS (Breadth First Search)
*@confuse__coder · Graphs EP 02*

---

## 1. Hook ka fact
Facebook Research (Feb 2016, ~159 crore users): kisi bhi do users ke beech **average ~3.57 log**.
(Ye average hai, sabke liye max nahi. Raasta ≈ 4.57 dosti ka. Facebook ne isse bade scale pe estimate kiya; idea wahi: **shortest path** in a friend graph.)

## 2. Problem (reel wala bug)
Dosti: Sam–Dev, Sam–Riya, Riya–Kabir, Kabir–Tara, Tara–Meera, Meera–Aditi, Dev–Aditi.
"Sam se Aditi kitni dosti door?" LinkedIn: **2nd**. Mera code: **5**.

```
Sam ── Riya ── Kabir ── Tara ── Meera ── Aditi   (5, galat raasta)
 └──── Dev ───────────────────────────── ┘       (2, sahi)
```

---

## 3. BFS = lehar
Paani mein patthar → pehle paas wali lehar, phir door wali.
- **Level 0:** Sam
- **Level 1:** Riya, Dev  (Sam ke dost)
- **Level 2:** Kabir, Aditi  (dost ke dost) → **Aditi mil gayi = 2** ✅
- Level 3: Tara, Meera

LinkedIn ka 1st / 2nd / 3rd = yahi levels.

## 4. Queue kyun? (pura bug yahi hai)
| | Queue (FIFO) | Stack (LIFO) |
|---|---|---|
| Kaun pehle niklega | jo pehle aaya | jo last aaya |
| Real life | ticket line | plates ka dher |
| Graph pe | level by level = **BFS** | ek raaste mein gehra = DFS jaisa |
| Python | `q.popleft()` | `q.pop()` |
| C++ | `queue<int>` + `front()` | `stack<int>` + `top()` |

Stack se Sam → Riya → Kabir → Tara → Meera → Aditi pehle pahunch gaya aur `dist[Aditi] = 5` likh diya. Visited ho gayi, toh Dev wala chhota raasta aaya hi nahi.

## 5. Code
**Python**
```python
from collections import deque

def bfs(adj, start):
    dist = {start: 0}
    q = deque([start])
    while q:
        node = q.popleft()          # pop() = BUG
        for nb in adj[node]:
            if nb not in dist:      # visited
                dist[nb] = dist[node] + 1
                q.append(nb)
    return dist
```
**C++**
```cpp
vector<int> bfs(vector<vector<int>>& adj, int s) {
    vector<int> dist(adj.size(), -1);
    queue<int> q;
    dist[s] = 0; q.push(s);
    while (!q.empty()) {
        int u = q.front(); q.pop();
        for (int v : adj[u])
            if (dist[v] == -1) { dist[v] = dist[u] + 1; q.push(v); }
    }
    return dist;
}
```

## 6. Rules yaad rakho
1. **Visited** push karte waqt mark karo, warna ek node do baar queue mein aayega / cycle mein gol gol ghoomega.
2. BFS jahan **pehli baar** pahunche, wahi shortest, **sirf unweighted** graph mein (har edge = 1).
3. Weight alag ho (km, minutes) → **Dijkstra** (aage ka episode).
4. Raasta bhi chahiye? `parent[nb] = node` rakho, phir target se peeche chalo.

## 7. Complexity
- Time **O(V + E)**: har node ek baar, har edge (undirected) do baar.
- Space **O(V)**: queue + dist.

## 8. Dry run (queue state)
```
q=[Sam]            → Sam nikla: Dev(1), Riya(1)
q=[Dev, Riya]      → Dev nikla: Aditi(2)
q=[Riya, Aditi]    → Riya nikla: Kabir(2)
q=[Aditi, Kabir]   → Aditi nikla: Meera(3)
q=[Kabir, Meera]   → Kabir nikla: Tara(3)
...                Aditi = 2 ✅
```

---

## Practice (LeetCode)
- **1971** Find if Path Exists in Graph (BFS se karo)
- **994** Rotting Oranges (multi-source BFS)
- **1091** Shortest Path in Binary Matrix (grid = graph)
- **127** Word Ladder (har word = node)

## Project: Referral Finder
[Referral Finder](https://www.confuse-coder.site/projects/07_referral_finder) · Python + C++ · tum likhoge `bfs()` + `get_path()` · 9 tests.

## Pinned quiz
Isi graph mein **Kabir** ke liye Aditi kaunsa connection? (Answer next reel mein.)
