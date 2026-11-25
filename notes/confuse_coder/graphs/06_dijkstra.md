# Dijkstra's Algorithm
*@confuse__coder · Graphs EP 06 · Reel: 2 stop = 30 min, 4 stop = 13 min*

Weighted graph mein sabse kam total weight (minute, km, cost) wala raasta. BFS kyun fail hota hai, Dijkstra ka ek rule, min heap, aur reel wala tuple bug.

---

## 1. Problem (ghar se college)
```
Ghar–Flyover 5    Ghar–Market 2     Market–Flyover 2
Flyover–College 25 (jam)            Market–Station 4
Station–Mall 3    Mall–College 4    Ghar–Chowk 6    Chowk–Mall 9
```
Ghar se College ke 6 simple raaste hain: 13, 18, 19, 29, 30, 49 minute. Sabse fast = **13**.

## 2. BFS kyun fail
BFS (EP 02) **edges ginta hai, weight nahi**. Woh `Ghar → Flyover → College` dega: 2 stop, par **30 min**.
Jab har edge ka weight same ho tabhi BFS = shortest path.

## 3. Dijkstra ka rule
> Abhi tak jo jagah sabse kam distance pe hai (aur pakki nahi hui), use **pakka** karo. Phir uske padosiyon ko update (relax) karo.

Relax: `if dist[v] + w < dist[nxt]: dist[nxt] = dist[v] + w`

## 4. Dry run
| Pakka | dist (Ghar, Market, Flyover, Chowk, Station, Mall, College) |
|---|---|
| Ghar 0 | 0, 2, 5, 6, ∞, ∞, ∞ |
| Market 2 | 0, 2, **4**, 6, 6, ∞, ∞  (flyover 5 → 4) |
| Flyover 4 | ..., College 29 |
| Chowk 6 / Station 6 | Mall 15 → **9** |
| Mall 9 | College 29 → **13** |
| College 13 | done |

Path (parent se): Ghar → Market → Station → Mall → College = **13 min**.

## 5. Code (Python)
```python
import heapq
def dijkstra(adj, src):
    dist = {src: 0}
    pq = [(0, src)]                  # (d, v): PEHLE distance
    done = set()
    while pq:
        d, v = heapq.heappop(pq)
        if v in done: continue       # purani entry
        done.add(v)                  # pakka
        for nxt, w in adj[v]:
            if d + w < dist.get(nxt, float('inf')):
                dist[nxt] = d + w
                heapq.heappush(pq, (d + w, nxt))
    return dist
```

## 6. Reel ka bug: tuple ulta
`heappush(pq, (nxt, d + w))` likha. Python tuple ko **pehle element** se compare karta hai, toh heap **naam (A→Z)** se sort hua.
Ghar ke baad Chowk nikla, phir Flyover ne College ko 30 pe daala, aur "College" alphabetically Flyover/Market se pehle hai, toh College **30 pe pakka** ho gaya, Market (2) process hone se pehle. Answer 30, bilkul BFS jaisa galat.
Fix: `(d + w, nxt)`. C++ mein `priority_queue<pair<int,string>, vector<...>, greater<>>`, pehle int.

## 7. Shart: koi negative edge nahi
Pakka karne ke baad koi sasta raasta nahi aana chahiye. Negative weight ho toh yeh guarantee toot jaati hai → **Bellman-Ford** use karo.

## 8. Complexity
Binary heap ke saath **O((V + E) log V)**, aam taur pe likhte hain **O(E log V)**. Space O(V + E).

## 9. Kahan use hota hai
Maps / cab ETA ka fastest route, network routing (OSPF). Asli systems iske tez versions (A*, contraction hierarchies) chalate hain, par idea yahi hai.

## Practice
- LeetCode 743 Network Delay Time
- 1514 Path with Maximum Probability
- 1631 Path With Minimum Effort
- 787 Cheapest Flights Within K Stops (twist: K stops)

**Project:** Auto Route Finder (sirf `dijkstra()` likho, BFS vs Dijkstra side by side, sadak band karo).
