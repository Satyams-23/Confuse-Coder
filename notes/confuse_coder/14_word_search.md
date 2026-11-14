# Grid mein 'ABCB' hai? Mera code: haan. Sahi: nahi (Word Search): Notes
*@confuse__coder · Recursion EP 14 (season finale) · Comment "NOTES" → ye notes + Word Puzzle Solver project + Recursion revision sheet DM mein*

---

## 1. Problem kya hai?
Letters ka grid hai. Ek word dhoondhna hai. Word ke letters **upar / neeche / left / right** jude hone chahiye, aur **ek khaana sirf ek baar** use ho sakta hai.
```
A B C E
S F C S
A D E E
```
- `ABCCED` → **haan**
- `SEE` → **haan**
- `ABCB` → **nahi** (poore grid mein B sirf **ek** hai, toh B do baar kaise aayega?)

---

## 2. Trick: grid pe backtracking
1. Pehla letter (A) dhoondho. Har aisa khaana ek starting point hai.
2. Wahan se **chaaron taraf** dekho: upar, neeche, left, right.
3. Agla letter mila? Us khaane pe chalo.
4. Nahi mila (ya grid se bahar)? **Wapas aao**, doosra raasta try karo.

Ye wahi backtracking hai jo N-Queens / Sudoku mein ki thi. Bas ab hum grid pe chal rahe hain.

---

## 3. Code: teen cheezein
```cpp
bool dfs(vector<vector<char>>& g, string& w, int r, int c, int k) {
    if (k == w.size()) return true;                                   // FOUND
    if (r < 0 || c < 0 || r >= g.size() || c >= g[0].size() || g[r][c] != w[k])
        return false;                                                  // OUT / NO MATCH
    char ch = g[r][c];
    g[r][c] = '#';                                                     // fix line 1: MARK
    bool ok = dfs(g, w, r+1, c, k+1) || dfs(g, w, r-1, c, k+1)        // 4 DIRECTIONS
           || dfs(g, w, r, c+1, k+1) || dfs(g, w, r, c-1, k+1);
    g[r][c] = ch;                                                      // fix line 2: UNMARK
    return ok;
}

bool exist(vector<vector<char>>& g, string w) {
    for (int r = 0; r < g.size(); r++)
        for (int c = 0; c < g[0].size(); c++)
            if (dfs(g, w, r, c, 0)) return true;
    return false;
}
```

**Python**
```python
def dfs(g, w, r, c, k):
    if k == len(w): return True
    if r < 0 or c < 0 or r >= len(g) or c >= len(g[0]) or g[r][c] != w[k]: return False
    ch, g[r][c] = g[r][c], '#'
    ok = dfs(g, w, r+1, c, k+1) or dfs(g, w, r-1, c, k+1) or dfs(g, w, r, c+1, k+1) or dfs(g, w, r, c-1, k+1)
    g[r][c] = ch
    return ok
```

---

## 4. Woh do lines (reel ka bug)
Bina mark ke code bolta hai `ABCB` **mil gaya**:
```
A(0,0) -> B(0,1) -> C(0,2) -> B(0,1)   <- wahi B dobara!
```
Code ko yaad hi nahi tha ki B pe pehle aa chuke hain.

**Line 1 (mark):** khaane pe aao toh `g[r][c] = '#'`. Ab koi letter `#` se match nahi karega → dobara nahi aa sakte.
**Line 2 (unmark):** wapas jaate waqt `g[r][c] = ch`. Warna **doosra raasta** (doosra starting point / doosri direction) us khaane ko use hi nahi kar paayega, aur grid bhi kharab ho jaayega.

Alag `visited[][]` array bhi chalega. `#` trick bas extra memory bachata hai.

---

## 5. Complexity
- Time: O(R × C × 4^L) worst case (har khaane se start, har step pe 4 raaste, L = word length). Mark ki wajah se asal mein 3^L (jahan se aaye wahan wapas nahi jaate).
- Space: O(L) recursion depth.

---

## 6. Common galtiyan
1. Mark nahi kiya → same khaana do baar (reel wala bug, `ABCB` true aa jaata hai).
2. Mark kiya par unmark bhool gaye → doosre starting point se sahi raasta bhi block ho jaata hai.
3. Bounds check **letter check se pehle** karo, warna index out of range.
4. Return `true` aate hi unmark skip ho gaya (early return se pehle grid restore karo, jaise upar `ok` variable mein rakha).

---

## 7. Recursion season: revision sheet (EP 01–14)
| EP | Topic | Yaad rakho |
|---|---|---|
| 01 | Recursion | Bada kaam = wahi kaam, thoda chhota, baar baar |
| 02 | Base case | Recursive call manzil ki taraf le jaata hai, base case batata hai manzil aa gayi |
| 03 | Call stack | Call ke neeche likha kaam = wapas aate waqt, ulte order mein |
| 04 | Stack overflow | Base case har input ke liye reachable hona chahiye |
| 05 | Recursion tree | Asli villain recursion nahi, same kaam dobara karna hai |
| 06 | Memoization | Thodi memory do, bahut saara time bachao |
| 07 | Tabulation | Upar se poochna = memo, neeche se banana = tabulation |
| 08 | Take / skip | Lo toh daalo aur aage jao, chhodo toh nikaalo aur aage jao |
| 09 | Permutations | Subsets = 2ⁿ (order nahi), permutations = n! (order matter) |
| 10 | N-Queens | Choose → explore → unchoose, unsafe ho toh explore hi mat karo |
| 11 | Sudoku | Saare answers → print karke aage. Ek answer → true milte hi return |
| 12 | Merge sort | Todna free hai, asli kaam merge mein. log n levels × n = n log n |
| 13 | Combination sum | Wahi coin dobara, par loop start se, peeche mat mudo |
| 14 | Word search | Khaane pe aao toh mark, wapas jao toh unmark |

**Recursion ka ek template:** base case → choose → explore (recursion) → un-choose.

---

## 8. Practice questions
1. **LeetCode 79** – Word Search (yahi reel)
2. **LeetCode 200** – Number of Islands (same grid DFS, graphs ka pehla sawaal)
3. **LeetCode 733** – Flood Fill
4. **LeetCode 212** – Word Search II (bahut saare words → Trie)
5. **LeetCode 695** – Max Area of Island

**Quiz (pinned comment):** isi grid mein "SEE" hai ya nahi? (Answer next reel mein: **haan** → S(1,3) → E(2,3) → E(2,2))

---

## 9. Project: Newspaper Word Puzzle Solver
Letter grid + word list. Har word ka raasta grid pe highlight karke print karo. Sirf `dfs()` khud likho (~15 lines). Python + C++, starter + solution + tests.
→ `viewer-projects/04_word_puzzle_solver/`

**Next season: Graphs.** Aur ye Word Search asal mein graph ka **DFS** hi tha: har khaana ek node, chaaron padosi uske edges.
