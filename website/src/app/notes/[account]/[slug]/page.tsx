import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { ACCOUNT_SEG, getNote, getNotes, noteHref } from "@/lib/content";
import { videoLinks } from "@/lib/links";

export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((n) => ({ account: ACCOUNT_SEG[n.account], slug: n.slug }));
}

type Params = { params: Promise<{ account: string; slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { account, slug } = await params;
  const note = getNote(account, slug);
  if (!note) return {};
  return { title: `${note.title} · Confuse Coder notes`, description: note.excerpt };
}

export default async function NotePage({ params }: Params) {
  const { account, slug } = await params;
  const note = getNote(account, slug);
  if (!note) notFound();

  // Notes files are our own markdown, so rendering their HTML is safe.
  const html = marked.parse(note.markdown, { async: false, gfm: true }) as string;
  const links = videoLinks(note.account, note.slug);
  const isDev = note.account === "confuse_coder.dev";
  const handle = isDev ? "@confuse__coder.dev" : "@confuse__coder";

  const same = getNotes()
    .filter((n) => n.account === note.account)
    .sort((a, b) => a.ep - b.ep);
  const i = same.findIndex((n) => n.slug === note.slug);
  const prev = same[i - 1];
  const next = same[i + 1];

  return (
    <>
      <Nav />
      <main className="wrap note-page">
        <div className="np-top mono">
          <Link href="/#notes">← saare notes</Link>
          <span className="pill">
            {isDev ? ".dev" : "DSA"} · EP {String(note.ep).padStart(2, "0")}
          </span>
        </div>

        <article className="md" dangerouslySetInnerHTML={{ __html: html }} />

        <section className="np-video">
          <span className="eyebrow">
            <i>▶</i>reel
          </span>
          <h2 className="display np-video-title">
            Ye notes ek <span className="accent-text">reel</span> se hain.
          </h2>
          <p className="np-video-sub">
            {links.direct.youtube || links.direct.instagram
              ? "Video dekho, phir notes se revise karo."
              : `Poori series ${handle} pe aur YouTube pe hai.`}
          </p>
          <div className="np-btns">
            <a className="btn btn-primary" href={links.youtube} target="_blank" rel="noreferrer">
              {links.direct.youtube ? "YouTube pe dekho" : "YouTube channel"} <span className="arrow">↗</span>
            </a>
            <a className="btn btn-primary alt" href={links.instagram} target="_blank" rel="noreferrer">
              {links.direct.instagram ? "Instagram pe dekho" : handle} <span className="arrow">↗</span>
            </a>
          </div>
        </section>

        <nav className="np-pager mono" aria-label="Other notes">
          {prev ? (
            <Link href={noteHref(prev)} className="card hoverable">
              <small>← EP {String(prev.ep).padStart(2, "0")}</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={noteHref(next)} className="card hoverable right">
              <small>EP {String(next.ep).padStart(2, "0")} →</small>
              {next.title}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
      <Footer />
      <style>{`
        .note-page{padding:130px 0 90px;max-width:820px}
        .np-top{display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:34px}
        .np-top a{color:var(--muted);text-decoration:none}.np-top a:hover{color:var(--accent)}
        [data-theme=dev] .np-top a{color:#111;font-weight:700}
        .np-top .pill{padding:5px 11px;border-radius:999px;border:1px solid var(--line)}
        [data-theme=dev] .np-top .pill{background:#111;color:#fff;border-radius:6px}

        .md{font-size:16.5px;line-height:1.75;color:var(--fg);overflow-wrap:anywhere}
        .md h1{font-family:var(--font-display);font-weight:var(--display-weight);letter-spacing:var(--display-track);font-size:clamp(32px,5vw,52px);line-height:1.05;margin:0 0 14px}
        .md h1+p em{color:var(--muted);font-style:normal;font-family:var(--font-mono);font-size:13px}
        .md h2{font-size:24px;margin:46px 0 12px;letter-spacing:-.01em}
        .md h3{font-size:19px;margin:30px 0 8px}
        .md p,.md ul,.md ol{margin:0 0 14px}
        .md li{margin:4px 0}
        .md strong{color:var(--accent-2)}
        [data-theme=dev] .md strong{color:#111;background:var(--accent);padding:0 3px}
        .md a{color:var(--accent)}
        .md hr{border:0;border-top:1px dashed var(--line);margin:34px 0}
        [data-theme=dev] .md hr{border-top:2px dashed #111}
        .md code{font-family:var(--font-mono);font-size:.88em;padding:2px 6px;border-radius:6px;background:var(--card);border:1px solid var(--line)}
        .md pre{margin:0 0 18px;padding:18px 20px;border-radius:16px;background:var(--card-solid);border:var(--bw) solid var(--line);overflow-x:auto;line-height:1.55}
        [data-theme=dev] .md pre{background:#111;color:#f5f0e0;border-radius:10px;box-shadow:6px 6px 0 var(--accent-2)}
        .md pre code{padding:0;border:0;background:none;font-size:13.5px;color:inherit}
        .md table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:14.5px;display:block;overflow-x:auto}
        .md th,.md td{text-align:left;padding:9px 12px;border:1px solid var(--line);vertical-align:top}
        .md th{background:var(--card);font-weight:700}
        [data-theme=dev] .md th{background:var(--accent)}
        [data-theme=dev] .md th,[data-theme=dev] .md td{border:2px solid #111}
        .md blockquote{margin:0 0 16px;padding:10px 18px;border-left:3px solid var(--accent);background:var(--card);border-radius:0 12px 12px 0}

        .np-video{margin-top:70px;padding:40px 30px;border-radius:26px;border:var(--bw) solid var(--line);background:var(--bg-2);text-align:center;display:flex;flex-direction:column;align-items:center}
        [data-theme=dev] .np-video{background:var(--accent);border-radius:16px;box-shadow:8px 8px 0 #111}
        .np-video-title{font-size:clamp(28px,4.4vw,46px);margin:16px 0 6px}
        [data-theme=dev] .np-video .accent-text{background:#fff}
        .np-video-sub{color:var(--muted);margin:0}
        [data-theme=dev] .np-video-sub{color:#111}
        .np-btns{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-top:24px}
        [data-theme=dev] .np-video .btn-primary{background:#fff}
        [data-theme=dev] .np-video .btn-primary.alt{background:var(--accent-2)}

        .np-pager{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:30px}
        .np-pager a{display:flex;flex-direction:column;gap:6px;padding:18px;color:var(--fg);text-decoration:none;font-size:14px;line-height:1.35}
        .np-pager a.right{text-align:right}
        .np-pager small{color:var(--muted);font-size:11.5px}
        @media (max-width:600px){.note-page{padding-top:110px}.np-pager{grid-template-columns:1fr}.np-pager a.right{text-align:left}.md{font-size:15.5px}}
      `}</style>
    </>
  );
}
