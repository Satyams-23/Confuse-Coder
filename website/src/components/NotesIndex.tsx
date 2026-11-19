"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useTheme } from "./ThemeProvider";

export type NoteRow = {
  href: string;
  account: "dsa" | "dev";
  ep: string;
  title: string;
  excerpt: string;
  season: string;
  keyword: string;
};

const SEASON_NAME: Record<string, string> = { "": "Season 1", graphs: "Graphs", aiml: "AI / ML" };

export function NotesIndex({ notes }: { notes: NoteRow[] }) {
  const { theme } = useTheme();
  const [tab, setTab] = useState<"all" | "dsa" | "dev" | null>(null);
  const [q, setQ] = useState("");
  // Until the visitor picks a tab, show the account whose theme they're on.
  const active = tab ?? (theme === "dev" ? "dev" : "dsa");

  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = notes.filter(
      (n) => (active === "all" || n.account === active) && (!s || (n.title + " " + n.excerpt + " " + n.keyword).toLowerCase().includes(s)),
    );
    const map = new Map<string, NoteRow[]>();
    for (const n of list) {
      const key = `${n.account}|${n.season}`;
      map.set(key, [...(map.get(key) ?? []), n]);
    }
    return [...map.entries()].map(([key, rows]) => {
      const [acc, season] = key.split("|");
      const label =
        (acc === "dev" ? "@confuse__coder.dev" : "@confuse__coder") +
        " · " +
        (acc === "dev" && !season ? "Dev explainers" : SEASON_NAME[season] ?? season);
      return { key, label, rows };
    });
  }, [notes, active, q]);

  const count = (a: "all" | "dsa" | "dev") => notes.filter((n) => a === "all" || n.account === a).length;
  const total = groups.reduce((t, g) => t + g.rows.length, 0);

  return (
    <>
      <div className="d-toolbar">
        <div className="d-tabs" role="group" aria-label="Account">
          {(["dsa", "dev", "all"] as const).map((a) => (
            <button key={a} className="d-tab" aria-pressed={active === a} onClick={() => setTab(a)}>
              {a === "dsa" ? "DSA" : a === "dev" ? "Dev" : "All"}
              <small>{count(a)}</small>
            </button>
          ))}
        </div>
        <label className="d-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notes: bfs, redis, memo…" aria-label="Search notes" />
        </label>
      </div>

      {groups.map((g) => (
        <section key={g.key} className="d-group">
          <h2 className="d-group-h">
            {g.label} <span>{g.rows.length}</span>
          </h2>
          <ul className="d-list">
            {g.rows.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="d-row">
                  <span className="d-ep">{n.ep}</span>
                  <span>
                    <span className="d-row-title">{n.title}</span>
                    {n.excerpt && <span className="d-row-sub">{n.excerpt}</span>}
                  </span>
                  <span className="d-row-tag">Read →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {!total && <p className="d-empty">Is topic pe abhi notes nahi hain. Kisi reel pe comment karke batao.</p>}
    </>
  );
}
