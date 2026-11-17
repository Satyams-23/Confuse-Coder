// solution.js: one possible answer. Try starter.js yourself first!

export function check(clip, brief) {
  const reasons = [];
  if (brief.status === 'locked') reasons.push('LOCKED');
  if (!brief.sources.includes(clip.sourceId)) reasons.push('NOT_A_CAMPAIGN_SOURCE');
  if (!brief.platforms.includes(clip.platform)) reasons.push('WRONG_PLATFORM');
  if (clip.durationSec < brief.minSec) reasons.push('TOO_SHORT');
  if (clip.durationSec > brief.maxSec) reasons.push('TOO_LONG');
  if (Math.abs(clip.height / clip.width - 16 / 9) > (16 / 9) * 0.02) reasons.push('NOT_VERTICAL');

  // Whole tags only: split the caption into #words, compare lowercase.
  const tags = new Set((clip.caption.match(/#[\p{L}\p{N}_]+/gu) || []).map(t => t.toLowerCase()));
  for (const tag of brief.requiredTags) {
    if (!tags.has(tag.toLowerCase())) reasons.push(`MISSING_TAG ${tag}`);
  }

  if (brief.noWatermark && clip.watermark) reasons.push('WATERMARK');
  return reasons;
}

export function earnings(views, brief) {
  if (brief.status === 'locked' || views < brief.minViews) return 0;
  const usd = Math.min((views / 1000) * brief.cpm, brief.budgetLeft);
  return Math.round(usd * 100) / 100;
}
