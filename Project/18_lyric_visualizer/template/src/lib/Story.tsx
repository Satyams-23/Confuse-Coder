/**
 * Story mode: the picture tells the lyric literally (ghar → a house, neele rang → a wall being painted blue,
 * dua → a diya in cupped hands). Painted/illustrated scenes, things that GROW, zoom-through transitions,
 * small lyrics in a corner coloured from the scene.
 */
import React from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig} from 'remotion';
import {ease, EASE, jitter, springIn, SPRINGS} from './anim';
import {SceneWord} from './data';
import {FONT, H, SAFE, W} from './palette';
import {useTheme} from './theme';

type Pt = [number, number];

/* ---------------------------------------------------------------- paint reveal */

/** CSS mask (data-URL SVG) of brush strokes painting across the frame. progress 0..1. */
export const paintMask = (
  progress: number,
  o: {strokes?: number; dir?: 'down' | 'up' | 'right'; width?: number; seed?: number; box?: [number, number, number, number]} = {},
) => {
  const n = o.strokes ?? 7;
  const [bx, by, bw, bh] = o.box ?? [0, 0, W, H];
  const sw = o.width ?? (bh / n) * 1.55;
  const seed = o.seed ?? 1;
  let paths = '';
  for (let k = 0; k < n; k++) {
    const p = Math.min(1, Math.max(0, progress * n - k)); // strokes go one after another
    if (p <= 0) continue;
    const ltr = k % 2 === 0;
    const along = by + (bh * (k + 0.5)) / n;
    const y0 = along + jitter(seed + k * 3.7, 40), y1 = along + jitter(seed + k * 5.1, 40);
    const x0 = ltr ? bx - sw * 0.4 : bx + bw + sw * 0.4, x1 = ltr ? bx + bw + sw * 0.4 : bx - sw * 0.4;
    const cy = (y0 + y1) / 2 + jitter(seed + k * 9.3, 60);
    let d = `M${x0} ${y0} Q${(x0 + x1) / 2} ${cy} ${x1} ${y1}`;
    if (o.dir === 'right') {
      const ax = bx + (bw * (k + 0.5)) / n;
      const xa = ax + jitter(seed + k * 3.7, 30), xb = ax + jitter(seed + k * 5.1, 30);
      d = ltr ? `M${xa} ${by - sw * 0.4} Q${ax} ${by + bh / 2} ${xb} ${by + bh + sw * 0.4}` : `M${xb} ${by + bh + sw * 0.4} Q${ax} ${by + bh / 2} ${xa} ${by - sw * 0.4}`;
    }
    paths += `<path d="${d}" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="${(1 - p).toFixed(4)}" />`;
  }
  const flip = o.dir === 'up' ? `transform="translate(0 ${H}) scale(1 -1)"` : '';
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<filter id="b" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="${seed}"/>` +
    `<feDisplacementMap in="SourceGraphic" scale="70"/></filter>` +
    `<g filter="url(#b)" ${flip} fill="none" stroke="#fff" stroke-width="${sw.toFixed(0)}" stroke-linecap="round">${paths}</g></svg>`;
  const url = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
  return {WebkitMaskImage: url, maskImage: url, WebkitMaskSize: `${W}px ${H}px`, maskSize: `${W}px ${H}px`, WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat'} as React.CSSProperties;
};

/** Children appear as if painted on with a big brush (wall being painted, a colour flooding in). */
export const PaintReveal: React.FC<{
  start: number;
  dur: number;
  children: React.ReactNode;
  strokes?: number;
  dir?: 'down' | 'up' | 'right';
  box?: [number, number, number, number];
  seed?: number;
}> = ({start, dur, children, ...o}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [start, start + dur], [0, 1], EASE.inOut);
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  if (p <= 0) return null;
  return <AbsoluteFill style={paintMask(p, o)}>{children}</AbsoluteFill>;
};

/* ---------------------------------------------------------------- growth */

const lerpPts = (pts: Pt[], t: number): Pt => {
  const f = Math.min(0.9999, Math.max(0, t)) * (pts.length - 1);
  const i = Math.floor(f), r = f - i;
  return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
};

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
export const smoothPath = (pts: Pt[]) => {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
  }
  return d;
};

/** One flower: petals spring open with a twist, a darker centre. scale 0..1+. */
export const Flower: React.FC<{x: number; y: number; r: number; s: number; color: string; centre?: string; petals?: number; rot?: number}> = ({
  x, y, r, s, color, centre = '#F6C64A', petals = 5, rot = 0,
}) => {
  if (s <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + (1 - s) * -70}) scale(${s})`}>
      {Array.from({length: petals}, (_, k) => (
        <ellipse key={k} cx={0} cy={-r * 0.55} rx={r * 0.42} ry={r * 0.62} fill={color} stroke="rgba(0,0,0,0.18)" strokeWidth={1.5} transform={`rotate(${(360 / petals) * k})`} />
      ))}
      <ellipse cx={0} cy={-r * 0.3} rx={r * 0.16} ry={r * 0.32} fill="rgba(255,255,255,0.35)" transform={`rotate(${360 / petals / 2})`} />
      <circle r={r * 0.24} fill={centre} />
    </g>
  );
};

