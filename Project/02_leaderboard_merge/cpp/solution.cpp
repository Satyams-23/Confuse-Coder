// Leaderboard Merge · SOLUTION (C++) · @confuse__coder  (pehle khud try karna!)
#include "leaderboard.h"

vector<int> merge(const vector<int>& left, const vector<int>& right) {
    vector<int> out;
    size_t i = 0, j = 0;
    while (i < left.size() && j < right.size()) {
        if (less_(right[j], left[i])) out.push_back(right[j++]);   // right chhota -> pehle
        else out.push_back(left[i++]);                              // barabar ho toh left pehle = stable
    }
    while (i < left.size()) out.push_back(left[i++]);
    while (j < right.size()) out.push_back(right[j++]);
    return out;
}

vector<int> mergeSort(const vector<int>& a) {
    if (a.size() <= 1) return a;                                    // BASE: 1 number = already sorted
    size_t m = a.size() / 2;
    vector<int> L = mergeSort(vector<int>(a.begin(), a.begin() + m));   // LEFT
    vector<int> R = mergeSort(vector<int>(a.begin() + m, a.end()));     // RIGHT
    return merge(L, R);                                                  // MERGE
}
