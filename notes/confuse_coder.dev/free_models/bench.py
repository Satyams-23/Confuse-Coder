"""Benchmark OpenRouter free models on the same coding tasks.
Usage: python -I bench.py sanity | python -I bench.py run
Key is read from env or HKCU\\Environment; it is never printed.
"""
import json, os, re, subprocess, sys, tempfile, time, urllib.request, urllib.error

HERE = os.path.dirname(os.path.abspath(__file__))
URL = "https://openrouter.ai/api/v1/chat/completions"


def key():
    k = os.environ.get("OPENROUTER_API_KEY")
    if not k:
        import winreg
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as h:
            k = winreg.QueryValueEx(h, "OPENROUTER_API_KEY")[0]
    return k.strip()


def chat(model, prompt, timeout=120):
    body = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}],
                       "temperature": 0}).encode()
    req = urllib.request.Request(URL, data=body, headers={
        "Authorization": "Bearer " + key(), "Content-Type": "application/json",
        "X-Title": "free-model-bench"})
    t = time.time()
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            d = json.load(r)
    except urllib.error.HTTPError as e:
        return {"ok": False, "err": f"HTTP {e.code}: {e.read().decode(errors='replace')[:200]}",
                "secs": round(time.time() - t, 1)}
    except Exception as e:
        return {"ok": False, "err": repr(e)[:200], "secs": round(time.time() - t, 1)}
    secs = round(time.time() - t, 1)
    if "error" in d:
        return {"ok": False, "err": str(d["error"])[:200], "secs": secs}
    msg = d["choices"][0]["message"]
    return {"ok": True, "text": msg.get("content") or "", "secs": secs,
            "served_by": d.get("model"), "usage": d.get("usage", {})}


TASKS = {
    "merge_intervals": {
        "prompt": ("Write a Python function merge_intervals(intervals) that takes a list of [start, end] "
                   "integer pairs (unsorted, may be empty, may touch like [1,2],[2,3]) and returns the merged "
                   "list sorted by start. Touching intervals must merge. Do not modify the input. "
                   "Reply with only one ```python code block, no explanation."),
        "tests": """
assert merge_intervals([]) == []
assert merge_intervals([[1,3],[2,6],[8,10],[15,18]]) == [[1,6],[8,10],[15,18]]
assert merge_intervals([[1,4],[4,5]]) == [[1,5]]
assert merge_intervals([[5,6],[1,2]]) == [[1,2],[5,6]]
assert merge_intervals([[1,10],[2,3],[4,5]]) == [[1,10]]
a = [[3,4],[1,2]]; merge_intervals(a); assert a == [[3,4],[1,2]]
""",
    },
    "lru_cache": {
        "prompt": ("Write a Python class LRUCache with __init__(self, capacity), get(self, key) returning the "
                   "value or -1, and put(self, key, value). Both get and put count as a use. When over capacity, "
                   "evict the least recently used key. O(1) per operation; you may use collections.OrderedDict. "
                   "Reply with only one ```python code block, no explanation."),
        "tests": """
c = LRUCache(2)
c.put(1, 1); c.put(2, 2)
assert c.get(1) == 1
c.put(3, 3)
assert c.get(2) == -1
c.put(4, 4)
assert c.get(1) == -1 and c.get(3) == 3 and c.get(4) == 4
d = LRUCache(1); d.put(1, 1); d.put(1, 5); assert d.get(1) == 5
d.put(2, 2); assert d.get(1) == -1 and d.get(2) == 2
e = LRUCache(2); e.put(1,1); e.put(2,2); e.put(1,10); e.put(3,3)
assert e.get(2) == -1 and e.get(1) == 10
""",
    },
}


def extract(text):
    m = re.findall(r"```(?:python|py)?\s*\n(.*?)```", text, re.S)
    return max(m, key=len) if m else text


def run_tests(code, tests):
    with tempfile.TemporaryDirectory() as td:
        p = os.path.join(td, "t.py")
        open(p, "w", encoding="utf-8").write(code + "\n\n" + tests + "\nprint('PASS')\n")
        try:
            r = subprocess.run([sys.executable, "-I", p], cwd=td, capture_output=True, text=True, timeout=15)
        except subprocess.TimeoutExpired:
            return False, "timeout"
        return ("PASS" in r.stdout), (r.stderr.strip().splitlines() or [""])[-1][:150]


def free_text_models():
    with urllib.request.urlopen("https://openrouter.ai/api/v1/models", timeout=30) as r:
        data = json.load(r)["data"]
    out = []
    for m in data:
        p = m.get("pricing", {})
        free = m["id"].endswith(":free") or (p.get("prompt") == "0" and p.get("completion") == "0")
        outs = m.get("architecture", {}).get("output_modalities", ["text"])
        if free and "text" in outs:
            out.append(m["id"])
    return out


if __name__ == "__main__":
    mode = sys.argv[1] if len(sys.argv) > 1 else "sanity"
    if mode == "sanity":
        r = chat("openrouter/free", "Reply with exactly: hello confuse coder")
        print({k: v for k, v in r.items() if k != "usage"})
        sys.exit()
    models = free_text_models()
    print(len(models), "free text models:", models, flush=True)
    results = []
    for mid in models:
        for tname, t in TASKS.items():
            r = chat(mid, t["prompt"])
            row = {"model": mid, "task": tname, "secs": r["secs"], "ok": r["ok"]}
            if r["ok"]:
                passed, err = run_tests(extract(r["text"]), t["tests"])
                row.update(passed=passed, err=err, served_by=r.get("served_by"),
                           out_tokens=r["usage"].get("completion_tokens"))
            else:
                row.update(passed=False, err=r["err"])
            results.append(row)
            print(json.dumps(row), flush=True)
            time.sleep(3.5)  # stay under 20 req/min
    json.dump(results, open(os.path.join(HERE, "results.json"), "w"), indent=1)
    print("saved results.json")
