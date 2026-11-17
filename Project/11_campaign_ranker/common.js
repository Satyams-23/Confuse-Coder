// common.js: ready-made helpers (you don't need to change this file).
import { readFileSync } from 'node:fs';

export const loadJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
export const money = (usd) => `$${usd.toFixed(2)}`;
export const rupees = (usd, rate) => `₹${Math.round(usd * rate).toLocaleString('en-IN')}`;
export const num = (n) => Math.round(n).toLocaleString('en-IN');
export const pct = (share) => `${Math.round(share * 100)}%`;
