import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

/*
  Career roadmaps are plain notes files (notes/confuse_coder.dev/roadmaps/NN_<role>.md), so they still read
  well on GitHub. This file turns one into structured data for the /roadmaps/<slug> page:
    ## 1 + ## 2        -> "about the role" tabs
    ## 3 table         -> the at-a-glance timeline (Step | Topics)
    ## 4 ### Step N    -> expandable steps; #### = topics; "- **Label:** text" bullets = topic fields
    ## 5 ... ## 12     -> the job-ready kit (expandable)
  Our own markdown, so the rendered HTML is safe to inject.
*/

const ROOT = path.resolve(process.cwd(), "..", "notes", "confuse_coder.dev", "roadmaps");

export type Field = { label: string; html: string; kind: FieldKind };
export type FieldKind = "learn" | "why" | "depth" | "resource" | "practice" | "project" | "outcome" | "other";
export type Topic = { id: string; name: string; learn?: Field; fields: Field[]; resources: Field[] };
export type Step = { n: number; id: string; title: string; topics: string[]; items: Topic[] };
export type Extra = { id: string; title: string; html: string; checklist?: string[] };
export type Roadmap = {
  slug: string;
  file: string;
  ep: number;
  title: string;
  role: string;
  hook: string;
  lead: string;
  about: { title: string; html: string }[];
  glanceIntro: string;
  glanceAfter: string;
  steps: Step[];
  allInOne?: { title: string; html: string };
  extras: Extra[];
  topicCount: number;
};

const md = (s: string) => marked.parse(s.trim(), { async: false, gfm: true }) as string;
const inline = (s: string) => marked.parseInline(s.trim(), { async: false, gfm: true }) as string;
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "01_data_engineer.md" -> "data-engineer" */
export const roadmapSlug = (file: string) => file.replace(/^\d+_/, "").replace(/\.md$/, "").replace(/_/g, "-");

function splitBy(text: string, re: RegExp): { head: string; body: string }[] {
  const out: { head: string; body: string }[] = [];
  const lines = text.split(/\r?\n/);
  let cur: { head: string; body: string[] } | null = null;
  for (const l of lines) {
    if (re.test(l)) {
      if (cur) out.push({ head: cur.head, body: cur.body.join("\n") });
      cur = { head: l, body: [] };
    } else if (cur) cur.body.push(l);
  }
  if (cur) out.push({ head: cur.head, body: cur.body.join("\n") });
  return out;
}

const KIND: [RegExp, FieldKind][] = [
  [/^kya seekhna/i, "learn"],
  [/^kyun/i, "why"],
  [/^kitna deep/i, "depth"],
  [/^(video|docs|book|free|repo|certification|paid)/i, "resource"],
  [/^practice/i, "practice"],
  [/^mini project/i, "project"],
  [/^outcome/i, "outcome"],
];

/** Topic body = top-level "- **Label:** text" bullets; indented lines belong to the bullet above. */
function parseTopic(name: string, body: string, stepN: number): Topic {
  const fields: Field[] = [];
  let cur: { label: string; lines: string[] } | null = null;
  const flush = () => {
    if (!cur) return;
    const text = cur.lines.join("\n");
    const multi = /\n\s+(\d+\.|-)\s/.test(text);
    const kind = KIND.find(([re]) => re.test(cur!.label))?.[1] ?? "other";
    fields.push({ label: cur.label, kind, html: multi ? md(text) : inline(text) });
  };
  for (const l of body.split(/\r?\n/)) {
    const m = l.match(/^- \*\*(.+?):\*\*\s*(.*)$/);
    if (m) {
      flush();
      cur = { label: m[1], lines: [m[2]] };
    } else if (cur && l.trim()) cur.lines.push(l);
  }
  flush();
  return {
    id: `s${stepN}-${slugify(name)}`,
    name,
    learn: fields.find((f) => f.kind === "learn"),
    fields: fields.filter((f) => f.kind !== "learn" && f.kind !== "resource"),
    resources: fields.filter((f) => f.kind === "resource"),
  };
}

