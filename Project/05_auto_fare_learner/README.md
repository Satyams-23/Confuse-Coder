# Auto Fare Learner (your first ML model)
*@confuse__coder.dev · AI/ML S1 EP01 project ("Kisi ne rule nahi bataya")*

Tumhare paas 6 auto rides ka bill hai, par rate card nahi. Computer ko rule mat batao,
use **khud seekhne do**. Bas ek function tum likhoge: `train_step()`, ek "guess → galti → adjust" step.

---

## Reel se connection
| Reel | Code |
|---|---|
| Shuru mein guess: rate 0, base 0 | `w = b = 0.0` |
| Har ride pe check: kitna galat? | `err = pred - asli fare` |
| Jidhar galti kam ho, thoda khiskao | `w -= lr * dw`, `b -= lr * db` |
| Yahi loop baar baar = training | `train()` in `fare.py` calls your step thousands of times |
| 15 km, jo data mein tha hi nahi | prediction: `w * 15 + b` |

`dw` and `db` are the gradient (which way the error grows). How that works is EP02. For now, just use the formula in the starter's docstring.

## Files (Python)
| Ready file | Your job | Answer |
|---|---|---|
| `python/fare.py` (data, training loop, tests) | `python/starter.py`: `train_step()` (~6 lines) | `python/solution.py` |

## Run
```bash
cd python
python starter.py
```

## Expected output (solution)
```
=== 1. AUTO FARE: 6 rides, 0 rules ===
  try    1:  rate =    0.00/km   base =    0.00   galti = Rs   133.84
  try    2:  rate =   19.80/km   base =    2.45   galti = Rs    19.30
  try  500:  rate =   15.27/km   base =   22.73   galti = Rs     1.10
  ...
  Model: fare = 15.01 * km + 24.90
  15 km ka fare? Rs 250   (data mein 15 km tha hi nahi)
=== 2. TESTS ===
  [PASS] ... (6 tests, including a second city with a different hidden rule)
```
(The reel says "863 tries", which is when rate and base are within 0.05 / 0.5 of 15 / 25. This project keeps going until the average error is under ₹0.05, which takes 1168 tries.)

## Try these after it passes
1. Set `lr=0.1` in `fare.py`'s `train()`. What happens to the error? (It blows up. Too big a step.)
2. Set `lr=0.001`. How many tries does it take now?
3. Add a noisy ride (e.g. 8 km = ₹160, the driver overcharged). Does it still find something close to 15?
