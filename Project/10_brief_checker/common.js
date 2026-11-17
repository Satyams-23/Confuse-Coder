// common.js: ready-made helpers (you don't need to change this file).
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

export const loadJson = (path) => JSON.parse(readFileSync(path, 'utf8'));

// Reason codes that check() can return, with a short message for the CLI.
export const REASONS = {
  LOCKED: 'campaign locked: naye posts band',
  NOT_A_CAMPAIGN_SOURCE: 'ye video campaign mein hai hi nahi: ₹0 + copyright risk',
  WRONG_PLATFORM: 'is platform pe campaign nahi chalta',
  TOO_SHORT: 'clip brief se chhota hai',
  TOO_LONG: 'clip brief se lamba hai',
  NOT_VERTICAL: 'vertical (9:16) nahi hai',
  MISSING_TAG: 'disclosure tag missing',
  WATERMARK: 'watermark hai (free plan?)',
};

// Optional: fill durationSec / width / height from a real video file using ffprobe (if installed).
export function probe(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height:format=duration', '-of', 'json', file], { encoding: 'utf8' });
  if (r.error || r.status !== 0) throw new Error(`ffprobe failed for ${file} (is ffprobe installed?)`);
  const j = JSON.parse(r.stdout);
  return { width: j.streams[0].width, height: j.streams[0].height, durationSec: Math.round(Number(j.format.duration)) };
}

export const money = (usd) => `$${usd.toFixed(2)}`;
export const rupees = (usd, rate) => `₹${Math.round(usd * rate).toLocaleString('en-IN')}`;
