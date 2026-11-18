"""Tiny READ-ONLY client for Meta's official Instagram API with Instagram Login.

Only GET requests. No posting, no replies, no deletes, no DMs.
Needs: an Instagram professional (Creator/Business) account and a token from your own Meta app
(App Dashboard -> Instagram -> API setup with Instagram business login -> Generate token).
Docs: developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
"""
import json
import os
import urllib.error
import urllib.parse
import urllib.request

BASE = "https://graph.instagram.com"
REEL_METRICS = "views,saved,shares,likes,comments,reach"


class InstaError(RuntimeError):
    pass


def _get(path, params, token):
    q = urllib.parse.urlencode({**params, "access_token": token})
    url = f"{BASE}/{path}?{q}"
    try:
        with urllib.request.urlopen(url, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:
            msg = json.loads(body)["error"]["message"]
        except Exception:
            msg = body[:200]
        raise InstaError(f"Instagram API {e.code}: {msg}") from None


def token_from_env():
    tok = os.environ.get("IG_TOKEN", "").strip()
    if not tok:
        raise InstaError("IG_TOKEN is not set. Copy .env.example, paste your token, see README step 3.")
    return tok


def profile(token):
    return _get("me", {"fields": "user_id,username,followers_count,media_count"}, token)


def recent_reels(token, limit=25):
    """Your recent REELS with their insights, as plain dicts (one API call per reel for insights)."""
    data = _get("me/media", {"fields": "id,caption,media_product_type,timestamp,permalink", "limit": limit}, token)
    reels = []
    for m in data.get("data", []):
        if m.get("media_product_type") != "REELS":
            continue
        ins = _get(f"{m['id']}/insights", {"metric": REEL_METRICS}, token)
        nums = {d["name"]: (d.get("values") or [{}])[0].get("value", 0) for d in ins.get("data", [])}
        reels.append({
            "id": m["id"],
            "date": m.get("timestamp", "")[:10],
            "caption": (m.get("caption") or "").strip(),
            "permalink": m.get("permalink", ""),
            "views": nums.get("views", 0),
            "saved": nums.get("saved", 0),
            "shares": nums.get("shares", 0),
            "likes": nums.get("likes", 0),
            "comments": nums.get("comments", 0),
        })
    return reels


def first_line(caption, width=48):
    line = (caption or "").splitlines()[0] if caption else "(no caption)"
    return line if len(line) <= width else line[: width - 1] + "…"
