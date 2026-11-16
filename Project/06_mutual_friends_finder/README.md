# Mutual Friends Finder (Graph + Adjacency List)
*@confuse__coder · Graphs EP 01 (What is a Graph) ka project*

Instagram ka "Suggested for you" kaise banta hai? Dost ke dost se.
Ek college friend group diya hai. Tum uska **graph** banaoge (adjacency list), aur har insaan ke liye
"Suggested for you" nikaaloge, jisme sabse zyada mutual friends wala sabse upar ho.
Bas do functions tum likhoge: `add_edge()` aur `suggest()`.

---

## Problem
- Har insaan = **node**. Do log dost = **edge**. Dosti **dono taraf** hoti hai (undirected graph).
- `add_edge(adj, u, v)`: dosti graph mein daalo. `adj` = naam → uske dosto ki list.
- `suggest(adj, who)`: dost ke dost, jo
  - khud `who` nahi hain,
  - aur pehle se `who` ke dost nahi hain.
  Order: zyada mutual friends pehle, tie ho toh naam A-Z.

## Reel se connection
| Reel | Code |
|---|---|
| Har node ki ek list, usmein uske saare padosi | `adj[u]` = u ke dost |
| Code ne Riya ki list mein Kabir daala | `adj[u].push_back(v)` |
| **Fix:** ulti taraf bhi add karo | `adj[v].push_back(u)` |
| Instagram follow = directed (ek taraf) | yahan dosti hai, isliye dono taraf |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `friends.py` (data, printing, tests) | `starter.py`: `add_edge()` + `suggest()` | `solution.py` |
| `cpp/` | `friends.h` (data, printing, tests, `main()`) | `starter.cpp`: `addEdge()` + `suggest()` | `solution.cpp` |

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
=== 1. ADJACENCY LIST ===
  Aman   -> Riya, Zoya
  Kabir  -> Riya, Tara, Zoya
  Neel   -> Sam, Tara
  Riya   -> Aman, Kabir, Sam
  Sam    -> Neel, Riya, Tara
  Tara   -> Kabir, Neel, Sam
  Zoya   -> Aman, Kabir

=== 2. MUTUAL FRIENDS ===
  Riya + Tara: Kabir, Sam
  Kabir + Sam: Riya, Tara

=== 3. SUGGESTED FOR YOU ===
  Kabir: Aman (2 mutual), Sam (2 mutual), Neel (1 mutual)
  Zoya: Riya (2 mutual), Tara (1 mutual)

=== 4. TESTS ===
  ... 7 x [PASS]
TESTS PASSED
```

## Hint (atke toh hi padhna)
- `add_edge`: naya naam ho toh pehle khaali list. Phir `u → v` **aur** `v → u`. Sirf ek likha toh Kabir ke dost mein Riya nahi aayegi (reel wala bug).
- `suggest`: `who` ke har dost `f` pe jao, phir `f` ke har dost `ff` pe. Agar `ff` na `who` hai na pehle se dost, toh `count[ff] += 1`. Ye count hi mutual friends hai. End mein count ke hisaab se sort karo.

## Level up
1. **Directed version:** `FOLLOWS` list banao (Instagram). `add_follow(u, v)` sirf ek taraf. "Follow back nahi karta" wale log print karo.
2. **Degree:** sabse zyada dost kiske hain? (har list ki length)
3. **2 step door:** Kabir se kaun exactly 2 dosti door hai? (Agle episode ka BFS isi ke liye hai.)
