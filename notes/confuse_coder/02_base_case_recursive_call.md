# Base Case + Recursive Call
*@confuse__coder · Recursion EP 02 · Reel: recursion ke sirf 2 parts*

---

## 1. Problem kya hai?
Tum 5th floor pe ho aur ground floor jaana hai. Har baar sirf ek floor neeche jaate ho.
Function ko do cheezein pata honi chahiye: **chalte raho** aur **kab ruk jao**.

---

## 2. Concept, simple words mein
Har recursion ke sirf **2 parts** hote hain:
- **Recursive Call** = wahi kaam, chhote input pe ("ek floor neeche, chalte raho").
- **Base Case** = kab rukna hai ("ground floor aa gaya, bas").

Base Case nahi hai → function khud ko call karta hi rahega → **crash** (Stack Overflow, EP 04).

---

## 3. Code, line by line
```cpp
void goDown(int n) {
    if (n == 0) return;   // BASE CASE: ground floor, ruk jao
    cout << n << " ";     // abhi wala floor print
    goDown(n - 1);        // RECURSIVE CALL: ek floor neeche
}
```

| Part | Matlab |
|---|---|
| `if (n == 0) return;` | Base case. Hamesha sabse upar likho |
| `cout << n` | Call se **pehle** ka kaam, jaate waqt chalta hai |
| `goDown(n - 1)` | Input chhota ho raha hai, manzil ki taraf |

---

## 4. Dry run: goDown(3)
```
goDown(3) → print 3 → goDown(2)
goDown(2) → print 2 → goDown(1)
goDown(1) → print 1 → goDown(0)
goDown(0) → base case, return
```
Output: `3 2 1`

---

## 5. Interview gotchas
1. **Base case pehle kyun?** Agar recursive call pehle likh diya toh check tak pahunchoge hi nahi.
2. **Har recursive call base case ki taraf jaana chahiye.** `goDown(n + 1)` likha toh kabhi 0 nahi aayega.
3. **Twist (EP 03):** print ko call ke **neeche** rakh do, output ulta ho jaata hai. Kyun? Call Stack.
