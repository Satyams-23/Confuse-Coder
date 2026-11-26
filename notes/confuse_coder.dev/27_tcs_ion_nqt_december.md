# TCS iON NQT December 2026: pattern, topics, samples and what comes after
*@confuse__coder.dev · DEV 27 · Reel: "1 test = 4000+ companies"*

---

## 1. Ek line mein
TCS iON NQT ek test hai jiska score **2 saal valid** rehta hai aur **4000+ companies** (TCS bhi) use karti hain. December test **25 December 2026** ko hai, apply karne ki last date **14 December 2026**.

**Official page:** [tcsion.com/hub/national-qualifier-test](https://www.tcsion.com/hub/national-qualifier-test/)
Registration sirf isi official page se karo. Kisi agent ko paise mat do.

## 2. Important facts (official page se, 26 Nov 2026 ko check kiya)

| Cheez | Detail |
|---|---|
| Test date | 25 Dec 2026 (hall ticket 2 din pehle email pe) |
| Last date | 14 Dec 2026 |
| Mode | Sirf in-centre, TCS iON Authorised Exam Centres (ghar se nahi) |
| Language | Sirf English |
| Negative marking | Nahi |
| Pass / fail | Koi cut-off nahi. Aapko sirf ek score milta hai |
| Score validity | Result aane ke din se 2 saal |
| Retake | Jitni baar chaho. Sirf best score count hota hai |

## 3. Kaun de sakta hai
- UG, PG ya Diploma, **pre-final ya final year** mein.
- **2022 se 2028** tak ka passout, koi bhi degree aur specialisation.
- Freshers jinke paas **2 saal se kam** experience hai.
- Age: **17 se 30 saal**.

## 4. Kaunsa test chunein (fee)

| Variant | Kya check hota hai | Fee |
|---|---|---|
| Cognitive | Verbal, Reasoning, Numerical | ₹599 |
| IT | Cognitive + advanced aptitude + coding | ₹999 |
| BFSI | Basic aptitude + banking/finance knowledge | ₹999 |
| Non-Tech | Quantitative, verbal, general mental ability | ₹599 |

**Software / IT job chahiye toh IT variant lo.** Official page kehta hai IT variant "single comprehensive test" hai jo TCS samet top companies ki jobs ke liye hai. Prep Pack waale bundles mehenge hain, aur practice tests aur course alag se bhi khareede ja sakte hain.

## 5. Test pattern (IT variant)
TCS ne section-wise exact question count official page pe nahi diya hai. Neeche wala pattern haal ke candidates aur prep guides ka hai, aur har cycle mein thoda badal sakta hai.

| Part | Section | Questions | Time |
|---|---|---|---|
| Foundation | Numerical Ability | ~20 | ~25 min |
| Foundation | Verbal Ability | ~25 | ~25 min |
| Foundation | Reasoning Ability | ~20 | ~25 min |
| Advanced | Advanced Quant + Reasoning | ~15 | ~25 min |
| Advanced | Advanced Coding | 2 (kuch guides 3 kehti hain) | ~90 min |

- Total lagbhag **190 minute**, ~83 questions.
- Har section ka apna timer hota hai. Ek section khatam hone ke baad usme wapas nahi ja sakte. Isliye kisi ek question pe atko mat.
- Coding mein C, C++, Java, Python milte hain (list cycle ke hisaab se badalti hai).
- Psychometric assessment bhi hota hai. Iska koi right/wrong nahi hota, bas honestly answer karo.

## 6. Kis topic se questions aate hain

**Numerical Ability** (official: number system, arithmetic, elementary statistics, data interpretation)
- Percentages, profit and loss, simple/compound interest
- Ratio, averages, mixtures
- Time and work, pipes and cisterns, speed-time-distance
- HCF/LCM, number series
- Probability, permutation and combination
- Data interpretation: table, bar, pie

**Verbal Ability** (official: grammar, usage, reading comprehension)
- Reading comprehension
- Sentence completion, fill in the blank
- Error spotting, sentence improvement
- Para jumbles (sentences sahi order mein lagana)

**Reasoning Ability** (official: word and number patterns, problem-solving, figural and factual analysis, decision-making, propositional reasoning, visual-spatial reasoning)
- Number and letter series, coding-decoding
- Seating arrangement, blood relations, directions
- Syllogism, statement and conclusion
- Data sufficiency
- Visual reasoning: figure series, cubes, paper folding

**Advanced Quant + Reasoning**
- Wahi topics, par mushkil level: geometry, algebra, P&C, probability, complex seating arrangement.

**Advanced Coding**
- Arrays, strings, hashing, sorting, math (prime, GCD, digits)
- Kabhi-kabhi greedy ya simple DP
- Question lambi story mein likha hota hai. Pehle input, output aur constraints alag likh lo.
- Input **stdin** se padhna hota hai aur output **exact format** mein print karna hota hai. Ek extra space ya extra line se bhi test case fail ho sakta hai.
- Hidden test cases hote hain. Edge cases zaroor socho: n = 1, sab elements same, negative numbers, bahut bade numbers.

## 7. Sample questions (practice ke liye, asli paper ke nahi)

**Numerical**
1. Ek item cost se 25% upar mark kiya, phir 10% discount diya. Profit kitna %?
   **Answer: 12.5%** (1.25 × 0.9 = 1.125)
2. Pipe A tank 12 ghante mein bharta hai, pipe B 15 ghante mein, aur ek leak 20 ghante mein khaali karti hai. Teeno khule hon toh tank kitne time mein bharega?
   **Answer: 10 ghante** (1/12 + 1/15 − 1/20 = 1/10)

**Reasoning**
1. Agla number kya hoga: 2, 6, 12, 20, 30, ?
   **Answer: 42** (antar 4, 6, 8, 10, 12)
2. A, B ki behen hai. C, B ke pita hain. A ka C se kya rishta hai?
   **Answer: beti**

**Verbal**
1. Blank bharo: "The mentor's explanation was so ____ that even the most sceptical student took notes."
   (a) vague (b) lucid (c) brief (d) loud
   **Answer: (b) lucid**

**Coding**
Pehli line mein `n` aur `k` hain, doosri line mein `n` integers. Kitne pairs (i < j) ka sum `k` hai, wo print karo.

```
Input:
5 6
1 5 7 -1 5
Output:
3
```

```python
import sys

def count_pairs(nums, k):
    seen = {}
    pairs = 0
    for x in nums:
        pairs += seen.get(k - x, 0)   # jitne pehle aaye unke saath pair
        seen[x] = seen.get(x, 0) + 1
    return pairs

def main():
    data = sys.stdin.read().split()
    n, k = int(data[0]), int(data[1])
    nums = list(map(int, data[2:2 + n]))
    print(count_pairs(nums, k))

if __name__ == "__main__":
    main()
```
Do loop wala brute force O(n²) hai. HashMap ke saath ye O(n) hai, jo bade n pe zaroori hai.

## 8. Free practice kahan karein
- **Official sample test:** NQT page pe "Take a Sample Test" option hai (TCS iON account se login karna padta hai). Real test ka interface pehle hi dekh lo.
- **Free psychometric test aur career readiness course:** NQT variant ke saath free milte hain (official page).
- **Coding:** LeetCode / HackerRank pe arrays, strings aur hashing ke easy-medium questions. Stdin se input padhne ki practice zaroor karo.
- **Aptitude:** ek aptitude book ya free YouTube playlist se topic-wise practice karo, phir har din ek timed mock do.

## 9. Score ke baad kya hota hai
**Sabse important baat: TCS iON khud interview nahi dilata.** Official FAQ ke mutabik:
1. Score email pe aata hai, aur "View Past Results" se scorecard download hota hai.
2. Aapko **khud companies mein apply karna hota hai** aur form mein apna NQT registration number aur score dalna hota hai.
3. Jo companies NQT score accept karti hain unki list official page pe hai. TCS iON Job Listing Portal pe bhi apply kar sakte ho (ye sirf NQT dene waalon ke liye hai, profile 100% complete honi chahiye).
4. Score se job ki guarantee nahi milti. Final selection company karti hai.

**TCS mein apply karna:** TCS ke liye [nextstep.tcs.com](https://nextstep.tcs.com) pe register karke apply karo. TCS mein NQT score ke hisaab se teen category hoti hain (cut-off publicly nahi batate):

| Category | CTC (reported, UG) | Kisko |
|---|---|---|
| Ninja | ~₹3.36 LPA | Foundation section achha |
| Digital | ~₹7 LPA | Advanced section bhi achha |
| Prime | ~₹9 LPA (PG ~₹11.5 LPA) | Advanced coding mein sabse achha |

Ye CTC candidates aur placement guides ke bataye hue hain. Har saal badal sakte hain.

## 10. TCS interview process
Score ke baad shortlist hue toh interview hota hai. Ninja mein aksar Technical + HR ek hi round mein ho jaata hai. Digital / Prime mein teeno round alag hote hain.

| Round | Kya poochte hain |
|---|---|
| Technical | Apna project (detail mein), OOP (class, inheritance, polymorphism), DBMS + SQL queries, ek basic coding question, aapki chuni hui language |
| Managerial | Situation waale sawal ("deadline miss ho rahi hai toh kya karoge"), teamwork, relocation aur shift ke liye ready ho ya nahi |
| HR | Introduction, "TCS hi kyun", strengths/weaknesses, bond/service agreement, documents |

**Interview ki tayyari:**
- Apne resume ki har line explain kar pao, khaaskar project: kya banaya, kaunsa tech use kiya, aur aapka khud ka kya part tha.
- OOP ke 4 pillars example ke saath, SQL mein JOIN / GROUP BY / second highest salary, aur DBMS normalization.
- Documents ready rakho: marksheets, degree / provisional certificate, ID proof. Reported eligibility: 60% aggregate, koi pending backlog nahi, education gap 2 saal se zyada nahi.

## 11. 18 din ka plan (26 Nov se 14 Dec registration tak, phir 25 Dec test)
1. **Aaj:** official page pe IT variant register karo. Last date ka wait mat karo.
2. **Week 1:** Numerical + Reasoning, roz ek topic, aur 20 questions timer laga ke.
3. **Week 2:** Verbal (roz 2 RC passages) + coding (arrays, strings, hashing, stdin input).
4. **Week 3:** Advanced quant, ek-do DP/greedy questions, aur roz ek full timed mock.
5. **Test ke baad:** resume + project explanation + OOP/SQL revise karo, kyunki interview jaldi aa sakta hai.
