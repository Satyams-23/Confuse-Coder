import fs from "node:fs";
import path from "node:path";

// Content lives next to the website in the reel/ folder, so a new reel's notes
// show up on the site without copying anything.
const REEL_ROOT = path.resolve(process.cwd(), "..");

export type Account = "confuse_coder" | "confuse_coder.dev";

export type Note = {
  account: Account;
  slug: string;
  ep: number;
  title: string;
  excerpt: string;
  keyword: string;
  /** "" = main season (root folder), else the sub-folder: "graphs", "aiml" */
  series: string;
  /** sort key: later seasons first, then episode */
  order: number;
  /** path relative to notes/<account>/ */
  file: string;
};

/** Reels whose DM keyword isn't "NOTES" (notes files no longer carry the "Comment X" line). */
const KEYWORD_OVERRIDE: Record<string, string> = { "confuse_coder.dev/02_vpn.md": "VPN", "confuse_coder.dev/01_data_engineer.md": "ROADMAP" };

/** Season order per sub-folder (root = first season). Newer seasons sort above older ones. */
const SERIES_RANK: Record<string, number> = { "": 0, graphs: 1, aiml: 1, roadmaps: 1 };

export { epLabel } from "./epLabel";

export type Project = {
  slug: string;
  ep: number;
  title: string;
  concept: string;
  pitch: string;
  languages: string[];
};

function readDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

function stripMd(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/`(.+?)`/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .trim();
}

/** First real paragraph under the first "##" heading. */
function firstParagraph(lines: string[]): string {
  const start = lines.findIndex((l) => l.startsWith("## "));
  const out: string[] = [];
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith("```") || l.startsWith("#") || l.startsWith("|") || l === "---") {
      if (out.length) break;
      continue;
    }
    if (!l.trim()) {
      if (out.length) break;
      continue;
    }
    out.push(l.replace(/^[-*]\s+/, ""));
  }
  const text = stripMd(out.join(" "));
  return text.length > 150 ? text.slice(0, 147).replace(/\s+\S*$/, "") + "…" : text;
}

