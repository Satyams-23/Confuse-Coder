# Combination Sum
*@confuse__coder · Recursion EP 13 · Reel: ₹8 ka bill: mera code 6 tareeke, sahi 3*

---

## 1. Problem kya hai?
Bill ₹8 hai. Coins hain **2, 3, 5**, aur har coin **kitni bhi baar** use kar sakte ho.
Kitne alag tareekon se pay karoge?

Sahi answer: **3**
```
2 + 2 + 2 + 2
2 + 3 + 3
3 + 5
```
`2 3 3`, `3 2 3`, `3 3 2` = **ek hi** tareeka hai (sirf order alag). Combination mein order matter nahi karta.

---

## 2. Trick: wahi purana take / skip, bas ek farq
Subsets (EP 08) mein har cheez ek baar le sakte the. Yahan **coin lene ke baad wahi coin dobara le sakte ho**.

Dry run (bill 8):
```
2 lo  -> bache 6
2 lo  -> bache 4
2 lo  -> bache 2
2 lo  -> bache 0   ✅ ANSWER 1: 2 2 2 2
...
2, 2, 2 (bache 2) -> 3 lo -> bache -1  ❌ bill se zyada -> BACKTRACK (3 wapas hatao)
```

---

## 3. Code: teen cheezein
```cpp
void pay(int amt, int start, vector<int>& coin, vector<int>& path) {
    if (amt == 0) { print(path); return; }       // ZERO  -> answer mil gaya
    if (amt < 0) return;                         // MINUS -> ruko, wapas jao
    for (int i = start; i < coin.size(); i++) {  // TRY   -> har coin (start se!)
        path.push_back(coin[i]);                 //   lo
        pay(amt - coin[i], i, coin, path);       //   aage jao (i, i+1 nahi: wahi coin dobara)
        path.pop_back();                         //   hatao
    }
}
// call: pay(8, 0, coins, path);
```

**Python**
```python
def pay(amt, start, coins, path, out):
    if amt == 0: out.append(path[:]); return
    if amt < 0: return
    for i in range(start, len(coins)):
        path.append(coins[i])
        pay(amt - coins[i], i, coins, path, out)
        path.pop()
```

---

## 4. Woh ek line (reel ka bug)
Mera pehla code: `for (int i = 0; ...)`. Output aaya **6**:
```
2 2 2 2 | 2 3 3 | 3 2 3 | 3 3 2 | 3 5 | 5 3
```
`2 3 3` teen baar aaya! Kyunki har call mein loop **pehle coin (2)** se shuru hota tha.
3 uthane ke baad bhi code **wapas 2 pe mud gaya** → `3 2 3` ban gaya.

**Fix:** `i = 0` → `i = start`. Ek baar 3 pe aa gaye, toh **peeche mat mudo**.
Har answer ab hamesha chhote se bade coin ke order mein banta hai (`2 3 3`), isliye har combination sirf ek baar.

| `i` kahan se | Kya ginta hai | Rs8, {2,3,5} |
|---|---|---|
| `0` se | permutations (order matter) | 6 |
| `start` se | combinations (order matter nahi) | **3** |

Recursion mein `i` bhejo (wahi coin dobara) ya `i + 1` (har coin ek baar, LeetCode 40): ye dusra decision hai.

---

## 5. Duplicates wala version (LeetCode 40)
Agar coins `[2, 3, 3, 5]` hain aur har coin **sirf ek baar** use ho sakta hai:
1. Pehle `sort` karo.
2. Recursion mein `i + 1` bhejo.
3. **Same level pe same number skip:** `if (i > start && c[i] == c[i-1]) continue;`

---

## 6. Complexity
- Time: exponential (worst case lagbhag O(n^(target/min_coin))). Har answer copy karne ka cost alag.
- Space: recursion depth = target / sabse chhota coin (Rs8 / 2 = 4 levels).
- Sirf **count** chahiye toh DP (Coin Change II) O(n × target) mein ho jaata hai.

---

## 7. Common galtiyan
1. Loop `0` se chalaya → duplicate answers (reel wala bug).
2. `out.push_back(path)` ki jagah Python mein `out.append(path)` → saare answers baad mein khaali (same list ka reference). `path[:]` copy karo.
3. `pop` bhool gaye → path mein purane coins latke rehte hain.
4. `amt < 0` check nahi kiya → infinite / galat recursion (ya coins sort karke loop mein `break` karo).

---

## 8. Practice questions
1. **LeetCode 39** – Combination Sum (yahi reel)
2. **LeetCode 40** – Combination Sum II (duplicates, har number ek baar)
3. **LeetCode 216** – Combination Sum III (k numbers, 1-9)
4. **LeetCode 518** – Coin Change II (sirf count → DP)
5. **LeetCode 377** – Combination Sum IV (yahan order matter karta hai! loop 0 se sahi hai)

**Quiz (pinned comment):** coins 1 aur 2, bill ₹4. Kitne tareeke? (Answer next reel mein: **3** → 1111, 112, 22)

---

## 9. Project: UPI Change Maker
Bill aur coins do, saare tareeke print karo + shopkeeper ka favourite (kam se kam coins). Sirf `backtrack()` khud likho (~10 lines). Python + C++, starter + solution + tests.
→ [UPI Change Maker](https://www.confuse-coder.site/projects/03_upi_change_maker)

**Next:** Word Search: grid pe backtracking (Recursion season ka last episode).
