// ============================================================================
//  UPI Change Maker  ·  SOLUTION (C++)  ·  @confuse__coder
// ============================================================================
#include "upi.h"

void backtrack(int amt, int start, const vector<int>& coins, vector<int>& path, vector<vector<int>>& out) {
    if (amt == 0) { out.push_back(path); return; }   // ZERO  -> answer
    if (amt < 0) return;                             // MINUS -> wapas
    for (int i = start; i < (int)coins.size(); i++) { // TRY   -> start se, peeche mat mudo
        path.push_back(coins[i]);                    // lo
        backtrack(amt - coins[i], i, coins, path, out);  // aage (i: wahi coin dobara)
        path.pop_back();                             // hatao
    }
}
