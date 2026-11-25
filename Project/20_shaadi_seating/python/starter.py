# Shaadi Seating · TUMHARA KAAM: find() aur union() likho. Phir: python starter.py
from seating import run


class DSU:
    def __init__(self, items):
        self.parent = {x: x for x in items}
        self.size = {x: 1 for x in items}
        self.steps = 0               # find() mein har "upar chalo" pe self.steps += 1

    def find(self, x):
        """leader lautao. Path compression: raste ke sab log seedha leader ke neeche."""
        # TODO
        return x

    def union(self, a, b):
        """a aur b ki families jodo. parent[a] = b NAHI! (reel ka bug)
        Chhoti family badi ke neeche (size)."""
        # TODO
        pass


if __name__ == "__main__":
    run(DSU)
