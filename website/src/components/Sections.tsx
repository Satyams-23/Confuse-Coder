"use client";

import { motion, useInView, animate } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import type { Note, Project } from "@/lib/content";
import Link from "next/link";
import { YOUTUBE } from "@/lib/links";

const reveal = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.7, ease: [0.2, 0.7, 0.2, 1] as const },
};

/* ───────── Ticker (ref video A's top ticker, but with topics) ───────── */
export function Ticker({ topics }: { topics: string[] }) {
  const items = [...topics, ...topics];
  return (
    <div className="marquee ticker" aria-label="Topics covered">
      <div className="marquee-track">
        {items.map((t, i) => (
          <span key={i} className="tick mono">
            <i>{i % 3 === 0 ? "▲" : i % 3 === 1 ? "●" : "■"}</i>
            {t}
          </span>
        ))}
      </div>
      <style>{`
        .ticker{overflow:hidden;border-block:var(--bw) solid var(--line);padding:14px 0;background:var(--bg-2);position:relative}
        [data-theme=dev] .ticker{background:#111;color:var(--accent);rotate:-1.2deg;margin:0 -20px;border-color:#111}
        .tick{display:inline-flex;align-items:center;gap:10px;padding:0 26px;font-size:13px;color:var(--muted);white-space:nowrap}
        .tick i{font-style:normal;color:var(--accent);font-size:9px}
        [data-theme=dev] .tick{color:var(--accent);font-weight:700;font-size:14px;text-transform:uppercase}
        [data-theme=dev] .tick i{color:var(--accent-2)}
      `}</style>
    </div>
  );
}

/* ───────── Stats ───────── */
function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toString();
      },
    });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>0</span>;
}

export function Stats({ notes, projects, questions }: { notes: number; projects: number; questions: number }) {
  const items = [
    { n: notes, label: "notes pages", sub: "comment NOTES → yahan" },
    { n: questions, label: "output-game sawaal", sub: "bina terminal, sirf dimaag" },
    { n: projects, label: "build projects", sub: "starter + tests + solution" },
    { n: 2, label: "accounts", sub: "DSA + .dev" },
  ];
  return (
    <section className="wrap stats">
      {items.map((it, i) => (
        <motion.div key={it.label} className="card stat" {...reveal} transition={{ ...reveal.transition, delay: i * 0.08 }}>
          <div className="display stat-n">
            <Count to={it.n} />
            <span className="accent-plus">+</span>
          </div>
          <div className="stat-l">{it.label}</div>
          <div className="stat-s mono">{it.sub}</div>
        </motion.div>
      ))}
      <style>{`
        .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding-top:80px}
        .stat{padding:26px}
        .stat-n{font-size:clamp(44px,5vw,64px)}
        .accent-plus{color:var(--accent);font-size:.6em;vertical-align:.4em;margin-left:2px}
        [data-theme=dev] .accent-plus{color:var(--accent-2)}
        .stat-l{font-weight:600;margin-top:10px}
        .stat-s{font-size:12px;color:var(--muted);margin-top:6px}
        [data-theme=dev] .stat:nth-child(1){background:var(--accent)}
        [data-theme=dev] .stat:nth-child(3){background:var(--accent-3)}
        @media (max-width:820px){.stats{grid-template-columns:repeat(2,1fr)}}
      `}</style>
    </section>
  );
}

