import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createRequire} from 'node:module';

export const SKILL = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const args = process.argv.slice(2);
export const opt = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
export const flag = (k) => args.includes(k);
export const positional = () => args.filter((a, i) => !a.startsWith('--') && !(args[i - 1] ?? '').startsWith('--'));

export const projectDir = (p) => {
  const dir = path.resolve(p ?? '.');
  if (!fs.existsSync(path.join(dir, 'project.json'))) {
    console.error(`Not a lyric project (no project.json): ${dir}`);
    process.exit(1);
  }
  return dir;
};
export const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

/** Import a package from the PROJECT's node_modules (the skill scripts need no install of their own). */
export const projectImport = async (dir, name) => {
  const req = createRequire(path.join(dir, 'package.json'));
  return import(pathToFileURL(req.resolve(name)).href);
};

export const bundleProject = async (dir) => {
  const {bundle} = await projectImport(dir, '@remotion/bundler');
  return bundle({entryPoint: path.join(dir, 'src', 'index.ts'), publicDir: path.join(dir, 'public')});
};
