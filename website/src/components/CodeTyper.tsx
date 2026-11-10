"use client";

import { useEffect, useState } from "react";
import type { Theme } from "./ThemeProvider";

// Snippets come straight from the reels' notes, so the hero teaches something real.
const SNIPPETS: Record<Theme, { file: string; code: string }[]> = {
  cc: [
    {
      file: "memo.py · EP 06",
      code: `memo = {}

def fib(n):
    if n <= 1: return n
    if n in memo:          # diary mein hai?
        return memo[n]     # seedha return
    memo[n] = fib(n-1) + fib(n-2)
    return memo[n]

fib(50)  # 4000 crore calls -> sirf 99`,
    },
    {
      file: "merge.py · EP 12",
      code: `def merge(a, b):
    i = j = 0; out = []
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:   # do ungliyan
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    return out + a[i:] + b[j:]`,
    },
  ],
  dev: [
    {
      file: "seat_lock.redis · 01",
      code: `# 1000 log, 1 seat (E7), same second
SET seat:show42:E7 user_A NX EX 600
# -> OK      (user_A ko seat mili)

SET seat:show42:E7 user_B NX EX 600
# -> (nil)   (sorry, already held)

TTL seat:show42:E7
# -> 600     (10 min mein auto-free)`,
    },
    {
      file: "tunnel.txt · 02",
      code: `you  -> [encrypt] -> VPN server -> site
ISP sees:   gibberish to 1 server
site sees:  VPN server ka IP
# trust shift hota hai, gayab nahi`,
    },
  ],
};

const KW =
  /\b(def|if|in|return|while|and|else|for|global|print|range|len|SET|GET|TTL|NX|EX|const|let|var|int|cout|console|log|setTimeout|Promise|then|true|false|import|from)\b/g;

export function highlight(line: string, commentMark = "#") {
  const ci = line.indexOf(commentMark);
  const code = ci >= 0 ? line.slice(0, ci) : line;
  const comment = ci >= 0 ? line.slice(ci) : "";
  const parts: React.ReactNode[] = [];
  let last = 0;
  const re = new RegExp(`${KW.source}|(\\d+)|(->)`, "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last) parts.push(code.slice(last, m.index));
    const cls = m[1] ? "tk-kw" : m[2] ? "tk-num" : "tk-op";
    parts.push(
      <span key={m.index} className={cls}>
        {m[0]}
      </span>,
    );
    last = m.index + m[0].length;
  }
  parts.push(code.slice(last));
  if (comment) parts.push(<span key="c" className="tk-cm">{comment}</span>);
  return parts;
}

export function CodeTyper({ theme }: { theme: Theme }) {
  const list = SNIPPETS[theme];
  const [idx, setIdx] = useState(0);
  const [n, setN] = useState(0);
  const snip = list[idx % list.length];

  useEffect(() => {
    setIdx(0);
    setN(0);
  }, [theme]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(snip.code.length);
      return;
    }
    if (n < snip.code.length) {
      const ch = snip.code[n];
      const id = setTimeout(() => setN(n + 1), ch === "\n" ? 140 : 22 + Math.random() * 30);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setIdx((i) => i + 1);
      setN(0);
    }, 3200);
    return () => clearTimeout(id);
  }, [n, snip]);

  const lines = snip.code.slice(0, n).split("\n");

  return (
    <div className="typer">
      <div className="typer-bar">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mono">{snip.file}</span>
      </div>
      <pre className="mono">
        {lines.map((l, i) => (
          <div key={i} className="ln">
            <span className="no">{i + 1}</span>
            <span>
              {highlight(l)}
              {i === lines.length - 1 && <span className="caret" />}
            </span>
          </div>
        ))}
      </pre>
      <style>{`
        .typer{background:color-mix(in srgb,var(--code-bg) 88%,transparent);border:var(--bw) solid var(--line);border-radius:var(--radius-sm);
          box-shadow:var(--shadow);overflow:hidden;backdrop-filter:blur(12px);color:#e9e6df;width:100%}
        [data-theme=cc] .typer{box-shadow:0 30px 80px -30px rgba(255,122,26,.35),inset 0 1px 0 rgba(255,255,255,.06)}
        .typer-bar{display:flex;align-items:center;gap:12px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.08);font-size:12px;color:#8a8f9c}
        [data-theme=dev] .typer-bar{background:var(--accent-2);color:#111;border-bottom:3px solid #111;font-weight:700}
        .dots{display:flex;gap:6px}.dots i{width:10px;height:10px;border-radius:50%;background:#2a2d36}
        [data-theme=dev] .dots i{background:#fff;border:2px solid #111}
        .typer pre{margin:0;padding:14px 0;font-size:13px;line-height:1.65;min-height:250px;white-space:pre}
        .typer .ln{display:flex;padding-right:14px}.typer .no{width:38px;text-align:right;padding-right:14px;color:#3d404b;user-select:none;flex:none}
        .tk-kw{color:#ff9a4d}.tk-num{color:#ffd9b0}.tk-op{color:#ffb547}.tk-cm{color:#6c7080;font-style:italic}
        [data-theme=dev] .tk-kw{color:#FFD23F}[data-theme=dev] .tk-num{color:#3DDC97}[data-theme=dev] .tk-op{color:#FF6FB5}
        @media (max-width:520px){.typer pre{font-size:11px;min-height:210px}}
      `}</style>
    </div>
  );
}
