import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { getNotes, noteHref } from "@/lib/content";
import "../docs.css";

export const metadata: Metadata = {
  title: "Career Roadmaps · Confuse Coder",
  description:
    "Tech career roadmaps, ek role ek page: kya seekhna, kis order mein, kahan se free, practice, projects, interview prep aur job-ready checklist.",
};

/** Roles planned for the series. A role goes live when its notes file exists in notes/confuse_coder.dev/roadmaps/. */
const ROLES = [
  { key: "data_engineer", name: "Data Engineer" },
  { key: "data_analyst", name: "Data Analyst" },
  { key: "data_scientist", name: "Data Scientist" },
  { key: "backend_developer", name: "Backend Developer" },
  { key: "devops_engineer", name: "DevOps Engineer" },
  { key: "full_stack_developer", name: "Full Stack Developer" },
  { key: "aiml_engineer", name: "AI/ML Engineer" },
  { key: "cloud_engineer", name: "Cloud Engineer" },
];

export default function RoadmapsPage() {
  const live = getNotes().filter((n) => n.account === "confuse_coder.dev" && n.series === "roadmaps");
  const find = (key: string) => live.find((n) => n.slug.endsWith(`_${key}`));

  return (
    <>
      <Nav />
      <main className="d-page d-narrow">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Roadmaps</span>
        </nav>
        <h1 className="d-h1">Career Roadmaps</h1>
        <p className="d-lead">
          Ek role, ek page: kya seekhna hai, kis order mein, kahan se (free pehle), kaise practice karna hai, kaunse projects banane hain aur
          interview ke liye kya taiyaar karna hai.
        </p>

        <section className="d-group">
          <h2 className="d-group-h">
            Roles <span>ek-ek karke aa rahe hain</span>
          </h2>
          <ul className="d-list">
            {ROLES.map((r) => {
              const n = find(r.key);
              return (
                <li key={r.key}>
                  {n ? (
                    <Link className="d-row d-road" href={noteHref(n)}>
                      <span>
                        <span className="d-row-title">{r.name}</span>
                        <span className="d-row-sub">{n.excerpt}</span>
                      </span>
                      <span className="d-row-tag d-road-live">Live</span>
                    </Link>
                  ) : (
                    <div className="d-row d-road d-road-soon">
                      <span>
                        <span className="d-row-title">{r.name}</span>
                      </span>
                      <span className="d-row-tag">Coming soon</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
