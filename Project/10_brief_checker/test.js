// test.js: checks your check() and earnings().   node test.js   (or: node test.js --solution)
import { loadJson } from './common.js';
const { check, earnings } = await import(process.argv.includes('--solution') ? './solution.js' : './starter.js');

const brief = loadJson(new URL('./demo/brief.json', import.meta.url));
const locked = loadJson(new URL('./demo/brief_locked.json', import.meta.url));
const good = { id: 't', platform: 'instagram', sourceId: 'demo-show-ep01', durationSec: 30, width: 1080, height: 1920, watermark: false, caption: 'funny #ad' };
const w = (patch) => ({ ...good, ...patch });

let pass = 0, fail = 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const t = (name, got, want) => {
  const ok = same(got, want); ok ? pass++ : fail++;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : `   got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`}`);
};

t('good clip passes', check(good, brief), []);
t('locked campaign', check(good, { ...brief, status: 'locked' }), ['LOCKED']);
t('source not in campaign', check(w({ sourceId: 'random-viral-podcast' }), brief), ['NOT_A_CAMPAIGN_SOURCE']);
t('wrong platform', check(w({ platform: 'x' }), brief), ['WRONG_PLATFORM']);
t('too short', check(w({ durationSec: 10 }), brief), ['TOO_SHORT']);
t('too long', check(w({ durationSec: 75 }), brief), ['TOO_LONG']);
t('edges 15s and 60s are fine', [check(w({ durationSec: 15 }), brief), check(w({ durationSec: 60 }), brief)], [[], []]);
t('landscape is not vertical', check(w({ width: 1920, height: 1080 }), brief), ['NOT_VERTICAL']);
t('720x1280 is still 9:16', check(w({ width: 720, height: 1280 }), brief), []);
t('#adventure is NOT #ad', check(w({ caption: 'lol #adventure' }), brief), ['MISSING_TAG #ad']);
t('#AD counts (any case)', check(w({ caption: 'lol #AD' }), brief), []);
t('#ad at the very start counts', check(w({ caption: '#ad lol' }), brief), []);
t('watermark', check(w({ watermark: true }), brief), ['WATERMARK']);
t('many problems, in order', check(w({ sourceId: 'x', durationSec: 90, width: 1920, height: 1080, caption: 'no tag', watermark: true }), locked),
  ['LOCKED', 'NOT_A_CAMPAIGN_SOURCE', 'TOO_LONG', 'NOT_VERTICAL', 'MISSING_TAG #ad', 'WATERMARK']);

t('10,000 views at $2 CPM = $20', earnings(10000, brief), 20);
t('below minViews = $0', earnings(999, brief), 0);
t('exactly minViews counts', earnings(1000, brief), 2);
t('capped by budget left', earnings(1_000_000, brief), 500);
t('locked campaign pays $0', earnings(1_000_000, locked), 0);
t('rounded to cents', earnings(1234, { ...brief, cpm: 1.5 }), 1.85);

console.log(fail ? `\nTESTS FAILED (${pass}/${pass + fail})` : `\nTESTS PASSED (${pass}/${pass + fail})`);
process.exit(fail ? 1 : 0);
