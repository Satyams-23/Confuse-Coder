# Memo bhi crash ho gaya? (Tabulation): Notes
*@confuse__coder · Recursion EP 07 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
EP 06 mein memoization ne `fib(50)` turant solve kar diya. Par `fib(10 lakh)` chalao toh **Stack Overflow**.
Diary (memo) toh hai, par **recursion abhi bhi zinda hai**: `fib(1000000)` → `fib(999999)` → … das lakh calls, das lakh plates, ek ke upar ek. Stack ki limit (aam taur pe 1–8 MB) khatam, aur program crash.

---

## 2. Concept, simple words mein
Building socho. Paanchvi manzil hawa mein nahi banti. Pehle ground floor, phir pehli, phir doosri.
**Tabulation** = chhote answers pehle, bade baad mein. Ek **table (dp array)** ko **neeche se upar** bharo, ek simple loop se.
Isko **bottom-up DP** kehte hain. Na recursion, na function calls, na stack.

---

## 3. Code, line by line
```cpp
long long fib(int n) {
    if (n <= 1) return n;
    vector<long long> dp(n + 1);
    dp[0] = 0; dp[1] = 1;                 // base cases: pata hain
    for (int i = 2; i <= n; i++)          // left se right
        dp[i] = dp[i - 1] + dp[i - 2];    // pichhle do ka jod
    return dp[n];
}
```

| Part | Matlab |
|---|---|
| `dp(n + 1)` | Table. `dp[i]` = fib(i) ka answer |
| `dp[0], dp[1]` | Base case, jo hum already jaante hain |
| `for i = 2..n` | Chhote se bade ki taraf, ek hi baar |
| `dp[i-1] + dp[i-2]` | Naya khaana sirf pichhle do khaanon se banta hai |

---

## 4. Flow: table kaise bharti hai
```
i:     0   1   2   3   4   5   6
dp:    0   1   1   2   3   5   8
               ↑   ↑   ↑   ↑   ↑
             1+0 1+1 2+1 3+2 5+3
```
Ek loop, left → right. Recursion tree ki jagah ek seedhi line.

---

## 5. Space trick: sirf 2 variables
Naya khaana banane ke liye sirf **pichhle do** chahiye. Toh poori table kyun rakhein?
```cpp
long long fib(int n) {
    if (n <= 1) return n;
    long long a = 0, b = 1;          // dp[i-2], dp[i-1]
    for (int i = 2; i <= n; i++) {
        long long c = a + b;
        a = b;
        b = c;
    }
    return b;
}
```

| | Naive recursion | Memo (top-down) | Tabulation | Tab + 2 vars |
|---|---|---|---|---|
| Time | O(2ⁿ) | O(n) | O(n) | O(n) |
| Extra memory | O(n) stack | O(n) memo + O(n) stack | O(n) table | **O(1)** |
| Bada n (10⁶) | hang | **stack overflow** | ✅ | ✅ |

---

## 6. Interview gotchas
1. **Memo vs Tabulation, dono DP hain.** Memo = top-down (recursion + cache). Tabulation = bottom-up (loop + table). Interview mein dono ka naam aur farak bolo.
2. **Order matters.** Tabulation mein table ko us order mein bharo jisme har khaane ke "dependencies" pehle ready hon. Galat order = galat answer.
3. **Overflow.** `fib(93)` ke baad `long long` overflow hota hai. fib(10 lakh) jaisa bada n ho toh question mein aksar `% 1e9+7` maanga jaata hai: `dp[i] = (dp[i-1] + dp[i-2]) % MOD`.
4. **Memo kab better?** Jab saare subproblems ki zarurat na ho (sirf kuch states visit hon), memo sirf zaroori states nikaalta hai. Tabulation sab bharta hai.
5. **Space optimisation tabhi** jab `dp[i]` sirf last k values pe depend kare. Agar baad mein poora path/answer reconstruct karna ho toh table rakhni padegi.

---

**One-line:** Upar se tod ke mat jao, neeche se banao: table + loop = no recursion, no crash.
Next episode: **Take ya Skip**, recursion ka sabse powerful pattern (subsets). Follow karo @confuse__coder 🔁
