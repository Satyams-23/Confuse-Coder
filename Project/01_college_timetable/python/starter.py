# ============================================================================
#  College Timetable Generator  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: sirf solve() likho (~12 lines). Baaki sab timetable.py mein ready hai.
#  Run:  python starter.py
#  Jab "TESTS PASSED" aaye, samjho ho gaya!
# ============================================================================
from timetable import lectures, slots, rooms, is_safe, place, unplace, log_try, log_dead_end, run


def solve(i):
    """Lecture i se lekar aakhri lecture tak sabko jagah do. Sab placed -> True, warna False.

    Wahi Sudoku wala pattern:
      1. BASE : i == len(lectures)?  Sab placed -> return True
      2. TRY  : har slot s, har room r:
                  ok, reason = is_safe(i, s, r)
                  nahi -> log_try(i, s, r, False, reason), continue
                  haan -> log_try(i, s, r, True), place(i, s, r)
                          if solve(i + 1): return True        # TWIST: ek answer kaafi
      3. UNDO :           unplace(i, s, r)
      Koi option nahi chala -> log_dead_end(i), return False
    """
    # TODO: yahan likho
    return False


run(solve)
