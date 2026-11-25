# Shaadi Seating (Union-Find / DSU)
*@confuse__coder · Graphs EP 07 (Union-Find) ka project*

Shaadi ke mehmaan aur unke rishte pairs mein. Tum likhoge DSU jo bataye **kitni tables** lagengi, **kaun kis table** pe, aur "ye do log ek family?" ka jawab.
Bonus: 1 lakh logon ki lambi chain pe path compression ka asar khud gino.
Tum sirf do functions likhoge: `find()` aur `union()`.

---

## Problem
- `DSU(items)`: `parent[x] = x` (sab khud apne leader), `size[x] = 1`
- `find(x)` → x ka leader. Har "upar chalo" pe `self.steps += 1`. Path compression karo.
- `union(a, b)` → families jodo; pehle se ek family ho toh `False`. Chhoti family badi ke neeche.

## Reel se connection
| Reel | Code |
|---|---|
| Har family ka ek leader | `find(x)` = leader |
| Bug: `parent[a] = b` → Riya–Kabir ka dhaaga kata, 3 tables | `parent[find(a)] = find(b)` |
| 1 lakh ki chain: 99,999 kadam | `chain_test()`: pehla find 99,999, doosra 1 |
| Union by rank | `size` se chhoti → badi ke neeche |
| Har operation lagbhag O(1) | amortized α(n) |

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `seating.py` | `starter.py` | `solution.py` |
| `cpp/` | `seating.h` | `starter.cpp` | `solution.cpp` |

## Run
```bash
cd python
python starter.py
python test_seating.py starter     # 9 tests
```
```bash
cd cpp
g++ -std=c++17 starter.cpp -o starter && ./starter
```

## Sahi output
```
=== Reel ki shaadi ===
  Tables: 2
  Table 1: Riya, Kabir, Sam, Tara, Aditi
  Table 2: Meera, Dev, Arjun
  Riya aur Kabir ek family? haan
  Riya aur Dev ek family? nahi

=== Badi shaadi ===
  Tables: 4
  Table 1: Dadi, Papa, Mummy, Chacha, Chachi, Bunty, Pinky
  Table 2: Nanaji, Mama, Mami, Golu
  Table 3: Rohan, Sneha
  Table 4: Ishaan
  Pinky aur Mummy ek family? haan
  Golu aur Papa ek family? nahi

=== 1 lakh ki chain ===
  pehla find(0): 99,999 kadam
  doosra find(0): 1 kadam
```
(C++ mein number bina comma: 99999.)

## Try karo
1. Reel wala bug likho (`parent[a] = b`) aur dekho reel ki shaadi mein 3 tables aati hain.
2. Path compression hata do: doosra find bhi 99,999 kadam.
3. Undirected graph mein cycle: `union()` False de toh woh edge cycle banati hai (LeetCode 684).
