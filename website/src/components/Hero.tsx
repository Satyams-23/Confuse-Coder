"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { CodeTyper } from "./CodeTyper";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

const COPY = {
  cc: {
    handle: "@confuse__coder",
    tag: "DSA · Hinglish · daily",
    sub: "DSA aur coding concepts, Hinglish mein. Reels jo 45 second mein samjha dein, notes jo exam se ek raat pehle bacha lein.",
  },
  dev: {
    handle: "@confuse__coder.dev",
    tag: "Repos · AI tools · how tech works",
    sub: "GitHub repos, AI tools aur \"ye kaam kaise karta hai\" explainers. Fast, punchy, show-don't-tell.",
  },
};

const STICKERS = {
  cc: ["O(log n)", "fib(50)", "memo[n]", "base case", "4000 cr → 99", "stack overflow"],
  dev: ["NX EX 600", "★ NEW REEL", "TTL ⏱", "VPN 🔒", "race condition", "200 OK"],
};

function SplitWord({ word }: { word: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.span key={word} className="word" aria-label={word}>
        {word.split("").map((c, i) => (
          <motion.span
            key={i}
            aria-hidden
            initial={{ y: "0.6em", opacity: 0, filter: "blur(8px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-0.4em", opacity: 0, filter: "blur(6px)", transition: { duration: 0.18, delay: i * 0.015 } }}
            transition={{ duration: 0.5, delay: i * 0.035, ease: [0.2, 0.7, 0.2, 1] }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {c}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}

export function Hero() {
  const { theme } = useTheme();
  const [clear, setClear] = useState(false);
  const touched = useRef(false);
  const c = COPY[theme];

  // Ambient demo: tangle → untangle on a loop until the visitor plays with it.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let on = false;
    const id = setInterval(() => {
      if (touched.current) return;
      on = !on;
      setClear(on);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const play = (v: boolean) => {
    touched.current = true;
    setClear(v);
  };

  return (
    <section id="top" className="hero">
      <div className="grid-bg" />
      <div className="glow" style={{ width: 560, height: 560, left: "55%", top: "8%", background: "#ff6a00", opacity: 0.32 }} />
      <div className="glow" style={{ width: 420, height: 420, left: "-8%", top: "40%", background: "#ff3d00", opacity: 0.25 }} />

      <div className="wrap hero-grid">
        <div className="hero-copy">
          <motion.span className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <i>✦</i>
            {c.handle} · {c.tag}
          </motion.span>

          <h1 className="display hero-title">
            <span className={`line1 ${clear ? "is-clear" : ""}`}>
              <SplitWord word={clear ? "Clear." : "Confused?"} />
            </span>
            <span className="line2">
              Good. Chalo <span className="accent-text">samjhte</span> hain.
            </span>
          </h1>

          <p className="hero-sub">{c.sub}</p>

          <div className="hero-cta">
            <a href="#notes" className="btn btn-primary">
              Notes padho <span className="arrow">→</span>
            </a>
            <a
              href={`https://instagram.com/${c.handle.slice(1)}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-ghost"
            >
              Follow {c.handle}
            </a>
          </div>

          <p className="hero-hint mono">
            <span className="pulse" /> Reel pe comment karo <b>NOTES</b>, link yahin aata hai.
          </p>
        </div>

        <div className="hero-visual">
          <div
            className="scene"
            onPointerEnter={() => play(true)}
            onPointerLeave={() => play(false)}
            onClick={() => play(!clear)}
            role="img"
            aria-label="Scattered logo pieces that snap together into the Confuse Coder logo"
          >
            <HeroScene clear={clear} theme={theme} />
            <span className="scene-hint mono">{clear ? "↺ hover hatao: bikhra do" : "hover karo: logo jodo"}</span>
          </div>
          <div className="typer-slot">
            <CodeTyper theme={theme} />
          </div>
          {STICKERS[theme].map((s, i) => (
            <motion.span
              key={theme + s}
              className={`sticker s${i}`}
              drag
              dragMomentum={false}
              whileDrag={{ scale: 1.1, rotate: 0 }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08 }}
            >
              {s}
            </motion.span>
          ))}
        </div>
      </div>

      <style>{`
        .hero{position:relative;min-height:100svh;padding:130px 0 70px;overflow:hidden;display:flex;align-items:center}
        .hero-grid{position:relative;display:grid;grid-template-columns:1.05fr 1fr;gap:40px;align-items:center}
        .hero-title{font-size:clamp(54px,8.6vw,124px);margin:22px 0 0;display:flex;flex-direction:column}
        .line1{min-height:1em;display:block;transition:color .5s;white-space:nowrap}
        [data-theme=dev] .hero-title{font-size:clamp(44px,6.6vw,100px)}
        [data-theme=dev] .line2{font-size:.5em}
        .line1.is-clear{color:var(--accent)}
        [data-theme=dev] .line1.is-clear{color:#111;-webkit-text-stroke:0;text-shadow:5px 5px 0 var(--accent-2)}
        .line2{font-size:.42em;letter-spacing:-.02em;margin-top:.35em;color:var(--fg)}
        [data-theme=cc] .line2{color:color-mix(in srgb,var(--fg) 82%,transparent)}
        .hero-sub{color:var(--muted);font-size:clamp(16px,1.4vw,18px);line-height:1.6;max-width:480px;margin:26px 0 0}
        .hero-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}
        .hero-hint{margin-top:28px;font-size:12.5px;color:var(--muted);display:flex;align-items:center;gap:10px}
        .hero-hint b{color:var(--fg)}
        .pulse{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 0 var(--accent);animation:pulse 1.8s infinite}
        [data-theme=dev] .pulse{background:var(--accent-3);border:2px solid #111}
        @keyframes pulse{70%{box-shadow:0 0 0 10px transparent}100%{box-shadow:0 0 0 0 transparent}}
        .hero-visual{position:relative;height:620px}
        .scene{position:absolute;inset:0 0 120px 0;cursor:pointer}
        [data-theme=dev] .scene{background:var(--accent-2);border:3px solid #111;border-radius:18px;box-shadow:8px 8px 0 #111;inset:0 30px 150px 0;
          background-image:radial-gradient(#111 1.3px,transparent 1.3px);background-size:18px 18px;background-color:#ff8cc4}
        .scene-hint{position:absolute;top:12px;right:14px;font-size:11px;color:var(--muted);pointer-events:none}
        [data-theme=dev] .scene-hint{color:#111;background:#fff;border:2px solid #111;padding:4px 8px;border-radius:6px;font-weight:700}
        .typer-slot{position:absolute;left:-40px;right:60px;bottom:0;z-index:2}
        [data-theme=dev] .typer-slot{left:-20px;right:0}
        .sticker{position:absolute;z-index:3;cursor:grab;user-select:none;touch-action:none;font:600 12px/1 var(--font-mono);padding:8px 11px;border-radius:999px;
          color:var(--accent-2);background:rgba(255,122,26,.08);border:1px solid rgba(255,122,26,.25);text-shadow:0 0 12px rgba(255,140,40,.6);backdrop-filter:blur(6px)}
        .sticker:active{cursor:grabbing}
        [data-theme=dev] .sticker{color:#111;text-shadow:none;border:2.5px solid #111;box-shadow:3px 3px 0 #111;border-radius:8px;font-weight:800;backdrop-filter:none}
        [data-theme=dev] .s0{background:var(--accent)}[data-theme=dev] .s1{background:#fff}[data-theme=dev] .s2{background:var(--accent-3)}
        [data-theme=dev] .s3{background:#fff}[data-theme=dev] .s4{background:var(--accent)}[data-theme=dev] .s5{background:var(--accent-3)}
        .s0{top:4%;left:2%;rotate:-6deg}.s1{top:12%;right:0;rotate:5deg}.s2{top:44%;left:-6%;rotate:4deg}
        .s3{top:36%;right:-2%;rotate:-4deg}.s4{top:58%;right:14%;rotate:3deg}.s5{top:-2%;left:30%;rotate:-3deg}
        @media (max-width:960px){
          .hero{padding-top:110px}
          .hero-grid{grid-template-columns:1fr;gap:20px}
          .hero-visual{height:540px}
          .typer-slot{left:0;right:0}
          [data-theme=dev] .typer-slot{left:0;right:0}
          [data-theme=dev] .scene{inset:0 8px 150px 0}
          .s2,.s3{display:none}
        }
        @media (max-width:520px){.hero-visual{height:480px}.scene{inset:0 0 150px 0}.s4,.s5{display:none}}
      `}</style>
    </section>
  );
}
