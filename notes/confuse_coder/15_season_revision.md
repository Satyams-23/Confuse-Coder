# Recursion revision sheet (EP 01–14)
*@confuse__coder · Recursion EP 15*

---

## 1. Ek line har episode
| EP | Topic | Yaad rakho |
|---|---|---|
| 01 | Recursion | Bada kaam = wahi kaam, thoda chhota, baar baar |
| 02 | Base case | Manzil aa gayi? Ruk jao. Har call manzil ki taraf jaani chahiye |
| 03 | Call stack | Call ke neeche likha kaam = wapas aate waqt, ulte order mein |
| 04 | Stack overflow | Base case tak pahunche hi nahi → crash. Har input ke liye reachable rakho |
| 05 | Recursion tree | Villain recursion nahi, same kaam dobara karna hai |
| 06 | Memoization | Answer yaad rakho, dobara mat nikaalo |
| 07 | Tabulation | Upar se mat poocho, neeche se banao (no recursion, no overflow) |
| 08 | Take / skip | Har cheez pe 2 raaste → 2ⁿ subsets |
| 09 | Permutations | Order matter karta hai → n! |
| 10 | N-Queens | Choose → explore → unchoose. Unsafe ho toh explore hi mat karo |
| 11 | Sudoku | Ek answer chahiye? Milte hi `return true` |
| 12 | Merge sort | Todna free hai, asli kaam merge mein. log n levels × n = n log n |
| 13 | Combination sum | Wahi coin dobara, par loop `start` se, peeche mat mudo |
| 14 | Word search | Khaane pe aao toh mark, wapas jao toh unmark |

**Poora season ek line mein:** base case → choose → explore → unchoose.

---

## 2. Har pattern ka chhota code (Python)

**Base case + chhota kaam (EP 01–04)**
```python
def fact(n):
    if n <= 1: return 1          # base case
    return n * fact(n - 1)       # same kaam, thoda chhota
```

**Memo vs tabulation (EP 05–07)**
```python
from functools import cache
@cache
def fib(n): return n if n < 2 else fib(n-1) + fib(n-2)   # memo: upar se

def fib_tab(n):                                          # tabulation: neeche se
    a, b = 0, 1
    for _ in range(n): a, b = b, a + b
    return a
```

**Take / skip (EP 08)**
```python
def subsets(i, cur, nums, out):
    if i == len(nums): out.append(cur[:]); return
    cur.append(nums[i]); subsets(i+1, cur, nums, out); cur.pop()   # take
    subsets(i+1, cur, nums, out)                                   # skip
```

**Choose → explore → unchoose (EP 09–11, 13, 14)**
```python
def backtrack(state):
    if done(state): record(state); return      # Sudoku: return True yahin
    for choice in choices(state):
        if not safe(state, choice): continue   # N-Queens pruning
        make(state, choice)                    # choose  (Word Search: mark)
        backtrack(state)                       # explore
        undo(state, choice)                    # unchoose (Word Search: unmark)
```
Combination Sum: `for i in range(start, len(coins))` aur recursion `i` se (wahi coin dobara, peeche nahi).

**Divide & conquer (EP 12)**
```python
def merge_sort(a):
    if len(a) <= 1: return a
    m = len(a) // 2
    return merge(merge_sort(a[:m]), merge_sort(a[m:]))   # asli kaam merge mein
```

---

## 3. Chupa hua episode: EP 14 = Graph
Word Search mein har khaana ek **node** tha, aur upar / neeche / left / right padosi uske **edges**. Mark/unmark = `visited`. Yahi graph ka **DFS** hai. Next season: **Graphs**.

---

## 4. Season ke projects
1. College Timetable (EP 11) → [College Timetable Generator](https://www.confuse-coder.site/projects/01_college_timetable)
2. Leaderboard Merge (EP 12) → [Leaderboard Merge](https://www.confuse-coder.site/projects/02_leaderboard_merge)
3. UPI Change Maker (EP 13) → [UPI Change Maker](https://www.confuse-coder.site/projects/03_upi_change_maker)
4. Newspaper Word Puzzle Solver (EP 14) → [Newspaper Word Puzzle Solver](https://www.confuse-coder.site/projects/04_word_puzzle_solver)

---

## 5. Practice (season ka ek sawaal har pattern se)
509 Fibonacci · 70 Climbing Stairs · 78 Subsets · 46 Permutations · 51 N-Queens · 37 Sudoku Solver · 39 Combination Sum · 79 Word Search

**Quiz (pinned comment):** fib(5) bina memo ke chalao. fib(2) kitni baar call hoga? (Answer: **3 baar**. Isliye memoization.)
