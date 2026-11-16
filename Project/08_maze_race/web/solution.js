// Maze Race · SOLUTION · @confuse__coder
// (DIRS + tracePath core.js se aate hain: browser mein pehle load hota hai, test.js mein global)

function bfs(grid, start, end) {
  const R = grid.length, C = grid[0].length;
  const seen = Array.from({length: R}, () => Array(C).fill(false));
  const parent = {};
  const order = [];
  const q = [start];
  let head = 0;                       // queue: q[head++] = jo pehle aaya
  seen[start[0]][start[1]] = true;
  parent[start[0] + ',' + start[1]] = null;
  while (head < q.length) {
    const [r, c] = q[head++];         // q.pop() = stack = BUG
    order.push([r, c]);
    if (r === end[0] && c === end[1]) break;
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 0 && !seen[nr][nc]) {
        seen[nr][nc] = true;          // visited push karte waqt
        parent[nr + ',' + nc] = [r, c];
        q.push([nr, nc]);
      }
    }
  }
  return {order, path: tracePath(parent, end)};
}

if (typeof module !== 'undefined') module.exports = {bfs};
