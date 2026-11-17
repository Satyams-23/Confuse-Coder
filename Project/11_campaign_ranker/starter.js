// starter.js: YOU write these two functions. Run `node test.js` to check them.
//
// A campaign platform row looks like:
//   { cpm: 2.00, min: 2, max: 800, countries: { IN: 0, PK: 0, BD: 0, '*': 2.00 } }
//   - cpm       dollars per 1,000 views (used when there is NO countries table)
//   - countries optional: rate per 1,000 views for each viewer country; '*' = every other country
//   - min       earning below this pays $0 (min payout)
//   - max       one clip never earns more than this (max payout per clip)
// audience = { views: 100000, countries: { IN: 0.85, OTHER: 0.15 } }   (shares add up to 1)
//   'OTHER' (or any code not in the table) uses the '*' rate.

// earn(row, audience, budgetLeft) → { usd, capped, unpaidViews }
//   1. for each audience country: views * share / 1000 * rate   (rate from countries table, else row.cpm)
//      add up the views whose rate is 0 → unpaidViews (whole number, Math.round)
//   2. total below row.min → total = 0
//   3. usd = Math.min(total, row.max, budgetLeft); capped = true if max or budget cut it
//   4. round usd to cents
export function earn(row, audience, budgetLeft) {
  // TODO
  return { usd: 0, capped: false, unpaidViews: 0 };
}

// rank(campaigns, audience, myPlatforms) → { rows, skipped }
//   rows:    one { name, platform, usd, capped, unpaidViews, rules } per (campaign × my platform the campaign accepts),
//            sorted by usd, highest first (keep input order on ties)
//   skipped: one { name, platform } per my platform the campaign does NOT accept
export function rank(campaigns, audience, myPlatforms) {
  // TODO
  return { rows: [], skipped: [] };
}