function parse(file: string): Roadmap {
  const raw = fs.readFileSync(path.join(ROOT, file), "utf8");
  const lines = raw.split(/\r?\n/);
  const title = (lines.find((l) => l.startsWith("# ")) ?? "").replace(/^#\s+/, "");
  const meta = lines.find((l) => /^\*@/.test(l)) ?? "";
  const hook = meta.replace(/^\*|\*$/g, "").split("Reel:")[1]?.trim() ?? "";
  const sections = splitBy(raw, /^## \d+\.\s/);
  const sec = (n: number) => sections.find((s) => s.head.startsWith(`## ${n}.`));
  const clean = (h: string) => h.replace(/^##\s+\d+\.\s*/, "");

  const s1 = sec(1)!;
  const lead = s1.body.trim().split(/\r?\n/)[0];

  // ## 3: intro paragraph, Step | Topics table, text after it
  const s3 = sec(3)!.body;
  const tableLines = s3.split(/\r?\n/).filter((l) => l.startsWith("|"));
  const rows = tableLines.slice(2).map((l) => l.split("|").slice(1, -1).map((c) => c.trim()));
  const firstTable = s3.indexOf(tableLines[0]);
  const lastTable = s3.indexOf(tableLines[tableLines.length - 1]) + tableLines[tableLines.length - 1].length;

  // ## 4: steps -> topics
  const s4 = sec(4)!.body;
  const stepBlocks = splitBy(s4, /^### /);
  const steps: Step[] = [];
  let allInOne: Roadmap["allInOne"];
  for (const b of stepBlocks) {
    const m = b.head.match(/^### Step (\d+)\s*·\s*(.+)$/);
    if (!m) {
      allInOne = { title: b.head.replace(/^###\s+/, ""), html: md(b.body) };
      continue;
    }
    const n = parseInt(m[1], 10);
    const row = rows[n - 1];
    steps.push({
      n,
      id: `step-${n}`,
      title: m[2].trim(),
      topics: (row?.[1] ?? "").split(",").map((t) => t.trim()).filter(Boolean),
      items: splitBy(b.body, /^#### /).map((t) => parseTopic(t.head.replace(/^####\s+/, ""), t.body, n)),
    });
  }

  const extras: Extra[] = sections
    .filter((s) => parseInt(s.head.slice(3), 10) >= 5)
    .map((s) => {
      const t = clean(s.head);
      const checks = s.body.split(/\r?\n/).filter((l) => /^- \[[ x]\]/.test(l));
      return {
        id: slugify(t),
        title: t,
        html: md(s.body),
        checklist: checks.length ? checks.map((l) => inline(l.replace(/^- \[[ x]\]\s*/, ""))) : undefined,
      };
    });

  return {
    slug: roadmapSlug(file),
    file,
    ep: parseInt(file, 10) || 0,
    title,
    role: title.replace(/\s*Roadmap.*$/i, ""),
    hook,
    lead,
    // the hero already shows section 1's first line, so the tab starts after it
    about: [1, 2].map((n) => ({
      title: clean(sec(n)!.head),
      html: md(n === 1 ? sec(n)!.body.trim().split(/\r?\n/).slice(1).join("\n") : sec(n)!.body),
    })),
    glanceIntro: inline(s3.slice(0, firstTable).trim()),
    glanceAfter: md(s3.slice(lastTable)),
    steps,
    allInOne,
    extras,
    topicCount: steps.reduce((a, s) => a + s.items.length, 0),
  };
}

export function getRoadmapFiles(): string[] {
  try {
    return fs.readdirSync(ROOT).filter((f) => /^\d+_.*\.md$/.test(f));
  } catch {
    return [];
  }
}

export function getRoadmap(slug: string): Roadmap | null {
  const file = getRoadmapFiles().find((f) => roadmapSlug(f) === slug);
  return file ? parse(file) : null;
}
