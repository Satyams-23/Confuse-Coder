# 4 Queens, 1 board = kitne tareeke? (N-Queens, Backtracking): Notes
*@confuse__coder · Recursion EP 10 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
4×4 chessboard pe 4 queens bithani hain, aur koi queen kisi doosri ko maar na sake:
na same **row**, na same **column**, na same **diagonal**.
Har tareeka try karo toh C(16, 4) = **1,820** placements. Sahi jawab: sirf **2**.
Toh 1,820 kyun check karein?

---

## 2. Concept, simple words mein
**Maze** socho. Galat gali mein ghuse, aage deewar. Poora maze shuru se nahi karte,
bas **pichhle mod pe wapas** jaate ho aur agla raasta lete ho. Yahi hai **Backtracking**:
choice karo → aage explore karo → fail hua toh **choice undo** karo → agli choice.

N-Queens mein:
- Har **row** mein ek hi queen (warna same row mein clash). Toh sawaal bas itna: is row mein queen **kaunse column** mein?
- Row 1 mein safe column chuno, row 2 pe jao, ... koi row mein ek bhi safe khaana nahi? **Dead end** → pichhli row pe wapas, wahan ki queen aage khiskao.

**Pruning** = unsafe raasta shuru hote hi kaat do. Us branch ke neeche ka poora tree kabhi banta hi nahi.

---

## 3. Code, line by line
```cpp
int n = 4;
vector<string> board(n, string(n, '.'));

bool isSafe(int row, int col) {
    for (int r = 0; r < row; r++) {                      // sirf upar wali rows check karo
        if (board[r][col] == 'Q') return false;          // same column
        int d = row - r;
        if (col - d >= 0 && board[r][col - d] == 'Q') return false;  // left diagonal
        if (col + d < n  && board[r][col + d] == 'Q') return false;  // right diagonal
    }
    return true;
}

void solve(int row) {
    if (row == n) { print(board); return; }   // 1. BASE: saari rows bhar gayi, ek answer
    for (int col = 0; col < n; col++) {       // 2. TRY: har column
        if (!isSafe(row, col)) continue;      //    PRUNING: unsafe? aage mat jao
        board[row][col] = 'Q';                //    queen rakho
        solve(row + 1);                       //    agli row
        board[row][col] = '.';                // 3. UNDO: queen uthao
    }
}
// call: solve(0);
```

| Part | Matlab |
|---|---|
| `row` | Abhi kaunsi row ki queen decide ho rahi hai |
| `row == n` | Saari queens safe baith gayi → ek solution |
| `if (!isSafe) continue` | Pruning: clash hai toh is column ka poora subtree skip |
| `board = 'Q'` + `solve(row+1)` | Choice karo aur aage jao |
| `board = '.'` | Wapas aate hi choice undo (backtrack) |

---

## 4. Flow: 4×4 pe dead end aur backtrack
```
row 0: Q at col 0                .  safe
row 1: col 0 ✗ col 1 ✗ col 2 ✓   →  Q at (1,2)
row 2: col 0 ✗ col 1 ✗ col 2 ✗ col 3 ✗   → DEAD END
       ↩ back to row 1, Q moves (1,2) → (1,3)
row 2: col 0 ✗ col 1 ✓           →  Q at (2,1)
row 3: sab ✗                      → DEAD END → ... wapas
       ... (0,0) se koi answer nahi, row 0 queen → col 1
Answer 1:  .Q..   Answer 2:  ..Q.
           ...Q              Q...
           Q...              ...Q
           ..Q.              .Q..
```
Pehli level pe hi: row 1 ke 16 (row0, row1) pairs mein se sirf **6** safe. Baaki 10 branches wahin kat gayi.

---

## 5. isSafe ko O(1) kaise karein? (notes ka bonus)
Upar wala `isSafe` har baar O(n) loop chalata hai. Teen boolean arrays rakho:
- `colUsed[c]`
- `diag1[r - c + n - 1]`  (ek "\" diagonal pe `r - c` same rehta hai)
- `diag2[r + c]`          (ek "/" diagonal pe `r + c` same rehta hai)

Queen rakho → teeno `true`; uthao → teeno `false`. Ab check = 3 array lookups = **O(1)**.

---

## 6. Interview gotchas
1. **Count:** 4 → 2, 5 → 10, 6 → 4, 8 → **92**. 2×2 aur 3×3 pe **0** solutions (n = 1 pe 1).
2. **Kitna kaam bachta hai:** 8×8 pe C(64, 8) = 4,42,61,65,368 placements. Backtracking sirf ~15,720 queen placements explore karta hai.
3. **Undo bhoole** (`board = '.'`) toh purani queen board pe reh jaati hai, aage ki rows galat "unsafe" dikhti hain → answers kam aate hain.
4. **Sirf count chahiye** (LeetCode 52)? Board banane ki zaroorat nahi, teen arrays + counter kaafi hain. Ek answer chahiye? Pehla mila toh `return true` karke ruk jao.
5. **Same template, alag problems:** Sudoku Solver, Rat in a Maze, Word Search, Combination Sum: sab "choose → explore → unchoose + pruning" hai.

---

**One-line:** Har row mein queen rakho, sirf jahan safe ho. Raasta band? Ek kadam peechhe, agla column.
Next episode: **Sudoku Solver**, same trick 9×9 pe. Follow karo @confuse__coder ♛
