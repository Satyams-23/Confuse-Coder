<div align="center">

# Confuse Coder

**Code. Build. Understand.**

Notes, hands-on projects and source code from the Confuse Coder reels: data structures and algorithms, system design, and how real-world tech works, explained in Hinglish.

[Instagram · @confuse__coder](https://www.instagram.com/confuse__coder/) &nbsp;·&nbsp;
[Instagram · @confuse__coder.dev](https://www.instagram.com/confuse__coder.dev/) &nbsp;·&nbsp;
[YouTube · @ConfuseCoder23](https://www.youtube.com/@ConfuseCoder23)

</div>

---

## About

Confuse Coder runs two channels:

| Channel | Focus |
|---|---|
| **@confuse__coder** | Data Structures & Algorithms: recursion, backtracking, dynamic programming, sorting, graphs |
| **@confuse__coder.dev** | Developer topics: system design, backend engineering, networking, AI tools, full-stack builds |

Each reel is a short explainer. This repository is the companion material: the full written notes behind every episode and projects you can build yourself to practise the concept.

## Repository structure

```
.
├── notes/        Written notes for each reel (concept, code, dry run, common mistakes, practice questions)
│   ├── confuse_coder/
│   └── confuse_coder.dev/
├── Project/      Hands-on projects with starter code, reference solutions and built-in tests
└── website/      Source of the Confuse Coder website (Next.js)
```

## Notes

Every episode has a matching notes file in [`notes/`](notes/), named `<episode>_<topic>.md`. Each one covers:

- the problem from the reel and the core idea in plain words
- annotated code (C++ / Python) with a step-by-step dry run
- time and space complexity
- common mistakes and interview pitfalls
- practice questions to try next

## Projects

The projects in [`Project/`](Project/) put each concept into a small real-world program. The boilerplate is ready, and you write only the core logic taught in the reel.

| # | Project | Concept | Languages |
|---|---|---|---|
| 01 | [College Timetable Generator](Project/01_college_timetable/) | Backtracking with pruning | Python, C++ |
| 02 | [Leaderboard Merge](Project/02_leaderboard_merge/) | Divide and conquer (merge sort) | Python, C++ |
| 03 | [UPI Change Maker](Project/03_upi_change_maker/) | Backtracking with reuse (combination sum) | Python, C++ |
| 04 | [Newspaper Word Puzzle Solver](Project/04_word_puzzle_solver/) | Grid DFS with mark / unmark | Python, C++ |
| 05 | [Auto Fare Learner](Project/05_auto_fare_learner/) | Gradient descent, linear regression | Python |
| 06 | [Mutual Friends Finder](Project/06_mutual_friends_finder/) | Graph adjacency list, friends of friends | Python, C++ |
| 07 | [Referral Finder](Project/07_referral_finder/) | BFS distance and shortest path | Python, C++ |
| 08 | [Maze Race: BFS vs DFS](Project/08_maze_race/) | Grid BFS vs DFS, browser race and game | HTML/JavaScript, Python, C++ |
| 10 | [Brief Checker](Project/10_brief_checker/) | Check a clip against a campaign brief before posting, CPM earnings | Node.js |
| 11 | [Campaign Ranker](Project/11_campaign_ranker/) | Real clipping earnings with max cap, viewer country and platform | Node.js |
| 12 | [Mini Clipper](Project/12_mini_clipper/) | Your own free AI clipper: Whisper + sliding-window moment picker + FFmpeg | Python |
| 13 | [Island Counter](Project/13_island_counter/) | Count islands with DFS flood fill, paint each one, count your own satellite photo | Python, C++ |
| 17 | [Stream Parts](Project/17_stream_parts/) | Long stream to AI-ready transcript parts with a prompt, then finished 9:16 clips (facecam on top, captions, credit) | Python |
| — | [Diwali Card Generator](Project/diwali-site/) | Client-side canvas rendering | HTML, JavaScript |

**How to use a project**

1. Open the project folder and read its `README.md`.
2. Implement the core function in the `starter` file.
3. Run it. The built-in tests report `PASSED` or `FAILED`.
4. If you get stuck, read the hint first, then compare with the `solution` file.

## Website

[`website/`](website/) contains the Next.js source of the Confuse Coder site. It reads `notes/` and `Project/` at build time, so new episodes appear automatically. See [`website/README.md`](website/README.md) for local setup.

## Feedback

Spotted a mistake or want a topic covered? Comment on any reel or open an issue in this repository.

---

<div align="center">

If the notes or projects helped you, consider following the channels and starring the repository.

</div>
