# Party Brain (Neuron → Neural Network)
*@confuse__coder.dev · AI/ML EP 02 · Reel: Ek sawaal jisne AI ko saalon roka*

Party jaaun ya nahi? Rahul aaye toh haan, Priya aaye toh haan, dono aaye toh nahi, koi na aaye toh bhi nahi. Ek neuron yeh kabhi 4/4 sahi nahi kar paata. Tum pehle ek neuron likhoge, phir 3 neurons jodkar woh sawaal solve karoge jo 1969 mein AI ko rok gaya tha.

---

## Reel se connection
| Reel | Code |
|---|---|
| Neuron = vote: dost +5, test −6, attendance −3 | `neuron([dost, test, att], [5, -6, -3], 0)` |
| Sab jodo, zero se upar = bunk | `score > 0 → 1` |
| Ek neuron XOR pe fail | `best_single_neuron()` tries every weight combo → max 3/4 |
| A: koi bhi aaya? B: dono aaye? | two neurons on `[rahul, priya]` |
| Final: A haan, B nahi | third neuron on `[A, B]` |

## Files (Python)
| Ready file | Your job | Answer |
|---|---|---|
| `python/party.py` (data, weight search, tests) | `python/starter.py`: `neuron()` (~3 lines) + `party_net()` (~4 lines) | `python/solution.py` |

## Run
```bash
cd python
python starter.py
```

## Expected output (solution)
```
=== 1. BUNK NEURON (dost +5, test -6, attendance -3) ===
  dost=1 test=0 attendance_kam=1  ->  BUNK
  dost=1 test=1 attendance_kam=0  ->  class
  ...
=== 2. XOR WITH ONE NEURON (sab weights try karke) ===
  best = 3/4   (ek seedhi deewar, aamne-saamne kone: kabhi 4/4 nahi)
=== 3. PARTY NETWORK (3 neurons, 2 layers) ===
  rahul=1 priya=1  ->  party nahi   (sahi: nahi)
  score = 4/4
=== 4. TESTS ===
  [PASS] ... (6 tests)
Sab pass! Tumne 1969 wala sawaal solve kar diya.
```

## Hint
Neuron A (OR) and neuron B (AND) both use weights `[1, 1]`. Only the bias differs: how many people need to come before the score goes above 0?

## Try these after it passes
1. Make a "Rahul AUR Priya dono aaye toh hi jaaunga" (AND) brain with a single neuron. Does one neuron manage it? Why?
2. Add a third friend. Party only if **exactly one** of the three comes. How many hidden neurons do you need?
3. Replace the step with `sigmoid(score) = 1 / (1 + e^-score)` and print the scores. Why do real networks need a smooth function like this to learn the weights by themselves?
