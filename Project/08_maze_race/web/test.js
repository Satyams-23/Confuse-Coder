// ============================================================================
//  Maze Race  ·  TESTS  ·  @confuse__coder
//  node test.js            -> tumhara starter.js
//  node test.js --solution -> solution.js
// ============================================================================
const core = require('./core.js');
Object.assign(global, core); // DIRS, tracePath, ... browser jaisa global
const file = process.argv.includes('--solution') ? './solution.js' : './starter.js';
const {bfs} = require(file);
const {parseMaze, makeMaze, dfs, validPath} = core;

// trusted shortest distance (sirf test ke liye)
function shortest(grid, s, e) {
  const R = grid.length, C = grid[0].length, d = grid.map((r) => r.map(() => -1));
  const q = [s]; d[s[0]][s[1]] = 0;
  for (let h = 0; h < q.length; h++) {
    const [r, c] = q[h];
    for (const [dr, dc] of core.DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && !grid[nr][nc] && d[nr][nc] < 0) { d[nr][nc] = d[r][c] + 1; q.push([nr, nc]); }
    }
  }
  return d[e[0]][e[1]];
}

const TWO_ROUTES = parseMaze([
  '#######',
  '#S....#',
  '#.###.#',
  '#.###.#',
  '#E....#',
  '#######',
]);
const BLOCKED = parseMaze(['#####', '#S#E#', '#.#.#', '#####']);
const OPEN = parseMaze(['#######', '#S....#', '#.....#', '#.....#', '#....E#', '#######']);

let ok = true;
const check = (name, cond) => { console.log(`  [${cond ? 'PASS' : 'FAIL'}] ${name}`); ok = ok && !!cond; };
const run = (m) => { try { return bfs(m.grid.map((r) => r.slice()), m.start.slice(), m.end.slice()) || {}; } catch (e) { console.log('  bfs() error:', e.message); return {}; } };
const len = (p) => (Array.isArray(p) && p.length ? p.length - 1 : -1);

console.log(`=== MAZE RACE TESTS (${file}) ===`);
let r = run(OPEN);
check('khula maze: path = 7 steps (3 neeche + 4 right)', len(r.path) === 7 && validPath(OPEN.grid, OPEN.start, OPEN.end, r.path));
check('order[0] = start', Array.isArray(r.order) && r.order.length && r.order[0][0] === OPEN.start[0] && r.order[0][1] === OPEN.start[1]);
check('order mein koi cell do baar nahi (visited)', Array.isArray(r.order) && r.order.length && new Set(r.order.map((x) => x + '')).size === r.order.length);

r = run(TWO_ROUTES);
const dfsLen = len(dfs(TWO_ROUTES.grid, TWO_ROUTES.start, TWO_ROUTES.end).path);
check(`do raaste wala maze: BFS = ${shortest(TWO_ROUTES.grid, TWO_ROUTES.start, TWO_ROUTES.end)} steps (DFS ka ${dfsLen})`, len(r.path) === shortest(TWO_ROUTES.grid, TWO_ROUTES.start, TWO_ROUTES.end) && validPath(TWO_ROUTES.grid, TWO_ROUTES.start, TWO_ROUTES.end, r.path));

r = run(BLOCKED);
check('band maze: path = [] (raasta nahi)', Array.isArray(r.path) && r.path.length === 0 && Array.isArray(r.order) && r.order.length > 0);

let all = true;
for (const seed of [1, 7, 42, 99, 2026]) {
  for (const size of [15, 21, 31]) {
    const m = makeMaze(size, size, seed);
    const p = run(m).path;
    if (!(validPath(m.grid, m.start, m.end, p) && len(p) === shortest(m.grid, m.start, m.end))) all = false;
  }
}
check('15 random mazes: har baar sahi + sabse chhota raasta', all);

console.log(ok ? '\nTESTS PASSED' : '\nTESTS FAILED  (hint README mein hai)');
process.exitCode = ok ? 0 : 1;
