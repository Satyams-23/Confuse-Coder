// ============================================================================
//  College Timetable Generator  ·  @confuse__coder  ·  Recursion EP 11
//  Ye file READY hai. Isme data, helpers, printing aur tests hain.
//  Tumhe sirf starter.cpp mein solve() likhna hai.
// ============================================================================
#pragma once
#include <iostream>
#include <map>
#include <string>
#include <vector>
using namespace std;

// ---------------------------------------------------------------------------
//  1) APNA COLLEGE DATA YAHAN BADLO
// ---------------------------------------------------------------------------
struct Lecture {
    string section;   // kis class ka lecture
    string subject;
    string teacher;
};

// Har section ko Monday ko har subject ka ek lecture chahiye.
vector<Lecture> lectures = {
    {"CSE-A", "Maths", "Rahul"},  {"CSE-A", "Physics", "Amit"}, {"CSE-A", "Chemistry", "Priya"},
    {"CSE-B", "Maths", "Rahul"},  {"CSE-B", "Physics", "Amit"}, {"CSE-B", "Chemistry", "Priya"},
};
vector<string> slots = {"9-10", "10-11", "11-12"};
vector<string> rooms = {"Room 101", "Room 102"};

// ---------------------------------------------------------------------------
//  2) STATE  (kaunsa lecture kahan baitha hai, kaun busy hai)
// ---------------------------------------------------------------------------
vector<int> slotOf(lectures.size(), -1), roomOf(lectures.size(), -1);
map<string, vector<bool>> teacherBusy, sectionBusy, roomBusy;

// ---------------------------------------------------------------------------
//  3) HELPERS  (inhe solve() mein use karo)
// ---------------------------------------------------------------------------

// Lecture i ko (slot s, room r) mein rakhna safe hai?
// Teen rules (Sudoku ke row / column / box jaise):
//   teacher us time free ho, room us time free ho, section us time free ho.
// Agar safe nahi, toh `reason` mein likh deta hai kyun.
bool isSafe(int i, int s, int r, string &reason) {
    const Lecture &L = lectures[i];
    if (teacherBusy[L.teacher][s]) { reason = L.teacher + " busy"; return false; }
    if (sectionBusy[L.section][s]) { reason = L.section + " ka lecture already hai"; return false; }
    if (roomBusy[rooms[r]][s])     { reason = rooms[r] + " full"; return false; }
    return true;
}

// Lecture i ko (s, r) mein rakho  (choose)
void place(int i, int s, int r) {
    const Lecture &L = lectures[i];
    slotOf[i] = s; roomOf[i] = r;
    teacherBusy[L.teacher][s] = sectionBusy[L.section][s] = roomBusy[rooms[r]][s] = true;
}

// Lecture i ko (s, r) se hatao  (unchoose / backtrack)
void unplace(int i, int s, int r) {
    const Lecture &L = lectures[i];
    slotOf[i] = roomOf[i] = -1;
    teacherBusy[L.teacher][s] = sectionBusy[L.section][s] = roomBusy[rooms[r]][s] = false;
}

// Trace print karne ke liye (optional, par dekhne mein maza aata hai)
string name(int i) { return lectures[i].section.substr(4) + "-" + lectures[i].subject; }
void logTry(int i, int s, int r, bool ok, const string &reason) {
    cout << "  " << name(i) << string(13 - name(i).size(), ' ') << "-> " << slots[s] << string(7 - slots[s].size(), ' ')
         << rooms[r] << "   " << (ok ? "OK" : "X  (" + reason + ")") << "\n";
}
void logDeadEnd(int i) { cout << "  " << name(i) << string(13 - name(i).size(), ' ') << "DEAD END! going back...\n"; }

// ---------------------------------------------------------------------------
//  4) TUMHARA FUNCTION (starter.cpp mein likho)
// ---------------------------------------------------------------------------
bool solve(int i);

// ---------------------------------------------------------------------------
//  5) PRINT + TESTS + MAIN  (ready)
// ---------------------------------------------------------------------------
void printTable() {
    cout << "\n  MONDAY TIMETABLE\n  " << string(66, '-') << "\n  " << "Slot   ";
    for (auto &rm : rooms) cout << "| " << rm << string(27 - rm.size(), ' ');
    cout << "\n  " << string(66, '-') << "\n";
    for (int s = 0; s < (int)slots.size(); s++) {
        cout << "  " << slots[s] << string(7 - slots[s].size(), ' ');
        for (int r = 0; r < (int)rooms.size(); r++) {
            string cell = "-";
            for (int i = 0; i < (int)lectures.size(); i++)
                if (slotOf[i] == s && roomOf[i] == r) cell = lectures[i].section + " " + lectures[i].subject + " (" + lectures[i].teacher + ")";
            cout << "| " << cell << string(cell.size() < 27 ? 27 - cell.size() : 1, ' ');
        }
        cout << "\n";
    }
    cout << "  " << string(66, '-') << "\n";
}

// solve() pe bharosa nahi karta: khud se poora timetable dobara check karta hai.
bool runTests() {
    bool ok = true;
    int n = lectures.size();
    for (int i = 0; i < n; i++)
        if (slotOf[i] < 0 || roomOf[i] < 0) { cout << "  FAIL: " << name(i) << " ko jagah nahi mili\n"; ok = false; }
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++) {
            if (slotOf[i] < 0 || slotOf[j] < 0 || slotOf[i] != slotOf[j]) continue;
            if (lectures[i].teacher == lectures[j].teacher) { cout << "  FAIL: teacher clash, " << lectures[i].teacher << " at " << slots[slotOf[i]] << "\n"; ok = false; }
            if (roomOf[i] == roomOf[j])                     { cout << "  FAIL: room clash, " << rooms[roomOf[i]] << " at " << slots[slotOf[i]] << "\n"; ok = false; }
            if (lectures[i].section == lectures[j].section) { cout << "  FAIL: section clash, " << lectures[i].section << " at " << slots[slotOf[i]] << "\n"; ok = false; }
        }
    cout << (ok ? "\n  TESTS PASSED: sab lectures placed, koi clash nahi.\n" : "\n  TESTS FAILED: upar dekho kya galat hai.\n");
    return ok;
}

int main() {
    for (auto &L : lectures) {
        teacherBusy[L.teacher].assign(slots.size(), false);
        sectionBusy[L.section].assign(slots.size(), false);
    }
    for (auto &rm : rooms) roomBusy[rm].assign(slots.size(), false);

    cout << "\n  Backtracking trace:\n";
    bool found = solve(0);
    if (found) cout << "  ALL LECTURES PLACED!\n";
    else cout << "  Koi valid timetable nahi mila (ya solve() abhi likha nahi).\n";
    printTable();
    return runTests() ? 0 : 1;
}
