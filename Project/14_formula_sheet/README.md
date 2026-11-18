# Formula Sheet (cycle detection in a directed graph)
*@confuse__coder · Graphs EP 04 (Cycle Detection) ka project*

Excel / Google Sheets "Circular reference" kaise pakadte hain? Har formula ek **directed edge** hai: is cell ko woh cell chahiye.
Tum likhoge woh DFS jo gol chakkar pakde, aur **poora loop print** kare: `B6 → B8 → B6`.
Loop nahi hai? Toh sheet khud calculate ho jaati hai (GST bill = 590).
Sirf ek function tum likhoge: `find_cycle()`.

---

## Problem
- `needs = {"B8": ["B6", "B7"], "B7": ["B6"], "B6": ["B2", "B3", "B4"], ...}`: cell → jo cells use chahiye.
- `find_cycle(needs)` → loop mila toh `["B6", "B8", "B6"]` (start = end), warna `None`.
- Reel wala dhaaga:
  - `path` = abhi ka raasta (khula dhaaga). Agla cell `path` mein mila → **cycle**.
  - `done` = jin cells ka dhaaga lipat chuka → purana raasta, cycle **nahi**.
  - Wapas aate waqt `path` se nikalo aur `done` mein daalo. Yahi woh **ek line** hai.

## Reel se connection
| Reel | Code |
|---|---|
| GST bill: Total → Subtotal, GST; GST → Subtotal | `gst_bill` sheet, test "koi cycle nahi" |
| Bug: sirf ek visited list → Subtotal dobara = "CYCLE!" | visited-only likho aur dekho: 5 tests fail |
| Dhaaga khulta / lapet-ta hai | `path.append()` / `path.pop()` |
| Asli loop: Subtotal = Total − GST | `gst_loop` → `B6 → B8 → B6` |
| Har cell, har arrow ek baar = O(V + E) | `done` set |

---

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `sheet.py` (5 sheets, formula parser, calculator, tests) | `starter.py`: `find_cycle()` | `solution.py` |
| `cpp/` | `sheet.h` (dependency graphs, printing, tests) | `starter.cpp`: `findCycle()` | `solution.cpp` |

C++ version sirf graph + loop karta hai; formulas ka calculation Python version mein hai.

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

## Expected output (solution, Python)
```
=== gst_bill ===
  B6   =SUM(B2:B4)    = 500
  B7   =B6*18%        = 90
  B8   =B6+B7         = 590

=== gst_loop ===
  #REF!  Circular reference: B6 → B8 → B6

=== self_ref ===
  #REF!  Circular reference: C1 → C1

=== hidden_loop ===
  #REF!  Circular reference: D1 → F1 → E1 → D1
...
TESTS PASSED
```

## Try karo
1. `path.pop()` hata do (reel ka bug). Kaunse tests fail hote hain aur kyun?
2. Apni sheet banao `SHEETS` mein: apni salary / kharcha. Jaan-boojh ke loop daalo.
3. Loop nahi hai toh cells kis order mein calculate hone chahiye? (Topological sort, agla episode.)

## Practice
LeetCode 207 Course Schedule · 802 Find Eventual Safe States · 210 Course Schedule II · 684 Redundant Connection
