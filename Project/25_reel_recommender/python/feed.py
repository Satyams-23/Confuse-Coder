"""Ready-made part of Reel Recommender (AI/ML S1 EP03). Don't edit; write distance(), my_address() and recommend() in starter.py."""

# every reel's "address" = [comedy, coding, cricket], 0-9
REELS = {
    "dev meme":        [8, 9, 0],
    "python tutorial": [1, 9, 0],
    "coding joke":     [7, 8, 0],
    "dsa short":       [0, 9, 0],
    "standup clip":    [9, 0, 1],
    "cricket meme":    [8, 0, 7],
    "virat edit":      [1, 0, 9],
    "ipl highlight":   [0, 0, 9],
}


def run(distance, my_address, recommend):
    print("=== 1. TUMNE DEKHE: dev meme + python tutorial ===")
    you = my_address(["dev meme", "python tutorial"], REELS)
    print(f"  tumhara address = {you}")

    print("\n=== 2. HAR REEL KITNA DOOR? ===")
    for name, v in sorted(REELS.items(), key=lambda kv: distance(you, kv[1])):
        print(f"  {name:16} {distance(you, v):5.1f}")

    print("\n=== 3. TUMHARA FEED (top 3, jo dekh liye woh nahi) ===")
    feed = recommend(["dev meme", "python tutorial"], REELS, k=3)
    for i, name in enumerate(feed, 1):
        print(f"  {i}. {name}")

    print("\n=== 4. TESTS ===")
    ok = True

    def check(name, cond):
        nonlocal ok
        ok &= bool(cond)
        print(f"  [{'PASS' if cond else 'FAIL'}] {name}")

    check("distance([0,0,0], [3,4,0]) = 5", abs(distance([0, 0, 0], [3, 4, 0]) - 5) < 1e-9)
    check("address = average = [4.5, 9.0, 0.0]", you == [4.5, 9.0, 0.0])
    check("coding joke ~2.7 door", abs(distance(you, REELS["coding joke"]) - 2.7) < 0.05)
    check("virat edit ~13.2 door", abs(distance(you, REELS["virat edit"]) - 13.2) < 0.05)
    check("feed #1 = coding joke", feed[:1] == ["coding joke"])
    check("jo dekh liye woh feed mein nahi", "dev meme" not in feed and "python tutorial" not in feed)
    check("cricket fan ko cricket hi mile", recommend(["virat edit"], REELS, k=2) == ["ipl highlight", "cricket meme"])
    print("\n" + ("Sab pass! Tumne apna mini Explore bana liya." if ok else "Kuch fail hua. Functions dobara dekho."))
