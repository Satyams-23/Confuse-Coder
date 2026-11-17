"""starter.py: YOU write step 2 of the clipper, the only "smart" part. Run `python test.py` to check it.

pick_moments(words, loud, duration, win=30, k=3) -> list of (start, end, score)

  words     [{"w": "Insane!", "start": 12.3, "end": 12.8}, ...]   (from Whisper, sorted by start)
  loud      [0.2, 0.9, ...]   loud[i] = how loud second i is, 0..1
  duration  video length in seconds
  win       clip length in seconds (every window is exactly `win` long)
  k         how many clips you want

Rules:
  1. Candidate windows start at every whole second: t = 0, 1, 2, ... while t + win <= duration.
  2. score(t) = 3 * (hype words whose START is inside [t, t+win))
              + (seconds i in [t, t+win) with loud[i] >= 0.7)
     A hype word = norm(word) is in HYPE (see common.py).
  3. Pick the best window, then the next best that does NOT overlap any picked one
     (two windows overlap if their starts are less than `win` apart). Repeat until you have k
     or nothing is left. Ties: the earlier start wins.
  4. Return them best-first: [(start, start + win, score), ...]. Skip windows with score 0.

Big videos: a 3-hour stream has ~10,800 windows and ~30,000 words. Recounting every window from
scratch is slow (test.py checks a 10-hour input). Hint: sliding window / prefix sums.
"""
from common import HYPE, norm


def pick_moments(words, loud, duration, win=30, k=3):
    # TODO
    return []
