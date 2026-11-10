"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme, type Theme } from "./ThemeProvider";

const LINKS = [
  { href: "#notes", label: "Notes" },
  { href: "#playground", label: "Playground" },
  { href: "#game", label: "Game" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export function AccountSwitch({ compact = false }: { compact?: boolean }) {
  const { theme, switchTo } = useTheme();
  const opts: { id: Theme; label: string }[] = [
    { id: "cc", label: compact ? "DSA" : "confuse__coder" },
    { id: "dev", label: compact ? ".dev" : ".dev" },
  ];
  return (
    <div className="switch" role="radiogroup" aria-label="Choose account">
      {opts.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={theme === o.id}
          className={theme === o.id ? "on" : ""}
          onClick={(e) => switchTo(o.id, { x: e.clientX, y: e.clientY })}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Nav() {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(scrollY > 40);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#top" className="nav-logo" aria-label="Confuse Coder home">
        <Image src={theme === "dev" ? "/brand/dev-logo.svg" : "/brand/cc.jpg"} alt="" width={30} height={30} />
        <span>
          Confuse Coder<b className="only-dev">.dev</b>
        </span>
      </a>
      <nav className="nav-links">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href}>
            {l.label}
          </a>
        ))}
      </nav>
      <AccountSwitch />
      <style>{`
        .nav{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:50;display:flex;align-items:center;gap:6px;
          padding:6px;border-radius:999px;border:var(--bw) solid var(--line);background:color-mix(in srgb,var(--bg) 70%,transparent);
          backdrop-filter:blur(14px);transition:box-shadow .3s,background .3s;max-width:calc(100% - 24px)}
        .nav.scrolled{background:color-mix(in srgb,var(--bg) 88%,transparent)}
        [data-theme=dev] .nav{border-radius:14px;box-shadow:4px 4px 0 #111;background:#fff}
        .nav-logo{display:flex;align-items:center;gap:8px;padding:0 18px 0 4px;margin-right:4px;border-right:1px solid var(--line);color:var(--fg);text-decoration:none;font-weight:700;font-size:14px;white-space:nowrap}
        .nav-logo img{border-radius:50%;object-fit:cover}
        [data-theme=dev] .nav-logo img{border-radius:6px;border:2px solid #111}
        .nav-logo b{color:var(--accent-2)}
        .nav-links{display:flex;gap:2px}
        .nav-links a{padding:8px 14px;border-radius:999px;color:var(--muted);text-decoration:none;font-size:14px;transition:color .2s,background .2s}
        .nav-links a:hover{color:var(--fg);background:var(--card)}
        [data-theme=dev] .nav-links a{color:#111;font-weight:600;border-radius:8px}
        [data-theme=dev] .nav-links a:hover{background:var(--accent)}
        .switch{display:flex;padding:3px;border-radius:999px;background:var(--card);border:var(--bw) solid var(--line);margin-left:6px}
        [data-theme=dev] .switch{border-radius:10px;border-width:2px;background:var(--bg)}
        .switch button{all:unset;cursor:pointer;padding:7px 12px;border-radius:999px;font:600 12px/1 var(--font-mono);color:var(--muted);transition:background .25s,color .25s;white-space:nowrap}
        .switch button.on{background:var(--accent);color:var(--on-accent)}
        [data-theme=dev] .switch button{border-radius:7px;color:#111}
        [data-theme=dev] .switch button.on{background:#111;color:var(--accent)}
        .switch button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        @media (max-width:820px){.nav-links{display:none}.nav{width:calc(100% - 24px);justify-content:space-between}}
      `}</style>
    </header>
  );
}
