# UPI Change Maker (Combination Sum)
*@confuse__coder · Recursion EP 13 (Combination Sum) ka project*

Chai tapri pe ₹8 ka bill hai aur galle mein sirf ₹2, ₹3, ₹5 ke coins.
Saare tareeke print karo jinse bill pay ho sakta hai, aur shopkeeper ka favourite (kam se kam coins) bhi batao.
Bas ek function tum likhoge: `backtrack()`.

---

## Problem
Bill amount aur coins diye hain. Har coin **kitni bhi baar** use ho sakta hai.
Har alag combination ek hi baar print hona chahiye (`2 3 3`, `3 2 3`, `3 3 2` = **ek hi** tareeka).

## Reel se connection
| Reel | Code |
|---|---|
| Amount zero? Answer mil gaya, print karo | `if amt == 0: out.append(path[:])` |
| Amount minus mein? Ruko, wapas jao | `if amt < 0: return` |
| Har coin try karo. Lo, aage jao, phir hatao | `append` → `backtrack(...)` → `pop` |
| Wahi coin dobara le sakte ho | recursion mein `i` bhejo, `i + 1` nahi |
| **Loop zero se nahi, start se chalao** | `for i in range(start, len(coins))` |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `upi.py` (data, printing, tests) | `starter.py`: `backtrack()` (~10 lines) | `solution.py` |
| `cpp/` | `upi.h` (data, printing, tests, `main()`) | `starter.cpp`: `backtrack()` (~10 lines) | `solution.cpp` |

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
=== 1. CHAI TAPRI (reel wala) ===
Bill Rs8, galla mein coins [2, 3, 5]
  1. Rs2 + Rs2 + Rs2 + Rs2
  2. Rs2 + Rs3 + Rs3
  3. Rs3 + Rs5
Shopkeeper ka favourite (kam se kam coins): Rs3 + Rs5  (2 coins)
Total: 3 tareeke

=== 2. TESTS ===
  [PASS] Rs8 with 2,3,5 = 3 tareeke
  [PASS] koi duplicate nahi (2 3 3 / 3 2 3 / 3 3 2 = ek hi)
  [PASS] Rs4 with 1,2 = 3 tareeke (pinned comment wala)
  [PASS] Rs7 with 2,4 = 0 tareeke (odd bill, even coins)
  [PASS] Rs50 with 1,2,5,10,20 = 450 tareeke
  [PASS] har tareeke ka total = bill

TESTS PASSED
```
Agar tumhe **6 tareeke** mil rahe hain (`2 3 3`, `3 2 3`, `3 3 2`...), toh tumne bhi reel wali galti ki hai: loop `0` se chal raha hai. 😉

## Hint (atak gaye toh)
1. Pehle do `if`: zero → copy daalo, minus → return.
2. Phir `for i` **start** se. Andar: coin lo, `backtrack(amt - coin, i, ...)`, coin hatao.
3. Copy zaroori hai: `out.append(path[:])` (C++ mein `push_back(path)` khud copy karta hai).

## Level up
- **Limited coins:** galle mein har coin sirf ek-ek hai (`[2, 3, 3, 5]`). Ab recursion mein `i + 1` bhejo, aur same level pe same coin skip karo (LeetCode 40).
- **Sirf count chahiye:** list mat banao, sirf gino. Phir DP se karo (LeetCode 518) aur dono ka time compare karo.
- **Max coins limit:** "3 se zyada coins nahi" wala rule jodo (`len(path) > 3` → return). Yahi pruning hai.

## Practice
LeetCode 39 Combination Sum · 40 Combination Sum II · 216 Combination Sum III · 518 Coin Change II
