# Island Counter (DFS + flood fill)
*@confuse__coder · Graphs EP 03 (DFS / Number of Islands) ka project*

Reel mein mera code 6 islands ko 3 bol gaya, kyunki map **donut** ban gaya tha.
Ab tum likho woh DFS jo sahi gine: har island alag rang mein paint ho, aur sabse bada island kaunsa hai.
Bonus: apni **satellite photo** do, aur code uske islands ginega.
Sirf ek function tum likhoge: `dfs()`.

---

## Problem
- Grid: `'1'` = zameen, `'0'` = paani. Upar / neeche / left / right jude khaane = ek island (diagonal nahi).
- `dfs(g, r, c, label)`:
  - `(r, c)` map ke bahar hai, ya wahan `'1'` nahi → `return 0`
  - warna jhanda gaado: `g[r][c] = label` (visited, dobara nahi aana)
  - chaaron taraf jao, aur return karo `1 + chaaron ka total` (island ka size)
- Baaki sab ready hai: grid pe loop, har nayi zameen pe naya label (A, B, C...), printing, tests.

## Reel se connection
| Reel | Code |
|---|---|
| Har khaana gina toh 16 islands (galat) | `dfs()` khaali chhodo aur chalao: har `'1'` alag gina jaata hai |
| Explorer ek raasta pakad ke aage, paani mila toh wapas | recursion: `dfs(r+1, c)` ... aur bahar / paani pe `return 0` |
| Jahan pahuncho, jhanda gaado | `g[r][c] = label` |
| `r < 0` check gaayab → Python ka `g[-1]` = aakhri row → donut, 6 ki jagah 3 | tests `1001 = 2` aur `1/0/1 = 2` isi bug ko pakadte hain |
| Grid = graph (khaana = node, padosi = edge) | `dfs` = graph DFS, padosi = 4 directions |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `islands.py` (maps, loop, printing, tests, photo mode) | `starter.py`: `dfs()` | `solution.py` |
| `cpp/` | `islands.h` (maps, loop, printing, tests) | `starter.cpp`: `dfs()` | `solution.cpp` |

## Run
**Python**
```bash
cd python
python starter.py
```
Satellite photo (Python only, `pip install pillow`):
```bash
python starter.py --image my_map.png
```
**C++**
```bash
cd cpp
g++ -O2 -std=c++17 starter.cpp -o starter
./starter
```

## Expected output (solution)
```
=== reel ===
  A A ~~~~~~~~~~B B
  A ~~~~C C ~~~~~~B
  ~~~~~~C ~~~~~~~~~~
  ~~~~~~~~~~~~D ~~~~
  E ~~~~~~~~D D ~~~~
  E E ~~~~~~~~~~~~F
  Islands: 6   sabse bada: 3 khaane

=== archipelago ===
  ... 16 islands, sabse bada = G (16 khaane, beech mein jheel aur jheel mein island I)

=== TESTS ===
  [PASS] reel map = 6 islands
  ...
TESTS PASSED
```

## Try karo
1. Bounds check se `r < 0 or c < 0` hata do. Python mein reel map **3** aayega (donut!). C++ mein ye undefined behaviour hai: crash ya kachra.
2. Diagonal bhi jodna ho toh 8 directions karo. Reel map kitne islands bolega?
3. Bada map (1000 x 1000) pe Python ka recursion limit toot sakta hai. `dfs` ko apne stack (list) se iterative banao.
4. Island ka perimeter gino (LeetCode 463).

## Practice
LeetCode 200 Number of Islands · 695 Max Area of Island · 463 Island Perimeter · 1254 Number of Closed Islands · 733 Flood Fill
