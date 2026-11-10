# ============================================================================
#  Leaderboard Merge  ·  READY FILE (Python)  ·  @confuse__coder
#  Data, comparison counter, bubble-sort race, printing aur tests yahan hain.
#  Isse chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
import random
import time

random.seed(23)
NAMES = ["Aarav", "Diya", "Kabir", "Isha", "Rohan", "Meera", "Arjun", "Sara", "Vivaan", "Anaya"]

# Do game servers, dono ka leaderboard ALREADY sorted (chhota score pehle)
SERVER_A = sorted(random.sample(range(100, 1000), 6))
SERVER_B = sorted(random.sample(range(100, 1000), 6))

comparisons = 0


def less(a, b):
    """a < b ? Har comparison yahan se karo, taaki hum gin sakein."""
    global comparisons
    comparisons += 1
    return a < b


def bubble_sort(a):
    a = a[:]
    n = len(a)
    for i in range(n):
        for j in range(n - 1 - i):
            if less(a[j + 1], a[j]):
                a[j], a[j + 1] = a[j + 1], a[j]
    return a


def _check(name, got, want):
    ok = got == want
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    if not ok:
        print(f"         chahiye: {want[:10]}{' ...' if len(want) > 10 else ''}")
        print(f"         mila   : {(got or [])[:10]}{' ...' if got and len(got) > 10 else ''}")
    return ok


def run(merge, merge_sort):
    global comparisons
    print("\n=== 1. Do servers ke leaderboard MERGE karo ===")
    print("Server A:", SERVER_A)
    print("Server B:", SERVER_B)
    comparisons = 0
    board = merge(SERVER_A, SERVER_B)
    print("Merged  :", board, f"  ({comparisons} comparisons, 12 numbers)")
    if board:
        print("\nTOP 3:")
        for rank, score in enumerate(reversed(board[-3:]), 1):
            print(f"  #{rank}  {NAMES[score % len(NAMES)]:<7} {score}")

    print("\n=== 2. Tests ===")
    ok = True
    ok &= _check("merge([1,4,9], [2,3,10])", merge([1, 4, 9], [2, 3, 10]), [1, 2, 3, 4, 9, 10])
    ok &= _check("merge([], [5,6])", merge([], [5, 6]), [5, 6])
    ok &= _check("merge([7], [])", merge([7], []), [7])
    ok &= _check("merge duplicates", merge([2, 2, 5], [2, 3]), [2, 2, 2, 3, 5])
    ok &= _check("merge_sort reel wala array", merge_sort([38, 27, 43, 3, 9, 82, 10, 15]), [3, 9, 10, 15, 27, 38, 43, 82])
    ok &= _check("merge_sort([])", merge_sort([]), [])
    ok &= _check("merge_sort([5])", merge_sort([5]), [5])
    big = [random.randint(0, 10**6) for _ in range(5000)]
    ok &= _check("merge_sort 5000 random", merge_sort(big), sorted(big))

    if ok:
        print("\n=== 3. RACE: 4000 numbers ===")
        data = [random.randint(0, 10**6) for _ in range(4000)]
        comparisons = 0; t0 = time.perf_counter(); bubble_sort(data); tb = time.perf_counter() - t0; cb = comparisons
        comparisons = 0; t0 = time.perf_counter(); merge_sort(data); tm = time.perf_counter() - t0; cm = comparisons
        print(f"  Bubble sort : {cb:>10,} comparisons  {tb:.3f}s")
        print(f"  Merge sort  : {cm:>10,} comparisons  {tm:.3f}s")
        print(f"  Merge sort ~{cb // max(cm, 1)}x kam kaam. 1 crore pe ye fark 2 lakh guna ho jaata hai!")
    print("\n" + ("TESTS PASSED  (comment karke batao kitne comparisons aaye!)" if ok else "TESTS FAILED  (hint README mein hai)"))
