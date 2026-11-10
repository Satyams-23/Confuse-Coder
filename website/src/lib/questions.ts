// Output-game questions. Every answer was verified by running the snippet (Python 3, Node, g++).
import type { Theme } from "@/components/ThemeProvider";

export type Q = {
  lang: string;
  topic: string;
  code: string;
  comment?: string; // comment marker for the highlighter
  options: string[];
  answer: number;
  why: string;
};

export const BANK: Record<Theme, Q[]> = {
  cc: [
    {
      lang: "python",
      topic: "Recursion · EP 02",
      code: `def f(n):
    if n == 0: return 0
    return n + f(n-1)

print(f(4))`,
      options: ["4", "10", "24", "RecursionError"],
      answer: 1,
      why: "f(4) = 4 + f(3) = 4 + 3 + 2 + 1 + f(0) → 10. Base case 0 pe rukta hai, isliye error nahi.",
    },
    {
      lang: "python",
      topic: "Call stack · EP 03",
      code: `def f(n):
    if n == 0: return
    print(n, end=" ")
    f(n-1)
    print(n, end=" ")

f(3)`,
      options: ["3 2 1", "3 2 1 1 2 3", "1 2 3 3 2 1", "3 2 1 0 0 1 2 3"],
      answer: 1,
      why: "Pehla print stack mein jaate waqt (3 2 1), doosra wapas aate waqt (1 2 3). f(0) kuch print nahi karta.",
    },
    {
      lang: "python",
      topic: "Base case · EP 04",
      code: `def countdown(n):
    print(n)
    countdown(n - 1)

countdown(3)`,
      options: ["3 2 1", "3 2 1 0", "3 2 1 0 -1 … phir RecursionError", "Infinite loop, kabhi nahi rukega"],
      answer: 2,
      why: "Base case hi nahi hai! Negative mein chalta rahega jab tak Python ki ~1000 depth limit nahi aati. Phir RecursionError.",
    },
    {
      lang: "python",
      topic: "Memoization · EP 06",
      code: `calls = 0
memo = {}
def fib(n):
    global calls; calls += 1
    if n <= 1: return n
    if n in memo: return memo[n]
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]

fib(10)
print(calls)`,
      options: ["10", "11", "19", "177"],
      answer: 2,
      why: "Memo ke saath har fib(k) ek baar nikalta hai, baaki calls diary se. Total 2n − 1 = 19. Bina memo ke 177 hote.",
    },
    {
      lang: "python",
      topic: "Take / Skip · EP 08",
      code: `def subsets(a, i=0, cur=[]):
    if i == len(a):
        print(cur)
        return
    subsets(a, i+1, cur + [a[i]])   # take
    subsets(a, i+1, cur)            # skip

subsets([1, 2])`,
      options: ["[] [1] [2] [1, 2]", "[1, 2] [1] [2] []", "[1, 2] [2] [1] []", "[1] [2] [1, 2]"],
      answer: 1,
      why: "Pehle 'take' branch chalti hai, isliye sabse pehle [1, 2] aata hai. Last mein dono skip → [].",
    },
    {
      lang: "python",
      topic: "Permutations · EP 09",
      code: `def perm(s, ans=""):
    if not s:
        print(ans, end=" ")
        return
    for i in range(len(s)):
        perm(s[:i] + s[i+1:], ans + s[i])

perm("abc")`,
      options: ["abc acb bac bca cab cba", "abc bca cab", "abc acb bac bca cba cab", "cba cab bca bac acb abc"],
      answer: 0,
      why: "Har level pe bache hue letters left se right chune jaate hain, isliye output dictionary order mein aata hai: 3! = 6.",
    },
    {
      lang: "python",
      topic: "Merge sort · EP 12",
      code: `a = [1, 4, 9]
b = [2, 3, 10]
i = j = 0; out = []
while i < len(a) and j < len(b):
    if a[i] <= b[j]: out.append(a[i]); i += 1
    else: out.append(b[j]); j += 1

print(out)`,
      options: ["[1, 2, 3, 4, 9, 10]", "[1, 2, 3, 4, 9]", "[1, 4, 9, 2, 3, 10]", "[1, 2, 3, 4]"],
      answer: 1,
      why: "Trap! a khatam hote hi loop ruk gaya aur 10 b mein reh gaya. Isliye merge ke end mein a[i:] + b[j:] zaroori hai.",
    },
    {
      lang: "c++",
      topic: "Recursion depth",
      comment: "//",
      code: `int f(int n) {
    if (n <= 1) return 1;
    return f(n / 2) + 1;
}

cout << f(16);`,
      options: ["4", "5", "8", "16"],
      answer: 1,
      why: "16 → 8 → 4 → 2 → 1: paanch levels. f(1)=1, phir har level +1 → 5. Ye log₂(16) + 1 hai.",
    },
  ],
  dev: [
    {
      lang: "redis",
      topic: "Seat lock · 01",
      code: `SET seat:E7 userA NX EX 600
SET seat:E7 userB NX EX 600
GET seat:E7`,
      options: ["userA", "userB", "(nil)", "ERR key exists"],
      answer: 0,
      why: "NX = sirf tab set karo jab key na ho. userA pehle aaya, userB ka SET (nil) return karta hai. Seat userA ki.",
    },
    {
      lang: "redis",
      topic: "TTL",
      code: `SET otp:9876 4821 EX 60
# ... 61 second baad ...
GET otp:9876`,
      options: ['"4821"', "(nil)", "0", "ERR expired"],
      answer: 1,
      why: "EX 60 ke baad key apne aap delete ho jaati hai. Delete key ka GET → (nil). Error nahi aata.",
    },
    {
      lang: "javascript",
      topic: "Event loop",
      comment: "//",
      code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
      options: ["A B C D", "A D B C", "A D C B", "A C D B"],
      answer: 2,
      why: "Pehle saara sync code (A, D). Phir microtasks (Promise → C). Last mein macrotasks (setTimeout → B), 0 ms ke baad bhi.",
    },
    {
      lang: "javascript",
      topic: "var in loops",
      comment: "//",
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`,
      options: ["0 1 2", "3 3 3", "2 2 2", "undefined ×3"],
      answer: 1,
      why: "var ek hi shared i banata hai. Timeouts chalne tak loop khatam, i = 3. let use karo toh har round ka apna i → 0 1 2.",
    },
    {
      lang: "javascript",
      topic: "Sort",
      comment: "//",
      code: `console.log([10, 1, 3].sort());`,
      options: ["[1, 3, 10]", "[10, 3, 1]", "[1, 10, 3]", "[3, 1, 10]"],
      answer: 2,
      why: "Default sort strings compare karta hai: '1' < '10' < '3'. Numbers ke liye .sort((a, b) => a - b).",
    },
    {
      lang: "javascript",
      topic: "References",
      comment: "//",
      code: `const a = [1, 2, 3];
const b = a;
b.push(4);
console.log(a.length);`,
      options: ["3", "4", "TypeError: const", "undefined"],
      answer: 1,
      why: "b = a copy nahi, same array ka doosra naam hai. const sirf re-assign rokta hai, push nahi.",
    },
    {
      lang: "javascript",
      topic: "Spread copy",
      comment: "//",
      code: `const user = { name: "Riya" };
const copy = { ...user };
copy.name = "Aman";
console.log(user.name);`,
      options: ['"Riya"', '"Aman"', "undefined", "ReferenceError"],
      answer: 0,
      why: "{ ...user } naya object banata hai, isliye top-level change original ko nahi chhoota. (Nested objects shared rehte hain!)",
    },
    {
      lang: "javascript",
      topic: "Floats",
      comment: "//",
      code: `console.log(0.1 + 0.2 === 0.3);`,
      options: ["true", "false", "NaN", "0.3"],
      answer: 1,
      why: "Binary mein 0.1 exact store nahi hota: 0.1 + 0.2 = 0.30000000000000004. Paise kabhi float mein mat rakho.",
    },
  ],
};

export const QUESTION_COUNT = BANK.cc.length + BANK.dev.length;
