# Maze Race · BFS vs DFS (visual + game)
*@confuse__coder · Graphs EP 02 (BFS) ka project*

Reel mein dekha: queue = lehar (BFS), stack = ek raaste mein gehra (DFS).
Ab khud dekho! Ek **browser game** jisme same maze pe BFS aur DFS ki race hoti hai, aur tum khud BFS ko harane ki koshish karte ho.
Tumhara kaam sirf ek function: **`bfs()`**. Baaki sab (maze, animation, game, DFS) ready hai.

🎮 **Abhi khelo (kuch download nahi, phone pe bhi):** [Maze Race live](https://satyams-23.github.io/Confuse-Coder/Project/08_maze_race/web/?solution#2026-15)  
(Reel wala maze: #2026. `?solution` hata do toh tumhara `starter.js` chalega, woh download karke.)

---

## Kya milega
| Mode | Kya hota hai |
|---|---|
| **▶ Race** | Same maze do baar. BFS (cyan) lehar ki tarah failta hai, DFS (red) ek raaste mein ghus jaata hai. Dono ka raasta peela chamakta hai, steps compare. |
| **✍️ Tum vs BFS** | Left maze pe ungli/mouse se S se E tak raasta banao (peeche khiskao = undo). Phir BFS chalega: "Barabar! 🎯" ya "BFS jeeta 😏". Best score save hota hai. |
| **🧱 Edit walls** | Deewar banao/hatao, phir race. BFS ka raasta block karke dekho woh kaise ghoom ke aata hai. |
| **Maze #42** | Har maze ka number URL mein (`#42-21`). Link dost ko bhejo, usko wahi maze milega. Challenge karo! |

Note: kabhi kabhi DFS bhi lucky ho jaata hai (same steps). Lekin **guarantee sirf BFS deta hai**. ~10 mein 8 maze mein BFS ka raasta chhota hoga.

---

## Files
```
web/      index.html (kholo!)  core.js + ui.js (ready)  starter.js (TUMHARA KAAM)  solution.js  test.js
python/   maze.py (ready)  starter.py  solution.py           terminal version, ASCII maze
cpp/      maze.h (ready)   starter.cpp solution.cpp          terminal version, ASCII maze
```
Browser ya terminal, jo pasand. Logic sab mein same hai.

## Run
**Browser (best):** `web/index.html` pe double-click. Kuch install nahi.
- Starter khaali hai toh BFS side pe likha aayega "starter.js mein bfs() likho ✍️".
- Answer dekhna ho toh top pe "solution dekho" link (ya `index.html?solution`).

**Web tests (Node.js chahiye):**
```bash
cd web
node test.js
```
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

## bfs() kya return kare
- `order`: cells jis order mein queue se nikle (start pehla). Isi se lehar ka animation banta hai.
- `path`: `[start, ..., end]` sabse chhota raasta. Raasta na ho toh khaali.
- JS: `return {order, path}` · Python: `return order, path` · C++: `order` aur `path` bharo.

## Reel se connection
| Reel | Code |
|---|---|
| Lehar ki tarah failo | BFS level by level, har padosi pe ek step |
| Lehar ko control karti hai ek **queue** | JS `q[head++]` · Python `popleft()` · C++ `q.front()` |
| Bug: `pop()` = stack | `pop()` lagao: tests fail, aur race mein BFS ka raasta lamba ho jaayega |
| Har insaan pe ek baar | visited, push karte waqt mark |
| Unweighted mein pehli baar = shortest | har step ki keemat 1, isliye BFS ka raasta hi sabse chhota |

## Expected output (terminal solution)
```
=== 1. RACE: COLLEGE maze ===
  BFS (queue): path 32 steps, visited 104
  DFS (stack): path 42 steps, visited 43
...
=== 4. TESTS ===
  ... 6 x [PASS]
TESTS PASSED
```
Dhyan do: DFS ne **kam cells** dekhe (43) par raasta **lamba** (42). BFS ne zyada dekha par raasta **sabse chhota** (32). Yahi trade-off hai.

## Hint (atke toh hi padhna)
- Queue mein start daalo, start ko visited + `parent = null/None`.
- Jab tak queue khaali na ho: aage se nikaalo, `order` mein daalo, end hai toh ruk jao.
- Har padosi (DIRS): grid ke andar, deewar nahi, visited nahi → visited mark, parent set, queue mein daalo.
- End mein `tracePath(parent, end)` (ready hai).

## Level up
1. **Diagonal moves:** DIRS mein 4 diagonal add karo. Raasta kitna chhota hua?
2. **Kaun zyada mehnat karta hai:** DFS aur BFS ka "visited" compare karo 20 random mazes pe. Kaun zyada kaam karta hai?
3. **Bidirectional BFS:** S aur E dono se lehar chalao, beech mein milo. Visited kitne kam hue?
4. **Weighted maze:** kuch cells "keechad" (cost 5). Ab BFS galat kyun? (Hint: Dijkstra, aane wala episode.)
