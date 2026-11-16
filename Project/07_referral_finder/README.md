# Referral Finder (BFS + shortest path)
*@confuse__coder · Graphs EP 02 (BFS) ka project*

LinkedIn tumhe "2nd" kaise dikhata hai? BFS se.
Tumhare college + office network ka graph diya hai. Tum likhoge **BFS**, jo batayega har insaan tumse kitni dosti door hai (1st / 2nd / 3rd+),
aur **referral ka sabse chhota raasta**: Google, Amazon, Microsoft mein kis kis se hoke pahunchoge.
Bas do functions tum likhoge: `bfs()` aur `get_path()`.

---

## Problem
- Har insaan = **node**, dosti = **edge** (dono taraf).
- `bfs(adj, start)` → `dist` (kitni dosti door) aur `parent` (kisse pahuncha).
  - Jahan pahunch hi nahi sakte (Om, alag island), woh `dist` mein hona hi nahi chahiye.
- `get_path(parent, target)` → `["Sam", "Dev", "Aditi"]` jaisa raasta.

## Reel se connection
| Reel | Code |
|---|---|
| Lehar ki tarah failo: pehle 1st, phir 2nd | BFS level by level, `dist[nb] = dist[node] + 1` |
| Lehar ko control karti hai ek **queue** | `deque` + `popleft()` / `queue` + `front()` |
| Bug: `pop()` = stack, Aditi 5 aaya | `pop()` lagao aur test "Aditi = 2" fail hoga, try karke dekho |
| Har insaan pe ek hi baar jao | `if nb not in dist` = visited |
| Unweighted graph mein pehli baar = shortest | isliye `dist` dobara update nahi hota |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `network.py` (data, printing, tests) | `starter.py`: `bfs()` + `get_path()` | `solution.py` |
| `cpp/` | `network.h` (data, printing, tests) | `starter.cpp`: `bfs()` + `getPath()` | `solution.cpp` |

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
=== 1. Sam se har insaan kitna door (LinkedIn badge) ===
  Riya     1  1st
  Dev      1  1st      Infosys
  Kabir    2  2nd
  Tara     3  3rd+     TCS
  Meera    3  3rd+
  Aditi    2  2nd      Google
  Neel     2  2nd
  Zoya     3  3rd+     Microsoft
  Arjun    3  3rd+
  Ishaan   4  3rd+     Amazon
  Kavya    4  3rd+     Google
  Om       -  no path  Flipkart

=== 2. REFERRAL ROUTE (sabse kam dosti wala raasta) ===
  Google   : Sam -> Dev -> Aditi  (2 dosti door)
  Amazon   : Sam -> Riya -> Kabir -> Tara -> Ishaan  (4 dosti door)
  Microsoft: Sam -> Riya -> Neel -> Zoya  (3 dosti door)
  Flipkart : koi raasta nahi :(

=== 3. TESTS ===
  ... 9 x [PASS]
TESTS PASSED
```

## Hint (atke toh hi padhna)
- `bfs`: `dist = {start: 0}`, `parent = {start: None}`, queue mein `start`. Jab tak queue khaali na ho: `node = q.popleft()`, uske har padosi `nb` ke liye agar `nb not in dist` toh `dist[nb] = dist[node] + 1`, `parent[nb] = node`, `q.append(nb)`.
- `get_path`: `target` se shuru karo, `parent[target]` pe jaate raho jab tak `None` na aaye. List ulti karo.

## Level up
1. **Bug khud dekho:** `popleft()` ko `pop()` karo. Kaunse tests fail hue? Aditi kitna aaya?
2. **Multi-source BFS:** "Google mein koi bhi" tak sabse chhota raasta, saare Google waalon ko ek saath queue mein daal ke (LeetCode 994 Rotting Oranges jaisa).
3. **Bidirectional BFS:** Sam aur Aditi dono taraf se lehar chalao, beech mein milo. 160 crore logon pe yahi fast hai.
