# Duniya ka sabse mushkil Sudoku = 1 second? (Sudoku Solver, Backtracking): Notes
*@confuse_coder · Recursion EP 11 · Comment "NOTES" → ye notes + Timetable starter project + practice questions DM mein*

---

## 1. Problem kya hai?
"World's hardest Sudoku" (Arto Inkala, 2012) mein sirf **21** numbers diye hain, **60** khaane khaali.
Har khaane mein 9 options → sab try karo toh 9⁶⁰ ≈ 1.8 × 10⁵⁷ (ek ke baad 57 zero).
Backtracking ise ek second se kam mein solve kar deta hai.

---

## 2. Concept, simple words mein
1. Pehla **khaali khaana** pakdo.
2. 1 se 9 tak har number try karo.
3. Number **tabhi** rakho jab woh **safe** ho: na uski row mein, na column mein, na uske 3×3 box mein.
4. Rakha → agle khaali khaane pe chalo (recursion).
5. Kisi khaane mein ek bhi number fit nahi? **Dead end** → pichhla number mitao, agla try karo.

N-Queens se farq: wahan **saare** answers print kiye. Sudoku mein **ek** answer kaafi hai, toh mila aur **ruk jao**.

---

## 3. Code, line by line
```cpp
int grid[9][9];   // 0 = khaali

bool isSafe(int r, int c, int d) {
    for (int i = 0; i < 9; i++) {
        if (grid[r][i] == d) return false;                   // row
        if (grid[i][c] == d) return false;                   // column
        if (grid[3*(r/3) + i/3][3*(c/3) + i%3] == d) return false;  // 3x3 box
    }
    return true;
}

bool solve() {
    for (int r = 0; r < 9; r++)
        for (int c = 0; c < 9; c++)
            if (grid[r][c] == 0) {                       // pehla khaali khaana
                for (int d = 1; d <= 9; d++) {           // 2. TRY 1..9
                    if (!isSafe(r, c, d)) continue;      //    pruning
                    grid[r][c] = d;                      //    rakho
                    if (solve()) return true;            //    TWIST: aage se true? turant ruk jao
                    grid[r][c] = 0;                      // 3. UNDO: mitao
                }
                return false;                            // koi number fit nahi → dead end
            }
    return true;                                         // 1. BASE: koi khaali nahi → solved
}
```

| Part | Matlab |
|---|---|
| `grid[r][c] == 0` | Khaali khaana mila, isi pe decision lena hai |
| `isSafe(r, c, d)` | Row + column + box mein d pehle se toh nahi? |
| `if (solve()) return true;` | **Twist**: neeche se true aaya matlab poora grid bhar gaya. Ab aur try mat karo, true upar tak bhejo |
| `grid[r][c] = 0` | Wapas aate hi number mitao (backtrack) |
| last `return true` | Ek bhi khaali khaana nahi bacha = solved |

---

## 4. Flow: "true" ka domino
```
solve()  (0,1)=1
 └ solve()  (0,2)=2
    └ solve()  (0,3)=7
       └ ...
          └ solve()  koi khaali nahi → return true
       ← true   ← true   ← true   (har level turant return, koi naya try nahi)
```
Agar `return true` na likho toh solution milne ke baad bhi loop chalta rahega aur `grid = 0` answer ko mita dega!

---

## 5. Bonus: yahi trick, college timetable
| Sudoku | Timetable |
|---|---|
| Khaali khaana | Ek lecture jise jagah chahiye |
| Digits 1–9 | (slot, room) options |
| Row / column / box rule | Teacher / room / section rule |
| Koi digit fit nahi → wapas | Koi slot fit nahi → wapas |

Starter project (DM mein): input, table printing aur tests ready hain. Tumhe sirf `solve()` likhna hai (~15 lines). Output:
```
 9-10  | CSE-A Maths (Rahul)    | CSE-B Chem (Priya)
10-11  | CSE-A Physics (Amit)   | CSE-B Maths (Rahul)
11-12  | CSE-A Chem (Priya)     | CSE-B Physics (Amit)
```

---

## 6. Interview gotchas
1. **Safe check = 20 khaane:** row ke 8 + column ke 8 + box ke 4 bache hue (jo row/column mein nahi aaye).
2. **Box index:** `3*(r/3) + i/3`, `3*(c/3) + i%3` — ek hi loop mein row, column aur box teeno check.
3. **`return true` bhoole** toh answer milne ke baad bhi `grid = 0` chalega aur grid wapas khaali ho jayega.
4. **Speed trick (MRV):** pehla khaali khaana lene ke bajaye woh khaana lo jisme **sabse kam options** hain. Dead ends bahut jaldi pakde jaate hain.
5. **O(1) safe check:** `rowUsed[9][10]`, `colUsed[9][10]`, `boxUsed[9][10]` boolean arrays rakho (N-Queens wala trick).
6. LeetCode: **37. Sudoku Solver** (solve), **36. Valid Sudoku** (sirf check).

---

## Practice ladder (order mein karo)
1. LeetCode 78 – Subsets (take / skip)
2. LeetCode 46 – Permutations (used[] + undo)
3. LeetCode 51 – N-Queens (pruning)
4. LeetCode 37 – Sudoku Solver (ek answer pe ruk jao)
5. LeetCode 79 – Word Search (grid backtracking)

---

**One-line:** Khaali khaana pakdo, 1–9 mein se safe number rakho, aage jao; true aaya toh ruk jao, fail hua toh mitao.
Follow karo @confuse_coder 🧩
