# ============================================================================
#  Shaadi Planner  ·  SOLUTION (Python)  ·  @confuse__coder
#  Pehle khud starter.py try karo!
# ============================================================================
from planner import run


def topo_days(tasks, after):
    indeg = {t: 0 for t in tasks}
    for t in tasks:
        for nxt in after[t]:
            indeg[nxt] += 1
    today = [t for t in tasks if indeg[t] == 0]   # jiske pehle kuch nahi
    days, done = [], set()
    while today:
        days.append(today)
        done.update(today)
        nxt_day = set()
        for t in today:
            for nxt in after[t]:
                indeg[nxt] -= 1
                if indeg[nxt] == 0:
                    nxt_day.add(nxt)
        today = [t for t in tasks if t in nxt_day]  # tasks wala order
    stuck = [t for t in tasks if t not in done]
    return days, stuck


if __name__ == "__main__":
    run(topo_days)
