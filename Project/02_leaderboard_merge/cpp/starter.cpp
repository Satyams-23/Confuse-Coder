// ============================================================================
//  Leaderboard Merge  ·  STARTER (C++)  ·  @confuse__coder
//
//  Kaam: merge() aur mergeSort() likho (~18 lines total).
//  Comparison ke liye  less_(x, y)  use karo (x < y ki jagah), taaki race mein gin sakein.
//  Run:  g++ -O2 -std=c++17 starter.cpp -o starter && ./starter
// ============================================================================
#include "leaderboard.h"

// Do SORTED lists -> ek sorted list.  Reel wali do ungliyan:
//   i = 0, j = 0
//   jab tak dono mein number bache: jo chhota (less_), woh pehle -> uski ungli aage
//   jo list bach gayi, uske baaki numbers end mein jod do
vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> out;
    // TODO: yahan likho
    return out;
}

// Teen steps:
//   BASE : a.size() <= 1 -> already sorted, return a
//   m = a.size() / 2
//   LEFT  = mergeSort(pehla half)     <- recursion pe bharosa
//   RIGHT = mergeSort(doosra half)
//   MERGE : return merge(LEFT, RIGHT)
vector<int> mergeSort(const vector<int>& a) {
    // TODO: yahan likho
    return a;
}
