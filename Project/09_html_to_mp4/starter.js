// starter.js: YOUR TURN. Write renderFrames() (about 12 lines).
//
// The idea: a screen recorder films the page while it runs in real time, so a slow laptop drops frames.
// We do the opposite: freeze time, take a photo, move time forward exactly 1 frame, take the next photo.
// The video comes out perfect even if each photo takes 2 seconds.
import { seekCssAnimations } from './common.js';

/**
 * @param page     Playwright page whose clock is paused at 0 (from openPage)
 * @param fps      frames per second, e.g. 30
 * @param seconds  video length, e.g. 8
 * @param onFrame  async (pngBuffer, frameIndex) => {}   call it once per frame, in order
 */
export async function renderFrames(page, { fps, seconds }, onFrame) {
  // TODO 1: total frames = fps * seconds (round it)
  // TODO 2: loop i = 0 .. total-1
  //   a) target time t = Math.round(i * 1000 / fps) ms
  //   b) move JS time forward to t:   await page.clock.runFor(t - previousT)   (skip if the difference is 0)
  //   c) freeze CSS at t:             await page.evaluate(seekCssAnimations, t)
  //   d) photo:                       const png = await page.screenshot({ type: 'png' })
  //   e) hand it over:                await onFrame(png, i)
}
