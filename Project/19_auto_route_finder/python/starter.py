# Auto Route Finder · TUMHARA KAAM: sirf dijkstra() likho. Phir: python starter.py
import heapq
from router import run


def dijkstra(adj, src, dst):
    """
    adj = {jagah: [(padosi, minute), ...]}
    return (minute, path)  jaise (13, ["Ghar", "Market", "Station", "Mall", "College"])
    raasta na ho toh (None, None)

    Rule: abhi tak jo jagah sabse kam minute mein pahunchi, use PAKKA karo.
    Heap mein (distance, jagah) daalo. Pehle distance! (reel ka bug yahi tha)
    Path ke liye parent = {} rakho.
    """
    # TODO
    return None, None


if __name__ == "__main__":
    run(dijkstra)
