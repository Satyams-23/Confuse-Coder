# ============================================================================
#  Island Counter  ·  READY FILE (Python)  ·  @confuse__coder
#  Is file ko chhedne ki zaroorat nahi. Tumhara kaam starter.py mein hai.
# ============================================================================
import sys

sys.setrecursionlimit(100000)  # bade map pe DFS gehra jaata hai (Python ka default 1000 hai)

# '1' = zameen, '0' = paani
MAPS = {
    # reel wala chart: 6 islands. Bug wala code (r < 0 / c < 0 check nahi) isse 3 bolta hai.
    "reel": [
        "110000011",
        "100110001",
        "000100000",
        "000000100",
        "100001100",
        "110000001",
    ],
    # bada archipelago (andar ek jheel wala ring island bhi hai)
    "archipelago": [
        "1100000000011100000000001",
        "1110001100001000011000000",
        "0100011110000000011100110",
        "0000001100011111000000110",
        "0011000000010001000000000",
        "0011100000010101000111000",
        "0000100110010001000101000",
        "0000000110011111000111000",
        "1000000000000000000000000",
        "1100011000000110000110011",
        "1000011100001111000100011",
        "0000000000000110000000001",
    ],
}


def to_grid(rows):
    return [list(r) for r in rows]


def count_islands(rows, dfs):
    """Grid pe chalo. Bina jhande wali zameen mili = naya island, uspe tumhara dfs() chalao."""
    g = to_grid(rows)
    areas = []
    label = 0
    for r in range(len(g)):
        for c in range(len(g[0])):
            if g[r][c] == "1":
                label_char = chr(ord("A") + label % 26)
                areas.append(dfs(g, r, c, label_char))
                label += 1
    return len(areas), areas, g


COLORS = ["\033[43m", "\033[46m", "\033[42m", "\033[45m", "\033[41m", "\033[44m"]


def show(g):
    for row in g:
        line = ""
        for ch in row:
            if ch == "0":
                line += "\033[34m~~\033[0m"
            elif ch == "1":
                line += "??"  # dfs ne paint nahi kiya
            else:
                line += f"{COLORS[(ord(ch) - 65) % len(COLORS)]}\033[30m{ch} \033[0m"
        print("  " + line)


def from_image(path, cols=60):
    """Satellite/map photo -> '1'/'0' grid. Paani = jahan blue sabse zyada. (pip install pillow)"""
    from PIL import Image

    im = Image.open(path).convert("RGB")
    rows = max(1, round(im.height / im.width * cols * 0.5))
    im = im.resize((cols, rows))
    out = []
    for y in range(rows):
        s = ""
        for x in range(cols):
            r, g, b = im.getpixel((x, y))
            water = b > r + 10 and b >= g - 5
            s += "0" if water else "1"
        out.append(s)
    return out


def _check(name, ok):
    print(f"  [{'PASS' if ok else 'FAIL'}] {name}")
    return ok


def tests(dfs):
    print("\n=== TESTS ===")
    ok = True
    n, areas, _ = count_islands(MAPS["reel"], dfs)
    ok &= _check(f"reel map = 6 islands (tumhara: {n})", n == 6)
    ok &= _check(f"reel map areas = 3,3,3,3,3,1 (tumhara: {areas})", sorted(areas, reverse=True) == [3, 3, 3, 3, 3, 1])
    ok &= _check("sirf paani = 0", count_islands(["000", "000"], dfs)[0] == 0)
    n, areas, _ = count_islands(["1111", "1111", "1111"], dfs)
    ok &= _check("sab zameen = 1 island, area 12", n == 1 and areas == [12])
    ok &= _check("diagonal judta nahi: 10/01 = 2", count_islands(["10", "01"], dfs)[0] == 2)
    ok &= _check("left-right kinaare alag: 1001 = 2  (c < 0 check)", count_islands(["1001"], dfs)[0] == 2)
    ok &= _check("upar-neeche kinaare alag: 1/0/1 = 2  (r < 0 check)", count_islands(["1", "0", "1"], dfs)[0] == 2)
    n, areas, _ = count_islands(MAPS["archipelago"], dfs)
    ok &= _check(f"archipelago = 16 islands (tumhara: {n})", n == 16)
    ok &= _check(f"sabse bada island = 16, jheel wala ring (tumhara: {max(areas) if areas else 0})", areas and max(areas) == 16)
    print("\nTESTS PASSED ✅" if ok else "\nKUCH TESTS FAIL ❌  (hint: bounds check mein r < 0 aur c < 0?)")
    return ok


def run(dfs):
    if "--image" in sys.argv:
        rows = from_image(sys.argv[sys.argv.index("--image") + 1])
        n, areas, g = count_islands(rows, dfs)
        show(g)
        print(f"\nIslands: {n}   sabse bada: {max(areas) if areas else 0} khaane")
        return
    for name in ["reel", "archipelago"]:
        n, areas, g = count_islands(MAPS[name], dfs)
        print(f"\n=== {name} ===")
        show(g)
        print(f"  Islands: {n}   sabse bada: {max(areas) if areas else 0} khaane")
    tests(dfs)
