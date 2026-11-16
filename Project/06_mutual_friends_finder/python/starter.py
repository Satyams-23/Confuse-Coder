# ============================================================================
#  Mutual Friends Finder  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: do functions likho.
#   1. add_edge(adj, u, v)   ~3 lines. Reel wala bug yaad hai? Dosti DONO taraf jaati hai.
#        adj ek dict hai: naam -> list of dost. Naya naam ho toh pehle khaali list banao.
#   2. suggest(adj, who)     ~8 lines. "Suggested for you" = dost ke dost,
#        jo khud `who` nahi hain aur pehle se dost bhi nahi hain.
#        Order: jiske saath zyada mutual friends, woh pehle. Tie ho toh naam A-Z.
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from friends import run


def add_edge(adj, u, v):
    # TODO: yahan likho
    pass


def suggest(adj, who):
    """return list of names, e.g. ["Aman", "Sam", "Neel"]"""
    # TODO: yahan likho
    return []


run(add_edge, suggest)
