# 3 toppings = kitne pizza? (Take / Skip, Subsets): Notes
*@confuse_coder · Recursion EP 08 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
Pizza pe 3 toppings: cheese, olives, paneer. Kitne alag pizza ban sakte hain?
Zyaadatar log bolte hain 3 ya 6. Sahi jawab: **8** (khaali pizza bhi gino toh).
Yahi hai **subsets** ka sawaal: n items ke saare possible groups.

---

## 2. Concept, simple words mein
Har topping ke saamne sirf **do choice**: **Take** (lo) ya **Skip** (chhodo).
- Cheese: 2 raaste
- Har raaste pe olives: 2 × 2 = 4
- Har raaste pe paneer: 2 × 2 × 2 = **8**

n items → **2ⁿ subsets**. Ye decisions ek binary **recursion tree** banate hain; har **leaf = ek subset**.

---

## 3. Code, line by line
```cpp
vector<string> top = {"cheese", "olives", "paneer"};
vector<string> cur;
int n = 3;

void solve(int i) {
    if (i == n) { print(cur); return; }   // 1. BASE: toppings khatam, ek pizza ready
    cur.push_back(top[i]);                 // 2. TAKE: topping daalo
    solve(i + 1);                          //    agli topping pe jao
    cur.pop_back();                        // 3. SKIP: topping wapas nikaalo
    solve(i + 1);                          //    aur phir agli pe jao
}
// call: solve(0);
```

| Part | Matlab |
|---|---|
| `i` | Abhi kaunsi topping ka decision ho raha hai |
| `i == n` | Saare decisions ho gaye → ek complete subset |
| `push_back` + `solve(i+1)` | Take branch |
| `pop_back` + `solve(i+1)` | Skip branch (pehle take ka asar hatao) |

---

## 4. Flow: tree aur output order
```
                    solve(0)  cur={}
            TAKE C /            \ SKIP C
        solve(1) {C}            solve(1) {}
       /        \               /        \
   {C,O}        {C}          {O}         {}
   /   \       /   \        /   \       /   \
{C,O,P}{C,O} {C,P} {C}   {O,P} {O}   {P}  { }
```
Output order (take pehle): `{C,O,P} {C,O} {C,P} {C} {O,P} {O} {P} {}` → 8 subsets.

---

## 5. pop_back kyun zaroori? (sabse common bug)
`cur` ek hi shared vector hai. Take branch ne olives daala; agar wapas nahi nikaala toh Skip branch mein bhi olives **chipki rahegi**.
Chahiye `{C}`, milega `{C,O}`. Isko hi **backtracking** kehte hain: choice karo → explore karo → **choice undo karo**.

---

## 6. Interview gotchas
1. **Count:** n items → 2ⁿ subsets, khaali set `{}` bhi shaamil. 4 toppings = 16 (khaali chhod ke 15).
2. **Time:** O(n · 2ⁿ) (2ⁿ subsets, har ek ko print/copy karne mein O(n)). n = 20 → 10,48,576 subsets theek hai; n = 40 → nahi chalega.
3. **Duplicates:** input `[1,2,2]` ho toh same subset do baar banega. Sort karo, aur skip karte waqt same value wale saare items ek saath skip karo (LeetCode 90).
4. **Bitmask alternative:** `for mask in 0..2ⁿ-1`, bit j set = item j le liya. Same 2ⁿ, bina recursion.
5. **Pattern hai, sirf ek question nahi:** Combination Sum, Target Sum, Partition, aur DP mein 0/1 Knapsack, sab Take / Skip pe chalte hain. Knapsack = Take/Skip + memo.

---

**One-line:** Har item pe ek sawaal, lo ya chhodo. Lo toh daalo aur aage jao, chhodo toh nikaalo aur aage jao.
Next episode: **Permutations**, jab order bhi matter kare. Follow karo @confuse_coder 🔁
