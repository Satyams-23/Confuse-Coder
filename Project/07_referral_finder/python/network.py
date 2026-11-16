# ============================================================================
#  Referral Finder  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================

# Kaun kahan kaam karta hai ("" = student / abhi koi company nahi)
COMPANY = {
    "Sam": "", "Riya": "", "Dev": "Infosys", "Kabir": "", "Tara": "TCS",
    "Meera": "", "Aditi": "Google", "Neel": "", "Zoya": "Microsoft",
    "Arjun": "", "Ishaan": "Amazon", "Kavya": "Google", "Om": "Flipkart",
}

# Dosti (dono taraf, undirected). Order matter karta hai: BFS isi order mein padosi dekhta hai.
FRIENDS = [
    ("Sam", "Dev"), ("Sam", "Riya"), ("Riya", "Kabir"), ("Kabir", "Tara"),
    ("Tara", "Meera"), ("Meera", "Aditi"), ("Dev", "Aditi"), ("Riya", "Neel"),
    ("Neel", "Zoya"), ("Kabir", "Arjun"), ("Arjun", "Ishaan"), ("Tara", "Ishaan"),
    ("Meera", "Kavya"),
]
# Om kisi ka dost nahi hai (alag island) -> uske paas pahunch hi nahi sakte.


def build():
    adj = {name: [] for name in COMPANY}
    for u, v in FRIENDS:
        adj[u].append(v)
        adj[v].append(u)
    return adj


def badge(d):
    if d is None:
        return "no path"
    if d == 0:
        return "you"
    return {1: "1st", 2: "2nd"}.get(d, "3rd+")


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def run(bfs, get_path, me="Sam"):
    adj = build()
    dist, parent = bfs(adj, me)

    print(f"=== 1. {me} se har insaan kitna door (LinkedIn badge) ===")
    for name in COMPANY:
        if name == me:
            continue
        d = dist.get(name)
        print(f"  {name:<7} {('-' if d is None else d):>2}  {badge(d):<8} {COMPANY[name]}")

    print("\n=== 2. REFERRAL ROUTE (sabse kam dosti wala raasta) ===")
    for company in ["Google", "Amazon", "Microsoft", "Flipkart"]:
        people = [p for p in COMPANY if COMPANY[p] == company and dist.get(p) is not None]
        if not people:
            print(f"  {company:<9}: koi raasta nahi :(")
            continue
        best = min(people, key=lambda p: (dist[p], p))
        print(f"  {company:<9}: {' -> '.join(get_path(parent, best))}  ({dist[best]} dosti door)")

    print("\n=== 3. TESTS ===")
    ok = True
    ok &= _check("Aditi = 2 (reel: pop() se 5 aata tha)", dist.get("Aditi") == 2)
    ok &= _check("Riya aur Dev = 1st", dist.get("Riya") == 1 and dist.get("Dev") == 1)
    ok &= _check("Kabir = 2, Meera = 3, Kavya = 4", (dist.get("Kabir"), dist.get("Meera"), dist.get("Kavya")) == (2, 3, 4))
    ok &= _check("Ishaan = 4", dist.get("Ishaan") == 4)
    ok &= _check("Om tak raasta nahi (dist mein hi nahi)", "Om" not in dist)
    ok &= _check("path(Aditi) = Sam -> Dev -> Aditi", get_path(parent, "Aditi") == ["Sam", "Dev", "Aditi"])
    ok &= _check("path(Zoya) = Sam -> Riya -> Neel -> Zoya", get_path(parent, "Zoya") == ["Sam", "Riya", "Neel", "Zoya"])
    ok &= _check("path(Sam) = [Sam]", get_path(parent, "Sam") == ["Sam"])
    ok &= _check("har path ki length = dist + 1", all(len(get_path(parent, p)) == dist[p] + 1 for p in dist))
    print("\nTESTS PASSED" if ok else "\nTESTS FAILED  (hint README mein hai)")
