"""Solution for split_parts(). Look only after you try."""


def split_parts(lines, n):
    if n < 1:
        raise ValueError("n must be at least 1")
    parts = [[] for _ in range(n)]
    if not lines:
        return parts
    end = lines[-1][0]
    size = end / n if end > 0 else 1
    for t, text in lines:
        i = min(int(t // size), n - 1)  # last line (t == end) goes to the last part
        parts[i].append((t, text))
    return parts