/* ───────── Notes bento (D3 "Code Wiki" + Gcore cards) ───────── */
export function NotesBento({ notes }: { notes: Note[] }) {
  const { theme } = useTheme();
  const [q, setQ] = useState("");
  const mine = theme === "cc" ? "confuse_coder" : "confuse_coder.dev";
  const list = useMemo(() => {
    const sorted = [...notes].sort((a, b) => Number(b.account === mine) - Number(a.account === mine));
    const s = q.trim().toLowerCase();
    return (s ? sorted.filter((n) => (n.title + n.excerpt).toLowerCase().includes(s)) : sorted).slice(0, 9); // 1 big (2×2) + 8 small = 3 full rows of 4
  }, [notes, mine, q]);

  return (
    <section id="notes" className="section">
      <div className="glow" style={{ width: 500, height: 500, right: "-10%", top: "10%", background: "#ff5a00", opacity: 0.18 }} />
      <div className="wrap">
        <motion.div {...reveal} className="notes-head">
          <div>
            <span className="eyebrow">
              <i>✎</i>notes
            </span>
            <h2 className="display section-title">
              Reel dekhi?
              <br />
              Ab <span className="accent-text">notes</span> padho.
            </h2>
            <p className="section-sub">
              Har reel ka cheat sheet: concept, code, dry run aur common galtiyan. Exam se ek raat pehle wala dost.
            </p>
          </div>
          <label className="search">
            <span className="mono">⌕</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="redis, memo, merge sort…" aria-label="Search notes" />
          </label>
        </motion.div>

        <div className="bento">
          {list.map((n, i) => (
            <motion.article
              key={n.account + n.slug}
              className={`card hoverable note ${i === 0 ? "big" : ""} ${n.account === "confuse_coder.dev" ? "is-dev" : "is-cc"}`}
              {...reveal}
              transition={{ ...reveal.transition, delay: (i % 4) * 0.06 }}
            >
              {i === 0 && (
                <span className="bignum display" aria-hidden>
                  {String(n.ep).padStart(2, "0")}
                </span>
              )}
              <div className="note-top mono">
                <span className="pill">{n.account === "confuse_coder.dev" ? ".dev" : "DSA"}</span>
                <span>EP {String(n.ep).padStart(2, "0")}</span>
              </div>
              <h3 className="note-title">
                <Link href={`/notes/${n.account === "confuse_coder.dev" ? "dev" : "dsa"}/${n.slug}`}>{n.title}</Link>
              </h3>
              <p className="note-ex">{n.excerpt}</p>
              <div className="note-foot mono">
                <span>comment “{n.keyword}”</span>
                <span className="soon">poore notes padho →</span>
              </div>
            </motion.article>
          ))}
          {!list.length && <p className="mono empty">Is topic pe abhi reel nahi bani. Comment karke batao 👀</p>}
        </div>
      </div>
      <style>{`
        .notes-head{display:flex;justify-content:space-between;align-items:flex-end;gap:30px;flex-wrap:wrap}
        .search{display:flex;align-items:center;gap:10px;padding:12px 16px;border:var(--bw) solid var(--line);border-radius:999px;background:var(--card);min-width:300px}
        [data-theme=dev] .search{border-radius:10px;background:#fff;box-shadow:4px 4px 0 #111}
        .search input{all:unset;flex:1;font:14px var(--font-mono);color:var(--fg)}
        .search input::placeholder{color:var(--muted)}
        .search:focus-within{border-color:var(--accent)}
        .bento{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-top:50px}
        .note{padding:22px;display:flex;flex-direction:column;gap:12px;min-height:230px;position:relative;overflow:hidden}
        .note.big{grid-column:span 2;grid-row:span 2;min-height:476px;justify-content:flex-end}
        [data-theme=cc] .note.big{background:radial-gradient(120% 80% at 80% 0%,rgba(255,122,26,.28),transparent 60%),var(--card)}
        [data-theme=dev] .note.big{background:var(--accent)}
        [data-theme=dev] .note:nth-child(3){background:var(--accent-2)}
        [data-theme=dev] .note:nth-child(6){background:var(--accent-3)}
        .bignum{position:absolute;top:-0.12em;right:.05em;font-size:clamp(160px,18vw,260px);line-height:1;color:transparent;
          -webkit-text-stroke:1.5px rgba(255,122,26,.35);pointer-events:none}
        [data-theme=dev] .bignum{color:#fff;-webkit-text-stroke:4px #111;text-shadow:8px 8px 0 #111}
        .note-top{display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted)}
        [data-theme=dev] .note-top{color:#111}
        .pill{padding:4px 9px;border-radius:999px;border:1px solid var(--line);color:var(--fg)}
        .is-dev .pill{color:var(--accent-2);border-color:currentColor}
        [data-theme=dev] .pill{background:#111;color:#fff!important;border-radius:5px}
        .note-title a{color:inherit;text-decoration:none}.note-title a::after{content:"";position:absolute;inset:0}
        .note-title{font-size:20px;line-height:1.2;margin:0;font-weight:700;letter-spacing:-.01em}
        .note.big .note-title{font-family:var(--font-display);font-weight:var(--display-weight);font-size:clamp(28px,3.2vw,44px);letter-spacing:var(--display-track);line-height:1}
        .note-ex{margin:0;color:var(--muted);font-size:14px;line-height:1.55;flex:1}
        [data-theme=dev] .note-ex{color:#2a2720}
        .note.big .note-ex{flex:none;font-size:16px;max-width:440px}
        .note-foot{display:flex;justify-content:space-between;font-size:11.5px;color:var(--muted);border-top:1px dashed var(--line);padding-top:12px}
        [data-theme=dev] .note-foot{color:#111;border-top:2px dashed #111}
        .soon{color:var(--accent)}[data-theme=dev] .soon{color:#111;font-weight:700}
        .empty{color:var(--muted);grid-column:1/-1}
        @media (max-width:960px){.bento{grid-template-columns:repeat(2,1fr)}.note.big{min-height:340px}}
        @media (max-width:560px){.bento{grid-template-columns:1fr}.note.big{grid-column:auto;grid-row:auto}.search{min-width:0;width:100%}}
      `}</style>
    </section>
  );
}

