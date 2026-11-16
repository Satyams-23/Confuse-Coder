# Machine kaise seekhti hai? Notes
*@confuse__coder.dev · AI/ML Season 1 · EP01 · Comment "NOTES" → ye notes DM mein*

---

## 1. Normal code vs Machine Learning
```
Normal code:       RULE + DATA     →  ANSWER      (tum rule likhte ho)
Machine Learning:  DATA + ANSWERS  →  RULE        (computer rule dhoondhta hai)
```
Reel mein: 6 auto rides ka bill diya (km → fare). Rate card nahi diya. Computer ne khud nikala: **₹15/km + ₹25 base**.

---

## 2. Model kya hai?
Model = ek function jiske andar kuch **numbers (knobs)** hain jo badal sakte hain.
```
fare = rate × km + base          ← model
         ↑            ↑
       knob 1       knob 2       ← "weights" / "parameters"
```
Isko **linear regression** kehte hain (seedhi line fit karna). ML ka sabse pehla model.

---

## 3. Training loop (poora ML isi pe chalta hai)
| Step | Kya hota hai | Reel mein |
|---|---|---|
| 1. Guess | knobs ki random/zero value | rate 0, base 0 |
| 2. Galti naapo (loss) | har example pe guess vs asli | average ₹134 galat |
| 3. Adjust | knobs ko thoda us taraf khiskao jidhar galti kam ho | line upar uthi |
| 4. Repeat | 1-3 baar baar | 863 baar |

```python
for step in range(1000):
    err  = [w*k + b - f for k, f in zip(km, fare)]   # galti
    dw   = 2 * sum(e*k for e, k in zip(err, km)) / n  # kis taraf khiskana hai (EP02)
    db   = 2 * sum(err) / n
    w   -= lr * dw                                    # thoda khiskao
    b   -= lr * db
```

---

## 4. Reel ki asli ginti (code se check ki hui)
| Try | Rate | Base | Average galti |
|---|---|---|---|
| 1 | 0 | 0 | ₹134 |
| 2 | 19.8 | 2.45 | ₹19 |
| 10 | 17.6 | 3.0 | ₹10.6 |
| 500 | 15.27 | 22.7 | ₹1.1 |
| ~863 | 15.05 | 24.6 | ₹0.2 |

Data: 2, 3, 5, 7, 10, 12 km → ₹55, 70, 100, 130, 175, 205. Learning rate = 0.01.
**Prediction:** 15 km (data mein nahi tha) → ₹250 ✅. Isko **generalisation** kehte hain.

---

## 5. Words (glossary)
- **Model:** seekha hua rule / function
- **Weights / parameters:** model ke andar ke knobs (yahan 2)
- **Loss:** galti ka ek number (yahan average squared error)
- **Training:** guess → loss → adjust → repeat
- **Learning rate:** har baar kitna khiskana hai. Zyada → model bhatak jaata hai; kam → bahut slow
- **Prediction:** naye input pe model ka answer

---

## 6. ChatGPT se connection
Same loop! Bas:
- 2 knobs → **arbon (billions)** knobs
- auto fare → "agla word kya hoga"
- line → bahut saari layers wala neural network (EP03-04)

---

## 7. Project 🛠️
**viewer-projects/05_auto_fare_learner**: `train_step()` likho (~6 lines). Tumhara model khud ₹15/km + ₹25 dhoondhega, aur ek doosre shehar ka rule bhi.

## 8. Practice
1. 20 km ka fare is model se? (answer: pinned comment mein)
2. Learning rate 0.1 karo, kya hota hai? (galti explode karti hai)
3. Ek ride mein driver ne zyada le liya (8 km = ₹160). Line pe kya asar padega?

**Next (EP02):** usse pata kaise chala ki "kis taraf" khiskana hai? → Gradient descent, andhere mein pahaad se utarna.
