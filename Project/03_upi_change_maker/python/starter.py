# ============================================================================
#  UPI Change Maker  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: backtrack() likho (~10 lines). Reel ke teen steps:
#    amt == 0  -> answer mil gaya, path ki COPY out mein daalo
#    amt < 0   -> wapas jao
#    warna     -> har coin try karo: lo (append), aage jao, phir hatao (pop)
#  Yaad rakho reel wali galti: loop 0 se nahi, START se chalao!
#  Run:  python starter.py      ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from upi import run


def backtrack(amt, start, coins, path, out):
    """amt   : abhi kitna paisa bacha hai
       start : kis coin se try shuru karna hai (peeche mat mudo)
       coins : sorted coins, e.g. [2, 3, 5]
       path  : abhi tak liye hue coins
       out   : saare answers yahan jodo (out.append(path[:]))
    """
    # TODO: yahan likho
    pass


run(backtrack)
