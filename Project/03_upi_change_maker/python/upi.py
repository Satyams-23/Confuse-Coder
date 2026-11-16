# ============================================================================
#  UPI Change Maker  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================


def _count_dp(bill, coins):
    """Reference counter (DP, Coin Change II) - sirf tests ke liye."""
    ways = [1] + [0] * bill
    for c in coins:
        for x in range(c, bill + 1):
            ways[x] += ways[x - c]
    return ways[bill]


def find_ways(backtrack, bill, coins):
    out = []
    backtrack(bill, 0, sorted(coins), [], out)
    return out


def show(way):
    return " + ".join(f"Rs{c}" for c in way)


def _check(name, ok, extra=""):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}{('  ' + extra) if extra and not ok else ''}")
    return ok


def run(backtrack):
    print("=== 1. CHAI TAPRI (reel wala) ===")
    bill, coins = 8, [2, 3, 5]
    ways = find_ways(backtrack, bill, coins)
    print(f"Bill Rs{bill}, galla mein coins {coins}")
    for i, w in enumerate(ways, 1):
        print(f"  {i}. {show(w)}")
    if ways:
        best = min(ways, key=len)
        print(f"Shopkeeper ka favourite (kam se kam coins): {show(best)}  ({len(best)} coins)")
    print(f"Total: {len(ways)} tareeke")

    print("\n=== 2. TESTS ===")
    ok = True
    ok &= _check("Rs8 with 2,3,5 = 3 tareeke", sorted(map(tuple, ways)) == [(2, 2, 2, 2), (2, 3, 3), (3, 5)], f"mila: {ways}")
    ok &= _check("koi duplicate nahi (2 3 3 / 3 2 3 / 3 3 2 = ek hi)", len({tuple(sorted(w)) for w in ways}) == len(ways))
    w4 = find_ways(backtrack, 4, [1, 2])
    ok &= _check("Rs4 with 1,2 = 3 tareeke (pinned comment wala)", len(w4) == 3, f"mila: {w4}")
    w7 = find_ways(backtrack, 7, [2, 4])
    ok &= _check("Rs7 with 2,4 = 0 tareeke (odd bill, even coins)", w7 == [], f"mila: {w7}")
    big = find_ways(backtrack, 50, [1, 2, 5, 10, 20])
    exp = _count_dp(50, [1, 2, 5, 10, 20])
    ok &= _check(f"Rs50 with 1,2,5,10,20 = {exp} tareeke", len(big) == exp, f"mila: {len(big)}")
    ok &= _check("har tareeke ka total = bill", all(sum(w) == 50 for w in big) and all(sum(w) == 8 for w in ways))

    print("\nTESTS PASSED" if ok else "\nTESTS FAILED  (hint README mein hai)")
