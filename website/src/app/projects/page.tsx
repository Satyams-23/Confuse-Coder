import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { getProjects } from "@/lib/content";
import "../docs.css";

export const metadata: Metadata = {
  title: "Projects · Confuse Coder",
  description: "Reel ke concept se ek chhota real project banao. Boilerplate ready, tum sirf core logic likho, tests batate hain PASSED ya FAILED.",
};

export default function ProjectsPage() {
  const projects = getProjects().sort((a, b) => b.ep - a.ep);
  return (
    <>
      <Nav />
      <main className="d-page">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Projects</span>
        </nav>
        <h1 className="d-h1">Projects</h1>
        <p className="d-lead">
          Har project ek reel ke concept pe bana hai. Boilerplate ready hai, tum sirf core function likhte ho. Tests turant batate hain: PASSED ya
          FAILED.
        </p>
        <div className="d-cards">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="d-card">
              <span className="d-card-top">
                <span>#{String(p.ep).padStart(2, "0")}</span>
                <span>{p.languages.join(" · ")}</span>
              </span>
              <h2>{p.title}</h2>
              <p>{p.pitch}</p>
              {p.concept && (
                <span className="d-meta" style={{ marginTop: 4 }}>
                  <span>{p.concept}</span>
                </span>
              )}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
