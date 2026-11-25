# Shaadi Seating · ANSWER (pehle khud try karo)
from seating import run


class DSU:
    def __init__(self, items):
        self.parent = {x: x for x in items}
        self.size = {x: 1 for x in items}
        self.steps = 0

    def find(self, x):
        root = x
        while self.parent[root] != root:
            root = self.parent[root]
            self.steps += 1
        while self.parent[x] != root:            # path compression
            self.parent[x], x = root, self.parent[x]
        return root

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)      # pehle dono ke leader
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:        # chhoti → badi ke neeche
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True


if __name__ == "__main__":
    run(DSU)
