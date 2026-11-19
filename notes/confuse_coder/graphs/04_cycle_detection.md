# Cycle Detection (Directed Graph)
*@confuse__coder · Graphs EP 04*

---

## 1. Hook ka fact
Excel ki ek sheet = **1,048,576 rows × 16,384 columns** = 17,179,869,184 cells ≈ **1,718 crore** (Microsoft: "Excel specifications and limits").
Kahin bhi formulas ka gol chakkar bane, spreadsheet bata deti hai: Excel "Circular Reference", Google Sheets `#REF!` "Circular dependency detected".
(Unka internal algorithm kya hai, reel ye claim nahi karti. Idea wahi hai: directed graph mein cycle.)

## 2. Problem (reel wala GST bill)
| Cell | Formula | Value |
|---|---|---|
| Items | 240 + 120 + 140 | |
| Subtotal (B6) | `=SUM(B2:B4)` | 500 |
| GST (B7) | `=B6*18%` | 90 |
| Total (B8) | `=B6+B7` | 590 |

Arrow = "mujhe ye cell chahiye":
```
        Total
       ↙     ↘
 Subtotal ←── GST
     ↓
   Items
```
Sheet ne bill bana diya (590). **Mera code bola: CYCLE MILA!** Galat.

## 3. Bug: sirf ek visited list
```python
seen = set()
def has_cycle(node):
    if node in seen:
        return True          # "cycle!"
    seen.add(node)
    for nxt in needs[node]:
        if has_cycle(nxt):
            return True
    return False
```
Total → Subtotal (visited) → Items. Wapas. Total → GST → **Subtotal phir se mila** → "cycle!".
Par ye **diamond** hai: do alag raaste ek hi cell pe mile. Gol chakkar nahi.

## 4. Dhaaga (current path)
- Aage badho → dhaaga khulta jaaye. Wapas aao → dhaaga lapeto.
- Aage **apna hi khula dhaaga** mila → tum gol ghoom rahe ho = **cycle**.
- Aisi jagah mili jahan pehle aaye the par dhaaga **lipat chuka** → purana raasta, cycle nahi.

3 colours wala naam (interview mein yahi bolo):
| Colour | Matlab | Dhaaga |
|---|---|---|
| White | abhi tak nahi gaye | — |
| Gray | current path pe hai (recursion stack) | khula |
| Black | poora ho gaya | lipat gaya |
Gray pe pahunche = cycle. Black pe pahunche = theek hai.

## 5. Fix
**Ek line wala fix** (reel): wapas aate waqt `path.remove(node)`. Ab `path` sirf current raasta hai. Answer sahi, par bade graph pe ek node baar baar dekh sakta hai.

**Poora fix** (O(V + E)): `path` + `done` set.
```python
def find_cycle(needs):
    path, done = set(), set()
    def dfs(node):
        if node in path: return True     # gray: apna khula dhaaga
        if node in done: return False    # black: purana raasta
        path.add(node)
        for nxt in needs[node]:
            if dfs(nxt): return True
        path.remove(node)                # dhaaga lapeto
        done.add(node)
        return False
    return any(dfs(n) for n in needs)    # har node se (graph disconnected ho sakta hai)
```
**C++**
```cpp
// 0 = white, 1 = gray (path pe), 2 = black (done)
bool dfs(int u, vector<vector<int>>& adj, vector<int>& color) {
    color[u] = 1;
    for (int v : adj[u]) {
        if (color[v] == 1) return true;              // cycle
        if (color[v] == 0 && dfs(v, adj, color)) return true;
    }
    color[u] = 2;                                    // dhaaga lapeto
    return false;
}
bool hasCycle(vector<vector<int>>& adj) {
    vector<int> color(adj.size(), 0);
    for (int u = 0; u < (int)adj.size(); u++)
        if (color[u] == 0 && dfs(u, adj, color)) return true;
    return false;
}
```

## 6. Asli cycle
Subtotal ka formula: `=Total − GST`. Ab Total ko Subtotal chahiye, Subtotal ko Total.
Total → Subtotal → **Total** (khula dhaaga mila) = cycle ✅. Google Sheets: `#REF!` Circular dependency detected.

## 7. Undirected vs Directed
- **Undirected:** visited + "jahan se aaye (parent) wahan wapas mat ginna" kaafi hai. Visited node mila jo parent nahi → cycle.
- **Directed:** visited kaafi **nahi** (diamond false alarm deta hai). Current path (gray) chahiye.

## 8. Kahan kaam aata hai
- Course prerequisites mein loop (DSA → OS → DBMS → DSA = kabhi graduate nahi): LeetCode 207.
- Spreadsheet circular reference, build tools / package dependencies, programs mein deadlock.

## 9. Complexity
Time **O(V + E)** (path + done ke saath, har node ek baar black hota hai). Space O(V).

## 10. Dry run (fixed, GST bill)
```
dfs(Total)  path={Total}
  dfs(Subtotal)  path={Total, Subtotal}
    dfs(Items)  path={Total, Subtotal, Items} → wapas, done={Items}
  wapas, done={Items, Subtotal}
  dfs(GST)  path={Total, GST}
    dfs(Subtotal) → done mein hai → purana raasta, no cycle
  wapas, done={.., GST}
wapas → koi cycle nahi ✅
```

---

## Practice (LeetCode)
- **207** Course Schedule
- **802** Find Eventual Safe States (black = safe)
- **210** Course Schedule II (order bhi chahiye → topo sort)
- **684** Redundant Connection (undirected cycle)

## Project: Formula Sheet
[Formula Sheet](https://www.confuse-coder.site/projects/14_formula_sheet) · Python (poori mini spreadsheet) + C++ (graph) · tum likhoge sirf `find_cycle()` · loop ka poora raasta print hota hai jaise `B6 → B8 → B6`.

## Pinned quiz
A→B, A→C, B→D, C→D, D→E. Reel wala buggy code (sirf visited) yahan CYCLE bolega ya nahi? Sahi answer kya hai? (Answer next reel mein.)
