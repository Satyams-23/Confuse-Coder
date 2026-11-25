# Bijli Network (Kruskal MST)
*@confuse__coder · Graphs EP 08 (Kruskal MST) ka project*

Reel mein mera code 20 lakh mein "sab jude" bola, par Bela gaon andhere mein reh gaya. Ab tum woh Kruskal likho jo sabse sasta aur poora network banaye.

**Tum sirf ek function likhoge:** `kruskal()` in `starter.py` (ya `starter.cpp`).

---

## Problem
- Input: gaon ki list, aur wires `(gaon1, gaon2, kharcha)`.
- Output: `(chosen, skipped)`
  - `chosen` = lagaye gaye wires, saste se mehenge
  - `skipped` = chhode gaye wires, kyunki dono gaon pehle se jude the
- `DSU` (find + union, EP 07 wala) ready file mein diya hai. Bas use karo.

## Reel se connection
| Reel | Code |
|---|---|
| Saste se mehenge, line mein lagao | `sorted(wires, key=kharcha)` |
| Alag groups → lagao, jude → chhodo | `if find(a) != find(b)` |
| Mukhiya same = already jude | `find()` from EP 07 |
| 6 gaon, 5 wire (n − 1) | `len(chosen) == len(gaon) - 1` → break |
| Bug: if gayab → ₹20 lakh, Bela andhere mein | output ki "bina if" line |

## Files
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `network.py` | `starter.py` | `solution.py` |
| `cpp/` | `network.h` | `starter.cpp` | `solution.cpp` |

## Run
```bash
cd python
python starter.py
python test_network.py starter     # 9 tests
```
```bash
cd cpp
g++ -std=c++17 starter.cpp -o starter && ./starter
```

## Expected output
```
=== Reel ke 6 gaon ===
  LAGAO   Rampur-Sitapur  Rs 2L
  LAGAO   Sitapur-Kheda  Rs 3L
  LAGAO   Kheda-Nandgaon  Rs 5L
  LAGAO   Nandgaon-Dhanpur  Rs 6L
  LAGAO   Nandgaon-Bela  Rs 8L
  CHHODO  Rampur-Kheda  Rs 4L  (pehle se jude)
  CHHODO  Rampur-Dhanpur  Rs 7L  (pehle se jude)
  Total: Rs 24 lakh | 6/6 jude
  (bina if: Rs 20 lakh | 5/6 jude | andhere mein: Bela)

=== Poora zila ===
  LAGAO   Rampur-Sitapur  Rs 2L
  LAGAO   Sitapur-Kheda  Rs 3L
  LAGAO   Bela-Gokul  Rs 3L
  LAGAO   Gokul-Moti Nagar  Rs 4L
  LAGAO   Kheda-Nandgaon  Rs 5L
  LAGAO   Chandpur-Lalganj  Rs 5L
  LAGAO   Nandgaon-Dhanpur  Rs 6L
  LAGAO   Nandgaon-Bela  Rs 8L
  LAGAO   Moti Nagar-Chandpur  Rs 10L
  CHHODO  Rampur-Kheda  Rs 4L  (pehle se jude)
  CHHODO  Bela-Moti Nagar  Rs 6L  (pehle se jude)
  CHHODO  Rampur-Dhanpur  Rs 7L  (pehle se jude)
  CHHODO  Sitapur-Bela  Rs 9L  (pehle se jude)
  Total: Rs 46 lakh | 10/10 jude
  (bina if: Rs 38 lakh | 5/10 jude | andhere mein: Bela, Gokul, Moti Nagar, Chandpur, Lalganj)
```
Python aur C++ ka output bilkul same hai.

## Hint
- Same kharche wale wires ka order input jaisa rakho (Python `sorted` stable hai, C++ mein `stable_sort`).
- `find(a) != find(b)` ke andar hi `union` aur `chosen.append` karo, aur wahin `n − 1` check.

## Level up
1. Reel wala bug likho (if hata do) aur dekho zila mein 5 gaon andhere mein.
2. Prim's algorithm likho (heap ke saath) aur check karo total wahi 46 aata hai.
3. LeetCode 1584: points ke beech kharcha = Manhattan distance, sab wires khud banao.
