// check.js: CLI.  node check.js <brief.json> <clips.json> [--views 10000] [--inr 88] [--solution]
// A clip may have "file": "path/to/clip.mp4" instead of durationSec/width/height (needs ffprobe).
import { loadJson, probe, REASONS, money, rupees } from './common.js';

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? Number(args[i + 1]) : def; };
const [briefPath, clipsPath] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!briefPath || !clipsPath) { console.log('usage: node check.js <brief.json> <clips.json> [--views 10000] [--inr 88] [--solution]'); process.exit(1); }

const { check, earnings } = await import(args.includes('--solution') ? './solution.js' : './starter.js');
const views = opt('--views', 10000), inr = opt('--inr', 88);
const brief = loadJson(briefPath);
const clips = loadJson(clipsPath).map(c => (c.file ? { ...c, ...probe(c.file) } : c));

console.log(`Brief: ${brief.name}  (${brief.status}, ${money(brief.cpm)} per 1,000 views, budget left ${money(brief.budgetLeft)})\n`);
let good = 0;
for (const c of clips) {
  const r = check(c, brief);
  const head = `${c.id.padEnd(7)} ${String(c.durationSec).padStart(3)}s  ${c.width}x${c.height}  ${c.platform.padEnd(9)}`;
  if (r.length === 0) {
    good++;
    const usd = earnings(views, brief);
    console.log(`✓ ${head} → ${views.toLocaleString('en-IN')} views = ${money(usd)} (≈ ${rupees(usd, inr)})`);
  } else {
    console.log(`✗ ${head} → ${r.map(code => `${code}: ${REASONS[code.split(' ')[0]] ?? '?'}`).join(' | ')}`);
  }
}
console.log(`\nPost karne layak: ${good}/${clips.length}`);
if (!args.includes('--solution') && brief.status !== 'locked' && earnings(1e6, brief) === 0)
  console.log('(starter.js abhi khaali lag raha hai: pehle check() aur earnings() likho, phir `node test.js`)');
