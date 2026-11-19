"""YOUR TASK: write split_parts().

lines = [(seconds, text), ...] sorted by time (one transcript).
Cut the stream into n EQUAL TIME windows and return n lists.

Example: stream ends at 600 s, n = 3  ->  windows [0,200) [200,400) [400, end]
  part 1 gets every line with   0 <= t < 200
  part 2 gets every line with 200 <= t < 400
  part 3 gets every line with 400 <= t        (the very last line goes here, not lost)

Rules (the tests check all of them):
  1. Always return exactly n lists, even if some are empty (a silent hour is still an hour).
  2. Every line lands in exactly ONE part. Nothing lost, nothing twice.
  3. Order inside a part = time order.
  4. Window size comes from the LAST line's time (the stream's end), not from the number of lines.
     (Splitting by line count is the bug: a chatty hour and a quiet hour are not the same length.)
  5. Empty transcript -> n empty lists. n < 1 -> ValueError.

Why: one small part at a time is what lets the AI read the MIDDLE of a 3-hour stream.
"""


def split_parts(lines, n):
    # TODO: write it
    return []
