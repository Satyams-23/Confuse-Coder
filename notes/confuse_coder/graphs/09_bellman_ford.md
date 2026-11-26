# Bellman-Ford Algorithm (Negative Edges)
*@confuse__coder · Graphs EP 09 · Reel: Dijkstra bola ₹5,500, asli sasta ₹4,500*

Jab kisi edge ka wazan negative ho (jaise cashback wala ticket), Dijkstra galat ho jaata hai. Bellman-Ford har edge ko V − 1 baar check karta hai, aur negative loop bhi pakad leta hai.

---

## 1. Problem (Delhi se Goa, one-way tickets)
Har ticket one way hai. Ek train pe cashback ticket ke daam se zyada hai, toh woh ticket **negative** ho gaya:
```
Delhi → Jaipur      1,000  (bus)
Delhi → Mumbai      4,000  (flight)
Jaipur → Ahmedabad  3,200  (flight)
Ahmedabad → Mumbai  −1,200 (train 800, cashback 2,000)
Mumbai → Goa        1,500  (bus)
```
Sirf do raaste hain:
- Delhi → Mumbai → Goa = **₹5,500** (2 ticket)
- Delhi → Jaipur → Ahmedabad → Mumbai → Goa = 1,000 + 3,200 − 1,200 + 1,500 = **₹4,500** (4 ticket)

## 2. Dijkstra yahan kyun fail hota hai
Dijkstra ka rule: abhi tak jo city sabse kam mein pahunchi, use **pakka** karo, phir kabhi mat chhedo. Ye tabhi sahi hai jab aage jaane se kharcha sirf badhe.

EP 06 wala code chalao:
| Step | Pakka | Kya hua |
|---|---|---|
| 1 | Delhi 0 | Jaipur 1,000, Mumbai 4,000 |
| 2 | Jaipur 1,000 | Ahmedabad 4,200 |
| 3 | Mumbai 4,000 | Goa 5,500 |
| 4 | Ahmedabad 4,200 | Mumbai ab 3,000, par Mumbai pehle hi pakka |
| 5 | Goa 5,500 | Goa ko kisi ne update kiya hi nahi |

Final: Mumbai 3,000 dikhata hai, par **Goa 5,500**. Negative ticket ne Dijkstra ka maan tod diya.

## 3. Bellman-Ford: rule ek
1. `dist[src] = 0`, baaki sab ∞. Kuch bhi pakka nahi.
2. Saare edges line se check karo: `dist[u] + w < dist[v]` hai toh update (isse **relax** kehte hain).
3. Ye poora chakkar **V − 1 baar** (cities minus ek).
4. Ek round aur chalao. Ab bhi kuch sasta hua? Matlab **negative loop** hai.

**V − 1 kyun?** Sabse sasta raasta (bina loop) zyada se zyada V − 1 edges ka hota hai. Har round ke baad kam se kam ek edge aage tak ka jawab sahi ho jaata hai.

## 4. Code
```python
def bellman_ford(cities, tickets, src):
    dist = {c: INF for c in cities}
    dist[src] = 0
    for _ in range(len(cities) - 1):
        for u, v, w in tickets:
            if dist[u] != INF and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    for u, v, w in tickets:          # ek round aur
        if dist[u] != INF and dist[u] + w < dist[v]:
            return None              # negative loop
    return dist
```
C++ mein same: `for (int i = 0; i < n - 1; i++)` ke andar wahi edge loop.

## 5. Dry run (list jaise code padhta hai)
Tickets alphabetical order mein: Ahmedabad→Mumbai pehle aata hai.

| Round | Kya badla | Goa |
|---|---|---|
| 1 | Jaipur 1,000, Mumbai 4,000, Ahmedabad 4,200, Goa 5,500 | 5,500 |
| 2 | Mumbai 3,000 (cashback ab kaam aaya), Goa 4,500 | **4,500** |
| 3 | kuch nahi | 4,500 |
| 4 | kuch nahi | 4,500 |

Round 1 mein cashback ticket sabse pehle check hua, tab Ahmedabad ∞ tha, toh kuch nahi hua. Isliye ek round kaafi nahi.

## 6. Reel ka bug: bahar wala loop gayab
Mere code mein `for _ in range(n - 1):` tha hi nahi. Tickets sirf ek baar check hue, round 1 pe ruk gaya:
```
Goa: ₹5,500      # Dijkstra jitna hi galat
```
Fix: woh ek line, `for _ in range(n - 1):`, aur edge loop uske andar.

## 7. Negative loop (paise chhaapne ki machine)
Ab ek ticket aur jodo: Mumbai → Ahmedabad ₹1,000.
- Ahmedabad → Mumbai → Ahmedabad = −1,200 + 1,000 = **−200 har chakkar**.
- Har chakkar pe ₹200 bachte, toh "sabse sasta" kabhi khatam nahi hota. Goa round dar round girta hai: 5,500 → 4,500 → 4,300 → 4,100.
- 5th round (V-th) mein bhi kuch sasta hua → loop pakda. Dijkstra ye nahi pakad sakta.

## 8. Complexity
- **O(V · E)**: V − 1 rounds, har round mein E edges.
- Dijkstra O(E log V): tez, par sirf non-negative weights pe.
- Early stop: jis round mein kuch na badle, wahin ruk jao.

## 9. Dijkstra ya Bellman-Ford?
- Saare weights ≥ 0 → **Dijkstra**.
- Koi weight negative → **Bellman-Ford**.
- "Negative cycle hai kya?" ka sawaal → Bellman-Ford ka V-th round.
- "Zyada se zyada K stops" (LeetCode 787) → Bellman-Ford ke K + 1 rounds.

## 10. Kahan use hota hai
- Currency arbitrage: rates pe −log lagao, negative cycle = free paise wala loop.
- RIP routing (purane internet routers): distance-vector protocol, Bellman-Ford pe based. Usmein 16 hop = infinity (source: RFC 2453).
- History: Shimbel 1955, Ford 1956, Moore 1957, Bellman 1958. Naam Bellman aur Ford ka chal gaya.

## 11. Practice
- [787. Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)
- [743. Network Delay Time](https://leetcode.com/problems/network-delay-time/) (Bellman-Ford se karke dekho)
- [GFG: Negative Weight Cycle](https://www.geeksforgeeks.org/problems/negative-weight-cycle3504/1)
- [CSES 1197: Cycle Finding](https://cses.fi/problemset/task/1197)

## 12. Project
[Cashback Trip Planner](https://www.confuse-coder.site/projects/22_cashback_trip): tickets aur cashback do, tumhara `bellman_ford()` sabse sasta trip aur raasta bataye, Dijkstra ka galat jawab side by side dikhe, aur cashback loop ho toh "PAISE CHHAAPNE KI MACHINE" ke saath loop ki cities print ho.