/* ───────── Big words (pin 8) ───────── */
export function BigWords() {
  const words = ["Learn.", "Build.", "Unconfuse."];
  return (
    <section className="bigwords wrap" aria-label="Learn. Build. Unconfuse.">
      {words.map((w, i) => (
        <motion.div
          key={w}
          className="display bw"
          initial={{ opacity: 0, x: i % 2 ? 80 : -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: i * 0.12, ease: [0.2, 0.7, 0.2, 1] }}
          style={{ textAlign: i === 1 ? "center" : i === 2 ? "right" : "left" }}
        >
          {i === 2 ? <span className="accent-text">{w}</span> : w}
        </motion.div>
      ))}
      <style>{`
        .bigwords{padding:60px 0 100px}
        .bw{font-size:clamp(56px,12vw,180px);line-height:.92}
        [data-theme=cc] .bw:not(:last-child){color:transparent;-webkit-text-stroke:1.5px color-mix(in srgb,var(--fg) 40%,transparent)}
        [data-theme=dev] .bw .accent-text{border-width:5px;box-shadow:10px 10px 0 #111}
      `}</style>
    </section>
  );
}

/* ───────── Playground: the memoization reel, playable ───────── */
const fibN = (n: number) => {
  let a = 0,
    b = 1;
  for (let i = 0; i < n; i++) [a, b] = [b, a + b];
  return a;
};
const naiveCalls = (n: number) => 2 * fibN(n + 1) - 1;
const memoCalls = (n: number) => Math.max(1, 2 * n - 1);

function human(n: number) {
  if (n >= 1e7) return `${(n / 1e7).toLocaleString("en-IN", { maximumFractionDigits: 1 })} crore`;
  if (n >= 1e5) return `${(n / 1e5).toLocaleString("en-IN", { maximumFractionDigits: 1 })} lakh`;
  return n.toLocaleString("en-IN");
}
function timeAt1e9(calls: number) {
  const s = calls / 1e9;
  if (s < 1e-3) return "pal bhar mein";
  if (s < 1) return `${(s * 1000).toFixed(0)} ms`;
  if (s < 3600) return `${s.toFixed(1)} sec`;
  if (s < 86400 * 365) return `${(s / 86400).toFixed(1)} din`;
  return `${Math.round(s / (86400 * 365)).toLocaleString("en-IN")} saal`;
}

const DOT_CAP = 900;

