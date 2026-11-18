// common.js: the boring parts, ready for you. Open a page with frozen time, pipe PNGs into ffmpeg.
// You don't need to edit this file. Your job is renderFrames() in starter.js.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import ffmpegPath from 'ffmpeg-static';

// Opens the HTML file in headless Chrome with a FAKE clock that is paused at 0.
// While it is paused, setTimeout / setInterval / requestAnimationFrame / Date / performance.now
// do not move at all. They only move when you call page.clock.runFor(ms).
export async function openPage(htmlFile, { width = 1080, height = 1920 } = {}) {
  let browser;
  try {
    browser = await chromium.launch({ channel: 'chrome' });      // your installed Chrome
  } catch {
    browser = await chromium.launch();                           // or: npx playwright install chromium
  }
  const page = await browser.newPage({ viewport: { width, height } });
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(0);
  await page.goto(pathToFileURL(resolve(htmlFile)).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot();   // warm-up: the very first paint can differ, so throw it away
  return { browser, page };
}

// Starts ffmpeg. Write PNG buffers into it, call end() and you get an MP4 (H.264, plays on phones).
export function startEncoder(outFile, fps) {
  const ff = spawn(ffmpegPath, [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart',
    outFile,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, fail) => ff.on('close', code => code === 0 ? ok() : fail(new Error('ffmpeg exited ' + code))));
  return {
    write: buf => new Promise(ok => ff.stdin.write(buf) ? ok() : ff.stdin.once('drain', ok)),
    end: () => { ff.stdin.end(); return done; },
  };
}

// Runs INSIDE the page. Freezes every CSS animation / transition at time t (ms).
// Animations that appear later (a class added by setTimeout) start counting from the frame they were first seen.
export function seekCssAnimations(t) {
  window.__firstSeen ||= new WeakMap();
  for (const a of document.getAnimations()) {
    if (!window.__firstSeen.has(a)) window.__firstSeen.set(a, t);
    a.pause();
    a.currentTime = t - window.__firstSeen.get(a);
    const el = a.effect && a.effect.target;
    if (el) getComputedStyle(el).transform;   // force the browser to apply the new time before the photo
  }
  document.documentElement.getBoundingClientRect();
}
