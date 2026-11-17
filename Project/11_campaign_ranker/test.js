// test.js: checks your earn() and rank().   node test.js   (or: node test.js --solution)
import { loadJson } from './common.js';
const { earn, rank } = await import(process.argv.includes('--solution') ? './solution.js' : './starter.js');

const data = loadJson(new URL('./data/campaigns_2026-11-17.json', import.meta.url));
const aud = { views: 100000, countries: { IN: 0.85, OTHER: 0.15 } };
const flat = { cpm: 1, min: 10, max: 500 };
const gated = { cpm: 2, min: 2, max: 800, countries: { IN: 0, PK: 0, BD: 0, '*': 2 } };

let pass = 0, fail = 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const t = (name, got, want) => {
  const ok = same(got, want); ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `   got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};

t('flat $1 CPM, 1L views = $100', earn(flat, aud, 9999), { usd: 100, capped: false, unpaidViews: 0 });
t('GTA: $70 cut to max $35', earn({ cpm: 0.7, min: 2, max: 35 }, aud, 1912), { usd: 35, capped: true, unpaidViews: 0 });
t('India views pay $0', earn(gated, aud, 9999), { usd: 30, capped: false, unpaidViews: 85000 });
t('unknown country uses *', earn(gated, { views: 1000, countries: { US: 1 } }, 9999), { usd: 2, capped: false, unpaidViews: 0 });
t('all-India audience on gated row = $0', earn(gated, { views: 1e6, countries: { IN: 1 } }, 9999), { usd: 0, capped: false, unpaidViews: 1000000 });
t('below min payout = $0', earn(flat, { views: 9000, countries: { IN: 1 } }, 9999), { usd: 0, capped: false, unpaidViews: 0 });
t('exactly min payout counts', earn(flat, { views: 10000, countries: { IN: 1 } }, 9999), { usd: 10, capped: false, unpaidViews: 0 });
t('budget left cuts it too', earn(flat, aud, 40), { usd: 40, capped: true, unpaidViews: 0 });
t('rounded to cents', earn({ cpm: 0.7, min: 0, max: 99 }, { views: 1234, countries: { IN: 1 } }, 99), { usd: 0.86, capped: false, unpaidViews: 0 });

const r = rank(data.campaigns, aud, ['youtube', 'instagram']);
t('6 rows for youtube + instagram', r.rows.length, 6);
t('sorted high → low', r.rows.map(x => x.usd), [150, 150, 100, 100, 35, 30]);
t('ties keep input order', r.rows.slice(0, 2).map(x => x.name), ['CoD MW4 DMZ', 'SEGA Metaphor']);
t('GTA is 5th', r.rows.findIndex(x => x.name === 'GTA 6 Tokyo Girl'), 4);
t('skipped: GTA + CoD not on youtube', r.skipped, [{ name: 'GTA 6 Tokyo Girl', platform: 'youtube' }, { name: 'CoD MW4 DMZ', platform: 'youtube' }]);
t('rules carried through', r.rows.find(x => x.name === 'GTA 6 Tokyo Girl')?.rules?.length, 1);

console.log(fail ? `\nTESTS FAILED (${pass}/${pass + fail})` : `\nTESTS PASSED (${pass}/${pass + fail})`);
process.exit(fail ? 1 : 0);
