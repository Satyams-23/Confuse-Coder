# Shaadi Planner (topological sort, Kahn's algorithm)
*@confuse__coder · Graphs EP 05 (Topological Sort) ka project*

Shaadi ke 13 kaam, sabki dependencies. Card print se pehle venue aur guest list, menu tasting se pehle caterer...
Tum likhoge Kahn's algorithm jo bataye **kaunsa kaam kis din** ho sakta hai: jinke pehle kuch baaki nahi, woh sab ek saath.
Aur agar kahin gol chakkar hai (caterer: "pehle guest count do", family: "pehle menu batao"), toh **phanse hue kaam** dikhao.
Sirf ek function tum likhoge: `topo_days()`.

---

## Problem
- `after = {"Venue book": ["Card print", "Caterer book", "Decoration"], ...}`: kaam → jo iske baad aate hain.
- `topo_days(tasks, after)` → `(days, stuck)`
  - `days` = `[["Venue book", "Guest list", "Shopping"], [...], ...]` (har din ke kaam `tasks` wale order mein)
  - `stuck` = jo kabhi ho hi nahi paaye (cycle), warna `[]`

## Reel se connection
| Reel | Code |
|---|---|
| "Jiske pehle kuch nahi, use pehle uthao" (Kahn) | `indeg == 0` wale kaam = aaj |
| Interview ke 6 kapde | `KAPDE`: Din 1 = Shirt, Pant, Mozey |
| Cycle ho toh koi order nahi (EP 04) | `LOOP`: Guest count ⇄ Menu final → stuck |
| Har node, har edge ek baar = O(V + E) | har kaam ek baar `days` mein, har arrow ek baar `indeg -= 1` |
| DFS wala tareeka (finish list ulti) | Try karo #2 |

---

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `planner.py` (shaadi / kapde / loop data, printing, tests) | `starter.py`: `topo_days()` | `solution.py` |
| `cpp/` | `planner.h` (same data, printing, tests) | `starter.cpp`: `topoDays()` | `solution.cpp` |

## Run
**Python**
```bash
cd python
python starter.py
```
**C++**
```bash
cd cpp
g++ -O2 -std=c++17 starter.cpp -o starter
./starter
```

## Expected output (solution)
```
=== Shaadi ===
  Din 1: Venue book, Guest list, Shopping
  Din 2: Card print, Caterer book, Decoration, Mehendi, Sangeet
  Din 3: Card baanto, Menu tasting
  Din 4: Shaadi

=== Interview ke kapde ===
  Din 1: Shirt, Pant, Mozey
  Din 2: Tie, Belt, Joote

=== Gol chakkar ===
  Din 1: Venue book
  ⚠ Phanse hue kaam (gol chakkar): Guest count, Menu final, Shaadi
...
TESTS PASSED
```

## Try karo
1. Apni shaadi / fest / exam prep ke kaam daalo `SHAADI` mein.
2. Reel wala DFS tareeka likho: finish list banao aur `[::-1]` karo. Order sahi aaya? (Din waala grouping nahi milega, sirf ek line.)
3. Ek din mein max 2 kaam hi ho sakte hain toh? (Hint: har din queue se 2 hi nikalo.)

## Practice
LeetCode 210 Course Schedule II · 1136 Parallel Courses (yahi "din" wala sawaal) · 207 Course Schedule · 269 Alien Dictionary