export function Playground() {
  const [n, setN] = useState(20);
  const [memo, setMemo] = useState(false);
  const calls = memo ? memoCalls(n) : naiveCalls(n);
  const dots = Math.min(calls, DOT_CAP);

  return (
    <section id="playground" className="play">
      <div className="wrap">
        <motion.div {...reveal} className="play-head">
          <span className="eyebrow">
            <i>▶</i>playground · EP 06
          </span>
          <h2 className="display section-title">Khud try karo.</h2>
          <p className="section-sub">
            Reel mein <span className="mono">fib(50)</span> ne laptop hang kar diya tha. Slider khiskao, phir memo on karo. Har dot = ek function call.
          </p>
        </motion.div>

        <motion.div {...reveal} className="play-box">
          <div className="controls">
            <label className="mono">
              fib(<b>{n}</b>)
              <input type="range" min={3} max={60} value={n} onChange={(e) => setN(+e.target.value)} aria-label="n" />
            </label>
            <button className={`toggle ${memo ? "on" : ""}`} onClick={() => setMemo(!memo)} aria-pressed={memo}>
              <span className="knob" />
              memo {memo ? "ON" : "OFF"}
            </button>
          </div>

          <div className="readout">
            <div>
              <div className="mono lbl">function calls</div>
              <div className="display big">{human(calls)}</div>
            </div>
            <div>
              <div className="mono lbl">10⁹ calls/sec pe time</div>
              <div className="display big">{timeAt1e9(calls)}</div>
            </div>
          </div>

          <div className="dots" aria-hidden>
            {Array.from({ length: dots }, (_, i) => (
              <i key={i} style={{ animationDelay: `${Math.min(i, 300) * 2}ms` }} className={memo ? "m" : ""} />
            ))}
            {calls > DOT_CAP && <span className="more mono">+ {human(calls - DOT_CAP)} aur…</span>}
          </div>
          <p className="mono verdict">
            {memo
              ? `Diary (memo) mein likh liya, isliye har fib(k) sirf ek baar nikla. ${human(naiveCalls(n))} → ${memoCalls(n)}.`
              : n >= 40
                ? "Ye wahi hai jahan laptop ka pankha udne lagta hai. Ab memo ON karo."
                : "Same fib(k) baar baar zero se nikal raha hai. n badhao, dekho kya hota hai."}
          </p>
        </motion.div>
      </div>
      <style>{`
        .play{padding:clamp(80px,12vw,140px) 0;background:#f7f4ee;color:#111;position:relative;border-radius:36px;margin:0 12px}
        [data-theme=dev] .play{background:#111;color:#fff6e0;border-radius:0;margin:0;border-block:3px solid #111}
        .play .section-sub{color:#5b5850}[data-theme=dev] .play .section-sub{color:#cfc8b5}
        .play .eyebrow{background:#fff;color:#111;border-color:#e6e1d6}
        [data-theme=dev] .play .eyebrow{background:var(--accent-3);border-color:#fff6e0;box-shadow:3px 3px 0 #fff6e0}
        .play-head{text-align:center;display:flex;flex-direction:column;align-items:center}
        .play-box{margin:50px auto 0;max-width:900px;background:#fff;border:1px solid #e6e1d6;border-radius:28px;padding:30px;
          box-shadow:0 40px 80px -40px rgba(80,50,20,.25)}
        [data-theme=dev] .play-box{background:var(--bg);color:#111;border:3px solid #fff6e0;border-radius:16px;box-shadow:8px 8px 0 var(--accent)}
        .controls{display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
        .controls label{display:flex;align-items:center;gap:16px;font-size:18px;flex:1;min-width:240px}
        .controls b{color:#ff7a1a;min-width:2ch;display:inline-block}
        [data-theme=dev] .controls b{color:#111;background:var(--accent);padding:0 4px}
        input[type=range]{flex:1;accent-color:#ff7a1a}
        [data-theme=dev] input[type=range]{accent-color:#111}
        .toggle{all:unset;cursor:pointer;display:flex;align-items:center;gap:12px;padding:10px 18px 10px 10px;border-radius:999px;background:#f1ede5;
          font:700 14px var(--font-mono);color:#111;transition:background .3s}
        .toggle .knob{width:40px;height:22px;border-radius:999px;background:#d8d2c6;position:relative;transition:background .3s}
        .toggle .knob::after{content:"";position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .3s}
        .toggle.on{background:#ffe6d1}.toggle.on .knob{background:#ff7a1a}.toggle.on .knob::after{transform:translateX(18px)}
        [data-theme=dev] .toggle{border:3px solid #111;border-radius:10px;box-shadow:3px 3px 0 #111;background:#fff}
        [data-theme=dev] .toggle.on{background:var(--accent-3)}[data-theme=dev] .toggle.on .knob{background:#111}
        .toggle:focus-visible{outline:2px solid #ff7a1a;outline-offset:3px}
        .readout{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:26px 0 18px}
        .readout>div{background:#faf8f4;border-radius:18px;padding:18px}
        [data-theme=dev] .readout>div{background:#fff;border:3px solid #111;border-radius:10px}
        .lbl{font-size:11px;color:#8a857a;text-transform:uppercase;letter-spacing:.06em}
        .readout .big{font-size:clamp(28px,4vw,46px);margin-top:8px}
        .dots{display:flex;flex-wrap:wrap;gap:3px;max-height:220px;overflow:hidden;align-content:flex-start;padding:4px;position:relative}
        .dots i{width:7px;height:7px;border-radius:2px;background:#ff7a1a;animation:pop .3s both}
        .dots i.m{background:#22b07d}
        [data-theme=dev] .dots i{background:#111;border-radius:0}[data-theme=dev] .dots i.m{background:#22b07d}
        @keyframes pop{from{transform:scale(0);opacity:0}}
        .more{width:100%;margin-top:8px;font-size:13px;color:#ff7a1a;font-weight:700}
        [data-theme=dev] .more{color:#111;background:var(--accent-2);border:2px solid #111;padding:4px 8px;width:auto}
        .verdict{font-size:13.5px;color:#5b5850;margin:18px 0 0;line-height:1.6}
        [data-theme=dev] .verdict{color:#111}
        @media (max-width:560px){.readout{grid-template-columns:1fr}.play-box{padding:20px}}
      `}</style>
    </section>
  );
}

