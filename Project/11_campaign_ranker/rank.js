// rank.js: CLI.  node rank.js <campaigns.json> <audience.json> [--inr 88] [--solution]
import { loadJson, money, rupees, num, pct } from './common.js';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? Number(args[i + 1]) : def; };
const [campPath, audPath] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!campPath || !audPath) { console.log('usage: node rank.js <campaigns.json> <audience.json> [--inr 88] [--solution]'); process.exit(1); }

const { rank } = await import(args.includes('--solution') ? './solution.js' : './starter.js');
const inr = opt('--inr', 88);
const data = loadJson(campPath), aud = loadJson(audPath);
const plats = aud.myPlatforms ?? ['instagram'];

const split = Object.entries(aud.countries).map(([c, s]) => `${c} ${pct(s)}`).join(' · ');
console.log(`Tumhara clip: ${num(aud.views)} views · ${split} · ${plats.join(' + ')}`);
console.log(`(${data.source})\n`);

const { rows, skipped } = rank(data.campaigns, aud, plats);
rows.forEach((r, i) => {
  const notes = [];
  if (r.capped) notes.push('CAP');
  if (r.unpaidViews) notes.push(`${num(r.unpaidViews)} views = $0 (country)`);
  console.log(`#${i + 1}  ${money(r.usd).padStart(8)}  ${rupees(r.usd, inr).padStart(8)}  ${r.name.padEnd(21)} ${r.platform.padEnd(9)} ${notes.join(' · ')}`);
  for (const rule of r.rules) console.log(`${' '.repeat(24)}⚠ ${rule}`);
});
for (const s of skipped) console.log(`✗ ${s.name}: ${s.platform} pe nahi chalta`);
if (!args.includes('--solution') && rows.length === 0)
  console.log('(starter.js abhi khaali lag raha hai: pehle earn() aur rank() likho, phir `node test.js`)');
console.log('\nNote: page pe country table na ho toh yahan sab countries paid maana hai. Join karke brief zaroor padho.');
