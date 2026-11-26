# Neuron se Neural Network tak
*@confuse__coder.dev · AI/ML EP 02 · Reel: Ek sawaal jisne AI ko saalon roka*

Neuron ek weighted vote hai, gradient descent pahaad se utarna hai, aur XOR batata hai ki layers kyun chahiye.

---

## 1. Neuron = weighted vote
```
score = input1 × weight1 + input2 × weight2 + ... + bias
decision = score > 0 ? 1 : 0
```
Reel ka example: **college bunk karun ya nahi?**

| Dost ja rahe (+5) | Aaj test (−6) | Attendance kam (−3) | Score | Decision |
|---|---|---|---|---|
| ✅ | ❌ | ❌ | 5 | Bunk |
| ✅ | ❌ | ✅ | 2 | Bunk |
| ✅ | ✅ | ❌ | −1 | Class |
| ❌ | ❌ | ❌ | 0 | Class (zero se upar chahiye) |

- **Weight:** input kitna matter karta hai, aur kis taraf
- **Bias:** jab koi input na ho tab ka default jhukaav
- **Activation:** score ko decision mein badalna (yahan: zero se upar = 1)

---

## 2. Weights kaun set karta hai? Gradient descent
Machine khud, EP01 wale loop se: guess → galti → adjust.
**Kidhar adjust karna hai?** Socho andhere mein pahaad se utar rahe ho:
- **Pahaad** = loss (galti), jitna upar utni zyada galti
- **Dhalaan** = gradient, pair ke neeche ka slope
- **Kadam** = learning rate, bada kadam toh fisal jaoge, chhota toh bahut der lagegi

```python
w = w - learning_rate * gradient    # dhalaan ki ulti taraf ek chhota kadam
```

---

## 3. XOR: woh sawaal jo ek neuron se nahi hota
**Party jaaun?** Sirf ek dost aaye toh haan.

| Rahul | Priya | Party? |
|---|---|---|
| ❌ | ❌ | Nahi |
| ❌ | ✅ | Haan |
| ✅ | ❌ | Haan |
| ✅ | ✅ | Nahi (breakup) |

Ek neuron sirf **ek seedhi line** kheench sakta hai. Yahan "haan" wale kone aamne-saamne hain, toh koi bhi ek line dono ko alag nahi kar sakti. Saare weights try karke bhi best = **3/4**.

---

## 4. Fix: neurons ki layers
```python
A     = neuron([rahul, priya], [1, 1], -0.5)   # koi bhi aaya?  (OR)
B     = neuron([rahul, priya], [1, 1], -1.5)   # dono aaye?     (AND)
party = neuron([A, B],         [1, -1], -0.5)  # A haan, B nahi
```
Result: 4/4 ✅. Beech wali layer (**hidden layer**) sawaal ko chhote sawaalon mein tod deti hai. Yahi hai **neural network**.

---

## 5. Thoda history
| Saal | Kya hua |
|---|---|
| 1958 | Rosenblatt ka Perceptron (ek neuron). Akhbaar: "yeh chalegi, bolegi, likhegi" |
| 1969 | Minsky & Papert ki kitaab *Perceptrons*: ek layer XOR nahi kar sakti. Funding thandi |
| 1986 | Backpropagation popular hua: hidden layers ke weights bhi train hone lage |

---

## 6. ChatGPT se connection
- Wahi neuron (weighted sum + activation), bas arbon mein
- GPT-3 mein **96 layers**
- Real networks step ki jagah smooth activation (sigmoid, ReLU) use karte hain, taaki gradient descent kaam kare

---

## 7. Words (glossary)
- **Neuron:** inputs × weights + bias → decision
- **Hidden layer:** input aur output ke beech ke neurons
- **Linearly separable:** ek seedhi line se groups alag ho jaayein (XOR nahi hota)
- **Gradient descent:** dhalaan ki ulti taraf chhote kadam
- **Backpropagation:** har hidden weight ka gradient nikalne ka tareeka

---

## 8. Project
**[Party Brain](https://www.confuse-coder.site/projects/23_party_brain)**: `neuron()` aur `party_net()` likho. Tests batayenge ki tumhara network XOR pe 4/4 karta hai ya nahi.

## 9. Practice
1. Bunk neuron: dost nahi ja rahe, test hai, attendance kam. Score? (answer: pinned comment mein)
2. "Dono aaye toh hi jaaunga" (AND): kya ek neuron kaafi hai?
3. Teen dost, "exactly ek aaye toh party". Kitne hidden neurons lagenge?

**Next (EP03):** Instagram ko kaise pata tumhe kya pasand hai? → Embeddings.
