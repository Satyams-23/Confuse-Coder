/**
 * Chunked render + mux of the ORIGINAL audio.
 *   node scripts/render.mjs <project> [--from 0 --to 20] [--concurrency 2] [--chunk 300] [--fresh]
 * Muted video in chunks (fresh browser per chunk = no long-run RAM crash), resumable (finished chunks are kept
 * only while no source changed, or until --fresh), ffmpeg concat, then mux the original audio → out/final.mp4 or out/clip_<a>-<b>.mp4
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {bundleProject, flag, opt, positional, projectDir, projectImport, readJson} from './_common.mjs';

const dir = projectDir(positional()[0]);
const proj = readJson(path.join(dir, 'project.json'));
const compId = opt('--comp', 'lyric-video'); // another composition (e.g. a reel that mixes its own audio): rendered WITH its audio, no song mux
const custom = compId !== 'lyric-video';
const {renderMedia, selectComposition} = await projectImport(dir, '@remotion/renderer');
const serveUrl = await bundleProject(dir);
const composition = await selectComposition({serveUrl, id: compId});
const fps = composition.fps;
const total = custom ? composition.durationInFrames : Math.round(proj.durationInSeconds * fps);
const a = Math.max(0, Math.round(Number(opt('--from', '0')) * fps));
const b = Math.min(total, opt('--to') ? Math.round(Number(opt('--to')) * fps) : total);
const chunk = Number(opt('--chunk', '300'));
const concurrency = Number(opt('--concurrency', '2'));
const base = custom ? compId : 'final';
const name = a > 0 || b < total ? `${custom ? compId + '_' : 'clip_'}${(a / fps).toFixed(0)}-${(b / fps).toFixed(0)}` : base;
const work = path.join(dir, 'out', `chunks_${name}`);
fs.mkdirSync(work, {recursive: true});
// Chunks are only reused when nothing changed: same range/chunking AND no source file newer than the stamp.
// (A stale part from an older edit or an older duration would otherwise be spliced into the new video.)
const newest = (p) => {
  if (!fs.existsSync(p)) return 0;
  const st = fs.statSync(p);
  if (!st.isDirectory()) return st.mtimeMs;
  return Math.max(0, ...fs.readdirSync(p).filter((f) => f !== 'node_modules').map((f) => newest(path.join(p, f))));
};
const srcTime = Math.max(...['src', 'public', 'phrases.json', 'beats.json', 'project.json'].map((p) => newest(path.join(dir, p))));
const stampPath = path.join(work, 'stamp.json');
const stamp = {a, b, chunk, compId, srcTime};
const old = fs.existsSync(stampPath) ? JSON.parse(fs.readFileSync(stampPath, 'utf8')) : null;
const stale = !old || old.a !== a || old.b !== b || old.chunk !== chunk || old.compId !== compId || old.srcTime !== srcTime;
if (flag('--fresh') || stale) {
  for (const f of fs.readdirSync(work)) fs.rmSync(path.join(work, f), {recursive: true, force: true});
  if (stale && old) console.log('sources changed since the last render: old chunks cleared');
}
fs.writeFileSync(stampPath, JSON.stringify(stamp));

const parts = [];
for (let s = a, k = 0; s < b; s += chunk, k++) {
  const e = Math.min(b, s + chunk) - 1;
  const out = path.join(work, `part_${String(k).padStart(3, '0')}.mp4`);
  parts.push(out);
  if (fs.existsSync(out) && fs.statSync(out).size > 1000) {
    console.log(`skip ${path.basename(out)} (exists)`);
    continue;
  }
  for (let attempt = 1; ; attempt++) {
    try {
      const t0 = Date.now();
      await renderMedia({
        serveUrl, composition, codec: 'h264', muted: true, frameRange: [s, e], outputLocation: out + '.tmp.mp4',
        concurrency, crf: 16, pixelFormat: 'yuv420p', imageFormat: 'jpeg', jpegQuality: 92,
        onProgress: ({progress}) => process.stdout.write(`\rpart ${k} [${s}-${e}] ${(progress * 100).toFixed(0)}%   `),
      });
      fs.renameSync(out + '.tmp.mp4', out);
      console.log(`\rpart ${k} [${s}-${e}] done in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
      break;
    } catch (err) {
      console.log(`\npart ${k} failed (attempt ${attempt}): ${String(err).slice(0, 200)}`);
      if (attempt >= 3) throw err;
    }
  }
}
fs.rmSync(serveUrl, {recursive: true, force: true});

const list = path.join(work, 'list.txt');
fs.writeFileSync(list, parts.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
const video = path.join(work, 'video.mp4');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', video]);
const final = path.join(dir, 'out', `${name}.mp4`);
if (custom) {
  // the composition's own mix (voice + music), rendered once in one pass so there are no clicks at chunk seams
  const aud = path.join(work, 'audio.aac');
  const serve2 = await bundleProject(dir);
  await renderMedia({serveUrl: serve2, composition, codec: 'aac', frameRange: [a, b - 1], outputLocation: aud});
  fs.rmSync(serve2, {recursive: true, force: true});
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, '-i', aud, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', final]);
  console.log(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'compact', final]).toString().trim());
  console.log(`-> ${final}`);
  process.exit(0);
}
const audioIn = proj.audio ? ['-ss', String(a / fps), '-t', String((b - a) / fps), '-i', path.join(dir, 'public', proj.audio)] : [];
const audioMap = proj.audio ? ['-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-shortest'] : [];
execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', video, ...audioIn, '-map', '0:v', ...audioMap, '-c:v', 'copy', '-movflags', '+faststart', final]);
const probe = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=codec_type,width,height,r_frame_rate:format=duration', '-of', 'compact', final]).toString();
console.log(probe.trim());
console.log(`-> ${final}`);
