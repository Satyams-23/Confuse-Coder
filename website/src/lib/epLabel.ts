/** "EP 03", "GRAPHS EP 03", "AI/ML EP 03" or "ROADMAP 01". No fs here, so client components can use it. */
export function epLabel(n: { ep: number; series: string }): string {
  const num = String(n.ep).padStart(2, "0");
  if (n.series === "roadmaps") return `ROADMAP ${num}`;
  const ep = `EP ${num}`;
  return n.series ? `${n.series === "aiml" ? "AI/ML" : n.series.toUpperCase()} ${ep}` : ep;
}
