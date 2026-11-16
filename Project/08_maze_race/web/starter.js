// ============================================================================
//  Maze Race  ·  STARTER  ·  @confuse__coder
//
//  Kaam: bfs(grid, start, end) likho (~20 lines). Reel wala BFS, bas graph ki jagah maze.
//    grid[r][c] = 1 deewar, 0 khula.  start/end = [r, c].
//    Har khule cell ke padosi = upar/neeche/left/right (DIRS core.js mein hai).
//
//  return {order, path}
//    order = cells jis order mein queue se nikle (start pehla). Isse lehar ka animation banta hai.
//    path  = [start, ..., end] sabse chhota raasta. Raasta na ho toh [].
//
//  Yaad rakho (reel):
//    - QUEUE: jo pehle aaya, woh pehle niklega. JS mein: array + `head` index (q[head++]).
//      q.pop() lagaya toh stack ban jaayega = DFS (bug!).
//    - visited push karte waqt mark karo.
//    - parent rakho, phir tracePath(parent, end) se raasta (core.js mein ready hai).
//      parent ka format: parent["r,c"] = [pr, pc], start ka null.
//
//  Check: index.html browser mein kholo, ▶ Race.   Tests: node test.js
// ============================================================================

function bfs(grid, start, end) {
  // TODO: yahan likho
  return {order: [], path: []};
}

if (typeof module !== 'undefined') module.exports = {bfs};
