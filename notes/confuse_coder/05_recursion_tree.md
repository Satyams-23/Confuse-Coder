# fib(50) ne laptop hang kyun kar diya? (Recursion Tree): Notes
*@confuse__coder · Recursion EP 05 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
Teen line ka Fibonacci code. `fib(5)` turant chalta hai, `fib(40)` kuch seconds leta hai, `fib(50)` pe sirf loading dikhta hai.
Koi error nahi aata, koi crash nahi hota, aur base case bhi sahi hai. Phir bhi answer nahi aata.

---

## 2. Concept, simple words mein
Har recursive call ek **node** hai. Jo function **do** baar khud ko call kare, uske calls ek **tree** bana dete hain: yahi **recursion tree** hai.
Problem recursion nahi hai. Problem ye hai ki **same sub-problem baar baar solve hota hai**, kyunki function ko yaad nahi rehta ki woh answer pehle nikaal chuka hai.

---

## 3. Code, line by line
```cpp
int fib(int n) {
    if (n <= 1) return n;              // base case: fib(0)=0, fib(1)=1
    return fib(n - 1) + fib(n - 2);    // DO recursive calls
}
```

| Part | Matlab |
|---|---|
| `n <= 1` | Base case. `<=` lagaya hai, toh 0 aur 1 dono yahin ruk jaate hain (EP 04 yaad hai?) |
| `fib(n - 1)` | Left branch |
| `fib(n - 2)` | Right branch |
| `+` | Dono branches ka result aane ke baad hi jodta hai |

---

## 4. fib(5) ka recursion tree
```
                    fib(5)
                 /          \
            fib(4)            fib(3)  ← repeat
           /      \           /    \
       fib(3)    fib(2)    fib(2)  fib(1)
       /   \     /   \     /   \
   fib(2) fib(1) f(1) f(0) f(1) f(0)
   /   \
 f(1) f(0)
```
- Total calls: **15**
- `fib(3)` → **2 baar**, `fib(2)` → **3 baar**, `fib(1)` → **5 baar**

| n | Total calls (naive) |
|---|---|
| 5 | 15 |
| 20 | 21,891 |
| 30 | 26,92,537 (~27 lakh) |
| 40 | 33,11,60,281 (~33 crore) |
| 50 | ~4,073 crore (40.7 billion) |

Formula: `calls(n) = 2 · fib(n+1) − 1`

---

## 5. Sneak peek: fix (next episode)
```cpp
long long memo[100];   // shuru mein sab -1 se fill karo

long long fib(int n) {
    if (n <= 1) return n;
    if (memo[n] != -1) return memo[n];          // diary mein hai? seedha do
    return memo[n] = fib(n - 1) + fib(n - 2);   // nahi? nikaalo + likh lo
}
```
Ab har `n` sirf **ek baar** calculate hota hai: time **O(n)**, aur `fib(50) = 12586269025` turant aa jaata hai.
Note: `fib(50)` int mein fit nahi hota, isliye `long long` lagaya hai.

---

## 6. Interview gotchas
1. **Naive fib ki time complexity?** Usually **O(2ⁿ)** bola jaata hai. Ye upper bound hai. Tight bound **O(φⁿ) ≈ O(1.618ⁿ)** hai. Dono bata doge toh plus point milega.
2. **Space complexity?** O(n), O(2ⁿ) nahi. Ek time pe stack mein sirf ek path hota hai (tree ki depth = n).
3. **Recursion tree kab draw karna hai?** Jab bhi function khud ko **ek se zyada** baar call kare. Repeated nodes dikhe, toh **memoization / DP** lagao.
4. **Overflow trap:** `fib(47)` se aage 32-bit `int` overflow ho jaata hai. Code galat answer deta hai aur koi error bhi nahi aata.
5. **Branching factor rule:** har call `b` calls kare aur depth `d` ho, toh calls ≈ `b^d`.

---

**One-line:** Recursion slow nahi hai. Same kaam baar baar karna slow hai.
Next episode: **Memoization**, jahan function ek diary rakhta hai. Follow karo @confuse__coder 🔁
