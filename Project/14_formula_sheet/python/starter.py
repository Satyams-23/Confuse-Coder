# ============================================================================
#  Formula Sheet  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: sirf ek function likho, find_cycle(needs)   (~15 lines, reel wala dhaaga)
#    needs = {"B8": ["B6", "B7"], "B7": ["B6"], ...}   (cell -> jo cells use chahiye)
#    Koi gol chakkar hai toh poora loop return karo, start = end:  ["B6", "B8", "B6"]
#    Nahi hai toh None.
#
#  Tips:
#    - path  = abhi ka raasta (khula dhaaga), LIST rakho taaki loop print kar sako
#    - done  = jin cells ka dhaaga lipat chuka (dobara check mat karo)
#    - next cell path mein mila  ->  cycle!  path[us cell se aage] + [wahi cell]
#    - wapas aate waqt: path.pop() aur done mein daalo   <- reel wali EK LINE
#    - har cell se shuru karke dekho (loop kahin bhi chhupa ho sakta hai)
#
#  Run:  python starter.py   ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from sheet import run


def find_cycle(needs):
    # TODO: yahan likho
    return None


if __name__ == "__main__":
    run(find_cycle)
