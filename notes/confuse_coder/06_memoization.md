# 4000 crore calls → sirf 99 (Memoization): Notes
*@confuse_coder · Recursion EP 06 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
EP 05 mein `fib(50)` ne laptop hang kar diya tha: lagbhag **4,073 crore calls**.
"Naya laptop le lo" kaam nahi karta. `fib(100)` ko naive recursion se lagbhag **36,000 saal** lagenge (10⁹ calls/sec maan ke). 1000× fast laptop pe bhi **36 saal**.
Problem speed ki nahi hai. Problem **yaadasht** ki hai: function same answer baar baar zero se nikaalta hai.

---

## 2. Concept, simple words mein
Teacher ne poochha 7 × 8? Pehli baar tumne calculate kiya (56) aur copy mein likh liya. Agli baar seedha copy se padh liya.
**Memoization** = function ek **diary (memo)** rakhta hai:
- Answer pehle se diary mein hai? → seedha **return**
- Nahi hai? → **nikaalo**, aur return karne se pehle **diary mein likh do**

Isko **top-down DP** bhi kehte hain (recursion + cache).

---

## 3. Code, line by line
```cpp
long long memo[100];               // shuru mein sab -1 (memset(memo, -1, sizeof memo))

long long fib(int n) {
    if (n <= 1) return n;                        // base case
    if (memo[n] != -1) return memo[n];           // 1. diary check: mila? return
    return memo[n] = fib(n - 1) + fib(n - 2);    // 2. nikaalo + likh lo
}
```

| Part | Matlab |
|---|---|
| `memo[100]` | Diary. Har `n` ka answer ek slot mein |
| `-1` | "Abhi tak nahi nikaala" ka marker (fib kabhi negative nahi hota) |
| `memo[n] != -1` | Cache hit: kaam dobara mat karo |
| `memo[n] = ...` | Assignment bhi value return karta hai, isliye ek hi line mein likho + return |

---

## 4. Tree ka kya hua? fib(5)
```
Naive (15 calls)                     Memo (9 calls)
        fib(5)                       fib(5) ── fib(3)  ← CACHE HIT
       /      \                        |
   fib(4)    fib(3) ← poora          fib(4) ── fib(2)  ← CACHE HIT
   /    \       subtree dobara         |
fib(3) fib(2)                        fib(3) ── fib(1)
  ...   ...                            |
                                     fib(2) ── fib(0)
                                       |
                                     fib(1)
```
Tree sikud ke ek **seedhi line** ban jaata hai.

| n | Naive calls | Memo calls (2n − 1) |
|---|---|---|
| 5 | 15 | 9 |
| 6 | 25 | 11 |
| 50 | ~4,073 crore | **99** |
| 100 | ~1.15 × 10²¹ | 199 |

Time: **O(2ⁿ) → O(n)**. Har `n` sirf ek baar calculate hota hai.

---

## 5. Catch: memory
Diary ko jagah chahiye: **O(n) extra memory** (memo array) + O(n) recursion stack.
Ye classic **time vs space trade-off** hai: thodi memory do, bahut saara time bachao.

---

## 6. Interview gotchas
1. **Spelling:** memo-**ization** hai, memo**r**ization nahi. "memo" = note likhna.
2. **Kab lagta hai?** Jab do cheezein hon: **overlapping subproblems** (same call baar baar) + **optimal substructure** (bada answer chhote answers se banta hai). Merge sort mein overlap nahi, isliye memo bekaar hai.
3. **Overflow:** `fib(93)` se aage `long long` bhi overflow ho jaata hai. fib(100) ka answer chahiye toh big integer (Python int / `__int128` / string add) lagao.
4. **Sentinel galti:** agar valid answer 0 ho sakta hai toh `0` ko "empty" mat maano. `-1` ya alag `visited[]` array use karo.
5. **Stack limit:** memo ke baad bhi depth `n` hai. `n = 10⁶` pe stack overflow (EP 04 yaad hai?). Wahan **tabulation** (loop) better hai, next episode.
6. **Python shortcut:** `@functools.lru_cache(None)` ya `@cache` decorator. Andar yahi diary hai.

---

**One-line:** Same kaam do baar mat karo. Ek baar karo, likh lo, agli baar padh lo.
Next episode: **Tabulation**, bina recursion ke same jaadu. Follow karo @confuse_coder 🔁
