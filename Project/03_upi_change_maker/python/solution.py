# ============================================================================
#  UPI Change Maker  ·  SOLUTION (Python)  ·  @confuse__coder
# ============================================================================
from upi import run


def backtrack(amt, start, coins, path, out):
    if amt == 0:                       # ZERO -> answer
        out.append(path[:])
        return
    if amt < 0:                        # MINUS -> wapas
        return
    for i in range(start, len(coins)): # TRY -> start se, peeche mat mudo
        path.append(coins[i])          # lo
        backtrack(amt - coins[i], i, coins, path, out)   # aage (i, kyunki wahi coin dobara le sakte ho)
        path.pop()                     # hatao


run(backtrack)
