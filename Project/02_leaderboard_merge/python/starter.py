# ============================================================================
#  Leaderboard Merge  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: merge() aur merge_sort() likho (~15 lines total).
#  Comparison ke liye  less(x, y)  use karo (x < y ki jagah), taaki race mein gin sakein.
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from leaderboard import less, run


def merge(left, right):
    """Do SORTED lists -> ek sorted list.  Reel wali do ungliyan:
       i = 0, j = 0
       jab tak dono mein number bache:  jo chhota (less), woh pehle -> uski ungli aage
       jo list bach gayi, uske baaki numbers end mein jod do
    """
    # TODO: yahan likho
    return []


def merge_sort(a):
    """Teen steps:
       BASE : len(a) <= 1  -> already sorted, return a
       m = len(a) // 2
       LEFT  = merge_sort(a[:m])      <- recursion pe bharosa
       RIGHT = merge_sort(a[m:])
       MERGE : return merge(LEFT, RIGHT)
    """
    # TODO: yahan likho
    return a


run(merge, merge_sort)
