# Recursion kya hai?
*@confuse__coder · Recursion EP 01 · Reel: function jo khud ko call kare*

---

## 1. Problem kya hai?
Movie hall ki line mein tum kahin beech mein khade ho aur jaanna hai ki tumhara number kya hai. Gin nahi sakte, andhera hai.
Toh aage wale se poochte ho: "tera number kya hai?" Woh apne aage wale se poochta hai... aur ye chalta rehta hai.

---

## 2. Concept, simple words mein
**Recursion** = ek function jo **khud ko call** karta hai, har baar **thode chhote input** ke saath.
- Sawaal **aage jaata** hai: har insaan aage wale se poochta hai.
- Sabse aage wala bolta hai: "main 1 hoon" (yahan answer obvious hai).
- Jawab **wapas aata** hai: 1 → 2 → 3 → ... tum tak.

Bada problem = **wahi problem, thoda chhota**, jab tak answer obvious na ho jaaye.

---

## 3. Code, line by line
```cpp
int position(int n) {          // n = mere aage kitne log hain
    if (n == 0) return 1;      // sabse aage: main 1 hoon
    return position(n - 1) + 1; // aage wale ka number + 1
}
```

| Part | Matlab |
|---|---|
| `position(n - 1)` | Aage wale se poocho (chhota input) |
| `+ 1` | Uska jawab aane ke baad apna number nikaalo |
| `n == 0` | Answer obvious hai, yahan ruko |

---

## 4. Dry run: position(3)
```
position(3) → position(2) + 1     sawaal aage ja raha hai ↓
  position(2) → position(1) + 1
    position(1) → position(0) + 1
      position(0) = 1              ← sabse aage
    position(1) = 2                jawab wapas aa raha hai ↑
  position(2) = 3
position(3) = 4
```

---

## 5. Interview gotchas
1. **Recursion = loop?** Har recursion ko loop mein likh sakte ho, par jahan problem khud chhote same problems mein toot-ta hai (trees, subsets), wahan recursion zyada clean hai.
2. **Khud ko call karna kaafi nahi.** Input har baar chhota hona chahiye, warna kabhi rukega nahi.
3. **Function ko kaise pata ki kab rukna hai?** Woh EP 02 ka topic hai: Base Case.
