"""Round 2: one hard task for the models that passed round 1, plus a Gemma retry."""
import json, os, time
from bench import chat, extract, run_tests, HERE

MODELS = [
    "google/gemma-4-31b-it:free", "google/gemma-4-26b-a4b-it:free",
    "nvidia/nemotron-3-ultra-550b-a55b:free", "nvidia/nemotron-3.5-super-vl:free",
    "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", "nvidia/nemotron-3.5-lightning:free",
    "cohere/north-mini-code:free", "baidu/ernie-5.5-flash-preview:free",
    "particle-ai/particle-1:free", "recursive/flint-v1.0:free",
    "dots-studio/dots-3-note-preview:free", "liquid/lfm-3-1.7b:free",
]
PROMPT = ("Write a Python function calculate(s) that evaluates an arithmetic expression string containing "
          "non-negative integers, spaces, + - * / and parentheses. Unary minus is allowed (e.g. '-(2+3)', "
          "'3*-2', '--4'). Division is integer division that truncates toward zero (so -7/2 == -3). "
          "Normal precedence: * and / before + and -, left to right. Do NOT use eval, exec, or ast. "
          "Reply with only one ```python code block, no explanation.")
TESTS = """
import builtins
_eval = builtins.eval
def _no(*a, **k): raise RuntimeError('eval not allowed')
builtins.eval = _no; builtins.exec = _no
assert calculate('1 + 1') == 2
assert calculate(' 2-1 + 2 ') == 3
assert calculate('(1+(4+5+2)-3)+(6+8)') == 23
assert calculate('3+2*2') == 7
assert calculate(' 3/2 ') == 1
assert calculate('-7/2') == -3
assert calculate('7/-2') == -3
assert calculate('-(2+3)') == -5
assert calculate('3*-2') == -6
assert calculate('--4') == 4
assert calculate('2*(5+5*2)/3+(6/2+8)') == 21
assert calculate('100 - 2*(3 - (4*5)) / -3') == 89
assert calculate('14-3/2') == 13
assert calculate('0') == 0
"""

rows = []
for m in MODELS:
    r = chat(m, PROMPT, timeout=150)
    row = {"model": m, "task": "calculator", "secs": r["secs"], "ok": r["ok"]}
    if r["ok"]:
        passed, err = run_tests(extract(r["text"]), TESTS)
        row.update(passed=passed, err=err, out_tokens=r["usage"].get("completion_tokens"))
    else:
        row.update(passed=False, err=r["err"][:160])
    rows.append(row)
    print(json.dumps(row), flush=True)
    time.sleep(3.5)
json.dump(rows, open(os.path.join(HERE, "results_round2.json"), "w"), indent=1)
print("saved")
