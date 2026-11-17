# Graphs EP 03 · DFS (Depth First Search) · Number of Islands
*@confuse__coder · Graphs season EP 03 · Comment "NOTES" → ye notes + Island Counter project DM mein*

---

## 1. Hook ka fact
Indonesia ke islands ki ginti official sources mein bhi alag alag hai:
- **16,056**: UN ke saath verified naam (2017)
- **17,024**: naam wale islands (BIG, Indonesia ki geospatial agency)
- **17,380**: officially registered (BIG, 2024)
- **17,508**: purana figure (1996 ka law)

(Ye survey / mapping se hota hai, DFS se nahi. Reel ka point: ginna hard hai, aur chhota sa bug bhi galat ginwa deta hai.)

## 2. Problem (reel wala map)
```
1 1 0 0 0 0 0 1 1        A A . . . . . B B
1 0 0 1 1 0 0 0 1        A . . C C . . . B
0 0 0 1 0 0 0 0 0   →    . . . C . . . . .
0 0 0 0 0 0 1 0 0        . . . . . . D . .
1 0 0 0 0 1 1 0 0        E . . . . D D . .
1 1 0 0 0 0 0 0 1        E E . . . . . . F
```
`1` = zameen, `0` = paani. Upar / neeche / left / right jude = ek island. **Sahi answer 6.** Mera code: **3**.

## 3. Galti #1: har zameen ka khaana = island?
16 land cells hain. Har `1` pe count++ kiya toh **16**, galat.
Fix: zameen mile toh **poora island ek baar mein explore karo**, aur explore kiye khaanon ko mark karo.

## 4. DFS = explorer
1. Ek raasta pakdo, jab tak zameen hai aage badho (**gehraai pehle**).
2. Paani ya map ka kinaara → **wapas** aao (recursion return), doosri direction try karo.
3. Har khaane pe **jhanda** gaado (visited), dobara nahi aana.
4. Explorer ruk gaya → ek island poora → `count += 1`.
5. Agla **bina jhande wala** land cell dhoondo → naya island.

| | BFS (EP 02) | DFS (EP 03) |
|---|---|---|
| Kaise failta hai | lehar: paas se door, level by level | ek raasta: aakhir tak, phir wapas |
| Tool | queue | recursion (call stack) / apna stack |
| Kab | shortest path (unweighted) | connected parts, islands, flood fill, cycle, raasta hai ya nahi |

Islands ginne ke liye dono chalte hain; DFS likhna sabse chhota hai.

## 5. Code
**Python**
```python
def dfs(g, r, c):
    if r < 0 or c < 0 or r >= len(g) or c >= len(g[0]) or g[r][c] != '1':
        return
    g[r][c] = '#'          # jhanda (visited)
    dfs(g, r + 1, c)       # neeche
    dfs(g, r - 1, c)       # upar
    dfs(g, r, c + 1)       # right
    dfs(g, r, c - 1)       # left

def num_islands(g):
    count = 0
    for r in range(len(g)):
        for c in range(len(g[0])):
            if g[r][c] == '1':
                count += 1
                dfs(g, r, c)
    return count
```
**C++**
```cpp
void dfs(vector<vector<char>>& g, int r, int c) {
    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return;
    g[r][c] = '#';
    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);
}
int numIslands(vector<vector<char>>& g) {
    int count = 0;
    for (int r = 0; r < (int)g.size(); r++)
        for (int c = 0; c < (int)g[0].size(); c++)
            if (g[r][c] == '1') { count++; dfs(g, r, c); }
    return count;
}
```

## 6. Reel ka bug: Python ka -1 trap (donut)
Mera check tha: `if r >= R or c >= C or g[r][c] != '1': return` → **`r < 0` aur `c < 0` gaayab**.
- Row 0 se upar gaya → `r = -1`. Python mein `g[-1]` = **aakhri row**, error nahi aata.
- Toh upar ka kinaara neeche se jud gaya, left ka right se → map ek **donut (torus)** ban gaya.
- Chaaron kone ke islands (A, B, E, F) ek ho gaye → **6 ki jagah 3**.
- Sirf `r < 0` bhoolo toh **4** (A+E, B+F). Sirf `c < 0` bhoolo toh bhi **4** (A+B, E+F).
- C++ / Java mein `-1` index: Java `ArrayIndexOutOfBoundsException`, C++ undefined behaviour (crash ya kachra). Python chup chaap galat answer deta hai, isliye ye bug sabse khatarnaak hai.

**Fix:** pehle bounds, phir value: `r < 0 or c < 0 or r >= R or c >= C or g[r][c] != '1'`.

## 7. Grid = Graph
- Har khaana = **node**, upar/neeche/left/right wala padosi = **edge**.
- Islands = graph ke **connected components**. Number of Islands = connected components ginna.

## 8. Complexity
- Time **O(R × C)**: har khaana max ek baar paint hota hai (+ har khaane se 4 checks).
- Space **O(R × C)** worst case recursion depth (poora map ek island ho toh). Python default recursion limit 1000 hai, bade map pe `sys.setrecursionlimit` ya iterative DFS (apna stack) / BFS.

## 9. Dry run (island A, order: neeche, upar, right, left)
```
dfs(0,0) jhanda
 ├ neeche dfs(1,0) jhanda
 │   ├ neeche (2,0) paani → wapas
 │   ├ upar (0,0) jhanda hai → wapas
 │   ├ right (1,1) paani → wapas
 │   └ left (1,-1) bahar → wapas
 ├ upar (-1,0) bahar → wapas          ← yahi check gaayab tha!
 ├ right dfs(0,1) jhanda
 │   └ ... sab paani / bahar / jhanda → wapas
 └ left (0,-1) bahar → wapas
Island A = 3 khaane, count = 1
```

---

## Practice (LeetCode)
- **200** Number of Islands (reel wala)
- **695** Max Area of Island (dfs se size return karo)
- **463** Island Perimeter
- **1254** Number of Closed Islands (kinaare wale islands nahi ginne)
- **733** Flood Fill (paint bucket tool = DFS)

## Project: Island Counter
`viewer-projects/13_island_counter/` · Python + C++ · tum likhoge sirf `dfs()` · 9 tests (2 tests donut bug pakadte hain) · bonus: apni satellite photo ke islands gino (`--image`).

## Pinned quiz
Isi map pe sirf `r < 0` bhool jao (`c < 0` check hai). Code kitne islands bolega? (Answer next reel mein.)
