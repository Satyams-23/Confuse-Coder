# Topological Sort
*@confuse__coder · Graphs EP 05 · Reel: 6 kapde, 720 tareeke, sahi sirf 61*

---

## 1. Hook ka number
6 kapde pehenne ke **6! = 720** tareeke. Unme se sahi (har "pehle → baad" follow ho) sirf **61**. (Saare 720 Python se check kiye.)

## 2. Problem (interview ka din)
Arrow = "pehle → baad":
```
Shirt → Tie        Shirt → Belt
Pant  → Belt       Pant  → Joote
Mozey → Joote
```
**Topological order** = aisa order jisme har arrow aage ki taraf jaaye (sirf directed graph, bina cycle = DAG).

## 3. Reel ka bug: DFS finish list seedha print kiya
```python
order, seen = [], set()
def dfs(x):
    seen.add(x)
    for nxt in after[x]:
        if nxt not in seen:
            dfs(nxt)
    order.append(x)          # khatam
for x in clothes:            # Shirt, Pant, Belt, Tie, Mozey, Joote
    if x not in seen:
        dfs(x)
print(order)                 # BUG
```
Dry run:
```
dfs(Shirt) → dfs(Tie): kuch nahi → Tie khatam
           → dfs(Belt): kuch nahi → Belt khatam
           Shirt khatam
dfs(Pant)  → dfs(Joote) → Joote khatam ; Pant khatam
dfs(Mozey) → Joote seen ; Mozey khatam
order = [Tie, Belt, Shirt, Joote, Pant, Mozey]   ← tie shirt se pehle, joote mozey se pehle ❌
```

## 4. Kyun ulta? (sabse important line)
DFS mein node tab khatam hota hai jab uske **baad wale saare** pehle hi khatam ho chuke hon.
Toh jo sabse aakhir mein aana chahiye (Tie, Joote), woh **sabse pehle** finish list mein aata hai.
→ Finish list = asli order ka **ulta**. Fix: `order[::-1]`
```
Mozey, Pant, Joote, Shirt, Belt, Tie   ✅ (har arrow aage)
```
C++: `reverse(order.begin(), order.end());`

## 5. Kahn's algorithm (doosra tareeka, BFS jaisa)
"Jiske pehle kuch nahi, use pehle uthao."
```python
from collections import deque
def kahn(nodes, after):
    indeg = {x: 0 for x in nodes}
    for x in nodes:
        for y in after[x]:
            indeg[y] += 1
    q = deque(x for x in nodes if indeg[x] == 0)
    order = []
    while q:
        x = q.popleft()
        order.append(x)
        for y in after[x]:
            indeg[y] -= 1
            if indeg[y] == 0:
                q.append(y)
    return order if len(order) == len(nodes) else None   # None = cycle
```
Kapdon pe: indegree Shirt 0, Pant 0, Mozey 0, Tie 1, Belt 2, Joote 2 → order Shirt, Pant, Mozey, Tie, Belt, Joote ✅ (ye bhi sahi, 61 mein se ek).

| | DFS + reverse | Kahn |
|---|---|---|
| Idea | finish list ulti | indegree 0 pehle |
| Cycle pata kaise | EP 04 wala gray check | `len(order) < V` |
| Bonus | — | "din / level" mil jaate hain (parallel kaam) |

## 6. Cycle ho toh?
Topological order **tabhi** hota hai jab graph mein cycle na ho. EP 04 ka Total ⇄ Subtotal: koi order nahi. Pehle cycle check, phir order.

## 7. Kahan kaam aata hai
Course schedule (prerequisites), build systems (pehle dependency compile), spreadsheet calculation order (EP 04 ka bill), package install order, task scheduling.

## 8. Complexity
Time **O(V + E)** (dono tareeke), Space O(V).

## 9. Ek se zyada sahi answer
Topo order unique nahi hota. Yahan 61 sahi orders hain. Interview / LeetCode mein koi bhi valid order chalta hai (jab tak problem "smallest" na maange).

---

## Practice (LeetCode)
- **210** Course Schedule II (order return karo)
- **207** Course Schedule (revision: order possible hai?)
- **1136** Parallel Courses (Kahn levels = semesters)
- **269** Alien Dictionary (letters ka order)

## Project: Shaadi Planner
[Shaadi Planner](https://www.confuse-coder.site/projects/15_shaadi_planner) · Python + C++ · tum likhoge sirf `topo_days()` (Kahn) · har din ke kaam + gol chakkar mein phanse kaam.

## Pinned quiz
A→C, B→C, C→D. Kitne sahi topological order hain? (Answer next reel mein.)