const Leaf: React.FC<{x: number; y: number; len: number; ang: number; s: number; color: string}> = ({x, y, len, ang, s, color}) =>
  s <= 0.001 ? null : (
    <g transform={`translate(${x} ${y}) rotate(${ang}) scale(${s})`}>
      <path d={`M0 0 Q${len * 0.5} ${-len * 0.32} ${len} 0 Q${len * 0.5} ${len * 0.32} 0 0Z`} fill={color} />
      <path d={`M0 0 L${len * 0.85} 0`} stroke="rgba(0,0,0,0.2)" strokeWidth={1.5} />
    </g>
  );

/**
 * A vine grows along `points`, leaves unfold and flowers bloom one by one (flowers spreading over a house,
 * a rose bush opening, a garland). Put it inside an <svg width=1080 height=1920>.
 */
export const Bloom: React.FC<{
  points: Pt[];
  start: number;
  dur: number;
  colors?: string[];
  leaf?: string;
  stem?: string;
  flowers?: number;
  size?: number;
  seed?: number;
}> = ({points, start, dur, colors = ['#E8457A', '#F06C9B', '#D63864'], leaf = '#4E8A4A', stem = '#3F6B3A', flowers = 9, size = 46, seed = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const grow = ease(frame, [start, start + dur], [0, 1], EASE.out);
  const d = smoothPath(points);
  const items: React.ReactNode[] = [];
  const leaves = flowers * 2;
  for (let k = 0; k < leaves; k++) {
    const t = (k + 0.5) / leaves;
    const [x, y] = lerpPts(points, t);
    const s = springIn(frame, fps, {delay: start + dur * t * 0.9, config: SPRINGS.soft});
    items.push(<Leaf key={`l${k}`} x={x} y={y} len={size * 0.9} ang={(k % 2 ? 1 : -1) * (40 + jitter(seed + k, 25)) - 90} s={s} color={leaf} />);
  }
  for (let k = 0; k < flowers; k++) {
    const t = (k + 0.8) / (flowers + 0.4);
    const [x, y] = lerpPts(points, t);
    const off: Pt = [jitter(seed * 3 + k * 1.7, size * 0.8), jitter(seed * 5 + k * 2.3, size * 0.8)];
    const s = springIn(frame, fps, {delay: start + dur * t + 4, config: SPRINGS.pop});
    const r = size * (0.75 + 0.5 * Math.abs(jitter(seed + k * 4.1, 1)));
    items.push(<Flower key={`f${k}`} x={x + off[0]} y={y + off[1]} r={r} s={s} color={colors[k % colors.length]} rot={jitter(seed + k, 40)} petals={k % 3 === 0 ? 6 : 5} />);
  }
  return (
    <g>
      <path d={d} pathLength={1} fill="none" stroke={stem} strokeWidth={size * 0.16} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - grow} />
      {items}
    </g>
  );
};

/* ---------------------------------------------------------------- magic trail */

