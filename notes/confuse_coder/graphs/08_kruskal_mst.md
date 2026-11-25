# Kruskal's Algorithm (Minimum Spanning Tree)
*@confuse__coder · Graphs EP 08 · Reel: code bola 20 lakh mein sab jude, Bela gaon andhere mein*

Saare points ko sabse kam kharche mein jodna ho, toh saste wire pehle uthao aur jo wire loop banaye use chhod do. Yahi Kruskal hai, aur check Union-Find karta hai.

---

## 1. Problem (6 gaon, bijli)
6 gaon ko bijli se jodna hai. 9 jagah wire bichh sakta hai (kharcha ₹ lakh mein):
```
Rampur–Sitapur 2   Sitapur–Kheda 3   Rampur–Kheda 4
Kheda–Nandgaon 5   Nandgaon–Dhanpur 6   Rampur–Dhanpur 7
Nandgaon–Bela 8    Sitapur–Bela 9    Dhanpur–Bela 11
```
Sawaal: **sabse kam kharche mein saare gaon jude kaise?**

## 2. Spanning tree aur MST
- **Spanning tree**: aise wire chuno ki har gaon juda ho aur koi loop na bane.
- n gaon → hamesha **n − 1 wire**. 6 gaon → 5 wire.
- **MST (Minimum Spanning Tree)**: sab spanning trees mein sabse sasta.

Sab try kyun nahi? Agar har gaon har gaon se jud sake, toh tareeke = n^(n−2) (Cayley's formula). 10 gaon pe **10^8 = 10 crore**. Hamare 9-wire map pe 75 spanning trees hain, aur sabse sasta sirf ek (₹24 lakh), brute force se check kiya.

## 3. Kruskal: rule ek
1. Saare wire **saste se mehenge** sort karo.
2. Ek ek uthao. Wire do **alag groups** ko jodta hai → lagao.
3. Dono gaon **pehle se jude** hain → chhod do (warna loop).
4. n − 1 wire ho gaye → ruk jao.

"Pehle se jude?" ka jawab [Union-Find](https://www.confuse-coder.site/notes/dsa/graphs-07_union_find) deta hai: `find(u) == find(v)` matlab dono ka mukhiya same, matlab already jude.

## 4. Code
```python
def kruskal(gaon, wires):
    d = DSU(gaon)              # EP 07 wala find + union
    chosen, skipped = [], []
    for a, b, w in sorted(wires, key=lambda x: x[2]):
        if d.find(a) != d.find(b):
            d.union(a, b)
            chosen.append((a, b, w))
            if len(chosen) == len(gaon) - 1:
                break
        else:
            skipped.append((a, b, w))
    return chosen, skipped
```
C++ mein same: `stable_sort` by weight, phir wahi `if (find(a) != find(b))`.

## 5. Dry run
| Wire | Kharcha | Faisla | Total |
|---|---|---|---|
| Rampur–Sitapur | 2 | lagao | 2 |
| Sitapur–Kheda | 3 | lagao | 5 |
| Rampur–Kheda | 4 | chhodo (Sitapur ke through jude) | 5 |
| Kheda–Nandgaon | 5 | lagao | 10 |
| Nandgaon–Dhanpur | 6 | lagao | 16 |
| Rampur–Dhanpur | 7 | chhodo (already jude) | 16 |
| Nandgaon–Bela | 8 | lagao | **24** |

5 wire, **₹24 lakh**, saare 6 gaon roshan. Sitapur–Bela (9) aur Dhanpur–Bela (11) dekhne ki zaroorat hi nahi.

## 6. Reel ka bug: ek `if` gayab
Mere code mein `if d.find(a) != d.find(b):` tha hi nahi, bas `len == n − 1` pe ruk jaata tha. Toh usne saste se saste 5 wire utha liye:
```
2, 3, 4, 5, 6  → total 20
```
- Rampur–Kheda (₹4L) lag gaya: Rampur–Sitapur–Kheda ka **gol ghera**, bekaar wire.
- 5 wire wahin khatam, **Bela tak koi wire nahi**.
- Bill ₹20 lakh: sasta, par galat. 5 wire ka matlab tree nahi, jab tak koi loop na ho.

Fix: woh ek line, `if find(u) != find(v):`.

## 7. Complexity
- Sort: **O(E log E)**.
- Har wire pe find/union: lagbhag O(1) (path compression + union by size).
- Total **O(E log E)**. Memory O(V + E).

## 8. Kruskal ya Prim?
- **Kruskal**: wire list se kaam, sparse graph (kam wire) mein badhiya. DSU chahiye.
- **Prim**: ek gaon se shuru, har baar sabse sasta wire jo network se bahar jaaye (Dijkstra jaisa heap). Dense graph mein badhiya.
- Dono same total dete hain (jab sab kharche alag hon, MST ek hi hota hai).

## 9. Kahan use hota hai
- Bijli, paani, internet cable ka network sabse saste mein.
- Road network, circuit wiring.
- Clustering: MST banao, sabse mehenge wires kaat do → groups.
- History: 1926 mein Otakar Borůvka ne pehla MST algorithm diya, Moravia (Czech) ka bijli network design karne ke liye. Kruskal ka paper 1956.

## 10. Practice
- [1584. Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)
- [1135. Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)
- [1168. Optimize Water Distribution in a Village](https://leetcode.com/problems/optimize-water-distribution-in-a-village/)
- [1489. Find Critical and Pseudo-Critical Edges in MST](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/)

## 11. Project
[Bijli Network](https://www.confuse-coder.site/projects/21_bijli_network): gaon aur wire ka kharcha do, tumhara `kruskal()` sabse sasta network banaye, bataye kaunsa wire chhoda aur kyun, aur "bina if" mode dikhaye kaunsa gaon andhere mein reh gaya.
