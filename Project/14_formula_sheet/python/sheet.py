# ============================================================================
#  Formula Sheet  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
import re
import sys

sys.setrecursionlimit(100000)

# Har sheet: cell -> number ya formula ("=..."). Formula mein: cell refs (B6), + - * /, %, SUM(B2:B4).
SHEETS = {
    "gst_bill": {  # reel wala bill: koi cycle nahi (Subtotal do raaston se aata hai = diamond)
        "B2": 240, "B3": 120, "B4": 140,
        "B6": "=SUM(B2:B4)",   # Subtotal
        "B7": "=B6*18%",       # GST
        "B8": "=B6+B7",        # Total
    },
    "gst_loop": {  # reel ka asli cycle: Subtotal = Total - GST
        "B2": 240, "B3": 120, "B4": 140,
        "B6": "=B8-B7",
        "B7": "=B6*18%",
        "B8": "=B6+B7",
    },
    "salary": {  # bada sheet, koi cycle nahi
        "A1": 50000,            # basic
        "A2": "=A1*40%",        # HRA
        "A3": "=A1*12%",        # PF
        "A4": "=A1+A2",         # gross
        "A5": "=A4-A3",         # in-hand before tax
        "A6": "=A5*10%",        # tax
        "A7": "=A5-A6",         # in-hand
        "A8": "=A7*12",         # yearly
    },
    "self_ref": {"C1": "=C1+1"},  # khud ko hi chahiye
    "hidden_loop": {  # pehle 3 cell theek, loop D1 -> E1 -> F1 -> D1 andar chhupa hai
        "A1": 10, "B1": "=A1*2", "C1": "=B1+A1",
        "D1": "=F1+1", "E1": "=D1*2", "F1": "=E1-C1",
    },
}

REF = re.compile(r"\b([A-Z])(\d+)\b")


def expand(formula):
    """SUM(B2:B4) -> (B2+B3+B4)  (same column ranges only)."""
    def rng(m):
        col, a, b = m.group(1), int(m.group(2)), int(m.group(4))
        return "(" + "+".join(f"{col}{i}" for i in range(a, b + 1)) + ")"
    return re.sub(r"SUM\(([A-Z])(\d+):([A-Z])(\d+)\)", rng, formula)


def needs_of(sheet):
    """cell -> list of cells its formula needs (directed edges)."""
    needs = {}
    for cell, v in sheet.items():
        deps = []
        if isinstance(v, str) and v.startswith("="):
            for col, row in REF.findall(expand(v[1:])):
                ref = f"{col}{row}"
                if ref not in deps:
                    deps.append(ref)
        needs[cell] = deps
    return needs


def evaluate(sheet):
    """Sirf tab chalao jab cycle nahi hai. Har cell ek baar calculate (memo)."""
    vals = {}
    busy = set()

    def val(cell):
        if cell in vals:
            return vals[cell]
        if cell in busy:
            raise RecursionError(cell)
        busy.add(cell)
        v = sheet.get(cell, 0)
        if isinstance(v, str) and v.startswith("="):
            expr = expand(v[1:]).replace("%", "/100")
            expr = REF.sub(lambda m: f"({val(m.group(0))})", expr)
            v = eval(expr, {"__builtins__": {}})  # sirf numbers + operators bache hain
        vals[cell] = v
        return v

    for c in sheet:
        val(c)
    return vals


def show(name, sheet, find_cycle):
    needs = needs_of(sheet)
    loop = find_cycle(needs)
    print(f"\n=== {name} ===")
    if loop:
        print("  #REF!  Circular reference: " + " → ".join(loop))
        return loop
    try:
        vals = evaluate(sheet)
    except RecursionError:
        print("  #REF!  gol chakkar hai, par tumhare find_cycle() ne nahi pakda!")
        return None
    for c in sheet:
        f = sheet[c] if isinstance(sheet[c], str) else ""
        print(f"  {c:<4} {f:<14} = {round(vals[c], 2):g}")
    return None


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def is_real_loop(loop, needs):
    if not loop or len(loop) < 2 or loop[0] != loop[-1]:
        return False
    return all(loop[i + 1] in needs.get(loop[i], []) for i in range(len(loop) - 1))


def tests(find_cycle):
    print("\n=== TESTS ===")
    ok = True
    n = needs_of(SHEETS["gst_bill"])
    ok &= _check("gst_bill: koi cycle nahi (diamond = 2 raaste, 1 cell)", find_cycle(n) is None)
    ok &= _check("gst_bill: Total = 590", round(evaluate(SHEETS["gst_bill"])["B8"]) == 590)
    n = needs_of(SHEETS["gst_loop"])
    loop = find_cycle(n)
    ok &= _check(f"gst_loop: cycle mila aur sahi loop hai  (tumhara: {loop})", is_real_loop(loop, n))
    ok &= _check("salary: koi cycle nahi", find_cycle(needs_of(SHEETS["salary"])) is None)
    n = needs_of(SHEETS["self_ref"])
    ok &= _check("self_ref: C1 → C1", find_cycle(n) == ["C1", "C1"])
    n = needs_of(SHEETS["hidden_loop"])
    loop = find_cycle(n)
    ok &= _check(f"hidden_loop: D1/E1/F1 wala loop  (tumhara: {loop})", is_real_loop(loop, n) and set(loop) == {"D1", "E1", "F1"})
    quiz = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": ["E"], "E": []}
    ok &= _check("pinned quiz: A→B, A→C, B→D, C→D, D→E = koi cycle nahi", find_cycle(quiz) is None)
    print("\nTESTS PASSED ✅" if ok else "\nKUCH TESTS FAIL ❌  (hint: wapas aate waqt path se nikalo!)")
    return ok


def run(find_cycle):
    for name, sheet in SHEETS.items():
        show(name, sheet, find_cycle)
    tests(find_cycle)
