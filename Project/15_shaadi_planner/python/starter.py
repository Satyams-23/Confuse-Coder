# ============================================================================
#  Shaadi Planner  ·  STARTER (Python)  ·  @confuse__coder
#
#  Kaam: sirf ek function likho, topo_days(tasks, after)   (~15 lines, Kahn's algorithm)
#    tasks = saare kaam (order fixed), after = {kaam: [jo iske baad aate hain]}
#    return (days, stuck)
#      days  = [[din 1 ke kaam], [din 2 ke kaam], ...]  (har din ke kaam `tasks` wale order mein)
#      stuck = jo kaam kabhi ho hi nahi paaye (gol chakkar), [] agar sab ho gaye
#
#  Tips (reel ka "jiske pehle kuch nahi, use pehle uthao"):
#    - indeg[kaam] = kitne kaam iske pehle chahiye
#    - aaj = saare kaam jinka indeg 0 hai  -> ek din
#    - un sabke baad wale kaamon ka indeg 1 kam karo, naye 0 wale = agla din
#    - jo kabhi 0 nahi hue = stuck
#
#  Run:  python starter.py   ->  "TESTS PASSED" aaye toh ho gaya!
# ============================================================================
from planner import run


def topo_days(tasks, after):
    # TODO: yahan likho
    return [], list(tasks)


if __name__ == "__main__":
    run(topo_days)
