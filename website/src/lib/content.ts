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
};

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
    const dir = path.join(REEL_ROOT, "notes", account);
    for (const file of readDir(dir).filter((f) => f.endsWith(".md"))) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const lines = raw.split(/\r?\n/);
      const h1 = lines.find((l) => l.startsWith("# ")) ?? file;
      const title = stripMd(h1.replace(/^#\s+/, "").replace(/\s*[:—–-]\s*Notes$/i, ""));
      const kw = raw.match(/[Cc]omment (?:keyword: )?\**"?([A-Z]{3,})"?/);
      notes.push({
        account,
        slug: file.replace(/\.md$/, ""),
        ep: parseInt(file, 10) || 0,
        title,
        excerpt: firstParagraph(lines),
        keyword: kw?.[1] ?? "NOTES",
      });
    }
  }
  return notes.sort((a, b) => b.ep - a.ep);
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
        title: m ? m[1] : h1,
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
