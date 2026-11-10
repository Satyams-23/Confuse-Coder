# 3 dost, 1 photo = kitne pose? (Permutations): Notes
*@confuse__coder · Recursion EP 09 · Comment "NOTES" → ye notes DM mein*

---

## 1. Problem kya hai?
Teen dost: Satyam, Anuj, Vishal. Ek photo mein kaun left, kaun beech, kaun right: kitne alag photo?
Pichli baar (subsets) jawab 8 tha, toh log phir 8 bolte hain. Sahi jawab: **6**.
Yahi hai **permutations**: saare items, har possible **order** mein.

---

## 2. Concept, simple words mein
Ab sawaal "lo ya chhodo" nahi, sawaal hai **kaun kahan baithega**.
- Seat 1: teen mein se koi bhi → **3** choice
- Seat 2: bache do → **2**
- Seat 3: bas ek → **1**

3 × 2 × 1 = **6** = **3!** (3 factorial). n items → **n!** permutations.

| | Subsets (EP 08) | Permutations (EP 09) |
|---|---|---|
| Har step pe sawaal | Item lo ya chhodo | Is seat pe kaun? |
| Branches | Hamesha 2 | Jitne bache utne (n, n-1, …, 1) |
| Total | 2ⁿ | n! |
| Order matter? | Nahi | Haan |

---

## 3. Code, line by line
```cpp
int n = 3;
vector<string> dost = {"Satyam", "Anuj", "Vishal"};
vector<int> cur;            // abhi tak kaun kis seat pe
vector<bool> used(n, false); // tick: kaun baith chuka hai

void solve() {
    if (cur.size() == n) { print(cur); return; }  // 1. BASE: saari seats bhar gayi, photo ready
    for (int i = 0; i < n; i++) {                   // 2. TRY: har dost ko try karo
        if (used[i]) continue;                      //    pehle se baitha? skip
        used[i] = true;  cur.push_back(i);          //    bithao + tick lagao
        solve();                                    //    agli seat pe jao
        cur.pop_back();  used[i] = false;           // 3. UNDO: uthao + tick hatao
    }
}
// call: solve();
```

| Part | Matlab |
|---|---|
| `cur.size() == n` | Saari seats bhar gayi → ek complete order |
| `for i` | Is seat ke liye har dost ko try karo |
| `used[i]` | Tick: ye dost pehle se kisi seat pe hai |
| `push_back` + `used = true` | Bithao + tick lagao |
| `pop_back` + `used = false` | Uthao + tick hatao (backtrack) |

---

## 4. Flow: tree aur output order
```
                     solve()  cur=[]
           S /            A |            \ V
        [S]               [A]             [V]
       A/  \V            S/  \V          S/  \A
   [S,A]  [S,V]      [A,S]  [A,V]    [V,S]  [V,A]
     |      |          |      |        |      |
   SAV    SVA        ASV    AVS      VSA    VAS
```
Levels pe branches: **3 → 2 → 1**. Output: `SAV SVA ASV AVS VSA VAS` → 6.

---

## 5. Tick kyun hatana zaroori? (sabse common bug)
`used[]` shared hai. Agar `used[i] = false` bhool gaye, toh jo dost ek baar baitha woh hamesha "baitha hua" dikhega.
Pehla photo SAV banega, phir koi bhi free nahi milega → **sirf 1 photo** instead of 6.
Rule same as EP 08: choice karo → explore karo → **choice undo karo**.

---

## 6. Interview gotchas
1. **Count:** n! badhta bahut tez hai. 5! = 120, 10! = 36,28,800, 12! ≈ 48 crore. n > 10-11 pe saare permutations print karna practically nahi chalega.
2. **Time:** O(n · n!) (n! orders, har ek copy/print karne mein O(n)). Space: O(n) recursion + used[].
3. **Duplicates (LeetCode 47):** "ABB" ke 3! = 6 nahi, sirf **3** alag: ABB, BAB, BBA. Sort karo, aur `if (i > 0 && a[i] == a[i-1] && !used[i-1]) continue;` se same value ko same seat pe dobara mat bithao.
4. **Swap method:** `used[]` ki jagah seat `k` pe har `i >= k` ko swap karke laao, recurse karo, phir wapas swap. Same n!, extra array nahi.
5. **Next permutation:** C++ `next_permutation(a.begin(), a.end())` sorted array se saare orders lexicographic order mein deta hai, bina recursion.

---

**One-line:** Har seat pe ek sawaal: kaun baithega? Jo free hai usse bithao, aage jao, phir wapas uthao.
Next episode: **N-Queens**, jab kuch raaste pehle se band hon. Follow karo @confuse__coder 🔁
