# Cashback Trip Planner (Bellman-Ford)
*@confuse__coder · Graphs EP 09 (Bellman-Ford) ka project*

Reel mein Dijkstra aur mera code dono ne Goa ka trip ₹5,500 bataya, jabki cashback wala raasta ₹4,500 ka tha. Ab tum woh Bellman-Ford likho jo sahi trip bhi de aur cashback ka loop bhi pakde.

**Tum sirf ek function likhoge:** `bellman_ford()` in `starter.py` (ya `starter.cpp`).

---

## Problem
- Input: cities ki list, one-way tickets `(se, tak, Rs)`, aur start city. Cashback wala ticket negative hai.
- Output: `(dist, parent, loop)`
  - `dist` = har city tak sabse sasta kharcha (na pahunche toh `INF`)
  - `parent` = har city pe kis city se aaye (raasta banane ke liye)
  - `loop` = `None`, ya cashback loop ki cities, jaise `Ahmedabad > Mumbai > Ahmedabad`
- Ready file Dijkstra (EP 06 wala) aur "bina loop" (1 round) wala galat code bhi chalata hai, taaki tum farak dekh sako.

## Reel se connection
| Reel | Code |
|---|---|
| Saare tickets line se check karo | `for u, v, w in tickets` |
| Sasta hai? Update karo | `dist[u] + w < dist[v]` |
| Cities minus ek baar | `for _ in range(len(cities) - 1)` |
| Bug: bahar wala loop hi nahi | output ki "bina loop (1 round)" line |
| Ek round aur, ab bhi sasta? Loop! | negative cycle check |

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `trip.py` | `starter.py` | `solution.py` |
| `cpp/` | `trip.h` | `starter.cpp` | `solution.cpp` |

## Run
```bash
cd python
python starter.py
python test_trip.py starter     # 9 tests
```
```bash
cd cpp
g++ -std=c++17 starter.cpp -o starter && ./starter
```

## Expected output
```
=== Reel ka trip ===
  Jaipur     Rs 1,000
  Ahmedabad  Rs 4,200
  Mumbai     Rs 3,000
  Goa        Rs 4,500
  Bellman-Ford: Goa Rs 4,500 via Delhi > Jaipur > Ahmedabad > Mumbai > Goa
  Dijkstra (EP 06): Goa Rs 5,500  (galat!)
  bina loop (1 round): Goa Rs 5,500  (galat!)

=== Bharat yatra ===
  Jaipur     Rs 1,000
  Ahmedabad  Rs 4,200
  Mumbai     Rs 3,000
  Pune       Rs 3,600
  Goa        Rs 4,500
  Hyderabad  Rs 4,500
  Bengaluru  Rs 4,200
  Bellman-Ford: Bengaluru Rs 4,200 via Delhi > Jaipur > Ahmedabad > Mumbai > Goa > Bengaluru
  Dijkstra (EP 06): Bengaluru Rs 5,200  (galat!)
  bina loop (1 round): Bengaluru Rs 5,700  (galat!)

=== Wapas ka ticket Rs 1,000 ===
  PAISE CHHAAPNE KI MACHINE!
  loop: Ahmedabad > Mumbai > Ahmedabad  (har chakkar Rs 200 bachte)
  sabse sasta trip: kabhi khatam nahi
```
Python aur C++ ka output bilkul same hai.

## Hint
- Relax karne se pehle check karo `dist[u] != INF`, warna "pahunch nahi" wali city se bhi update ho jaayega.
- Loop mila? Jis city ka update hua, uske `parent` pe `n` baar peeche chalo. Ab tum pakka loop ke andar ho. Wahan se ghoomo jab tak wapas na aa jao.

## Level up
1. Early stop lagao: jis round mein kuch na badle, wahin ruk jao. Reel ke trip pe kitne rounds lage?
2. Har round ke baad table print karo (reel jaisa: Round 1 → Goa 5,500, Round 2 → 4,500).
3. LeetCode 787: "zyada se zyada K stop" wala twist. Bellman-Ford ke K + 1 rounds se.
