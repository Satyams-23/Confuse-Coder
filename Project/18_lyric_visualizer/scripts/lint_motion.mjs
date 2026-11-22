/**
 * Fails if any source file calls interpolate() without an easing (= linear motion).
 *   node scripts/lint_motion.mjs <project>
 */
import fs from 'node:fs';
import path from 'node:path';
import {positional, projectDir} from './_common.mjs';

const dir = projectDir(positional()[0]);
const files = [];
const walk = (d) => {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(f)) files.push(p);
  }
};
walk(path.join(dir, 'src'));

let bad = 0;
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  const re = /\binterpolate\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    let depth = 0;
    let j = m.index + m[0].length - 1;
    for (; j < src.length; j++) {
      if (src[j] === '(') depth++;
      else if (src[j] === ')' && --depth === 0) break;
    }
    const call = src.slice(m.index, j + 1);
    if (!/easing/.test(call)) {
      const line = src.slice(0, m.index).split('\n').length;
      console.log(`LINEAR: ${path.relative(dir, f)}:${line}  ${call.replace(/\s+/g, ' ').slice(0, 90)}`);
      bad++;
    }
  }
}
console.log(bad ? `\n${bad} linear interpolate() call(s). Use ease()/keys() from src/lib/anim.ts.` : 'motion lint: OK (no linear interpolate)');
process.exit(bad ? 1 : 0);
