# ============================================================================
#  College Timetable Generator  ·  @confuse__coder
#  Ye file READY hai. Isme data, helpers, printing aur tests hain.
#  Tumhe sirf starter.py mein solve() likhna hai.
# ============================================================================

# ---------------------------------------------------------------------------
#  1) APNA COLLEGE DATA YAHAN BADLO
# ---------------------------------------------------------------------------
# (section, subject, teacher): har section ko Monday ko har subject ka ek lecture chahiye
lectures = [
    ("CSE-A", "Maths", "Rahul"), ("CSE-A", "Physics", "Amit"), ("CSE-A", "Chemistry", "Priya"),
    ("CSE-B", "Maths", "Rahul"), ("CSE-B", "Physics", "Amit"), ("CSE-B", "Chemistry", "Priya"),
]
slots = ["9-10", "10-11", "11-12"]
rooms = ["Room 101", "Room 102"]

# ---------------------------------------------------------------------------
#  2) STATE  (kaunsa lecture kahan baitha hai, kaun busy hai)
# ---------------------------------------------------------------------------
slot_of = [-1] * len(lectures)
room_of = [-1] * len(lectures)
busy = set()  # ("teacher", "Rahul", s), ("section", "CSE-A", s), ("room", "Room 101", s)


# ---------------------------------------------------------------------------
#  3) HELPERS  (inhe solve() mein use karo)
# ---------------------------------------------------------------------------
def is_safe(i, s, r):
    """Lecture i ko (slot s, room r) mein rakhna safe hai?
    Teen rules (Sudoku ke row / column / box jaise): teacher, section, room us time free hon.
    Returns (True, "") ya (False, reason)."""
    section, _, teacher = lectures[i]
    if ("teacher", teacher, s) in busy:
        return False, f"{teacher} busy"
    if ("section", section, s) in busy:
        return False, f"{section} ka lecture already hai"
    if ("room", rooms[r], s) in busy:
        return False, f"{rooms[r]} full"
    return True, ""


def place(i, s, r):
    """Lecture i ko (s, r) mein rakho  (choose)"""
    section, _, teacher = lectures[i]
    slot_of[i], room_of[i] = s, r
    busy.update({("teacher", teacher, s), ("section", section, s), ("room", rooms[r], s)})


def unplace(i, s, r):
    """Lecture i ko (s, r) se hatao  (unchoose / backtrack)"""
    section, _, teacher = lectures[i]
    slot_of[i], room_of[i] = -1, -1
    busy.difference_update({("teacher", teacher, s), ("section", section, s), ("room", rooms[r], s)})


def name(i):
    return f"{lectures[i][0][4:]}-{lectures[i][1]}"


def log_try(i, s, r, ok, reason=""):
    print(f"  {name(i):<13}-> {slots[s]:<7}{rooms[r]}   " + ("OK" if ok else f"X  ({reason})"))


def log_dead_end(i):
    print(f"  {name(i):<13}DEAD END! going back...")


# ---------------------------------------------------------------------------
#  4) PRINT + TESTS + RUN  (ready)
# ---------------------------------------------------------------------------
def print_table():
    line = "  " + "-" * 66
    print("\n  MONDAY TIMETABLE\n" + line)
    print("  Slot   " + "".join(f"| {rm:<27}" for rm in rooms))
    print(line)
    for s, sl in enumerate(slots):
        cells = []
        for r in range(len(rooms)):
            cell = "-"
            for i, (sec, sub, tch) in enumerate(lectures):
                if slot_of[i] == s and room_of[i] == r:
                    cell = f"{sec} {sub} ({tch})"
            cells.append(f"| {cell:<27}")
        print(f"  {sl:<7}" + "".join(cells))
    print(line)


def run_tests():
    """solve() pe bharosa nahi karta: khud se poora timetable dobara check karta hai."""
    ok = True
    n = len(lectures)
    for i in range(n):
        if slot_of[i] < 0 or room_of[i] < 0:
            print(f"  FAIL: {name(i)} ko jagah nahi mili")
            ok = False
    for i in range(n):
        for j in range(i + 1, n):
            if slot_of[i] < 0 or slot_of[i] != slot_of[j]:
                continue
            at = slots[slot_of[i]]
            if lectures[i][2] == lectures[j][2]:
                print(f"  FAIL: teacher clash, {lectures[i][2]} at {at}"); ok = False
            if room_of[i] == room_of[j]:
                print(f"  FAIL: room clash, {rooms[room_of[i]]} at {at}"); ok = False
            if lectures[i][0] == lectures[j][0]:
                print(f"  FAIL: section clash, {lectures[i][0]} at {at}"); ok = False
    print("\n  TESTS PASSED: sab lectures placed, koi clash nahi." if ok else "\n  TESTS FAILED: upar dekho kya galat hai.")
    return ok


def run(solve):
    print("\n  Backtracking trace:")
    if solve(0):
        print("  ALL LECTURES PLACED!")
    else:
        print("  Koi valid timetable nahi mila (ya solve() abhi likha nahi).")
    print_table()
    raise SystemExit(0 if run_tests() else 1)
