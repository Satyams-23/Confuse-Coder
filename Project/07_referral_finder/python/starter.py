# ============================================================================
#  Referral Finder  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: do functions likho.
#   1. bfs(adj, start)        ~12 lines. Reel wala BFS. Queue = deque, aur popleft() (pop() nahi!).
#        return (dist, parent)
#        dist   = {naam: kitni dosti door}, start ka 0. Jahan pahunch nahi sakte, woh dist mein na ho.
#        parent = {naam: kisse pahuncha}, start ka None. Visited + dist push karte waqt set karo.
#   2. get_path(parent, target) ~5 lines. parent ke peeche peeche start tak jao, phir list ulti karo.
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from collections import deque
from network import run


def bfs(adj, start):
    # TODO: yahan likho
    return {}, {}


def get_path(parent, target):
    """e.g. ["Sam", "Dev", "Aditi"]"""
    # TODO: yahan likho
    return []


if __name__ == "__main__":
    run(bfs, get_path)
