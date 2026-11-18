// render.js: turn an HTML animation into an MP4.
//   node render.js demo/launch.html launch.mp4                 (uses YOUR starter.js)
//   node render.js demo/launch.html launch.mp4 --solution      (uses solution.js)
//   options: --seconds 8  --fps 30  --size 1080x1920
import { openPage, startEncoder } from './common.js';

const args = process.argv.slice(2);
const flag = (name, def) => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : def; };
const [input, output = 'out.mp4'] = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
if (!input) { console.log('usage: node render.js <file.html> [out.mp4] [--seconds 8] [--fps 30] [--size 1080x1920] [--solution]'); process.exit(1); }

const fps = Number(flag('fps', 30));
const seconds = Number(flag('seconds', 8));
const [width, height] = flag('size', '1080x1920').split('x').map(Number);
const { renderFrames } = await import(args.includes('--solution') ? './solution.js' : './starter.js');

const started = Date.now();
const { browser, page } = await openPage(input, { width, height });
const enc = startEncoder(output, fps);
let frames = 0;
await renderFrames(page, { fps, seconds }, async (png, i) => {
  await enc.write(png);
  frames++;
  if (i % fps === 0) process.stdout.write(`\rframe ${i}/${Math.round(fps * seconds)}`);
});
await browser.close();
await enc.end();
if (frames === 0) { console.log('\n0 frames. renderFrames() is still empty: write it in starter.js'); process.exit(1); }
console.log(`\rdone: ${output}  ${frames} frames, ${width}x${height} @ ${fps}fps, took ${((Date.now() - started) / 1000).toFixed(1)}s`);