export function getNotes(): Note[] {
  const accounts: Account[] = ["confuse_coder", "confuse_coder.dev"];
  const notes: Note[] = [];
  for (const account of accounts) {
    const root = path.join(REEL_ROOT, "notes", account);
    // root .md files + one level of season sub-folders (graphs/, aiml/); only NN_*.md files
    const series = ["", ...readDir(root).filter((d) => !d.includes(".") && fs.statSync(path.join(root, d)).isDirectory())];
    for (const sub of series) {
      for (const f of readDir(path.join(root, sub)).filter((f) => /^\d+_.*\.md$/.test(f))) {
        const file = sub ? `${sub}/${f}` : f;
        const raw = fs.readFileSync(path.join(root, file), "utf8");
        const lines = raw.split(/\r?\n/);
        const h1 = lines.find((l) => l.startsWith("# ")) ?? f;
        const title = stripMd(h1.replace(/^#\s+/, "").replace(/\s*[:—–-]\s*Notes$/i, ""));
        const kw = raw.match(/[Cc]omment (?:keyword: )?\**"?([A-Z]{3,})"?/);
        const ep = parseInt(f, 10) || 0;
        notes.push({
          account,
          slug: (sub ? `${sub}-` : "") + f.replace(/\.md$/, ""),
          ep,
          title,
          excerpt: firstParagraph(lines),
          keyword: KEYWORD_OVERRIDE[`${account}/${f}`] ?? kw?.[1] ?? "NOTES",
          series: sub,
          order: (SERIES_RANK[sub] ?? 1) * 1000 + ep,
          file,
        });
      }
    }
  }
  return notes.sort((a, b) => b.order - a.order);
}

// Public repo keeps viewer projects in Project/, the local reel folder in viewer-projects/.
const PROJECT_DIRS = ["Project", "viewer-projects"].map((d) => path.join(REEL_ROOT, d));

export function getProjects(): Project[] {
  const dir = PROJECT_DIRS.find((d) => readDir(d).some((f) => /^\d+_/.test(f))) ?? PROJECT_DIRS[0];
  return readDir(dir)
    .filter((f) => /^\d+_/.test(f) && !f.includes(".") && fs.existsSync(path.join(dir, f, "README.md")))
    .map((slug) => {
      const raw = fs.readFileSync(path.join(dir, slug, "README.md"), "utf8");
      const lines = raw.split(/\r?\n/);
      const h1 = (lines.find((l) => l.startsWith("# ")) ?? slug).replace(/^#\s+/, "");
      const m = h1.match(/^(.+?)\s*\((.+)\)\s*$/);
      const pitchLine = lines.find((l, i) => i > 2 && l.trim() && !l.startsWith("*") && !l.startsWith("#"));
      return {
        slug,
        ep: parseInt(slug, 10),
        title: (m ? m[1] : h1).replace(/^\d+\s*[·:.\-–—]\s*/, ""),
        concept: m ? m[2] : "",
        pitch: stripMd(pitchLine ?? ""),
        languages: readDir(path.join(dir, slug)).filter((d) => d === "python" || d === "cpp").map((d) => (d === "cpp" ? "C++" : "Python")),
      };
    });
}

// Only reads public folders (notes/, Project/) so the site builds from the public repo.
export function getStats() {
  return {
    notes: getNotes().length,
    projects: getProjects().length,
  };
}

// URL segment for each account: /notes/dsa/12_merge_sort, /notes/dev/02_vpn
export const ACCOUNT_SEG: Record<Account, "dsa" | "dev"> = { confuse_coder: "dsa", "confuse_coder.dev": "dev" };
export const SEG_ACCOUNT: Record<string, Account> = { dsa: "confuse_coder", dev: "confuse_coder.dev" };

export function noteHref(n: Pick<Note, "account" | "slug">): string {
  // career roadmaps have their own page: roadmaps-01_data_engineer -> /roadmaps/data-engineer
  const road = n.slug.match(/^roadmaps-\d+_(.+)$/);
  if (road) return `/roadmaps/${road[1].replace(/_/g, "-")}`;
  return `/notes/${ACCOUNT_SEG[n.account]}/${n.slug}`;
}

/** Full markdown of one notes file, or null if it doesn't exist. */
export function getNote(seg: string, slug: string): (Note & { markdown: string }) | null {
  const account = SEG_ACCOUNT[seg];
  if (!account || !/^[\w.-]+$/.test(slug)) return null;
  const note = getNotes().find((n) => n.account === account && n.slug === slug);
  if (!note) return null;
  const markdown = fs.readFileSync(path.join(REEL_ROOT, "notes", account, note.file), "utf8");
  return { ...note, markdown };
}

/* ───────── GitHub links (public repo only) ───────── */

export const GITHUB_REPO = "https://github.com/Satyams-23/Confuse-Coder";

// On Vercel the site builds from the public repo itself (notes/ and Project/ sit next to website/).
// Locally it runs from private/, whose public mirror is ../public. A link is shown only when the
// file really exists there, so nothing private (or not yet synced) gets a broken link.
const PUBLIC_ROOT = fs.existsSync(path.join(REEL_ROOT, "Project")) ? REEL_ROOT : path.resolve(REEL_ROOT, "..", "public");

function githubIfPublic(rel: string, kind: "blob" | "tree"): string | null {
  return fs.existsSync(path.join(PUBLIC_ROOT, rel)) ? `${GITHUB_REPO}/${kind}/main/${rel.split(path.sep).join("/")}` : null;
}

export function noteGithub(n: Pick<Note, "account" | "file">): string | null {
  return githubIfPublic(`notes/${n.account}/${n.file}`, "blob");
}

export function projectGithub(slug: string): string | null {
  return githubIfPublic(`Project/${slug}`, "tree");
}

/* ───────── Project detail ───────── */

export type ProjectFile = { path: string; role: "starter" | "solution" | "ready" | "doc" };

export function getProject(slug: string): (Project & { markdown: string; files: ProjectFile[] }) | null {
  if (!/^\d+_[\w-]+$/.test(slug)) return null;
  const project = getProjects().find((p) => p.slug === slug);
  if (!project) return null;
  const dir = PROJECT_DIRS.find((d) => fs.existsSync(path.join(d, slug, "README.md")))!;
  const root = path.join(dir, slug);
  const files: ProjectFile[] = [];
  const walk = (rel: string) => {
    for (const f of readDir(path.join(root, rel)).sort()) {
      const r = rel ? `${rel}/${f}` : f;
      if (f.startsWith(".") || f === "node_modules" || f === "__pycache__") continue;
      if (fs.statSync(path.join(root, r)).isDirectory()) walk(r);
      else
        files.push({
          path: r,
          role: /starter/i.test(f) ? "starter" : /solution/i.test(f) ? "solution" : /\.md$/i.test(f) ? "doc" : "ready",
        });
    }
  };
  walk("");
  return { ...project, markdown: fs.readFileSync(path.join(root, "README.md"), "utf8"), files };
}

/** "@confuse__coder · Graphs EP 03 (DFS / Number of Islands) ka project" → the reel line under the H1. */
export function projectReelLine(markdown: string): string {
  const l = markdown.split(/\r?\n/).find((x) => /^\*.+\*$/.test(x.trim()));
  return l ? stripMd(l.trim().replace(/^\*|\*$/g, "")) : "";
}
