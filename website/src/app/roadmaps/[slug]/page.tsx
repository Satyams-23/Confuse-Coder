import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { DownloadIcon, GithubIcon, PlayIcon } from "@/components/Icons";
import { PrintButton } from "@/components/PrintButton";
import { RoadmapView } from "@/components/RoadmapView";
import { noteGithub } from "@/lib/content";
import { videoLinks } from "@/lib/links";
import { getRoadmap, getRoadmapFiles, roadmapSlug } from "@/lib/roadmap";
import "../../docs.css";
import "../roadmap.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRoadmapFiles().map((f) => ({ slug: roadmapSlug(f) }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const r = getRoadmap(slug);
  if (!r) return {};
  return {
    title: `${r.title} · Confuse Coder`,
    description: `${r.role} banne ka self-paced roadmap: ${r.steps.length} steps, kya seekhna, kahan se free, practice, projects aur interview prep.`,
  };
}

export default async function RoadmapPage({ params }: Params) {
  const { slug } = await params;
  const r = getRoadmap(slug);
  if (!r) notFound();
  const noteSlug = `roadmaps-${r.file.replace(/\.md$/, "")}`;
  const links = videoLinks("confuse_coder.dev", noteSlug);
  const github = noteGithub({ account: "confuse_coder.dev", file: `roadmaps/${r.file}` });

  return (
    <>
      <Nav />
      <main className="d-page rm-page">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <Link href="/roadmaps">Roadmaps</Link> / <span>{r.role}</span>
        </nav>

        <RoadmapView r={r} />

        <section className="d-box rm-reel">
          <h2>Ye roadmap ek reel se hai</h2>
          <p>Short version reel mein hai. Poora roadmap yahi page hai, bookmark kar lo.</p>
          <div className="d-actions">
            <a className="d-btn primary" href={links.instagram} target="_blank" rel="noreferrer">
              <PlayIcon /> {links.direct.instagram ? "Watch on Instagram" : "@confuse__coder.dev"}
            </a>
            <a className="d-btn" href={`/md/dev/${noteSlug}`} download>
              <DownloadIcon /> Download .md
            </a>
            {github && (
              <a className="d-btn" href={github} target="_blank" rel="noreferrer">
                <GithubIcon /> GitHub
              </a>
            )}
            <PrintButton />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
