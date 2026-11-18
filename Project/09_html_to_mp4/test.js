// test.js: checks your renderFrames().   node test.js   (or: node test.js --solution)
import { openPage } from './common.js';
import { createHash } from 'node:crypto';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const { renderFrames } = await import(process.argv.includes('--solution') ? './solution.js' : './starter.js');

// A tiny page with one of each kind of time: CSS animation, setTimeout, requestAnimationFrame.
const dir = mkdtempSync(join(tmpdir(), 'h2m-'));
const page1 = join(dir, 'probe.html');
writeFileSync(page1, `<!doctype html><style>
  #box{width:100px;height:100px;background:#f50;animation:slide 1000ms linear forwards}
  @keyframes slide{to{transform:translateX(500px)}}</style>
  <div id=box></div><script>
  window.flag=false; setTimeout(()=>window.flag=true, 500);
  window.rafNow=0; (function loop(n){window.rafNow=n; requestAnimationFrame(loop)})(0);
</script>`);

let pass = 0, fail = 0;
const check = (name, ok, extra = '') => { ok ? pass++ : fail++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${ok ? '' : '   ' + extra}`); };

async function run(fps, seconds) {
  const { browser, page } = await openPage(page1, { width: 640, height: 200 });
  const rows = [];
  await renderFrames(page, { fps, seconds }, async (png, i) => {
    const s = await page.evaluate(() => ({
      now: Date.now(),
      css: document.getAnimations()[0]?.currentTime ?? -1,
      flag: window.flag,
      raf: window.rafNow,
    }));
    rows.push({ i, hash: createHash('md5').update(png).digest('hex'), ...s });
  });
  await browser.close();
  return rows;
}

const a = await run(10, 1);
check('makes fps * seconds frames (10 * 1 = 10)', a.length === 10, `got ${a.length}`);
if (a.length === 10) {
  check('frames arrive in order 0..9', a.every((r, k) => r.i === k), a.map(r => r.i).join(','));
  check('JS clock = frame * 100ms', a.every((r, k) => Math.abs(r.now - k * 100) <= 1), a.map(r => r.now).join(','));
  check('CSS animation frozen at the same time', a.every((r, k) => Math.abs(r.css - k * 100) <= 1), a.map(r => Math.round(r.css)).join(','));
  check('setTimeout(500) fires exactly at frame 5', a.findIndex(r => r.flag) === 5, `first true at frame ${a.findIndex(r => r.flag)}`);
  check('requestAnimationFrame keeps running', a[9].raf > a[2].raf, `rAF time ${a[2].raf} -> ${a[9].raf}`);
  const b = await run(10, 1);
  check('same input = same pixels (deterministic)', b.length === 10 && b.every((r, k) => r.hash === a[k].hash), 'differ at frames ' + b.map((r,k)=>r.hash===a[k].hash?'':k).filter(String).join(','));
  check('frames actually change over time', a[0].hash !== a[9].hash, 'frame 0 and 9 look identical');
}
const c = await run(30, 0.5);
check('works at 30fps too (15 frames)', c.length === 15, `got ${c.length}`);

console.log(fail === 0 ? `\nTESTS PASSED (${pass}/${pass})` : `\nTESTS FAILED (${pass}/${pass + fail} passed)  -> open starter.js`);
process.exit(fail === 0 ? 0 : 1);
