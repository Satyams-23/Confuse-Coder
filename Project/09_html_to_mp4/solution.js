// solution.js: one way to write renderFrames(). Try starter.js first!
import { seekCssAnimations } from './common.js';

export async function renderFrames(page, { fps, seconds }, onFrame) {
  const total = Math.round(fps * seconds);
  let prevT = 0;
  for (let i = 0; i < total; i++) {
    const t = Math.round((i * 1000) / fps);
    if (t > prevT) await page.clock.runFor(t - prevT);   // JS timers + rAF move exactly to t
    prevT = t;
    await page.evaluate(seekCssAnimations, t);           // CSS animations frozen at t
    const png = await page.screenshot({ type: 'png' });
    await onFrame(png, i);
  }
}
