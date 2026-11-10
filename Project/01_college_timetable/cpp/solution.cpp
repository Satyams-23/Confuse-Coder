// ============================================================================
//  College Timetable Generator  ·  SOLUTION  ·  @confuse__coder EP 11
//  Pehle starter.cpp khud try karo! Atak jao tabhi yahan dekho.
//  Run:  g++ solution.cpp -o solution && ./solution
// ============================================================================
#include "timetable.h"

bool solve(int i) {
    if (i == (int)lectures.size()) return true;              // 1. BASE: sab placed

    for (int s = 0; s < (int)slots.size(); s++) {            // 2. TRY: har slot
        for (int r = 0; r < (int)rooms.size(); r++) {        //         har room
            string reason;
            if (!isSafe(i, s, r, reason)) {                  //    pruning
                logTry(i, s, r, false, reason);
                continue;
            }
            logTry(i, s, r, true, "");
            place(i, s, r);                                  //    choose
            if (solve(i + 1)) return true;                   //    TWIST: ek answer kaafi, ruk jao
            unplace(i, s, r);                                // 3. UNDO
        }
    }
    logDeadEnd(i);                                           // koi option nahi chala
    return false;
}
