# ============================================================================
#  Newspaper Word Puzzle Solver  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: dfs() likho (~15 lines). Reel ke teen steps + do line ka fix:
#    k == len(word)                      -> True (poora word mil gaya)
#    grid se bahar, ya letter match nahi  -> False
#    MARK   : g[r][c] = '#'   (ab dobara is khaane pe nahi aa sakte)
#    chaaron direction mein recursion (upar, neeche, left, right)
#    UNMARK : g[r][c] = wapas original letter (doosra raasta use kar sake)
#  Bonus: path mein (r, c) jodo, aur fail ho toh hata do - tabhi grid pe highlight dikhega.
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from puzzle import run


def dfs(g, word, r, c, k, path):
    """g    : letters ka grid (list of lists), tum isme '#' laga sakte ho
       word : dhoondhna wala word
       r, c : abhi kis khaane pe ho
       k    : word ka kaunsa letter match karna hai
       path : ab tak ke khaane [(r, c), ...]
       return True agar yahan se baaki word mil gaya
    """
    # TODO: yahan likho
    return False


run(dfs)
