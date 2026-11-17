// solution.js: one answer. Try starter.js yourself first.
export function earn(row, audience, budgetLeft) {
  let total = 0, unpaid = 0;
  for (const [country, share] of Object.entries(audience.countries)) {
    const rate = row.countries ? (row.countries[country] ?? row.countries['*'] ?? 0) : row.cpm;
    const views = audience.views * share;
    total += views / 1000 * rate;
    if (rate === 0) unpaid += views;
  }
  if (total < row.min) total = 0;
  const usd = Math.min(total, row.max, budgetLeft);
  return { usd: Math.round(usd * 100) / 100, capped: usd < total, unpaidViews: Math.round(unpaid) };
}

export function rank(campaigns, audience, myPlatforms) {
  const rows = [], skipped = [];
  for (const c of campaigns) for (const p of myPlatforms) {
    const row = c.platforms[p];
    if (!row) { skipped.push({ name: c.name, platform: p }); continue; }
    rows.push({ name: c.name, platform: p, ...earn(row, audience, c.budgetLeft), rules: c.rules ?? [] });
  }
  rows.sort((a, b) => b.usd - a.usd); // Array sort is stable, so ties keep input order
  return { rows, skipped };
}
