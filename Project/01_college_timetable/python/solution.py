# ============================================================================
#  College Timetable Generator  ·  SOLUTION (Python)  ·  @confuse__coder
#  Pehle starter.py khud try karo! Atak jao tabhi yahan dekho.
#  Run:  python solution.py
# ============================================================================
from timetable import lectures, slots, rooms, is_safe, place, unplace, log_try, log_dead_end, run


def solve(i):
    if i == len(lectures):                     # 1. BASE: sab placed
        return True
    for s in range(len(slots)):                # 2. TRY: har slot
        for r in range(len(rooms)):            #         har room
            ok, reason = is_safe(i, s, r)
            if not ok:                         #    pruning
                log_try(i, s, r, False, reason)
                continue
            log_try(i, s, r, True)
            place(i, s, r)                     #    choose
            if solve(i + 1):                   #    TWIST: ek answer kaafi, ruk jao
                return True
            unplace(i, s, r)                   # 3. UNDO
    log_dead_end(i)                            # koi option nahi chala
    return False


run(solve)
