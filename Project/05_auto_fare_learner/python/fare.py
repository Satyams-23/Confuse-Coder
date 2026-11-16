"""Ready-made part of the Auto Fare Learner (AI/ML S1 EP01). Don't edit; write train_step() in starter.py."""

KM = [2, 3, 5, 7, 10, 12]
FARE = [55, 70, 100, 130, 175, 205]          # hidden rule: 15 * km + 25 (the model must find it)

# a second city, different hidden rule (8 * km + 40), to prove your loop isn't hardcoded
KM2 = [1, 4, 6, 9, 11, 14]
FARE2 = [8 * k + 40 for k in KM2]


def avg_error(w, b, km, fare):
    """RMSE: on average, how many rupees the model is off by."""
    n = len(km)
    return (sum((w * k + b - f) ** 2 for k, f in zip(km, fare)) / n) ** 0.5


def train(train_step, km, fare, lr=0.01, steps=5000, show=True):
    w = b = 0.0
    for step in range(1, steps + 1):
        err = avg_error(w, b, km, fare)
        if show and step in (1, 2, 10, 100, 500, 1000, 2000, 5000):
            print(f"  try {step:>4}:  rate = {w:7.2f}/km   base = {b:7.2f}   galti = Rs {err:8.2f}")
        if err < 0.05:
            if show:
                print(f"  try {step:>4}:  rate = {w:7.2f}/km   base = {b:7.2f}   galti = Rs {err:8.2f}  <- bas, mil gaya")
            break
        w, b = train_step(w, b, km, fare, lr)
    return w, b


def run(train_step):
    print("=== 1. AUTO FARE: 6 rides, 0 rules ===")
    w, b = train(train_step, KM, FARE)
    print(f"\n  Model: fare = {w:.2f} * km + {b:.2f}")
    print(f"  15 km ka fare? Rs {w * 15 + b:.0f}   (data mein 15 km tha hi nahi)\n")

    print("=== 2. TESTS ===")
    ok = True

    def check(name, cond):
        nonlocal ok
        ok &= cond
        print(f"  [{'PASS' if cond else 'FAIL'}] {name}")

    w1, b1 = train_step(0.0, 0.0, KM, FARE, 0.01)
    check("ek step ke baad rate badha (galti kam karne ki taraf)", w1 > 0 and b1 > 0)
    check("ek step ke baad galti kam hui", avg_error(w1, b1, KM, FARE) < avg_error(0, 0, KM, FARE))
    check("rate ~ 15 mila", abs(w - 15) < 0.1)
    check("base ~ 25 mila", abs(b - 25) < 1)
    check("15 km = Rs 250", round(w * 15 + b) == 250)
    w2, b2 = train(train_step, KM2, FARE2, steps=20000, show=False)
    check("doosra shehar (8/km + 40) bhi khud seekha", abs(w2 - 8) < 0.1 and abs(b2 - 40) < 1)
    print("\n" + ("Sab pass! Tumne pehla ML model train kar diya." if ok else "Kuch fail hua. train_step() dobara dekho."))
