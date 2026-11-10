# Leaderboard Merge (Merge Sort)
*@confuse__coder · Recursion EP 12 (Merge Sort) ka project*

Do game servers ke leaderboard **ek** mein jodo, phir khud ka **merge sort** likho,
aur last mein bubble sort se **race** karwao. Comparisons khud gino.

---

## Problem
Server A aur Server B dono ke scores **already sorted** hain (chhota pehle).
1. `merge(left, right)`: dono ko ek sorted leaderboard mein jodo. Reel wali **do ungliyan**.
2. `merge_sort(a)` / `mergeSort(a)`: koi bhi random list sort karo. Reel wale **teen steps**.

## Reel se connection
| Reel | Code |
|---|---|
| Do sorted lists, dono pe ek ungli | `i`, `j` index |
| Jo chhota, woh pehle, ungli aage | `if less(right[j], left[i])` ... `j += 1` |
| Beech se todo, tab tak jab tak 1 number na bache | `m = len // 2`, base case `len <= 1` |
| Left sort, right sort, merge | `merge(merge_sort(L), merge_sort(R))` |
| Recursion pe bharosa | halves kaise sort hue, trace mat karo |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `leaderboard.py` (data, `less()`, bubble race, tests) | `starter.py`: `merge()` + `merge_sort()` (~15 lines) | `solution.py` |
| `cpp/` | `leaderboard.h` (data, `less_()`, bubble race, tests, `main()`) | `starter.cpp`: `merge()` + `mergeSort()` (~18 lines) | `solution.cpp` |

**Rule:** comparison ke liye `less(x, y)` (C++: `less_(x, y)`) use karo, `<` nahi. Isi se race mein comparisons gine jaate hain.

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
Merged  : [117, 185, 233, 396, 414, 466, 488, 533, 642, 706, 898, 949]   (9 comparisons, 12 numbers)
TOP 3:
  #1  Anaya   949
...
  [PASS] merge_sort 5000 random
=== 3. RACE ===
  Bubble sort :  7,998,000 comparisons
  Merge sort  :     42,824 comparisons
TESTS PASSED
```
(C++ ka random data alag hai, isliye numbers alag honge. Bas PASS aana chahiye.)

## Hint (atak gaye toh)
- `merge` mein loop khatam hone ke baad ek list mein numbers **bache** rehte hain. Unhe end mein jodna mat bhoolna.
- Barabar scores pe **left wala pehle** rakho (`less(right[j], left[i])` check karo). Isse sort **stable** rehta hai.
- `merge_sort` mein base case pehle likho, warna infinite recursion → stack overflow (EP 04 yaad hai?).

## Level-up challenges
1. **k servers:** `merge` ko 4 sorted lists ke liye chalao (pairwise merge karo, ya min-heap use karo).
2. **Inversions gino:** merge karte waqt jab right wala pehle jaata hai, kitne left wale bache the? Unka total = "kitne pairs ulte the". (LeetCode style question)
3. **Top-K only:** sirf top 3 chahiye toh poora merge zaroori hai? Kitne comparisons bachte hain?
