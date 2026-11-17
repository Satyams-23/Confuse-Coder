# ============================================================================
#  Island Counter  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: sirf ek function likho, dfs(g, r, c, label)   (~8 lines, reel wala DFS)
#    - (r, c) map ke bahar hai, ya wahan zameen ('1') nahi hai  ->  return 0
#        DHYAAN: r < 0 aur c < 0 bhi check karo! Python mein g[-1] = aakhri row (reel ka donut bug)
#    - warna jhanda gaado:  g[r][c] = label      (dobara nahi aana)
#    - chaaron taraf jao: neeche, upar, right, left
#    - return: is island ke kitne khaane paint kiye (1 + chaaron ka total)
#
#  Run:  python starter.py                    ->  "TESTS PASSED" aaye toh ho gaya!
#        python starter.py --image photo.png  ->  apni satellite photo ke islands gino (pip install pillow)
# ============================================================================
from islands import run


def dfs(g, r, c, label):
    # TODO: yahan likho
    return 0


if __name__ == "__main__":
    run(dfs)
