# ============================================================================
#  Shaadi Planner  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================

# (pehle, baad): "pehle" wala kaam khatam hone ke baad hi "baad" wala ho sakta hai.
SHAADI = [
    ("Venue book", "Card print"), ("Guest list", "Card print"), ("Card print", "Card baanto"),
    ("Venue book", "Caterer book"), ("Caterer book", "Menu tasting"), ("Venue book", "Decoration"),
    ("Shopping", "Mehendi"), ("Shopping", "Sangeet"),
    ("Card baanto", "Shaadi"), ("Menu tasting", "Shaadi"), ("Decoration", "Shaadi"),
    ("Mehendi", "Shaadi"), ("Sangeet", "Shaadi"),
]

# reel wale 6 kapde
KAPDE = [("Shirt", "Tie"), ("Shirt", "Belt"), ("Pant", "Belt"), ("Pant", "Joote"), ("Mozey", "Joote")]

# loop: caterer bolta hai "pehle guest count do", family bolti hai "pehle menu batao"
LOOP = [("Venue book", "Guest count"), ("Guest count", "Menu final"), ("Menu final", "Guest count"), ("Menu final", "Shaadi")]


def build(pairs):
    """tasks (first-seen order) + after = {task: [jo iske baad aate hain]}"""
    tasks, after = [], {}
    for a, b in pairs:
        for x in (a, b):
            if x not in after:
                after[x] = []
                tasks.append(x)
        after[a].append(b)
    return tasks, after


def show(name, pairs, topo_days):
    tasks, after = build(pairs)
    days, stuck = topo_days(tasks, after)
    print(f"\n=== {name} ===")
    for i, d in enumerate(days, 1):
        print(f"  Din {i}: " + ", ".join(d))
    if stuck:
        print("  ⚠ Phanse hue kaam (gol chakkar): " + ", ".join(stuck))
    return days, stuck


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def valid(days, pairs):
    """har (pehle, baad) mein pehle wala strictly pehle din pe ho"""
    day = {t: i for i, d in enumerate(days) for t in d}
    return all(a in day and b in day and day[a] < day[b] for a, b in pairs)


def tests(topo_days):
    print("\n=== TESTS ===")
    ok = True
    t, a = build(SHAADI)
    days, stuck = topo_days(t, a)
    ok &= _check("shaadi: har kaam apni dependency ke baad", valid(days, SHAADI) and not stuck)
    ok &= _check(f"shaadi: 4 din mein ho jaata hai (tumhara: {len(days)})", len(days) == 4)
    ok &= _check("shaadi: Din 1 = Venue book, Guest list, Shopping", days[:1] == [["Venue book", "Guest list", "Shopping"]])
    ok &= _check("shaadi: Shaadi sabse aakhri din, akeli", days[-1:] == [["Shaadi"]])
    t, a = build(KAPDE)
    days, stuck = topo_days(t, a)
    ok &= _check("kapde: Din 1 = Shirt, Pant, Mozey", days[:1] == [["Shirt", "Pant", "Mozey"]] and valid(days, KAPDE))
    t, a = build(LOOP)
    days, stuck = topo_days(t, a)
    ok &= _check(f"loop: phanse kaam = Guest count, Menu final, Shaadi  (tumhara: {stuck})", sorted(stuck) == ["Guest count", "Menu final", "Shaadi"])
    ok &= _check("loop: Venue book phir bhi ho jaata hai", days[:1] == [["Venue book"]])
    print("\nTESTS PASSED ✅" if ok else "\nKUCH TESTS FAIL ❌  (hint: har din indegree 0 wale saare kaam ek saath)")
    return ok


def run(topo_days):
    show("Shaadi", SHAADI, topo_days)
    show("Interview ke kapde", KAPDE, topo_days)
    show("Gol chakkar", LOOP, topo_days)
    tests(topo_days)
