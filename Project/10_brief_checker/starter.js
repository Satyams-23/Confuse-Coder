// starter.js: YOU write these two functions. Run `node test.js` to check them.

// check(clip, brief) → array of reason codes (see REASONS in common.js). Empty array = safe to post.
// For MISSING_TAG return the code with the tag, like 'MISSING_TAG #ad'.
//
// Rules, in this order:
//   1. brief.status === 'locked'                    → 'LOCKED'
//   2. clip.sourceId not in brief.sources           → 'NOT_A_CAMPAIGN_SOURCE'
//   3. clip.platform not in brief.platforms         → 'WRONG_PLATFORM'
//   4. clip.durationSec < brief.minSec              → 'TOO_SHORT'
//      clip.durationSec > brief.maxSec              → 'TOO_LONG'
//   5. height / width not 16/9 (allow 2% slack)     → 'NOT_VERTICAL'
//   6. every tag in brief.requiredTags must be in the caption as a WHOLE tag
//      (case doesn't matter: '#AD' counts, but '#adventure' does NOT)   → 'MISSING_TAG #ad'
//   7. brief.noWatermark && clip.watermark          → 'WATERMARK'
export function check(clip, brief) {
  const reasons = [];
  // TODO
  return reasons;
}

// earnings(views, brief) → dollars you'd earn for this many views, rounded to cents.
//   - locked campaign → 0
//   - views below brief.minViews → 0
//   - else views / 1000 * brief.cpm, but never more than brief.budgetLeft
export function earnings(views, brief) {
  // TODO
  return 0;
}
