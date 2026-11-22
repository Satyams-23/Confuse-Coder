/**
 * Render sample frames + a contact sheet.
 *   node scripts/stills.mjs <project> --line 0 [--count 5]     evenly across one line's scene
 *   node scripts/stills.mjs <project> --times 1.2 3.4 5        specific seconds
 *   [--scale 0.5] [--out <dir>] [--comp <composition id>]
 * Output: <project>/out/stills/NN_<t>s.jpg + sheet.jpg
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {args, bundleProject, opt, positional, projectDir, projectImport, readJson} from './_common.mjs';

const dir = projectDir(positional()[0]);
const proj = readJson(path.join(dir, 'project.json'));
const phrases = readJson(path.join(dir, 'phrases.json'));
const fps = proj.fps;
const scale = Number(opt('--scale', '0.5'));
const outDir = path.resolve(opt('--out', path.join(dir, 'out', 'stills')));
fs.mkdirSync(outDir, {recursive: true});
for (const f of fs.readdirSync(outDir)) if (f.endsWith('.jpg')) fs.unlinkSync(path.join(outDir, f));

const frames = [];
if (args.includes('--times')) {
  for (let k = args.indexOf('--times') + 1; k < args.length && !args[k].startsWith('--'); k++) frames.push(Math.round(Number(args[k]) * fps));
} else {
  const n = Number(opt('--line', '0'));
  const count = Number(opt('--count', '5'));
  const p = phrases[n];
  if (!p) {
    console.error(`no line ${n} in phrases.json`);
    process.exit(1);
  }
  const a = n === 0 ? 0.25 : Math.max(phrases[n - 1].end, p.start - 0.5) + 0.25; // just after the transition-in
  const b = phrases[n + 1] ? Math.max(p.end, phrases[n + 1].start - 0.5) + 0.25 : proj.durationInSeconds - 0.1; // into the next transition
  for (let k = 0; k < count; k++) frames.push(Math.round((a + ((b - a) * k) / Math.max(1, count - 1)) * fps));
}

const {renderStill, selectComposition} = await projectImport(dir, '@remotion/renderer');
const serveUrl = await bundleProject(dir);
const composition = await selectComposition({serveUrl, id: opt('--comp', 'lyric-video')}); // --comp <id>: any composition (reel, cover)
const files = [];
for (const [k, fr] of frames.entries()) {
  const frame = Math.min(composition.durationInFrames - 1, Math.max(0, fr));
  const file = path.join(outDir, `${String(k + 1).padStart(2, '0')}_${(frame / fps).toFixed(2)}s.jpg`);
  await renderStill({serveUrl, composition, frame, output: file, imageFormat: 'jpeg', jpegQuality: 88, scale});
  files.push(file);
  process.stdout.write(`${(frame / fps).toFixed(2)}s `);
}
// contact sheet via ffmpeg tile
const list = path.join(outDir, 'list.txt');
fs.writeFileSync(list, files.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `tile=${files.length}x1:padding=12:color=0x2A2724`, '-frames:v', '1', path.join(outDir, 'sheet.jpg')]);
fs.unlinkSync(list);
fs.rmSync(serveUrl, {recursive: true, force: true}); // don't leave bundle copies in %TEMP%
console.log(`\n${files.length} stills + sheet.jpg -> ${outDir}`);
