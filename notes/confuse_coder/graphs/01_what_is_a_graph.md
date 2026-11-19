# Graph kya hai + Adjacency List
*@confuse__coder · Graphs EP 01*

---

## 1. Problem (reel wala bug)
Dosti: Riya–Kabir, Riya–Sam, Kabir–Tara.
"Kabir ke dost kaun?" Mera code bola **sirf Tara**. Sahi answer: **Riya aur Tara**.

---

## 2. Graph = nodes + edges
- **Node:** ek cheez (insaan, sheher, page). Reel mein har insaan.
- **Edge:** do nodes ke beech connection. Reel mein dosti.
- **Graph:** bas nodes aur edges ka set.

Real life: Instagram (log + follow), Google Maps (jagah + sadak), Ola/Uber (best route), LinkedIn ("2nd connection").

---

## 3. Code mein kaise rakhein: Adjacency List
Har node ki ek list, usmein uske saare padosi.
```
Riya  -> Kabir, Sam
Kabir -> Riya, Tara
Sam   -> Riya
Tara  -> Kabir
```

**C++**
```cpp
int n = 4;                                   // 0 Riya, 1 Kabir, 2 Sam, 3 Tara
vector<vector<int>> adj(n);
void addEdge(int u, int v) {
    adj[u].push_back(v);
    adj[v].push_back(u);                     // <- reel wali ek line
}
```
**Python**
```python
from collections import defaultdict
adj = defaultdict(list)
def add_edge(u, v):
    adj[u].append(v)
    adj[v].append(u)                         # <- reel wali ek line
```
Space: O(V + E). Kisi node ke saare padosi: O(degree).

---

## 4. Woh ek line (bug)
Bina doosri line ke:
```
add_edge(Riya, Kabir)  ->  adj[Riya] = [Kabir]   adj[Kabir] = [ ]   <- Riya gayab!
```
Dosti **dono taraf** hoti hai, toh edge bhi dono taraf store karna padta hai: `adj[v].push_back(u)`.

---

## 5. Undirected vs Directed
| | Undirected | Directed |
|---|---|---|
| Example | Dosti, sadak (two-way) | Instagram follow, one-way road |
| Edge | u — v (dono taraf) | u → v (sirf ek taraf) |
| Code | `adj[u].push_back(v); adj[v].push_back(u);` | sirf `adj[u].push_back(v);` |

Tum kisi ko follow karo, toh zaroori nahi woh tumhe follow kare. Isliye Instagram = **directed graph**.

---

## 6. Common galtiyan
1. Undirected graph mein ek hi taraf edge daala (reel wala bug).
2. Directed graph mein dono taraf daal diya → "follow back" jo hua hi nahi.
3. Same edge do baar input mein ho toh duplicate padosi (zaroorat ho toh `set` use karo).
4. Nodes 1 se number hain aur array size `n` rakha → out of range. Size `n + 1` rakho.

---

## 7. Practice
1. **LeetCode 1791** – Find Center of Star Graph (degree)
2. **LeetCode 997** – Find the Town Judge (directed: in/out degree)
3. **LeetCode 1971** – Find if Path Exists in Graph
4. **LeetCode 841** – Keys and Rooms

**Quiz (pinned comment):** 5 dost, sab ek doosre ke dost. Kitni edges? (Answer next reel mein: **10** = 5×4/2)

---

## 8. Project: Mutual Friends Finder
Friend pairs se adjacency list banao, mutual friends aur "Suggested for you" (friends of friends) print karo. Sirf `add_edge()` aur `suggest()` khud likho. Python + C++, starter + solution + tests.
→ [Mutual Friends Finder](https://www.confuse-coder.site/projects/06_mutual_friends_finder)

**Next:** BFS: Kabir se Neel kitni dosti door hai?
