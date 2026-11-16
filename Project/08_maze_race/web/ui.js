// ============================================================================
//  Maze Race  ·  READY FILE (UI)  ·  @confuse__coder
//  Drawing, animation, game. Isko chhedne ki zaroorat nahi. Tumhara kaam starter.js mein hai.
// ============================================================================
(function () {
  const $ = (id) => document.getElementById(id);
  const L = $('left'), R = $('right');
  const C = {wall: '#1b1e2c', open: '#0b0d14', start: '#4bf2a7', end: '#ffb547', path: '#ffe14d', user: '#c792ff'};

  let size = 21, seed = 42, maze = null;
  let mode = 'idle'; // idle | race | play | edit
  let left = null, right = null; // {res, n, pk, kind}
  let userPath = [], playDone = false, raf = 0;

  // ---------- share link: #seed-size ----------
  function readHash() {
    const m = location.hash.match(/^#(\d+)-(\d+)$/);
    if (m) { seed = +m[1]; size = [15, 21, 31].includes(+m[2]) ? +m[2] : 21; }
    else seed = 1 + Math.floor(Math.random() * 9999);
  }

  function newMaze(keepSeed) {
    if (!keepSeed) seed = 1 + Math.floor(Math.random() * 9999);
    maze = makeMaze(size, size, seed);
    $('size').value = String(size);
    $('seed').textContent = 'Maze #' + seed;
    history.replaceState(null, '', location.pathname + location.search + '#' + seed + '-' + size);
    reset();
  }

  function reset() {
    cancelAnimationFrame(raf);
    left = right = null; userPath = []; playDone = false;
    ['lVis', 'rVis'].forEach((k) => ($(k).textContent = '0'));
    ['lPath', 'rPath'].forEach((k) => ($(k).textContent = '-'));
    hideOver();
    drawAll();
  }

  // ---------- run the algorithms safely ----------
  function runBfs() {
    if (typeof bfs !== 'function') return {err: '<code>bfs()</code> function hi nahi mila.'};
    let res;
    try { res = bfs(maze.grid.map((r) => r.slice()), maze.start.slice(), maze.end.slice()); }
    catch (e) { return {err: '<code>bfs()</code> mein error:<br><code>' + String(e.message || e) + '</code>'}; }
    if (!res || !Array.isArray(res.order) || res.order.length === 0)
      return {err: 'starter.js mein <code>bfs()</code> likho ✍️<br><small style="color:#8b90a8">abhi woh khaali return kar raha hai</small>'};
    if (!Array.isArray(res.path)) res.path = [];
    res.bad = res.path.length > 0 && !validPath(maze.grid, maze.start, maze.end, res.path);
    return res;
  }

  // ---------- drawing ----------
  function fit(cv) {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.round(cv.clientWidth * dpr);
    if (cv.width !== w) { cv.width = w; cv.height = w; }
    return w / size;
  }
  function mix(a, b, t) {
    const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16)), pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
    return 'rgb(' + pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(',') + ')';
  }
  function draw(cv, st) {
    const ctx = cv.getContext('2d');
    const k = fit(cv);
    const g = maze.grid;
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++) {
        ctx.fillStyle = g[r][c] ? C.wall : C.open;
        ctx.fillRect(c * k, r * k, k + 0.5, k + 0.5);
      }
    if (st && st.res && st.res.order) {
      const o = st.res.order, n = Math.min(st.n, o.length);
      const [a, b] = st.kind === 'bfs' ? ['#9ff0ff', '#0b4f8a'] : ['#ffb3c1', '#7a1028'];
      for (let i = 0; i < n; i++) {
        const [r, c] = o[i];
        ctx.fillStyle = mix(a, b, i / Math.max(1, o.length - 1));
        ctx.fillRect(c * k + 1, r * k + 1, k - 2, k - 2);
      }
      if (n < o.length && n > 0) { // glowing head
        const [r, c] = o[n - 1];
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(c * k + 1, r * k + 1, k - 2, k - 2);
      }
      if (st.pk > 0 && st.res.path.length) line(ctx, k, st.res.path.slice(0, Math.ceil(st.pk)), st.res.bad ? '#ff4d6d' : C.path, 0.42);
    }
    if (st && st.user && st.user.length) line(ctx, k, st.user, C.user, 0.42);
    cell(ctx, k, maze.start, C.start, 'S');
    cell(ctx, k, maze.end, C.end, 'E');
  }
  function line(ctx, k, pts, col, w) {
    ctx.strokeStyle = col; ctx.lineWidth = Math.max(2, k * w); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = col; ctx.shadowBlur = k * 0.6;
    ctx.beginPath();
    pts.forEach(([r, c], i) => (i ? ctx.lineTo : ctx.moveTo).call(ctx, c * k + k / 2, r * k + k / 2));
    ctx.stroke(); ctx.shadowBlur = 0;
  }
  function cell(ctx, k, [r, c], col, ch) {
    ctx.fillStyle = col; ctx.fillRect(c * k, r * k, k, k);
    ctx.fillStyle = '#07080c'; ctx.font = '800 ' + Math.floor(k * 0.7) + 'px system-ui'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(ch, c * k + k / 2, r * k + k / 2 + 1);
  }
  function drawAll() {
    draw(L, mode === 'play' ? {user: userPath} : left);
    draw(R, right);
  }

  function over(side, html) { const el = $(side + 'Over'); el.innerHTML = '<div>' + html + '</div>'; el.style.display = 'flex'; }
  function hideOver() { $('lOver').style.display = 'none'; $('rOver').style.display = 'none'; }
  const steps = (p) => (p && p.length ? p.length - 1 : null);

  // ---------- animation ----------
  function animate(onDone) {
    cancelAnimationFrame(raf);
    const sp = () => +$('speed').value;
    const tick = () => {
      let busy = false;
      for (const [st, vis, pth] of [[left, 'lVis', 'lPath'], [right, 'rVis', 'rPath']]) {
        if (!st || !st.res || !st.res.order) continue;
        const o = st.res.order;
        if (st.n < o.length) { st.n = Math.min(o.length, st.n + sp() * 0.5); busy = true; }
        else if (st.pk < st.res.path.length) { st.pk = Math.min(st.res.path.length, st.pk + sp() * 0.35 + 0.3); busy = true; }
        $(vis).textContent = String(Math.floor(Math.min(st.n, o.length)));
        if (st.n >= o.length) $(pth).textContent = st.res.path.length ? steps(st.res.path) + (st.res.bad ? ' ❌' : '') : 'no path';
      }
      drawAll();
      if (busy) raf = requestAnimationFrame(tick);
      else if (onDone) onDone();
    };
    raf = requestAnimationFrame(tick);
  }

  // ---------- modes ----------
  function setMode(m) {
    mode = m;
    $('playBtn').classList.toggle('on', m === 'play');
    $('editBtn').classList.toggle('on', m === 'edit');
    const play = m === 'play';
    $('lTitle').textContent = play ? 'TUM' : 'BFS · queue';
    $('lTitle').style.color = play ? C.user : 'var(--cyan)';
    $('lSub').textContent = play ? 'S se E tak raasta banao' : m === 'edit' ? 'click/drag = deewar' : 'lehar ki tarah';
    $('rTitle').textContent = play ? 'BFS' : 'DFS · stack';
    $('rTitle').style.color = play ? 'var(--cyan)' : 'var(--red)';
    $('rSub').textContent = play ? 'tumhare baad chalega' : 'ek raasta, gehra';
  }

  function race() {
    setMode('race');
    reset();
    const b = runBfs();
    left = b.err ? null : {res: b, n: 0, pk: 0, kind: 'bfs'};
    if (b.err) over('l', b.err);
    right = {res: dfs(maze.grid, maze.start, maze.end), n: 0, pk: 0, kind: 'dfs'};
    $('verdict').innerHTML = 'Race chal rahi hai…';
    animate(() => {
      const ds = steps(right.res.path);
      if (b.err) { $('verdict').innerHTML = '<span class="r">BFS abhi likha nahi.</span> DFS ka raasta: <b>' + (ds ?? 'none') + '</b> steps. starter.js kholo ✍️'; return; }
      const bs = steps(b.path);
      if (b.bad) $('verdict').innerHTML = '<span class="r">❌ BFS ka path galat hai</span> (deewar se guzra ya jump kiya). Test chalao: <code>node test.js</code>';
      else if (bs === null && ds === null) $('verdict').innerHTML = 'Koi raasta hi nahi! (Edit se kuch deewar hatao)';
      else if (bs === null) $('verdict').innerHTML = '<span class="r">BFS ko raasta nahi mila</span>, par DFS ko mila. bfs() check karo.';
      else if (bs < ds) $('verdict').innerHTML = 'BFS: <span class="g">' + bs + ' steps</span> · DFS: <span class="r">' + ds + ' steps</span> → <span class="g">BFS ne shortest dhoondha</span> (' + (ds - bs) + ' kam)';
      else if (bs === ds) $('verdict').innerHTML = 'Dono <span class="a">' + bs + ' steps</span>. Is baar DFS lucky raha, par guarantee nahi. 🔀 New maze: ~10 mein 8 baar BFS ka raasta chhota hoga.';
      else $('verdict').innerHTML = '<span class="r">DFS ka path chhota?!</span> Matlab bfs() mein queue ki jagah stack hai. pop → shift/head karo 😉';
    });
  }

  function startPlay() {
    setMode('play');
    reset();
    userPath = [maze.start.slice()];
    $('lVis').textContent = '-';
    $('verdict').innerHTML = '✍️ Left maze pe <span class="a">S</span> se <span class="a">E</span> tak raasta banao. Sabse chhota raasta = BFS ko harao (ya barabari).';
    drawAll();
  }

  function finishPlay() {
    playDone = true;
    if (window.innerWidth < 720) setTimeout(() => $('verdict').scrollIntoView({behavior: 'smooth', block: 'center'}), 300);
    const you = userPath.length - 1;
    const b = runBfs();
    if (b.err) { over('r', b.err); $('verdict').innerHTML = 'Tumhara raasta: <b>' + you + ' steps</b>. Ab bfs() likho taaki BFS se compare ho ✍️'; return; }
    right = {res: b, n: 0, pk: 0, kind: 'bfs'};
    $('lPath').textContent = String(you);
    $('verdict').innerHTML = 'Tum: <b>' + you + '</b> steps… ab BFS chal raha hai';
    animate(() => {
      const bs = steps(b.path);
      const key = 'mazerace-best-' + seed + '-' + size;
      let best = null;
      try { best = +localStorage.getItem(key) || null; if (!best || you < best) localStorage.setItem(key, String(you)); } catch (e) {}
      const bestTxt = best ? ' · tumhara best: ' + Math.min(best, you) : '';
      if (b.bad || bs === null) $('verdict').innerHTML = '<span class="r">BFS ka answer galat hai</span>, bfs() check karo.';
      else if (you === bs) $('verdict').innerHTML = '🎯 <span class="g">Barabar! ' + you + ' = ' + bs + '</span>. Tum BFS jitne smart ho!' + bestTxt;
      else $('verdict').innerHTML = 'Tum: <span class="r">' + you + '</span> · BFS: <span class="g">' + bs + '</span> → BFS jeeta 😏 (' + (you - bs) + ' extra steps). Dobara try: ✍️' + bestTxt;
    });
  }

  // ---------- pointer (draw path / edit walls) ----------
  let down = false, paint = 0;
  function cellAt(e) {
    const rect = L.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * size);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * size);
    return r >= 0 && r < size && c >= 0 && c < size ? [r, c] : null;
  }
  const same = (a, b) => a && b && a[0] === b[0] && a[1] === b[1];
  function onCell(p, first) {
    if (!p) return;
    if (mode === 'edit') {
      if (same(p, maze.start) || same(p, maze.end) || p[0] === 0 || p[1] === 0 || p[0] === size - 1 || p[1] === size - 1) return;
      if (first) paint = maze.grid[p[0]][p[1]] ? 0 : 1;
      if (maze.grid[p[0]][p[1]] !== paint) { maze.grid[p[0]][p[1]] = paint; left = right = null; drawAll(); }
      return;
    }
    if (mode === 'play' && !playDone) {
      const last = userPath[userPath.length - 1];
      if (same(p, last)) return;
      if (userPath.length > 1 && same(p, userPath[userPath.length - 2])) { userPath.pop(); drawAll(); return; }
      const adj = Math.abs(p[0] - last[0]) + Math.abs(p[1] - last[1]) === 1;
      if (!adj || maze.grid[p[0]][p[1]] || userPath.some((q) => same(q, p))) return;
      userPath.push(p);
      $('lPath').textContent = String(userPath.length - 1);
      drawAll();
      if (same(p, maze.end)) finishPlay();
    }
  }
  L.addEventListener('pointerdown', (e) => { down = true; L.setPointerCapture(e.pointerId); onCell(cellAt(e), true); });
  L.addEventListener('pointermove', (e) => { if (down) onCell(cellAt(e), false); });
  L.addEventListener('pointerup', () => (down = false));
  L.addEventListener('pointercancel', () => (down = false));

  // ---------- buttons ----------
  $('newBtn').onclick = () => { newMaze(false); if (mode === 'play') startPlay(); else { setMode('idle'); $('verdict').innerHTML = '▶ Race dabao: dekho kaun shortest raasta dhoondhta hai.'; } };
  $('raceBtn').onclick = race;
  $('playBtn').onclick = startPlay;
  $('editBtn').onclick = () => { if (mode === 'edit') { setMode('idle'); return; } setMode('edit'); reset(); $('verdict').innerHTML = '🧱 Left maze pe click/drag: deewar banao ya hatao. Phir ▶ Race.'; };
  $('size').onchange = (e) => { size = +e.target.value; newMaze(false); setMode('idle'); };
  window.addEventListener('resize', drawAll);

  $('using').textContent = window.USING;
  const sw = $('swap');
  sw.textContent = window.USING === 'starter.js' ? 'solution dekho' : 'apna starter chalao';
  sw.href = (window.USING === 'starter.js' ? '?solution' : location.pathname) + location.hash;
  sw.onclick = () => { sw.href = (window.USING === 'starter.js' ? '?solution' : location.pathname.split('/').pop() || 'index.html') + location.hash; };

  readHash();
  newMaze(true);
  setMode('idle');
})();
