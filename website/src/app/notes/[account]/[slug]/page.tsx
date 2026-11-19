import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { DownloadIcon, GithubIcon, PlayIcon } from "@/components/Icons";
import { PrintButton } from "@/components/PrintButton";
import { ACCOUNT_SEG, epLabel, getNote, getNotes, noteGithub, noteHref } from "@/lib/content";
import { videoLinks } from "@/lib/links";
import "../../../docs.css";

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
  const github = noteGithub(note);

  const same = getNotes()
    .filter((n) => n.account === note.account && n.series === note.series)
    .sort((a, b) => a.ep - b.ep);
  const i = same.findIndex((n) => n.slug === note.slug);
  const prev = same[i - 1];
  const next = same[i + 1];

  return (
    <>
      <Nav />
      <main className="d-page d-narrow">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/notes">Notes</Link> /{" "}
          <span>
            {isDev ? "Dev" : "DSA"} · {epLabel(note)}
          </span>
        </nav>

        <div className="d-actions" style={{ marginTop: 0, marginBottom: 28 }}>
          {github && (
            <a className="d-btn" href={github} target="_blank" rel="noreferrer">
              <GithubIcon /> View on GitHub
            </a>
          )}
          <a className="d-btn" href={`/md/${account}/${note.slug}`} download>
            <DownloadIcon /> Download .md
          </a>
          <PrintButton />
        </div>

        <article className="d-md" dangerouslySetInnerHTML={{ __html: html }} />

        <section className="d-box">
          <h2>Ye notes ek reel se hain</h2>
          <p>
            {links.direct.youtube || links.direct.instagram
              ? "Pehle video dekho, phir yahan se revise karo."
              : `Poori series ${handle} aur YouTube pe hai.`}
          </p>
          <div className="d-actions">
            <a className="d-btn primary" href={links.instagram} target="_blank" rel="noreferrer">
              <PlayIcon /> {links.direct.instagram ? "Watch on Instagram" : handle}
            </a>
            <a className="d-btn" href={links.youtube} target="_blank" rel="noreferrer">
              <PlayIcon /> {links.direct.youtube ? "Watch on YouTube" : "YouTube channel"}
            </a>
          </div>
        </section>

        <nav className="d-pager" aria-label="Other notes">
          {prev ? (
            <Link href={noteHref(prev)}>
              <small>← {epLabel(prev)}</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={noteHref(next)} className="right">
              <small>{epLabel(next)} →</small>
              {next.title}
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </main>
      <Footer />
    </>
  );
}
