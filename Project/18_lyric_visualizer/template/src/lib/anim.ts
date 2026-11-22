/**
 * Shared motion library. RULE: no linear motion. Everything here is spring() or an Easing curve.
 * Scenes must build motion from these helpers (add new ones here, with a name, not inline).
 */
import {Easing, interpolate, spring, SpringConfig} from 'remotion';

type EasingFn = (t: number) => number;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const EASE = {
  out: Easing.out(Easing.cubic),
  in: Easing.in(Easing.cubic),
  inOut: Easing.inOut(Easing.cubic),
  soft: Easing.inOut(Easing.sin),
  snap: Easing.bezier(0.2, 0.9, 0.1, 1),
  back: Easing.out(Easing.back(1.8)), // overshoot then settle
  fall: Easing.in(Easing.quad),
  rise: Easing.out(Easing.quad),
};

export const SPRINGS = {
  pop: {damping: 11, stiffness: 170, mass: 0.9} as Partial<SpringConfig>, // overshoot + settle
  soft: {damping: 18, stiffness: 90} as Partial<SpringConfig>,
  wobbly: {damping: 7, stiffness: 120} as Partial<SpringConfig>,
  firm: {damping: 20, stiffness: 220} as Partial<SpringConfig>,
};

/** Timed value with a REQUIRED easing curve (clamped). */
export const ease = (frame: number, range: [number, number], out: [number, number], easing: EasingFn = EASE.inOut) =>
  interpolate(frame, range, out, {...clamp, easing});

/** Multi-key timed value; every segment uses the given easing. */
export const keys = (frame: number, input: number[], output: number[], easing: EasingFn = EASE.inOut) =>
  interpolate(frame, input, output, {...clamp, easing});

/** 0 → 1 with overshoot + settle. */
export const springIn = (frame: number, fps: number, opts: {delay?: number; config?: Partial<SpringConfig>; durationInFrames?: number} = {}) =>
  spring({frame: frame - (opts.delay ?? 0), fps, config: opts.config ?? SPRINGS.pop, durationInFrames: opts.durationInFrames});

/** stroke-dashoffset line drawing. progress 0..1. */
export const drawStroke = (progress: number, length: number) => ({
  strokeDasharray: `${length} ${length}`,
  strokeDashoffset: length * (1 - Math.min(1, Math.max(0, progress))),
});

/** Eased draw progress between two frames. */
export const drawProgress = (frame: number, start: number, dur: number, easing: EasingFn = EASE.inOut) =>
  ease(frame, [start, start + dur], [0, 1], easing);

/** Small punch-in at atFrame: 1 → ~1.14 → settles to 1. */
export const punchWord = (frame: number, fps: number, atFrame: number, amount = 0.14) => {
  if (frame < atFrame) return 1;
  const up = ease(frame, [atFrame, atFrame + 3], [0, 1], EASE.rise);
  const down = spring({frame: frame - atFrame - 3, fps, config: {damping: 9, stiffness: 160}});
  return 1 + amount * up * (1 - down);
};

/** Slow continuous camera: zoom + pan over the scene, soft in-out. */
export const cameraDrift = (
  frame: number,
  dur: number,
  o: {zoom?: [number, number]; x?: [number, number]; y?: [number, number]; rot?: [number, number]} = {},
) => {
  const t = ease(frame, [0, Math.max(1, dur)], [0, 1], EASE.soft);
  const lerp = (r: [number, number] | undefined, d: number) => (r ? r[0] + (r[1] - r[0]) * t : d);
  return {z: lerp(o.zoom ?? [1, 1.07], 1), x: lerp(o.x, 0), y: lerp(o.y, 0), rot: lerp(o.rot, 0)};
};

/**
 * Anticipation → fall → bounce → bounce → settle (+ squash on impacts).
 * Returns y offset (0 = resting on the surface, negative = above) and squash scaleY.
 * impact = frame the object FIRST touches the surface (put it on a beat / word).
 */
export const dropBounce = (frame: number, fps: number, impact: number, o: {height?: number; fall?: number} = {}) => {
  const h = o.height ?? 700;
  const fall = o.fall ?? 14;
  const a0 = impact - fall - 7; // anticipation start
  const f0 = impact - fall;
  let y: number;
  if (frame < f0) y = -h - ease(frame, [a0, f0], [0, h * 0.05], EASE.rise); // small lift before the fall
  else if (frame < impact) y = ease(frame, [f0, impact], [-h * 1.05, 0], EASE.fall);
  else {
    const b1 = h * 0.2, b2 = h * 0.06, d1 = 6, d2 = 4;
    y = keys(
      frame,
      [impact, impact + d1, impact + d1 * 2, impact + d1 * 2 + d2, impact + d1 * 2 + d2 * 2],
      [0, -b1, 0, -b2, 0],
      EASE.soft,
    );
  }
  // squash on each impact, springs back
  const hit = (f: number) => (frame >= f ? 1 - spring({frame: frame - f, fps, config: {damping: 10, stiffness: 260}}) : 0);
  const squash = 1 - 0.22 * hit(impact) - 0.1 * hit(impact + 12) - 0.04 * hit(impact + 20);
  return {y, squash, landed: frame >= impact};
};

/** Rotate with anticipation (small pull back), then spring overshoot to target and settle. Degrees. */
export const overshootRotate = (frame: number, fps: number, at: number, from: number, to: number, cfg: Partial<SpringConfig> = SPRINGS.wobbly) => {
  const back = (to - from) * -0.06;
  if (frame < at - 4) return from;
  if (frame < at) return from + ease(frame, [at - 4, at], [0, back], EASE.rise);
  const s = spring({frame: frame - at, fps, config: cfg});
  return from + back + (to - from - back) * s;
};

/** Subtle pulse that hits on every beat (beats in scene-relative frames). */
export const beatPulse = (frame: number, beats: number[], amount = 0.025, decay = 9) => {
  let last = -1e9;
  for (const b of beats) if (b <= frame) last = b; else break;
  const t = frame - last;
  if (t > decay) return 1;
  return 1 + amount * (1 - EASE.out(t / decay));
};

/** Nearest beat (scene frames) to a target frame within a window — snap motion hits onto the music. */
export const snapToBeat = (target: number, beats: number[], window = 5) => {
  let best = target, bd = window + 1;
  for (const b of beats) {
    const d = Math.abs(b - target);
    if (d < bd) { bd = d; best = b; }
  }
  return bd <= window ? best : target;
};

/** Deterministic hand-made jitter (for sketchy, imperfect shapes). */
export const jitter = (seed: number, amp = 1) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return (x - Math.floor(x) - 0.5) * 2 * amp;
};
