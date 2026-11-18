"""Reference solution for rank_reels(). Try starter.py first."""


def rank_reels(reels, top=None):
    ranked = []
    for r in reels:
        views = r.get("views", 0)
        if views <= 0:
            continue
        item = dict(r)
        item["save_rate"] = round(r.get("saved", 0) / views * 100, 2)
        ranked.append(item)
    ranked.sort(key=lambda r: (-r["save_rate"], -r.get("saved", 0)))
    return ranked if top is None else ranked[:top]