/* ───────── Projects ───────── */
export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="section">
      <div className="wrap">
        <motion.div {...reveal}>
          <span className="eyebrow">
            <i>⚒</i>build it yourself
          </span>
          <h2 className="display section-title">
            Sirf dekho mat.
            <br />
            <span className="accent-text">Banao.</span>
          </h2>
          <p className="section-sub">
            Har project ka boilerplate ready hai. Tum sirf woh core logic likhte ho jo reel mein sikhaya. Tests turant bata dete hain: PASSED ya FAILED.
          </p>
        </motion.div>

        <div className="proj-grid">
          {projects.map((p, i) => (
            <motion.article key={p.slug} className="card hoverable proj" {...reveal} transition={{ ...reveal.transition, delay: i * 0.1 }}>
              <div className="proj-no display">{String(p.ep).padStart(2, "0")}</div>
              <div className="proj-body">
                <span className="mono proj-concept">{p.concept}</span>
                <h3>{p.title}</h3>
                <p>{p.pitch}</p>
                <div className="proj-files mono">
                  <span>starter ✎</span>
                  <span>tests ✓</span>
                  <span>solution 🔒</span>
                  {p.languages.map((l) => (
                    <span key={l} className="lang">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
          <motion.article className="card proj next" {...reveal}>
            <div className="proj-no display">+</div>
            <div className="proj-body">
              <span className="mono proj-concept">next reel</span>
              <h3>Agla project tum chuno</h3>
              <p>Kis topic pe build karna hai? Kisi bhi reel pe comment karo. Sabse zyada maanga gaya topic agla project banega.</p>
            </div>
          </motion.article>
        </div>
      </div>
      <style>{`
        .proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:50px}
        .proj{padding:26px;display:flex;flex-direction:column;gap:18px}
        .proj-no{font-size:72px;color:transparent;-webkit-text-stroke:1.5px var(--accent);line-height:1}
        [data-theme=dev] .proj-no{color:var(--accent);-webkit-text-stroke:3px #111}
        .proj-concept{font-size:12px;color:var(--accent)}
        [data-theme=dev] .proj-concept{color:#111;background:var(--accent-3);border:2px solid #111;padding:2px 6px;border-radius:5px}
        .proj h3{font-size:24px;margin:10px 0 8px;letter-spacing:-.02em}
        .proj p{color:var(--muted);font-size:14.5px;line-height:1.6;margin:0}
        .proj-files{display:flex;flex-wrap:wrap;gap:6px;margin-top:18px}
        .proj-files span{font-size:11.5px;padding:5px 9px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
        [data-theme=dev] .proj-files span{border:2px solid #111;color:#111;border-radius:6px;background:#fff}
        .proj-files .lang{color:var(--fg);border-color:var(--accent)}
        [data-theme=dev] .proj-files .lang{background:var(--accent)}
        .proj.next{border-style:dashed}
        [data-theme=dev] .proj.next{background:var(--accent-2);border-style:solid}
        @media (max-width:960px){.proj-grid{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}

/* ───────── CTA with horizon glow (Gcore video) ───────── */
export function Cta() {
  return (
    <section id="contact" className="wrap cta-wrap">
      <motion.div {...reveal} className="cta">
        <div className="horizon" />
        <span className="eyebrow">
          <i>✦</i>dono accounts
        </span>
        <h2 className="display cta-title">
          Confusion ka <span className="accent-text">ilaaj</span>,
          <br />
          roz ek reel.
        </h2>
        <p className="section-sub cta-sub">DSA ke liye ek, dev world ke liye ek. Follow karo, comment karo NOTES, aur yahan wapas aao.</p>
        <div className="cta-btns">
          <a className="btn btn-primary" href="https://instagram.com/confuse__coder" target="_blank" rel="noreferrer">
            @confuse__coder <span className="arrow">↗</span>
          </a>
          <a className="btn btn-primary alt" href="https://instagram.com/confuse__coder.dev" target="_blank" rel="noreferrer">
            @confuse__coder.dev <span className="arrow">↗</span>
          </a>
          <a className="btn btn-primary yt" href={YOUTUBE} target="_blank" rel="noreferrer">
            YouTube <span className="arrow">↗</span>
          </a>
        </div>
      </motion.div>
      <style>{`
        .cta-wrap{padding:40px 0 120px}
        .cta{position:relative;overflow:hidden;text-align:center;padding:90px 24px 200px;border-radius:32px;border:var(--bw) solid var(--line);background:var(--bg-2);
          display:flex;flex-direction:column;align-items:center}
        .horizon{position:absolute;left:-10%;right:-10%;bottom:-62%;height:100%;border-radius:50%;pointer-events:none;
          background:radial-gradient(closest-side,#fff 0%,#ffd2a8 18%,#ff7a1a 42%,rgba(255,80,0,.35) 62%,transparent 75%);filter:blur(10px)}
        [data-theme=dev] .cta{background:var(--accent);border-radius:18px;box-shadow:10px 10px 0 #111;padding-bottom:110px}
        [data-theme=dev] .horizon{display:none}
        .cta-title{font-size:clamp(42px,7vw,96px);margin:22px 0 0;position:relative}
        .cta-sub{margin-inline:auto;position:relative}
        [data-theme=dev] .cta-sub{color:#111}
        [data-theme=dev] .cta .accent-text{background:#fff}
        .cta-btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:30px;position:relative}
        [data-theme=dev] .btn-primary.alt{background:var(--accent-2)}
        [data-theme=dev] .cta .btn-primary{background:#fff}
        [data-theme=dev] .cta .btn-primary.yt{background:var(--accent-3)}
      `}</style>
    </section>
  );
}

/* ───────── Footer with giant wordmark (ref video A) ───────── */
export function Footer() {
  const { theme } = useTheme();
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <div className="foot-brand">Confuse Coder</div>
          <p className="mono foot-small">Hinglish mein code samjhao. Galti se seekho. Repeat.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/#notes">Notes</Link>
          <Link href="/#playground">Playground</Link>
          <Link href="/#projects">Projects</Link>
        </div>
        <div>
          <h4>Instagram</h4>
          <a href="https://instagram.com/confuse__coder" target="_blank" rel="noreferrer">
            @confuse__coder
          </a>
          <a href="https://instagram.com/confuse__coder.dev" target="_blank" rel="noreferrer">
            @confuse__coder.dev
          </a>
        </div>
        <div>
          <h4>YouTube</h4>
          <a href={YOUTUBE} target="_blank" rel="noreferrer">
            @ConfuseCoder23
          </a>
        </div>
      </div>
      <div className="wordmark display" aria-hidden>
        {theme === "dev" ? "confuse.dev" : "unconfused"}
      </div>
      <div className="wrap foot-bottom mono">
        <span>© {new Date().getFullYear()} Confuse Coder</span>
        <span>made with recursion (and a base case)</span>
      </div>
      <style>{`
        .foot{border-top:var(--bw) solid var(--line);padding-top:70px;overflow:hidden}
        .foot-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:30px}
        .foot-brand{font-weight:700;font-size:22px}
        .foot-small{color:var(--muted);font-size:12.5px;margin-top:10px}
        .foot h4{font-size:13px;color:var(--muted);font-weight:500;margin:0 0 14px}
        .foot a{display:block;color:var(--fg);text-decoration:none;font-size:15px;margin-bottom:10px}
        .foot a:hover{color:var(--accent)}
        [data-theme=dev] .foot a:hover{background:var(--accent);color:#111}
        .wordmark{font-size:clamp(56px,15.5vw,250px);text-align:center;line-height:.8;margin:60px 0 0;white-space:nowrap;
          background:linear-gradient(180deg,var(--fg) 30%,transparent 95%);-webkit-background-clip:text;background-clip:text;color:transparent}
        [data-theme=cc] .wordmark{background:linear-gradient(180deg,#ffb547 0%,#ff7a1a 35%,transparent 90%);-webkit-background-clip:text;background-clip:text}
        [data-theme=dev] .wordmark{background:none;color:var(--accent);-webkit-text-stroke:4px #111;text-shadow:10px 10px 0 #111}
        .foot-bottom{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;padding:20px 0 28px;font-size:12px;color:var(--muted);border-top:1px solid var(--line)}
        [data-theme=dev] .foot-bottom{border-top:3px solid #111;color:#111}
        @media (max-width:700px){.foot-grid{grid-template-columns:1fr 1fr}.foot-grid>div:first-child{grid-column:1/-1}}
      `}</style>
    </footer>
  );
}
