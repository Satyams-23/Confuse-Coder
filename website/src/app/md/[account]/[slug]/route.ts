import { ACCOUNT_SEG, getNote, getNotes } from "@/lib/content";

// /md/dsa/graphs-02_bfs → the raw notes file as a download (built statically).
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getNotes().map((n) => ({ account: ACCOUNT_SEG[n.account], slug: n.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ account: string; slug: string }> }) {
  const { account, slug } = await params;
  const note = getNote(account, slug);
  if (!note) return new Response("Not found", { status: 404 });
  return new Response(note.markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="confuse-coder-${slug}.md"`,
    },
  });
}
