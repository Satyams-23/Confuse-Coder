"""Ready-made part of Party Brain (AI/ML S1 EP02). Don't edit; write neuron() and party_net() in starter.py."""
from itertools import product

BUNK_WEIGHTS = [5, -6, -3]          # dost ja rahe, aaj test hai, attendance kam
BUNK_BIAS = 0
XOR = [((0, 0), 0), ((0, 1), 1), ((1, 0), 1), ((1, 1), 0)]   # (rahul, priya) -> party?


def best_single_neuron(neuron):
    """Try every weight/bias combo in [-10, 10] (step 0.5) on XOR with ONE neuron. Returns the best score out of 4."""
    vals = [v / 2 for v in range(-20, 21)]
    best = 0
    for w1, w2, b in product(vals, vals, vals):
        ok = sum(neuron([r, p], [w1, w2], b) == y for (r, p), y in XOR)
        best = max(best, ok)
    return best


def run(neuron, party_net):
    yn = lambda v: "haan" if v else "nahi"
    print("=== 1. BUNK NEURON (dost +5, test -6, attendance -3) ===")
    for dost, test, att in product([0, 1], repeat=3):
        d = neuron([dost, test, att], BUNK_WEIGHTS, BUNK_BIAS)
        print(f"  dost={dost} test={test} attendance_kam={att}  ->  {'BUNK' if d else 'class'}")

    print("\n=== 2. XOR WITH ONE NEURON (sab weights try karke) ===")
    best = best_single_neuron(neuron)
    print(f"  best = {best}/4   (ek seedhi deewar, aamne-saamne kone: kabhi 4/4 nahi)")

    print("\n=== 3. PARTY NETWORK (3 neurons, 2 layers) ===")
    score = 0
    for (r, p), y in XOR:
        out = party_net(r, p)
        score += out == y
        print(f"  rahul={r} priya={p}  ->  party {yn(out):4}   (sahi: {yn(y)})")
    print(f"  score = {score}/4")

    print("\n=== 4. TESTS ===")
    ok = True

    def check(name, cond):
        nonlocal ok
        ok &= bool(cond)
        print(f"  [{'PASS' if cond else 'FAIL'}] {name}")

    check("dost + attendance kam = bunk (5 - 3 = 2)", neuron([1, 0, 1], BUNK_WEIGHTS, 0) == 1)
    check("dost + test = class (5 - 6 = -1)", neuron([1, 1, 0], BUNK_WEIGHTS, 0) == 0)
    check("score exactly 0 = class (zero se UPAR chahiye)", neuron([0, 0, 0], BUNK_WEIGHTS, 0) == 0)
    check("bias kaam karta hai (bias +1, koi input nahi = 1)", neuron([0, 0], [3, 3], 1) == 1)
    check("ek neuron XOR pe 4/4 nahi kar sakta", best < 4)
    check("party network XOR pe 4/4", score == 4)
    print("\n" + ("Sab pass! Tumne 1969 wala sawaal solve kar diya." if ok else "Kuch fail hua. neuron() / party_net() dobara dekho."))
