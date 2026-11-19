import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { GithubIcon } from "@/components/Icons";
import { getProject, getProjects, projectGithub, projectReelLine } from "@/lib/content";
import "../../docs.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${p.title} · Confuse Coder projects`, description: p.pitch };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  // README is our own markdown. Drop its H1 + reel line: the page header shows them.
  const body = p.markdown.replace(/^#\s.*\r?\n(\s*\*.+\*\s*\r?\n)?/, "");
  const html = marked.parse(body, { async: false, gfm: true }) as string;
  const github = projectGithub(p.slug);
  const reel = projectReelLine(p.markdown);

  const all = getProjects().sort((a, b) => a.ep - b.ep);
  const i = all.findIndex((x) => x.slug === p.slug);
  const prev = all[i - 1];
  const next = all[i + 1];

  return (
    <>
      <Nav />
      <main className="d-page">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/projects">Projects</Link> / <span>#{String(p.ep).padStart(2, "0")}</span>
        </nav>
        <h1 className="d-h1">{p.title}</h1>
        {reel && <p className="d-lead">{reel}</p>}
        <div className="d-meta">
          {p.concept && <span>{p.concept}</span>}
          {p.languages.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>

        <div className="d-split">
          <article className="d-md" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="d-side">
            <div>
              <h3>Get the code</h3>
              {github ? (
                <div className="d-actions" style={{ marginTop: 0, flexDirection: "column" }}>
                  <a className="d-btn primary" href={github} target="_blank" rel="noreferrer">
                    <GithubIcon /> Open on GitHub
                  </a>
                </div>
              ) : (
                <p style={{ margin: 0, color: "var(--muted)" }}>Code jaldi GitHub pe aayega.</p>
              )}
            </div>
            <div className="d-files-wrap">
              <h3>Files</h3>
              <ul className="d-files">
                {p.files
                  .filter((f) => f.role !== "doc")
                  .map((f) => (
                    <li key={f.path}>
                      {f.path}
                      {f.role === "starter" && <b className="starter">tum likho</b>}
                      {f.role === "solution" && <b>answer</b>}
                    </li>
                  ))}
              </ul>
            </div>
          </aside>
        </div>

        <nav className="d-pager" aria-label="Other projects" style={{ marginTop: 48 }}>
          {prev ? (
            <Link href={`/projects/${prev.slug}`}>
              <small>← #{String(prev.ep).padStart(2, "0")}</small>
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/projects/${next.slug}`} className="right">
              <small>#{String(next.ep).padStart(2, "0")} →</small>
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