/** A glowing sparkle ribbon flies from `from` to `to` along a curve (words leaving a mouth, a wish flying to someone). SVG. */
export const SparkTrail: React.FC<{from: Pt; to: Pt; bend?: number; start: number; dur: number; color?: string; count?: number}> = ({
  from, to, bend = -220, start, dur, color = '#FFE7A8', count = 26,
}) => {
  const frame = useCurrentFrame();
  const head = ease(frame, [start, start + dur], [0, 1], EASE.inOut);
  const fade = ease(frame, [start + dur, start + dur + 18], [1, 0], EASE.out);
  if (frame < start || fade <= 0) return null;
  const c: Pt = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + bend];
  const at = (t: number): Pt => [
    (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * c[0] + t * t * to[0],
    (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * c[1] + t * t * to[1],
  ];
  const ribbon: Pt[] = Array.from({length: 24}, (_, k) => at(Math.max(0, head - 0.35 + (0.35 * k) / 23)));
  const [hx, hy] = at(head);
  return (
    <g opacity={fade} filter="url(#glow)">
      <path d={smoothPath(ribbon)} fill="none" stroke={color} strokeWidth={6} strokeLinecap="round" opacity={0.75} />
      {Array.from({length: count}, (_, k) => {
        const t = head - (k / count) * 0.4;
        if (t < 0) return null;
        const [x, y] = at(t);
        const sp = 1 - k / count;
        return <circle key={k} cx={x + jitter(k * 2.9 + Math.floor(frame / 2), 26 * (1 - sp))} cy={y + jitter(k * 4.3 + Math.floor(frame / 2), 26 * (1 - sp))} r={2 + 5 * sp} fill={color} opacity={sp} />;
      })}
      <circle cx={hx} cy={hy} r={13} fill="#fff" />
    </g>
  );
};

/* ---------------------------------------------------------------- picture + words */

/** Full-bleed illustration/photo with a slow Ken Burns move toward `focus` (the thing the lyric names). */
export const StoryImage: React.FC<{src: string; dur: number; zoom?: [number, number]; focus?: Pt; style?: React.CSSProperties}> = ({
  src, dur, zoom = [1.04, 1.16], focus = [W / 2, H / 2], style,
}) => {
  const frame = useCurrentFrame();
  const z = ease(frame, [0, dur], zoom, EASE.soft);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img src={src} style={{width: W, height: H, objectFit: 'cover', transform: `scale(${z})`, transformOrigin: `${focus[0]}px ${focus[1]}px`, ...style}} />
    </AbsoluteFill>
  );
};

/**
 * Small lyric in a corner (the picture is the hero, the words whisper). Each word rises + unblurs at its
 * timestamp; the key word takes `accent`. Pick `color` from the scene (blue words on a blue house).
 */
export const CornerLyric: React.FC<{
  words: SceneWord[];
  corner?: 'tl' | 'tr' | 'bl' | 'br';
  color?: string;
  accent?: string;
  size?: number;
  font?: 'serif' | 'hand' | 'word';
  maxWidth?: number;
  shadow?: boolean;
}> = ({words, corner = 'tl', color, accent, size = 64, font = 'serif', maxWidth = 620, shadow = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const theme = useTheme();
  const top = corner[0] === 't';
  const left = corner[1] === 'l';
  return (
    <div
      style={{
        position: 'absolute',
        [top ? 'top' : 'bottom']: top ? SAFE.top + 30 : SAFE.bottom + 30,
        [left ? 'left' : 'right']: SAFE.side + 10,
        maxWidth,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: left ? 'flex-start' : 'flex-end',
        gap: `0 ${size * 0.28}px`,
        fontFamily: FONT[font],
        fontSize: size,
        lineHeight: 1.25,
        color: color ?? theme.ink,
        textShadow: shadow ? '0 2px 14px rgba(0,0,0,0.35)' : undefined,
      }}
    >
      {words.map((w, k) => {
        const s = springIn(frame, fps, {delay: w.sf, config: SPRINGS.soft});
        const blur = (1 - Math.min(1, s)) * 8;
        return (
          <span
            key={k}
            style={{
              display: 'inline-block',
              opacity: Math.min(1, s * 1.4),
              transform: `translateY(${(1 - s) * 24}px) scale(${w.key ? 1.18 : 1})`,
              transformOrigin: left ? 'left bottom' : 'right bottom',
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
              color: w.key ? accent ?? theme.accent : undefined,
              fontWeight: w.key ? 700 : 400,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};
