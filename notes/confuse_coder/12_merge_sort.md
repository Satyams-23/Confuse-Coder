# 1 crore numbers: 14 ghante vs 1 second? (Merge Sort, Divide & Conquer): Notes
*@confuse__coder · Recursion EP 12 · Comment "NOTES" → ye notes + Leaderboard Merge project + practice questions DM mein*

---

## 1. Problem kya hai?
1 crore (10⁷) numbers sort karne hain.
- **Seedha tareeka** (bubble / selection sort): har number ko baaki sab se compare karo → n²/2 ≈ **50 lakh crore** comparisons (5 × 10¹³). Fast C++ mein bhi **ghanton/din** ka kaam.
- **Merge Sort**: n × log₂n ≈ 1 crore × 23 ≈ **23 crore** comparisons. **~1 second**.
- Fark: ~2 lakh guna.

---

## 2. Concept, simple words mein
Ab tak recursion mein humne **choose** kiya (take/skip, permutations, N-Queens). Merge sort mein hum **todte** hain (divide & conquer):

1. **TODO:** array ko beech se todo. Dono halves ko phir todo. Tab tak, jab tak **ek number** na bache.
2. **BASE CASE:** ek number? Woh toh already sorted hai.
3. **MERGE (asli jaadu):** do *sorted* lists. Dono ke shuru pe ek ungli. Jo chhota, woh output mein pehle, uski ungli aage. Jo list bach jaaye, baaki seedha jod do.

Dry run `[38, 27, 43, 3, 9, 82, 10, 15]`:
```
            [38 27 43 3 | 9 82 10 15]
        [38 27 | 43 3]      [9 82 | 10 15]
      [38|27]  [43|3]      [9|82]  [10|15]       <- todte jao
      [27 38]  [3 43]      [9 82]  [10 15]       <- merge
        [3 27 38 43]          [9 10 15 82]
            [3 9 10 15 27 38 43 82]              <- merge
```
Last merge: 3<9 → 3 | 27>9 → 9 | 27>10 → 10 | 27>15 → 15 | 27 → 38 → 43 (left khatam) → 82.

---

## 3. Code (C++), line by line
```cpp
void merge(int a[], int l, int m, int r) {
    vector<int> out;
    int i = l, j = m + 1;                 // do ungliyan
    while (i <= m && j <= r) {
        if (a[j] < a[i]) out.push_back(a[j++]);   // jo chhota, woh pehle
        else             out.push_back(a[i++]);   // barabar? left pehle (stable)
    }
    while (i <= m) out.push_back(a[i++]);   // bacha hua left
    while (j <= r) out.push_back(a[j++]);   // bacha hua right
    for (int k = 0; k < (int)out.size(); k++) a[l + k] = out[k];
}

void mergeSort(int a[], int l, int r) {
    if (l >= r) return;          // BASE: 1 number = sorted
    int m = (l + r) / 2;         // beech se todo
    mergeSort(a, l, m);          // 1. LEFT   (bharosa)
    mergeSort(a, m + 1, r);      // 2. RIGHT  (bharosa)
    merge(a, l, m, r);           // 3. MERGE
}
```

**Python**
```python
def merge_sort(a):
    if len(a) <= 1:
        return a
    m = len(a) // 2
    L, R = merge_sort(a[:m]), merge_sort(a[m:])
    out, i, j = [], 0, 0
    while i < len(L) and j < len(R):
        if R[j] < L[i]: out.append(R[j]); j += 1
        else:           out.append(L[i]); i += 1
    return out + L[i:] + R[j:]
```

---

## 4. 23 ka raaz (time complexity)
- 1 crore → 50 lakh → 25 lakh → ... har baar aadha. **23 baar** mein 1 bachta hai (2²³ ≈ 84 lakh, 2²⁴ ≈ 1.67 crore). Yahi **log₂ n**.
- Har level pe saare n numbers ek-ek baar merge hote hain → har level **n kaam**.
- Total = n × log n = **O(n log n)**. Best, average, worst: teeno same.
- Extra space: **O(n)** (merge ke liye temp array). Recursion depth: O(log n).

| | Bubble sort | Merge sort |
|---|---|---|
| Time | O(n²) | O(n log n) |
| 1 crore pe comparisons | ~50 lakh crore | ~23 crore |
| Extra space | O(1) | O(n) |
| Stable? | Haan | Haan (barabar pe left pehle) |

---

## 5. Common galtiyan
1. Merge ke baad **bache hue numbers** jodna bhool gaye → output chhota aata hai.
2. `if (a[j] <= a[i])` likh diya → barabar values ka order badal jaata hai (stable nahi raha).
3. `m = (l + r) / 2` bade index pe overflow kar sakta hai → `m = l + (r - l) / 2` safe hai.
4. Base case `l > r` likha → `l == r` pe infinite recursion.

---

## 6. Practice questions
1. **LeetCode 912** – Sort an Array (khud ka merge sort)
2. **LeetCode 88** – Merge Sorted Array (sirf merge wala part)
3. **LeetCode 21** – Merge Two Sorted Lists (linked list pe same ungli trick)
4. **LeetCode 148** – Sort List (linked list pe merge sort)
5. **Count Inversions** (GFG) – merge karte waqt gino
6. **LeetCode 315** – Count of Smaller Numbers After Self (hard, same idea)

**Quiz (pinned comment):** 2 crore numbers pe kitne levels? (Answer next reel mein: **24**)

---

## 7. Project: Leaderboard Merge
Do game servers ke sorted leaderboard jodo, apna merge sort likho, aur bubble sort se race karao (comparisons gine jaate hain). Python + C++, starter + solution + tests.
→ `viewer-projects/02_leaderboard_merge/`

**Next:** Combination Sum / duplicates in backtracking → phir Word Search (graphs ka darwaza).
