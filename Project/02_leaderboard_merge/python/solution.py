# Leaderboard Merge · SOLUTION (Python) · @confuse__coder  (pehle khud try karna!)
from leaderboard import less, run


def merge(left, right):
    out, i, j = [], 0, 0
    while i < len(left) and j < len(right):
        if less(right[j], left[i]):      # right chhota -> pehle (barabar ho toh left pehle = stable)
            out.append(right[j]); j += 1
        else:
            out.append(left[i]); i += 1
    out.extend(left[i:])
    out.extend(right[j:])
    return out


def merge_sort(a):
    if len(a) <= 1:                      # BASE: 1 number = already sorted
        return a[:]
    m = len(a) // 2
    return merge(merge_sort(a[:m]), merge_sort(a[m:]))   # LEFT, RIGHT, MERGE


run(merge, merge_sort)
