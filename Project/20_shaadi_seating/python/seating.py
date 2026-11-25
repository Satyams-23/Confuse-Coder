# ============================================================================
#  Shaadi Seating  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
import time

# reel wale 8 mehmaan: (a, b) = ek hi family
REEL_GUESTS = ["Riya", "Kabir", "Sam", "Tara", "Aditi", "Meera", "Dev", "Arjun"]
REEL_PAIRS = [("Riya", "Kabir"), ("Sam", "Tara"), ("Kabir", "Sam"),
              ("Meera", "Dev"), ("Riya", "Aditi"), ("Arjun", "Dev")]

# badi shaadi: 14 mehmaan
BIG_GUESTS = ["Dadi", "Papa", "Mummy", "Chacha", "Chachi", "Bunty", "Pinky",
              "Nanaji", "Mama", "Mami", "Golu", "Rohan", "Sneha", "Ishaan"]
BIG_PAIRS = [("Papa", "Dadi"), ("Mummy", "Papa"), ("Chacha", "Dadi"), ("Chachi", "Chacha"),
             ("Bunty", "Chachi"), ("Pinky", "Bunty"), ("Mama", "Nanaji"), ("Mami", "Mama"),
             ("Golu", "Mami"), ("Rohan", "Sneha")]


def tables(guests, find):
    groups = {}
    for g in guests:
        groups.setdefault(find(g), []).append(g)
    return list(groups.values())


def show(title, guests, pairs, DSU, asks=()):
    d = DSU(guests)
    for a, b in pairs:
        d.union(a, b)
    ts = tables(guests, d.find)
    print(f"\n=== {title} ===")
    print(f"  Tables: {len(ts)}")
    for i, t in enumerate(ts, 1):
        print(f"  Table {i}: " + ", ".join(t))
    for a, b in asks:
        print(f"  {a} aur {b} ek family? {'haan' if d.find(a) == d.find(b) else 'nahi'}")


def chain_test(DSU, n=100000):
    """1 lakh log ek line mein: i ka parent i+1. find(0) kitne kadam?"""
    names = list(range(n))
    d = DSU(names)
    for i in range(n - 1):
        d.parent[i] = i + 1          # jaan-boojh ke lambi chain
    d.steps = 0
    d.find(0)
    first = d.steps
    d.steps = 0
    d.find(0)
    print(f"\n=== 1 lakh ki chain ===\n  pehla find(0): {first:,} kadam\n  doosra find(0): {d.steps:,} kadam")


def run(DSU):
    show("Reel ki shaadi", REEL_GUESTS, REEL_PAIRS, DSU, asks=[("Riya", "Kabir"), ("Riya", "Dev")])
    show("Badi shaadi", BIG_GUESTS, BIG_PAIRS, DSU, asks=[("Pinky", "Mummy"), ("Golu", "Papa")])
    chain_test(DSU)
