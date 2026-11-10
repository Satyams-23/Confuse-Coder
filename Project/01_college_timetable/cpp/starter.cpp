// ============================================================================
//  College Timetable Generator  ·  STARTER  ·  @confuse__coder EP 11
//
//  Kaam: sirf solve() likho (~15 lines). Baaki sab timetable.h mein ready hai.
//  Run:  g++ starter.cpp -o starter && ./starter
//  Jab "TESTS PASSED" aaye, samjho ho gaya!
// ============================================================================
#include "timetable.h"

// solve(i) = lecture i se lekar aakhri lecture tak sabko jagah do.
// Sab ko jagah mil gayi toh true, warna false.
//
// Wahi Sudoku wala pattern:
//   1. BASE  : i == lectures.size()?  Sab placed -> return true
//   2. TRY   : har slot s, har room r:
//                isSafe(i, s, r, reason)?  nahi -> logTry(..., false, reason), continue
//                haan -> logTry(..., true, ""), place(i, s, r)
//                        if (solve(i + 1)) return true;     // TWIST: ek answer kaafi
//   3. UNDO  :           unplace(i, s, r)
//   Koi option nahi chala -> logDeadEnd(i), return false
//
// Helpers (timetable.h): isSafe, place, unplace, logTry, logDeadEnd
// Sizes: lectures.size(), slots.size(), rooms.size()

bool solve(int i) {
    (void)i;  // ye line hata dena jab solve() likho
    // TODO: yahan likho
    return false;
}

