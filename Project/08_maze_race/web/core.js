// ============================================================================
//  Maze Race  ·  READY FILE (core)  ·  @confuse__coder
//  Maze banana, DFS (stack wala, reel ka "bug"), path check. Isko chhedne ki zaroorat nahi.
//  Grid: grid[r][c] = 1 (deewar) ya 0 (khula). Cell = [r, c].
// ============================================================================

const DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // right, down, left, up

/** Seeded random (same seed = same maze, "Maze #42" share kar sakte ho). */
function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Maze banao (rows, cols odd). Pehle ek "perfect" maze (sirf ek raasta), phir `loops` fraction
 * deewarein tod do taaki kai raaste ban jaayein. Warna BFS aur DFS ek hi raasta dhoondhenge!
 */
function makeMaze(rows, cols, seed, loops = 0.14) {
  const rand = rng(seed);
  const g = Array.from({length: rows}, () => Array(cols).fill(1));
  const stack = [[1, 1]];
  g[1][1] = 0;
  while (stack.length) {
    const [r, c] = stack[stack.length - 1];
    const opts = [];
    for (const [dr, dc] of DIRS) {
      const nr = r + dr * 2, nc = c + dc * 2;
      if (nr > 0 && nr < rows - 1 && nc > 0 && nc < cols - 1 && g[nr][nc] === 1) opts.push([nr, nc, r + dr, c + dc]);
    }
    if (!opts.length) { stack.pop(); continue; }
    const [nr, nc, wr, wc] = opts[Math.floor(rand() * opts.length)];
    g[wr][wc] = 0;
    g[nr][nc] = 0;
    stack.push([nr, nc]);
  }
  for (let r = 1; r < rows - 1; r++)
    for (let c = 1; c < cols - 1; c++) {
      if (g[r][c] !== 1) continue;
      const horiz = g[r][c - 1] === 0 && g[r][c + 1] === 0;
      const vert = g[r - 1][c] === 0 && g[r + 1][c] === 0;
      if ((horiz || vert) && rand() < loops) g[r][c] = 0;
    }
  return {grid: g, start: [1, 1], end: [rows - 2, cols - 2]};
}

/** Text maze -> grid. '#' = deewar, 'S' start, 'E' end, '.' khula. */
function parseMaze(lines) {
  let start = null, end = null;
  const grid = lines.map((row, r) =>
    [...row].map((ch, c) => {
      if (ch === 'S') start = [r, c];
      if (ch === 'E') end = [r, c];
      return ch === '#' ? 1 : 0;
    }),
  );
  return {grid, start, end};
}

/**
 * DFS with a STACK (reel wala "pop()" bug). Ek raasta pakad ke gehra jaata hai.
 * return {order: visit order, path: start..end (ya [] agar raasta nahi)}
 */
function dfs(grid, start, end) {
  const R = grid.length, C = grid[0].length;
  const seen = Array.from({length: R}, () => Array(C).fill(false));
  const parent = {};
  const order = [];
  const stack = [[start[0], start[1], -1, -1]];
  while (stack.length) {
    const [r, c, pr, pc] = stack.pop();
    if (seen[r][c]) continue;
    seen[r][c] = true;
    parent[r + ',' + c] = pr < 0 ? null : [pr, pc];
    order.push([r, c]);
    if (r === end[0] && c === end[1]) break;
    for (let i = DIRS.length - 1; i >= 0; i--) {
      const nr = r + DIRS[i][0], nc = c + DIRS[i][1];
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 0 && !seen[nr][nc]) stack.push([nr, nc, r, c]);
    }
  }
  return {order, path: tracePath(parent, end)};
}

/** parent map ("r,c" -> [pr,pc] | null) se end se start tak peeche chalo. */
function tracePath(parent, end) {
  const k = end[0] + ',' + end[1];
  if (!(k in parent)) return [];
  const path = [];
  let cur = end;
  while (cur) {
    path.push(cur);
    cur = parent[cur[0] + ',' + cur[1]];
  }
  return path.reverse();
}

/** Path sahi hai? start se shuru, end pe khatam, har step padosi, koi deewar nahi. */
function validPath(grid, start, end, path) {
  if (!Array.isArray(path) || !path.length) return false;
  const [f, l] = [path[0], path[path.length - 1]];
  if (f[0] !== start[0] || f[1] !== start[1] || l[0] !== end[0] || l[1] !== end[1]) return false;
  for (let i = 0; i < path.length; i++) {
    const [r, c] = path[i];
    if (grid[r] === undefined || grid[r][c] !== 0) return false;
    if (i && Math.abs(r - path[i - 1][0]) + Math.abs(c - path[i - 1][1]) !== 1) return false;
  }
  return true;
}

if (typeof module !== 'undefined') module.exports = {DIRS, rng, makeMaze, parseMaze, dfs, tracePath, validPath};
