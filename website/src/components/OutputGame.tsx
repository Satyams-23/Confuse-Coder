"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { highlight } from "./CodeTyper";
import { useTheme, type Theme } from "./ThemeProvider";
import { BANK } from "@/lib/questions";

/*
  "Output batao": read the code, run it in your head, pick the output.
  No terminal, no compiler. Every answer below was verified by actually running
  the snippet (Python 3, Node, g++) before it went in.
*/

const BEST_KEY = (t: Theme) => `cc-game-best-${t}`;

export function OutputGame() {
  const { theme } = useTheme();
  const qs = BANK[theme];
  const [order, setOrder] = useState(() => qs.map((_, i) => i));
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const done = step >= order.length;
  const q = qs[order[Math.min(step, order.length - 1)]];

  const reset = (shuffle: boolean) => {
    const o = qs.map((_, i) => i);
    if (shuffle) o.sort(() => Math.random() - 0.5);
    setOrder(o);
    setStep(0);
    setPicked(null);
    setScore(0);
    setStreak(0);
  };

  useEffect(() => {
    reset(false);
    try {
      setBest(Number(localStorage.getItem(BEST_KEY(theme))) || 0);
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    if (!done || score <= best) return;
    setBest(score);
    try {
      localStorage.setItem(BEST_KEY(theme), String(score));
    } catch {}
  }, [done, score, best, theme]);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else setStreak(0);
  };

  const next = () => {
    setPicked(null);
    setStep((s) => s + 1);
  };

  // keyboard: 1-4 to answer, Enter for next
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const el = document.getElementById("game");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      if (picked === null && /^[1-4]$/.test(e.key)) choose(+e.key - 1);
      else if (picked !== null && e.key === "Enter") next();
    };
    addEventListener("keydown", on);
    return () => removeEventListener("keydown", on);
  });

  const verdict = useMemo(() => {
    const p = score / order.length;
    if (p === 1) return "Full marks. Tum confused nahi, tum compiler ho. 🧠";
    if (p >= 0.75) return "Solid! Bas ek-do trap mein fase.";
    if (p >= 0.5) return "Aadha rasta. Notes padho, phir try karo.";
    return "Koi baat nahi, confusion hi pehla step hai. Reels dekho, phir wapas aao.";
  }, [score, order.length]);

  const right = picked !== null && picked === q.answer;

  return (
    <section id="game" className="section game">
      <div className="glow" style={{ width: 520, height: 520, left: "-12%", top: "20%", background: "#ff5a00", opacity: 0.16 }} />
      <div className="wrap game-grid">
        <motion.div
          className="game-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <span className="eyebrow">
            <i>?</i>game · output batao
          </span>
          <h2 className="display section-title">
            Output
            <br />
            <span className="accent-text">batao.</span>
          </h2>
          <p className="section-sub">
            Code padho, dimaag mein chalao, answer chuno. Na terminal, na compiler. Sirf tum aur tumhara dimaag.
          </p>
          <div className="scoreboard mono">
            <div>
              <span>score</span>
              <b>
                {score}/{order.length}
              </b>
            </div>
            <div>
              <span>streak</span>
              <b>{streak >= 2 ? `🔥 ${streak}` : streak}</b>
            </div>
            <div>
              <span>best</span>
              <b>{best}</b>
            </div>
          </div>
          <p className="mono keys">tip: keyboard pe 1–4 dabao, Enter = next</p>
        </motion.div>

        <div className="game-card card">
          <div className="progress" aria-hidden>
            {order.map((_, i) => (
              <i key={i} className={i < step ? "done" : i === step ? "now" : ""} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={theme + step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <div className="q-meta mono">
                  <span>
                    Q{step + 1} · {q.topic}
                  </span>
                  <span className="lang">{q.lang}</span>
                </div>
                <pre className="q-code mono">
                  {q.code.split("\n").map((l, i) => (
                    <div key={i}>{highlight(l, q.comment ?? "#")}</div>
                  ))}
                </pre>
                <p className="q-ask">Output kya hoga?</p>
                <div className="opts">
                  {q.options.map((o, i) => {
                    const state =
                      picked === null ? "" : i === q.answer ? "correct" : i === picked ? "wrong" : "dim";
                    return (
                      <motion.button
                        key={i}
                        className={`opt mono ${state}`}
                        onClick={() => choose(i)}
                        disabled={picked !== null}
                        animate={state === "wrong" ? { x: [0, -8, 8, -5, 5, 0] } : state === "correct" ? { scale: [1, 1.04, 1] } : {}}
                        transition={{ duration: 0.4 }}
                      >
                        <kbd>{i + 1}</kbd>
                        {o}
                      </motion.button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {picked !== null && (
                    <motion.div
                      className={`why ${right ? "why-ok" : "why-no"}`}
                      initial={{ opacity: 0, y: 10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                    >
                      <b>{right ? "Sahi jawab! ✓" : "Arre, trap mein fas gaye ✗"}</b>
                      <p>{q.why}</p>
                      <button className="btn btn-primary" onClick={next}>
                        {step + 1 === order.length ? "Result dekho" : "Next"} <span className="arrow">→</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div key="done" className="result" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="display big-score">
                  {score}
                  <span>/{order.length}</span>
                </div>
                <p className="result-line">{verdict}</p>
                <p className="mono result-cta">
                  Apna score reel ke comments mein daalo: <b>&quot;OUTPUT {score}/{order.length}&quot;</b>
                </p>
                <button className="btn btn-primary" onClick={() => reset(true)}>
                  Phir se khelo <span className="arrow">↺</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .game-grid{display:grid;grid-template-columns:.8fr 1.2fr;gap:50px;align-items:start;position:relative}
        .game-intro{position:sticky;top:110px}
        .scoreboard{display:flex;gap:10px;margin-top:30px}
        .scoreboard div{flex:1;border:var(--bw) solid var(--line);border-radius:var(--radius-sm);padding:12px 14px;background:var(--card)}
        [data-theme=dev] .scoreboard div{box-shadow:4px 4px 0 #111}
        [data-theme=dev] .scoreboard div:nth-child(2){background:var(--accent)}
        .scoreboard span{display:block;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
        .scoreboard b{display:block;font-size:24px;margin-top:4px}
        .keys{font-size:12px;color:var(--muted);margin-top:16px}
        .game-card{padding:24px;overflow:hidden}
        .progress{display:flex;gap:6px;margin-bottom:20px}
        .progress i{flex:1;height:4px;border-radius:4px;background:var(--line);transition:background .3s}
        [data-theme=dev] .progress i{height:8px;border:2px solid #111;background:#fff;border-radius:3px}
        .progress i.done{background:var(--accent)}
        .progress i.now{background:color-mix(in srgb,var(--accent) 45%,transparent)}
        [data-theme=dev] .progress i.now{background:var(--accent-2)}
        .q-meta{display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}
        .q-meta .lang{color:var(--accent)}
        [data-theme=dev] .q-meta{color:#111}
        [data-theme=dev] .q-meta .lang{background:#111;color:var(--accent);padding:2px 7px;border-radius:5px}
        .q-code{background:var(--code-bg);color:#e9e6df;border:var(--bw) solid var(--line);border-radius:var(--radius-sm);
          padding:16px 18px;margin:12px 0 0;font-size:14px;line-height:1.6;overflow-x:auto;white-space:pre}
        .q-code div{min-height:1.6em}
        .q-ask{font-weight:700;font-size:18px;margin:20px 0 12px}
        .opts{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .opt{all:unset;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;gap:12px;padding:14px;border-radius:var(--radius-sm);
          border:var(--bw) solid var(--line);background:var(--card);font:500 13.5px/1.4 var(--font-mono),monospace;white-space:pre-wrap;transition:border-color .2s,background .2s,opacity .2s}
        .opt:hover:not(:disabled){border-color:var(--accent)}
        .opt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .opt kbd{flex:none;width:24px;height:24px;border-radius:6px;display:grid;place-items:center;font:700 12px var(--font-mono);
          background:var(--bg-2);border:1px solid var(--line);color:var(--muted)}
        [data-theme=dev] .opt{background:#fff;box-shadow:3px 3px 0 #111}
        [data-theme=dev] .opt:hover:not(:disabled){transform:translate(-2px,-2px);box-shadow:5px 5px 0 #111;border-color:#111}
        [data-theme=dev] .opt kbd{background:var(--accent);border:2px solid #111;color:#111}
        .opt.correct{border-color:#22b07d;background:rgba(34,176,125,.14)}
        .opt.correct kbd{background:#22b07d;color:#fff;border-color:#22b07d}
        .opt.wrong{border-color:#ff4d4d;background:rgba(255,77,77,.12)}
        .opt.wrong kbd{background:#ff4d4d;color:#fff;border-color:#ff4d4d}
        [data-theme=dev] .opt.correct{background:var(--accent-3);border-color:#111}
        [data-theme=dev] .opt.wrong{background:#ff8a8a;border-color:#111}
        .opt.dim{opacity:.45}
        .why{overflow:hidden;margin-top:16px;padding:16px 18px;border-radius:var(--radius-sm);border:var(--bw) solid var(--line)}
        .why.why-ok{background:rgba(34,176,125,.1)}.why.why-no{background:rgba(255,77,77,.08)}
        [data-theme=dev] .why.why-ok{background:var(--accent-3)}[data-theme=dev] .why.why-no{background:#ffd0d0}
        .why b{font-size:16px}
        .why p{margin:8px 0 16px;color:var(--muted);line-height:1.6;font-size:14.5px}
        [data-theme=dev] .why p{color:#111}
        .result{text-align:center;padding:30px 0 10px;display:flex;flex-direction:column;align-items:center}
        .big-score{font-size:clamp(90px,12vw,150px);color:var(--accent)}
        .big-score span{font-size:.4em;color:var(--muted)}
        [data-theme=dev] .big-score{color:#111;text-shadow:6px 6px 0 var(--accent-2)}
        .result-line{font-size:20px;font-weight:600;margin:10px 0 0;max-width:460px}
        .result-cta{color:var(--muted);font-size:13px;margin:16px 0 26px}
        .result-cta b{color:var(--fg)}
        @media (max-width:960px){.game-grid{grid-template-columns:1fr;gap:30px}.game-intro{position:static}}
        @media (max-width:560px){.opts{grid-template-columns:1fr}.q-code{font-size:12.5px}.game-card{padding:18px}}
      `}</style>
    </section>
  );
}
