import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { NotesIndex, type NoteRow } from "@/components/NotesIndex";
import { ACCOUNT_SEG, getNotes, noteHref } from "@/lib/content";
import "../docs.css";

export const metadata: Metadata = {
  title: "Notes · Confuse Coder",
  description: "Har reel ke notes: concept, code, dry run aur common galtiyan. DSA aur dev, Hinglish mein.",
};

/** The EP column already shows the episode, so drop it from the title:
    "Graphs EP 05 · Topological Sort", "DEV 15 · ClipShlip…", "…kit (DEV 13)", "…hai? Notes" */
function cleanTitle(t: string): string {
  return t
    .replace(/^(?:[A-Za-z/]+\s+)?(?:EP|DEV)\s*\d+\s*[·:—–-]\s*/i, "")
    .replace(/\s*\(DEV\s*\d+\)\s*$/i, "")
    .replace(/\s+Notes$/i, "");
}

export default function NotesPage() {
  const rows: NoteRow[] = getNotes().map((n) => ({
    href: noteHref(n),
    account: ACCOUNT_SEG[n.account],
    ep: `EP ${String(n.ep).padStart(2, "0")}`,
    title: cleanTitle(n.title),
    excerpt: n.excerpt,
    season: n.series,
    keyword: n.keyword,
  }));

  return (
    <>
      <Nav />
      <main className="d-page">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Notes</span>
        </nav>
        <h1 className="d-h1">Notes</h1>
        <p className="d-lead">Har reel ka cheat sheet: concept, code, dry run aur common galtiyan. Padho, print karo, ya GitHub pe dekho.</p>
        <NotesIndex notes={rows} />
      </main>
      <Footer />
    </>
  );
}
