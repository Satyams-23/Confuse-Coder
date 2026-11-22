# Stack Overflow
*@confuse__coder · Recursion EP 04 · Reel: ek character ki galti, poora program crash*

---

## 1. Problem kya hai?
Factorial ka code saare tests pass karta hai: `fact(5) = 120`, `fact(3) = 6`. Phir kisi ne `fact(0)` call kiya aur program **crash**.

---

## 2. Concept, simple words mein
Har function call = memory mein ek **plate**. Plates ka dher = **Call Stack** (EP 03).
Calls aati rahein aur kabhi wapas na jaayein → dher limit cross karta hai → **Stack Overflow**.
Base case likha hona kaafi nahi: woh **har input ke liye reachable** hona chahiye.

---

## 3. Code: bug aur fix
```cpp
int fact(int n) {
    if (n == 1) return 1;        // BUG: fact(0) yahan kabhi nahi rukega
    return n * fact(n - 1);
}
```
```cpp
int fact(int n) {
    if (n <= 1) return 1;        // FIX: sirf ek character, == se <=
    return n * fact(n - 1);
}
```

---

## 4. Dry run: fact(0) buggy version mein
```
fact(0)  → 0 == 1? nahi → fact(-1)
fact(-1) → fact(-2)
fact(-2) → fact(-3)
...  1 kabhi nahi aata, plates badhti rehti hain → CRASH
```
Fix ke baad: `fact(0)` → `0 <= 1` → return 1. (Maths mein bhi 0! = 1.)

---

## 5. Interview gotchas
1. **Tests pass ≠ code sahi.** Edge inputs socho: 0, negative, empty, ek element.
2. **Bahut bada n** (jaise 10 lakh) sahi base case ke saath bhi overflow kar sakta hai: stack depth limited hai. Tab loop ya tail recursion socho.
3. **Python** mein ye `RecursionError: maximum recursion depth exceeded` dikhta hai (default limit ~1000).
