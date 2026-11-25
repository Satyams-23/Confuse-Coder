# Union-Find (Disjoint Set Union)
*@confuse__coder · Graphs EP 07 · Reel: 2 families, code bola 3 tables*

Kaun kis group mein hai, yeh baar baar pucha jaaye aur naye rishte judte jaayein, toh har baar DFS mat chalao. DSU: har group ka ek leader, `find` aur `union`, reel wala 2-shabd ka bug, aur path compression.

---

## 1. Problem (shaadi ki seating)
8 mehmaan, pairs = ek family:
```
Riya–Kabir, Sam–Tara, Kabir–Sam, Meera–Dev, Riya–Aditi, Arjun–Dev
```
Sahi jawab: **2 families** → {Riya, Kabir, Sam, Tara, Aditi}, {Meera, Dev, Arjun} → 2 tables.

## 2. Idea
- `parent[x]`: shuru mein `parent[x] = x` (har koi apna leader).
- **find(x)**: parent ke parent ke... jab tak `parent[x] == x` (leader).
- **union(a, b)**: ek family ka **leader** doosri family ke **leader** ke neeche.
- Groups = jitne leaders.

## 3. Dry run
| Pair | Kya hua |
|---|---|
| Riya–Kabir | Riya → Kabir |
| Sam–Tara | Sam → Tara |
| Kabir–Sam | find(Kabir) = Kabir, find(Sam) = Tara → Kabir → Tara |
| Meera–Dev | Meera → Dev |
| Riya–Aditi | find(Riya) = Tara → Tara → Aditi |
| Arjun–Dev | Arjun → Dev |

Leaders: Aditi, Dev → **2**.

## 4. Reel ka bug: `parent[a] = b`
```python
for a, b in pairs:
    parent[a] = b        # BUG: seedha parent badal diya
```
Riya ka parent pehle Kabir tha. Riya–Aditi aaya → Riya ka parent Aditi. **Kabir wala dhaaga kat gaya.**
Groups: {Riya, Aditi}, {Kabir, Sam, Tara}, {Meera, Dev, Arjun} → **3 tables**.
Fix (2 shabd): `parent[find(a)] = find(b)`.
(Yeh bug tab chhupta hai jab koi "a" do baar na aaye; jaise 1–2, 3–4, 2–3, 5–6 pe dono 2 bolenge.)

## 5. Code (Python)
```python
parent = {g: g for g in guests}
size = {g: 1 for g in guests}

def find(x):
    root = x
    while parent[root] != root:
        root = parent[root]
    while parent[x] != root:          # path compression
        parent[x], x = root, parent[x]
    return root

def union(a, b):
    ra, rb = find(a), find(b)
    if ra == rb:
        return False                  # pehle se ek family (undirected cycle!)
    if size[ra] < size[rb]:
        ra, rb = rb, ra
    parent[rb] = ra                   # chhoti → badi ke neeche
    size[ra] += size[rb]
    return True
```

## 6. Path compression + union by rank
- Bina compression: 1 lakh log ek line mein → `find` = **99,999 kadam**.
- Compression: find ke raste ke sab log seedha leader ke neeche → agli baar **1 kadam**.
- Union by rank/size: chhoti family badi ke neeche, tree gehra nahi hota.
- Dono saath: har operation amortized **O(α(n))**, α(n) ≤ 4 practically → lagbhag O(1).

## 7. Kahan use hota hai
- Kruskal's MST (edge cycle banayegi? `union` False)
- Network connectivity: "ye do computer connected?"
- Number of Provinces, Accounts Merge, Redundant Connection

## Practice
- LeetCode 547 Number of Provinces
- 684 Redundant Connection
- 721 Accounts Merge
- 1319 Number of Operations to Make Network Connected

**Project:** Shaadi Seating (sirf `find()` aur `union()` likho; tables + "ek family?" + 1 lakh chain ka kadam count).
