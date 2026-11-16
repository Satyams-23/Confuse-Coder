# ============================================================================
#  Mutual Friends Finder  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================

# College ka friend group (dosti = dono taraf, undirected graph)
FRIENDS = [
    ("Riya", "Kabir"),
    ("Riya", "Sam"),
    ("Kabir", "Tara"),
    ("Sam", "Tara"),
    ("Riya", "Aman"),
    ("Aman", "Zoya"),
    ("Kabir", "Zoya"),
    ("Tara", "Neel"),
    ("Sam", "Neel"),
]


def build(add_edge, pairs):
    adj = {}
    for u, v in pairs:
        add_edge(adj, u, v)
    return adj


def friends_of(adj, who):
    return sorted(adj.get(who, []))


def mutual(adj, a, b):
    return sorted(set(adj.get(a, [])) & set(adj.get(b, [])))


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def run(add_edge, suggest):
    adj = build(add_edge, FRIENDS)

    print("=== 1. ADJACENCY LIST ===")
    for who in sorted(adj):
        print(f"  {who:<6} -> {', '.join(friends_of(adj, who))}")

    print("\n=== 2. MUTUAL FRIENDS ===")
    for a, b in [("Riya", "Tara"), ("Kabir", "Sam")]:
        print(f"  {a} + {b}: {', '.join(mutual(adj, a, b)) or '(koi nahi)'}")

    print("\n=== 3. SUGGESTED FOR YOU ===")
    for who in ["Kabir", "Zoya"]:
        out = suggest(adj, who)
        print(f"  {who}: " + (", ".join(f"{n} ({len(mutual(adj, who, n))} mutual)" for n in out) or "(koi nahi)"))

    print("\n=== 4. TESTS ===")
    ok = True
    ok &= _check("Kabir ke dost = Riya, Tara, Zoya  (reel wala bug: Riya dono taraf)", friends_of(adj, "Kabir") == ["Riya", "Tara", "Zoya"])
    ok &= _check("Tara ke dost = Kabir, Neel, Sam", friends_of(adj, "Tara") == ["Kabir", "Neel", "Sam"])
    ok &= _check("har edge dono taraf (u in adj[v] aur v in adj[u])", all(u in adj.get(v, []) and v in adj.get(u, []) for u, v in FRIENDS))
    ok &= _check("koi duplicate dost nahi", all(len(l) == len(set(l)) for l in adj.values()))
    ok &= _check("suggest(Kabir) = Aman, Sam, Neel", suggest(adj, "Kabir") == ["Aman", "Sam", "Neel"])
    ok &= _check("suggest(Zoya)  = Riya, Tara", suggest(adj, "Zoya") == ["Riya", "Tara"])
    ok &= _check("suggest mein khud ya pehle se dost nahi", all(n != w and n not in adj[w] for w in adj for n in suggest(adj, w)))
    print("\nTESTS PASSED" if ok else "\nTESTS FAILED  (hint README mein hai)")
