# Auto Route Finder (Dijkstra)
*@confuse__coder · Graphs EP 06 (Dijkstra) ka project*

City ka map, har sadak pe traffic ke minute. Tum likhoge Dijkstra jo **sabse fast raasta** nikaale, BFS ke "kam stop" wale raaste ke saath side by side.
Aur ek sadak band karo, toh naya raasta.
Sirf ek function tum likhoge: `dijkstra()`.

---

## Problem
- `adj = {"Ghar": [("Flyover", 5), ("Market", 2), ...], ...}`: jagah → (padosi, minute)
- `dijkstra(adj, src, dst)` → `(minute, path)`, raasta na ho toh `(None, None)` (C++: `{-1, {}}`)

## Reel se connection
| Reel | Code |
|---|---|
| "Sabse kam minute wali jagah pakka karo" | `heappop` → `done.add(v)` |
| Bug: tuple ulta `(v, d)` → naam se sort | heap mein hamesha `(d, v)` |
| BFS bolega 2 stop, 30 min | `bfs_route()` (ready file) side by side print |
| Flyover 5 → 4 (market se hoke) | `if d + w < dist[nxt]` (relax) |
| Time O(E log V) | har sadak max ek push, har push/pop log |

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `router.py` | `starter.py` | `solution.py` |
| `cpp/` | `router.h` | `starter.cpp` | `solution.cpp` |

## Run
```bash
cd python
python starter.py
python test_router.py starter     # 9 tests
```
```bash
cd cpp
g++ -std=c++17 starter.cpp -o starter && ./starter
```

## Sahi output
```
=== Reel ka map: Ghar -> College ===
  BFS (kam stop) : Ghar -> Flyover -> College  = 30 min, 2 stop
  Dijkstra (fast): Ghar -> Market -> Station -> Mall -> College  = 13 min, 4 stop

=== Shaam 6 baje: Office -> Ghar ===
  BFS (kam stop) : Office -> Highway -> Ghar  = 25 min, 2 stop
  Dijkstra (fast): Office -> Metro -> Gali No 4 -> Mandir -> Ghar  = 16 min, 4 stop

=== Mandir wali gali band ===
  BFS (kam stop) : Office -> Highway -> Ghar  = 25 min, 2 stop
  Dijkstra (fast): Office -> Metro -> Bus Stand -> Ghar  = 19 min, 3 stop
```
(C++ sirf Dijkstra wali lines print karta hai.)

## Try karo
1. Apne ghar se college/office ka map banao, Google Maps ke minute daal ke.
2. Reel wala bug khud dekho: push mein `(nxt, d + w)` likho. Answer 30 aayega.
3. Ek sadak `-5` minute ki karo. Dijkstra galat kyun hota hai? (Bellman-Ford padho)
