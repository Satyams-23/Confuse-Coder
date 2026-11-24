import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {H, W} from './palette';
import {ease, EASE, jitter} from './anim';
import {TRANSITION_FRAMES} from './data';
import {useTheme} from './theme';
import {paintMask} from './Story';

export type TransitionSpec =
  | {kind: 'cut'} // hard match-cut: shapes line up across the cut
  | {kind: 'iris'; at?: [number, number]; to?: [number, number]; r0?: number} // circle opens from a shared object (match-cut on a round object); `to` = where that object travels
  | {kind: 'ink'; at?: [number, number]} // wobbly ink blot spreads from a point
  | {kind: 'wipe'; dir?: 'left' | 'right' | 'up' | 'down'; edge?: boolean} // hand-cut paper wipe with an ink edge
  | {kind: 'zoom'; at: [number, number]; r0?: number} // zoom THROUGH an object (an eye's iris, a rose's centre, a window): old scene dives in, new scene grows out of it
  | {kind: 'paint'; dir?: 'down' | 'up' | 'right'; seed?: number} // new scene is painted on with big brush strokes
  | {kind: 'split'; panels?: number} // new scene arrives as horizontal panels sliding in from alternate sides
  | {kind: 'polaroid'; tilt?: number} // new scene flies in as a tilted photo print, then fills the frame
  | {kind: 'whip'; dir?: 'left' | 'right'}; // fast motion-blur whip pan

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

  if (spec.kind === 'split') {
    const n = spec.panels ?? 2;
    const h = H / n;
    return (
      <AbsoluteFill>
        {Array.from({length: n}, (_, k) => {
          const tk = ease(frame, [k * 2, frames - (n - 1 - k) * 1], [0, 1], EASE.out);
          const from = (k % 2 ? 1 : -1) * W * 1.05;
          return (
            <AbsoluteFill key={k} style={{clipPath: `inset(${k * h + (tk < 1 ? 5 : 0)}px 0 ${H - (k + 1) * h + (tk < 1 ? 5 : 0)}px 0)`}}>
              <AbsoluteFill style={{transform: `translateX(${from * (1 - tk)}px)`, filter: tk < 0.97 ? `blur(${(1 - tk) * 14}px)` : undefined}}>{children}</AbsoluteFill>
            </AbsoluteFill>
          );
        })}
      </AbsoluteFill>
    );
  }

  if (spec.kind === 'polaroid') {
    const tilt = spec.tilt ?? -7;
    const fly = ease(frame, [0, frames * 0.55], [0, 1], EASE.out);
    const grow = ease(frame, [frames * 0.55, frames], [0, 1], EASE.inOut);
    const s = 0.5 + 0.5 * grow;
    const rot = tilt * (1 - grow) + (1 - fly) * tilt * 2;
    const y = (1 - fly) * 900;
    const border = 26 * (1 - grow);
    return (
      <AbsoluteFill style={{background: `rgba(10,5,2,${0.55 * (1 - grow)})`}}>
        <AbsoluteFill
          style={{
            transform: `translateY(${y}px) rotate(${rot}deg) scale(${s})`,
            boxShadow: `0 0 0 ${border}px #F7F1E6, 0 ${border * 3}px 0 ${border}px #F7F1E6, 0 40px 80px rgba(0,0,0,${0.6 * (1 - grow)})`,
            overflow: 'hidden',
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  if (spec.kind === 'whip') {
    const sign = spec.dir === 'left' ? -1 : 1;
    const tw = ease(frame, [0, frames], [0, 1], EASE.out);
    return (
      <AbsoluteFill style={{transform: `translateX(${sign * W * (1 - tw)}px) scaleX(${1 + 0.25 * (1 - tw)})`, filter: tw < 0.97 ? `blur(${(1 - tw) * 30}px)` : undefined}}>
        {children}
      </AbsoluteFill>
    );
  }

  if (spec.kind === 'paint') return <AbsoluteFill style={paintMask(t, {dir: spec.dir, seed: spec.seed})}>{children}</AbsoluteFill>;

  if (spec.kind === 'zoom') {
    const [x, y] = spec.at;
    const r = (spec.r0 ?? 50) + 2300 * ease(frame, [0, frames], [0, 1], EASE.in);
    const s = 0.3 + 0.7 * ease(frame, [0, frames], [0, 1], EASE.out);
    return (
      <AbsoluteFill style={{clipPath: `circle(${r}px at ${x}px ${y}px)`}}>
        <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${x}px ${y}px`}}>{children}</AbsoluteFill>
      </AbsoluteFill>
    );
  }

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

/** Wraps the OUTGOING scene: a small eased push-in during the overlap so the cut has follow-through.
 *  If the NEXT transition is a zoom-through, the camera dives into that point instead. */
export const OutPush: React.FC<{dur: number; children: React.ReactNode; amount?: number; frames?: number; next?: TransitionSpec}> = ({
  dur,
  children,
  amount = 0.05,
  frames = TRANSITION_FRAMES,
  next,
}) => {
  const frame = useCurrentFrame();
  if (next?.kind === 'cut') return <AbsoluteFill>{children}</AbsoluteFill>; // same picture continues: no push
  if (next?.kind === 'zoom') {
    const z = 1 + 5 * ease(frame, [dur - frames - 6, dur], [0, 1], EASE.in);
    return <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${next.at[0]}px ${next.at[1]}px`}}>{children}</AbsoluteFill>;
  }
  if (next?.kind === 'whip') {
    const sign = next.dir === 'left' ? -1 : 1;
    const tw = ease(frame, [dur - frames, dur], [0, 1], EASE.in);
    return <AbsoluteFill style={{transform: `translateX(${-sign * W * 0.8 * tw}px)`, filter: tw > 0.03 ? `blur(${tw * 30}px)` : undefined}}>{children}</AbsoluteFill>;
  }
  const s = 1 + amount * ease(frame, [dur - frames, dur], [0, 1], EASE.in);
  return <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>;
};
