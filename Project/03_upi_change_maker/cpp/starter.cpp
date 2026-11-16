// ============================================================================
//  UPI Change Maker  ·  STARTER (C++)  ·  @confuse__coder
//
//  Kaam: backtrack() likho (~10 lines). Reel ke teen steps:
//    amt == 0  -> answer mil gaya, out.push_back(path)
//    amt < 0   -> wapas jao
//    warna     -> har coin try karo: lo (push_back), aage jao, phir hatao (pop_back)
//  Yaad rakho reel wali galti: loop 0 se nahi, START se chalao!
//  Run:  g++ -O2 -std=c++17 starter.cpp -o starter && ./starter
// ============================================================================
#include "upi.h"

void backtrack(int amt, int start, const vector<int>& coins, vector<int>& path, vector<vector<int>>& out) {
    // TODO: yahan likho
}
