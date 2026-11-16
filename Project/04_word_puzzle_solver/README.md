# Newspaper Word Puzzle Solver (Word Search)
*@confuse__coder · Recursion EP 14 (Word Search) ka project · Recursion season finale*

Akhbaar wali word puzzle: letters ka grid aur words ki list. Har word grid mein dhoondho
aur uska raasta grid pe **[ ]** se highlight karke print karo.
Bas ek function tum likhoge: `dfs()`.

---

## Problem
Word ke letters grid mein **upar / neeche / left / right** jude hone chahiye (diagonal nahi).
**Ek khaana ek word mein sirf ek baar** use ho sakta hai. Yahi reel wala bug tha.

## Reel se connection
| Reel | Code |
|---|---|
| Poora word mil gaya? True | `if k == len(word): return True` |
| Grid se bahar, ya letter match nahi? False | bounds check + `g[r][c] != word[k]` |
| Warna chaaron direction mein recursion | `dfs(r+1..) or dfs(r-1..) or dfs(..c+1) or dfs(..c-1)` |
| **Fix line 1:** khaane pe aao, toh mark karo | `g[r][c] = '#'` |
| **Fix line 2:** wapas jaate waqt mark hata do | `g[r][c] = ch` |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `puzzle.py` (grid, words, drawing, tests) | `starter.py`: `dfs()` (~15 lines) | `solution.py` |
| `cpp/` | `puzzle.h` (grid, words, drawing, tests, `main()`) | `starter.cpp`: `dfs()` (~15 lines) | `solution.cpp` |

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

## Expected output (solution, short)
```
=== 1. AAJ KA PUZZLE ===

CODE: MILA
    [C][O][D][E] x  s
     q  l  o  o  p  t
...
TREAP: MILA
     c  o  d  e  x  s
     q  l  o  o  p  t
    [T][R][E] e  z  a
     g  r [A][P] h  c
...
QUEUE: nahi mila

LOL: nahi mila

6/8 words mile

=== 2. TESTS ===
  [PASS] ABCCED -> HAAN
  [PASS] SEE -> HAAN
  [PASS] ABCB -> NAHI  (reel wala trap: ek hi B do baar)
  [PASS] STACK -> HAAN
  [PASS] TREAP -> HAAN
  [PASS] QUEUE -> NAHI
  [PASS] LOL -> NAHI  (ek hi L do baar)
  [PASS] unmark: search ke baad grid wapas original

TESTS PASSED
```
`ABCB` ya `LOL` **HAAN** aa raha hai? Mark wali line bhool gaye. 😉
"grid wapas original" FAIL? Unmark wali line bhool gaye.

## Hint (atak gaye toh)
1. Pehle do `if`: `k == len(word)` → True. Bahar / letter galat → False.
2. `ch = g[r][c]`, phir `g[r][c] = '#'`, phir `path.append((r, c))`.
3. `ok = dfs(neeche) or dfs(upar) or dfs(right) or dfs(left)` (sab mein `k + 1`).
4. `g[r][c] = ch`. Agar `ok` False hai toh `path.pop()`. `return ok`.

## Level up
- **Diagonal bhi allowed:** 8 directions karo (`dr, dc` ki list bana ke loop chalao). Kitne naye words milte hain?
- **Number of Islands:** grid mein `1` aur `0`. Wahi dfs, bas word ki jagah "jo bhi `1` hai, mark karte jao". Kitne alag islands? (LeetCode 200)
- **Bahut saare words:** 100 words ke liye har baar dfs slow hai. Trie bana ke ek hi baar grid ghoomo (LeetCode 212).

## Practice
LeetCode 79 Word Search · 200 Number of Islands · 733 Flood Fill · 212 Word Search II
