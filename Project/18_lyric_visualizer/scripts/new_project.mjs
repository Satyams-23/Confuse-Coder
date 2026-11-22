/**
 * Create a lyric-video project from the template.
 *   node scripts/new_project.mjs <slug> --audio song.mp3 [--dir lyric-videos] [--node-modules <path>]
 * --node-modules links (junction) an existing node_modules that has remotion 4.0.540 instead of npm install.
 */
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {SKILL, opt, positional} from './_common.mjs';

const slug = positional()[0];
if (!slug) {
  console.error('usage: node new_project.mjs <slug> --audio song.mp3');
  process.exit(1);
}
const dir = path.join(path.resolve(opt('--dir', 'lyric-videos')), slug);
if (fs.existsSync(dir)) {
  console.error(`exists: ${dir}`);
  process.exit(1);
}

fs.cpSync(path.join(SKILL, 'template'), dir, {recursive: true, filter: (src) => !src.includes('node_modules') && !src.includes(`${path.sep}out`)});

// fresh song project: empty scene registry (demo scenes stay in src/scenes/demo as reference)
fs.writeFileSync(
  path.join(dir, 'src/scenes/index.ts'),
  `import type React from 'react';
import type {SceneSlot} from '../lib/data';
import type {TransitionSpec} from '../lib/Transition';

// line index -> scene component (src/scenes/LineNN.tsx). Lines without an entry use DefaultScene.
export const SCENES: Record<number, React.FC<SceneSlot>> = {};

// line index -> theme for that line (default: project.json 'theme'), e.g. {3: 'nightGold'}
export const LINE_THEMES: Record<number, string> = {};

// line index -> how that line's scene ENTERS over the previous one. Default: alternating wipes.
export const TRANSITIONS: Record<number, TransitionSpec> = {};
`,
);
fs.writeFileSync(path.join(dir, 'phrases.json'), '[]\n');
fs.writeFileSync(path.join(dir, 'beats.json'), '{"bpm": 0, "beats": [], "downbeats": [], "onsets": []}\n');
fs.writeFileSync(path.join(dir, 'CREDITS.md'), '# Credits\n\n| asset | source | author | license |\n|---|---|---|---|\n');
fs.writeFileSync(path.join(dir, 'lyrics.txt'), '# one sung phrase per line, in order; mark the key word with *stars*\n');

const proj = JSON.parse(fs.readFileSync(path.join(dir, 'project.json'), 'utf8'));
proj.title = slug;
proj.theme = opt('--theme', 'inkPaper'); // see src/lib/theme.ts THEMES
const audio = opt('--audio');
if (audio) {
  const out = path.join(dir, 'public', 'song.mp3');
  fs.mkdirSync(path.dirname(out), {recursive: true});
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.resolve(audio), '-vn', '-ac', '2', '-ar', '44100', '-b:a', '256k', out]);
  const dur = Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', out]).toString().trim());
  proj.audio = 'song.mp3';
  proj.durationInSeconds = Math.round(dur * 100) / 100;
}
fs.writeFileSync(path.join(dir, 'project.json'), JSON.stringify(proj, null, 2) + '\n');

const nm = opt('--node-modules');
if (nm) {
  fs.symlinkSync(path.resolve(nm), path.join(dir, 'node_modules'), 'junction');
  console.log(`linked node_modules -> ${path.resolve(nm)}`);
} else {
  console.log(`next: cd "${dir}" && npm install`);
}
console.log(`project ready: ${dir}`);
console.log(`before the creative direction: read ${path.join(path.dirname(dir), 'STYLE_LOG.md')} (don't repeat the last 2 styles)`);
console.log(`next: write lyrics.txt, then: python "${path.join(SKILL, 'scripts', 'align.py')}" "${dir}" --vocals`);
