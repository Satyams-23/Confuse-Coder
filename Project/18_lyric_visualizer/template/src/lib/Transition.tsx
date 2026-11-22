import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from './palette';
import {ease, EASE, jitter} from './anim';
import {TRANSITION_FRAMES} from './data';
import {useTheme} from './theme';

export type TransitionSpec =
  | {kind: 'cut'} // hard match-cut: shapes line up across the cut
  | {kind: 'iris'; at?: [number, number]; to?: [number, number]; r0?: number} // circle opens from a shared object (match-cut on a round object); `to` = where that object travels
  | {kind: 'ink'; at?: [number, number]} // wobbly ink blot spreads from a point
  | {kind: 'wipe'; dir?: 'left' | 'right' | 'up' | 'down'; edge?: boolean}; // hand-cut paper wipe with an ink edge

/** Wraps the INCOMING scene; reveals it over the outgoing one during the first TRANSITION_FRAMES. */
export const Transition: React.FC<{spec?: TransitionSpec; children: React.ReactNode; frames?: number}> = ({
  spec = {kind: 'wipe'},
  children,
  frames = TRANSITION_FRAMES,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  if (spec.kind === 'cut' || frame >= frames) return <AbsoluteFill>{children}</AbsoluteFill>;
  const t = ease(frame, [0, frames], [0, 1], EASE.inOut);

  if (spec.kind === 'iris' || spec.kind === 'ink') {
    const [x0, y0] = spec.at ?? [540, 960];
    const [x1, y1] = spec.kind === 'iris' && spec.to ? spec.to : [x0, y0];
    const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t;
    const r0 = spec.kind === 'iris' ? spec.r0 ?? 60 : 10;
    const r = r0 + (2300 - r0) * t;
    let clip: string;
    if (spec.kind === 'iris') clip = `circle(${r}px at ${x}px ${y}px)`;
    else {
      const pts = [];
      for (let k = 0; k < 40; k++) {
        const a = (k / 40) * Math.PI * 2;
        const rr = r * (1 + jitter(k * 7.3, 0.16) + 0.06 * Math.sin(a * 5 + 1));
        pts.push(`${(x + Math.cos(a) * rr).toFixed(1)}px ${(y + Math.sin(a) * rr).toFixed(1)}px`);
      }
      clip = `polygon(${pts.join(',')})`;
    }
    return <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>;
  }

  // wipe: jagged hand-torn edge sweeping across, with an ink line riding the edge
  const dir = spec.dir ?? 'right';
  const horiz = dir === 'left' || dir === 'right';
  const span = horiz ? W : H;
  const pos = -160 + (span + 320) * t;
  const n = 18;
  const edge: [number, number][] = [];
  for (let k = 0; k <= n; k++) {
    const along = ((horiz ? H : W) * k) / n;
    const off = jitter(k * 3.1, 40) + (horiz ? along * 0.12 : along * 0.08);
    edge.push(horiz ? [pos + off, along] : [along, pos + off]);
  }
  const flip = (p: [number, number]): [number, number] =>
    dir === 'left' ? [W - p[0], p[1]] : dir === 'up' ? [p[0], H - p[1]] : p;
  const e = edge.map(flip);
  const poly =
    horiz
      ? dir === 'right'
        ? [[-10, -10], ...e.map((p) => [p[0], p[1]]), [-10, H + 10]]
        : [[W + 10, -10], ...e, [W + 10, H + 10]]
      : dir === 'down'
        ? [[-10, -10], ...e, [W + 10, -10]]
        : [[-10, H + 10], ...e, [W + 10, H + 10]];
  const clip = `polygon(${poly.map((p) => `${p[0].toFixed(1)}px ${p[1].toFixed(1)}px`).join(',')})`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{clipPath: clip}}>{children}</AbsoluteFill>
      {spec.edge !== false ? (
        <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
          <polyline
            points={e.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke={theme.ink}
            strokeWidth={9}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#wobble2)"
          />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/** Wraps the OUTGOING scene: a small eased push-in during the overlap so the cut has follow-through. */
export const OutPush: React.FC<{dur: number; children: React.ReactNode; amount?: number; frames?: number}> = ({
  dur,
  children,
  amount = 0.05,
  frames = TRANSITION_FRAMES,
}) => {
  const frame = useCurrentFrame();
  const s = 1 + amount * ease(frame, [dur - frames, dur], [0, 1], EASE.in);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};
