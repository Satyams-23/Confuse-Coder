import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Sections";
import { CAREER_PAGES, DRIVES, EXPERIENCED, FRESHER, SEARCHES, UPDATED, type Job } from "@/lib/jobs";
import "../../docs.css";

export const metadata: Metadata = {
  title: "IT Jobs List · Confuse Coder",
  description: "Fresher aur experienced IT jobs ek jagah: drives ki last date, live openings, official apply links. Har entry pe posted date aur last checked date.",
};

const Ext = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
    <path d="M14 4h6v6M20 4l-9 9M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
);

function JobRow({ j, drive }: { j: Job; drive?: boolean }) {
  const sub = [j.where, j.exp, j.pay].filter(Boolean).join(" · ");
  return (
    <li>
      <a className="d-row d-job" href={j.url} target="_blank" rel="noopener noreferrer">
        <span>
          <span className="d-row-title">
            {j.company} · {j.role}
          </span>
          <span className="d-row-sub">{sub}</span>
          {j.note && <span className="d-row-sub">{j.note}</span>}
          <span className="d-job-via">
            {j.via} <Ext />
          </span>
        </span>
        <span className="d-job-when">
          {drive ? (
            j.lastDate ? (
              <span className="d-due">Last date {j.lastDate}</span>
            ) : (
              <span className="d-roll">Rolling / check page</span>
            )
          ) : (
            <span className="d-row-tag">Posted {j.posted}</span>
          )}
          {j.status && <span className={`d-status ${j.status}`}>{j.status === "confirmed" ? "Confirmed" : "Reported"}</span>}
        </span>
      </a>
    </li>
  );
}

function LinkRow({ name, url, via }: { name: string; url: string; via: string }) {
  return (
    <li>
      <a className="d-row d-job" href={url} target="_blank" rel="noopener noreferrer">
        <span>
          <span className="d-row-title">{name}</span>
          <span className="d-job-via">
            {via} <Ext />
          </span>
        </span>
        <span />
      </a>
    </li>
  );
}

export default function JobsPage() {
  return (
    <>
      <Nav />
      <main className="d-page d-narrow">
        <nav className="d-crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>Jobs</span>
        </nav>
        <h1 className="d-h1">IT Jobs List</h1>
        <p className="d-lead">
          Fresher aur experienced, dono ke liye. Drives ki last date, live openings aur official apply links ek jagah. Naye openings aate hi ye
          page update hota hai.
        </p>
        <div className="d-meta" style={{ marginTop: 14 }}>
          <span>Last updated: {UPDATED}</span>
          <span>Reel: No jobs in IT? Naukri pe 18,000+</span>
        </div>

        <div className="d-box d-safe">
          <h2>Apply karne se pehle</h2>
          <p>
            1. Apply sirf company ki official careers site pe karo. Naukri listing khule toh &ldquo;Apply on company site&rdquo; button use karo.
            <br />
            2. Koi bhi &ldquo;registration fee&rdquo; ya &ldquo;job guarantee&rdquo; ke paise maange toh wo scam hai. Asli company paise nahi leti.
          </p>
        </div>

        <section className="d-group">
          <h2 className="d-group-h">
            1. Drives aur exams <span>freshers · last date wale</span>
          </h2>
          <ul className="d-list">
            {DRIVES.map((j) => (
              <JobRow key={j.company + j.role} j={j} drive />
            ))}
          </ul>
        </section>

        <section className="d-group">
          <h2 className="d-group-h">
            2. Fresher openings <span>0–2 yrs welcome · rolling</span>
          </h2>
          <ul className="d-list">
            {FRESHER.map((j) => (
              <JobRow key={j.url} j={j} />
            ))}
          </ul>
        </section>

        <section className="d-group">
          <h2 className="d-group-h">
            3. Experienced openings <span>2+ yrs · rolling</span>
          </h2>
          <ul className="d-list">
            {EXPERIENCED.map((j) => (
              <JobRow key={j.url} j={j} />
            ))}
          </ul>
        </section>

        <section className="d-group">
          <h2 className="d-group-h">
            4. Official career pages <span>hamesha fresh</span>
          </h2>
          <ul className="d-list">
            {CAREER_PAGES.map((c) => (
              <LinkRow key={c.url} {...c} />
            ))}
          </ul>
        </section>

        <section className="d-group">
          <h2 className="d-group-h">
            5. Ready searches <span>filters already set · roz naye jobs</span>
          </h2>
          <ul className="d-list">
            {SEARCHES.map((c) => (
              <LinkRow key={c.url} {...c} />
            ))}
          </ul>
        </section>

        <p className="d-job-foot">
          Rolling = koi fixed last date nahi, role bharte hi band ho jaata hai, isliye jaldi apply karo. &ldquo;Reported&rdquo; = news mein aaya
          hai, official page pe confirm karo. Saare links {UPDATED} ko check kiye gaye. Hum kisi company se jude nahi hain.
        </p>
      </main>
      <Footer />
    </>
  );
}
