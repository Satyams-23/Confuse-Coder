# Call Stack
*@confuse__coder · Recursion EP 03 · Reel: ek line neeche ki aur output ulta*

---

## 1. Problem kya hai?
EP 02 ka `goDown(3)` output deta tha `3 2 1`. Bas `print` ko recursive call ke **neeche** move kiya, aur output aaya `1 2 3`. Ulta! Kyun?

---

## 2. Concept, simple words mein
Har call apne andar wale call ke **wapas aane tak freeze** ho jaata hai. Baaki ka kaam ek "sticky note" pe pending rehta hai.
- Base case tak ek bhi print nahi hota: sab line mein freeze khade hain.
- Jo **last** freeze hua, woh **pehle** unfreeze hota hai → **LIFO** → isliye isse **Call Stack** kehte hain.

---

## 3. Code, line by line
```cpp
void goDown(int n) {
    if (n == 0) return;
    goDown(n - 1);        // pehle andar jao (freeze)
    cout << n << " ";     // wapas aate waqt chalega
}
```

| Code ki jagah | Kab chalta hai |
|---|---|
| Call ke **upar** | Jaate waqt (3, 2, 1 order) |
| Call ke **neeche** | Wapas aate waqt (1, 2, 3 order) |

---

## 4. Dry run: stack kaise bharta aur khaali hota hai
```
push goDown(3)   [3]
push goDown(2)   [3, 2]
push goDown(1)   [3, 2, 1]
push goDown(0)   [3, 2, 1, 0]  → base case
pop 0            [3, 2, 1]     → print 1
pop 1            [3, 2]        → print 2
pop 2            [3]           → print 3
```
Output: `1 2 3`

---

## 5. Interview gotchas
1. **Recursion ki space complexity?** Stack ki max depth. `goDown(n)` → **O(n)**.
2. **Linked list ulta print karna** bina reverse kiye? Yahi trick: print call ke neeche.
3. **Stack ki bhi limit hai.** Bahut gehri recursion ya base case miss → Stack Overflow (EP 04).
