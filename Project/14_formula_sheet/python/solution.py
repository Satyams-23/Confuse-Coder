# ============================================================================
#  Formula Sheet  ·  SOLUTION (Python)  ·  @confuse__coder
#  Pehle khud starter.py try karo!
# ============================================================================
from sheet import run


def find_cycle(needs):
    path = []      # khula dhaaga (current path)
    on_path = set()
    done = set()   # dhaaga lipat chuka

    def dfs(cell):
        if cell in on_path:                       # apna hi khula dhaaga mila
            return path[path.index(cell):] + [cell]
        if cell in done:                          # purana raasta, cycle nahi
            return None
        path.append(cell)
        on_path.add(cell)
        for nxt in needs.get(cell, []):
            loop = dfs(nxt)
            if loop:
                return loop
        path.pop()                                # wapas: dhaaga lapeto
        on_path.remove(cell)
        done.add(cell)
        return None

    for cell in needs:
        loop = dfs(cell)
        if loop:
            return loop
    return None


if __name__ == "__main__":
    run(find_cycle)
