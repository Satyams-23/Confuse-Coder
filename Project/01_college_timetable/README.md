# College Timetable Generator (Backtracking)
*@confuse__coder · Recursion EP 11 (Sudoku Solver) ka project*

Sudoku solve karne wali **same backtracking trick** se apne college ka timetable banao.
Na teacher clash, na room clash, na section clash.

---

## Problem
College mein 2 sections (CSE-A, CSE-B), 3 subjects, 3 teachers, 2 rooms, 3 time slots.
Har section ko Monday ko har subject ka **ek** lecture chahiye. Total 6 lectures, aur jagah bhi sirf 6 (2 rooms × 3 slots).

| Subject | Teacher |
|---|---|
| Maths | Rahul |
| Physics | Amit |
| Chemistry | Priya |

**Rules:**
1. Ek teacher ek time pe ek hi class le sakta hai
2. Ek room mein ek time pe ek hi class
3. Ek section ka ek time pe ek hi lecture

## Sudoku se connection
| Sudoku | Timetable |
|---|---|
| Khaali khaana | Ek lecture jise jagah chahiye |
| Digits 1–9 | (slot, room) options |
| Row / column / box rule | Teacher / room / section rule |
| Koi digit fit nahi → wapas | Koi slot fit nahi → wapas |

---

## Files (Python ya C++, jo pasand ho)
| Folder | Ready file | Tumhara kaam | Answer |
|---|---|---|---|
| `python/` | `timetable.py` (data, `is_safe` / `place` / `unplace`, printing, tests) | `starter.py`: sirf `solve()` likho (~12 lines) | `solution.py` |
| `cpp/` | `timetable.h` (data, `isSafe` / `place` / `unplace`, printing, tests, `main()`) | `starter.cpp`: sirf `solve()` likho (~15 lines) | `solution.cpp` |

Pehle khud try karo, atak jao tabhi solution kholo.

## Run
**Python**
```bash
cd python
python starter.py
```
**C++**
```bash
cd cpp
g++ -std=c++17 starter.cpp -o starter
./starter
```
(Windows pe `starter.exe`.) Jab tak `solve()` nahi likha, `TESTS FAILED` aayega. Sahi likha toh `TESTS PASSED`.
Dono languages ka output bilkul same hai.

---

## Expected output (jab solve() sahi ho)
```
  Backtracking trace:
  A-Maths      -> 9-10   Room 101   OK
  A-Physics    -> 9-10   Room 101   X  (CSE-A ka lecture already hai)
  ...
  B-Physics    -> 9-10   Room 102   OK
  B-Chemistry  -> 9-10   Room 101   X  (CSE-B ka lecture already hai)
  B-Chemistry  -> 9-10   Room 102   X  (CSE-B ka lecture already hai)
  B-Chemistry  -> 10-11  Room 101   X  (CSE-B ka lecture already hai)
  B-Chemistry  -> 10-11  Room 102   X  (CSE-B ka lecture already hai)
  B-Chemistry  -> 11-12  Room 101   X  (Priya busy)
  B-Chemistry  -> 11-12  Room 102   X  (Priya busy)
  B-Chemistry  DEAD END! going back...
  B-Physics    -> 10-11  Room 101   X  (Amit busy)
  B-Physics    -> 10-11  Room 102   X  (Amit busy)
  B-Physics    -> 11-12  Room 101   X  (Room 101 full)
  B-Physics    -> 11-12  Room 102   OK
  B-Chemistry  -> 9-10   Room 101   X  (Room 101 full)
  B-Chemistry  -> 9-10   Room 102   OK
  ALL LECTURES PLACED!

  MONDAY TIMETABLE
  ------------------------------------------------------------------
  Slot   | Room 101                   | Room 102
  ------------------------------------------------------------------
  9-10   | CSE-A Maths (Rahul)        | CSE-B Chemistry (Priya)
  10-11  | CSE-A Physics (Amit)       | CSE-B Maths (Rahul)
  11-12  | CSE-A Chemistry (Priya)    | CSE-B Physics (Amit)
  ------------------------------------------------------------------

  TESTS PASSED: sab lectures placed, koi clash nahi.
```
Dead end dekha? B-Chemistry ko koi jagah nahi mili, toh code **ek kadam peechhe** gaya, B-Physics ko 9-10 se 11-12 pe khiskaya, aur phir sab fit ho gaya. Yahi backtracking hai.

---

## Hint (agar atak gaye)
```
solve(i):
  i == lectures.size()  ->  return true            // BASE
  har slot s, har room r:
      safe nahi? skip
      place(i, s, r)
      if solve(i + 1): return true                  // TWIST: ek answer kaafi
      unplace(i, s, r)                              // UNDO
  return false                                      // dead end
```

---

## Level up (challenges)
1. **Apna college daalo:** `timetable.py` / `timetable.h` ke top pe `lectures`, `slots`, `rooms` badlo. Jitne zyada lectures, utna maza.
2. **isSafe khud likho:** helper (`is_safe` / `isSafe`) delete karo aur teeno rules khud check karo.
3. **Naya rule:** "Rahul 9-10 nahi aa sakta" ya "Lab sirf Room 102 mein". Bas `isSafe` mein ek `if` add karo.
4. **Poora week:** slots ko `Mon 9-10`, `Tue 9-10`... bana do, aur rule add karo "ek section ka ek din mein ek subject sirf ek baar".
5. **Faster:** pehle woh lecture place karo jiske paas sabse kam safe options hain (Sudoku wala MRV trick).

Resume pe likh sakte ho: *"Built a constraint-based college timetable generator in Python/C++ using backtracking with pruning (teacher / room / section constraints)."*

Follow karo @confuse__coder 🔁
