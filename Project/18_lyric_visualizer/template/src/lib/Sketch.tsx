import React, {useMemo} from 'react';
import {getLength, interpolatePath} from '@remotion/paths';
import {C} from './palette';
import {drawStroke, jitter} from './anim';

/**
 * Hand-drawn path: main ink stroke that draws itself (stroke-dashoffset) + a second, offset, lighter
 * "sketch" pass, both through the boiling #wobble filters. progress 0..1.
 */
export const SketchPath: React.FC<{
  d: string;
  progress?: number;
  color?: string;
  width?: number;
  fill?: string;
  fillOpacity?: number;
  double?: boolean;
  seed?: number;
}> = ({d, progress = 1, color = C.ink, width = 7, fill = 'none', fillOpacity = 1, double = true, seed = 1}) => {
  const len = useMemo(() => {
    try {
      return getLength(d);
    } catch {
      return 2000;
    }
  }, [d]);
  const dx = jitter(seed, 3), dy = jitter(seed + 1, 3);
  return (
    <g>
      {fill !== 'none' && progress > 0.6 ? (
        <path d={d} fill={fill} opacity={fillOpacity * Math.min(1, (progress - 0.6) / 0.4)} stroke="none" filter="url(#wobble)" />
      ) : null}
      {double ? (
        <path
          d={d}
          fill="none"
          stroke={color}
          strokeOpacity={0.35}
          strokeWidth={width * 0.45}
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${dx} ${dy})`}
          filter="url(#wobble2)"
          style={drawStroke(Math.min(1, progress * 1.08), len)}
        />
      ) : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#wobble)"
        style={drawStroke(progress, len)}
      />
    </g>
  );
};

/** Wrap any SVG group to give it the boiling hand-drawn wobble. */
export const Sketchy: React.FC<{children: React.ReactNode; strong?: boolean}> = ({children, strong}) => (
  <g filter={strong ? 'url(#wobble2)' : 'url(#wobble)'}>{children}</g>
);

/** Shape → shape morph (paths should have similar structure for best results). */
export const morph = (progress: number, from: string, to: string) => interpolatePath(Math.min(1, Math.max(0, progress)), from, to);

/** Wobbly circle path (imperfect, hand-drawn). */
export const wobblyCircle = (cx: number, cy: number, r: number, seed = 1, points = 28, amp = 0.025) => {
  const pts: [number, number][] = [];
  for (let k = 0; k <= points; k++) {
    const a = (k / points) * Math.PI * 2;
    const rr = r * (1 + jitter(seed * 31 + (k % points), amp));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  // smooth with quadratic midpoints
  let d = `M ${(pts[0][0] + pts[1][0]) / 2} ${(pts[0][1] + pts[1][1]) / 2}`;
  for (let k = 1; k < pts.length - 1; k++) {
    const [x, y] = pts[k];
    const [nx, ny] = pts[k + 1];
    d += ` Q ${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`;
  }
  const [x1, y1] = pts[1];
  d += ` Q ${pts[0][0]} ${pts[0][1]} ${(pts[0][0] + x1) / 2} ${(pts[0][1] + y1) / 2}`;
  return d;
};

/** Hatching lines inside a rect (pencil shading). */
export const Hatch: React.FC<{x: number; y: number; w: number; h: number; gap?: number; opacity?: number; progress?: number}> = ({
  x, y, w, h, gap = 22, opacity = 0.18, progress = 1,
}) => {
  const lines = [];
  const n = Math.floor((w + h) / gap);
  for (let k = 0; k < n * progress; k++) {
    const o = k * gap;
    lines.push(<line key={k} x1={x + o} y1={y} x2={x + o - h} y2={y + h} stroke={C.ink} strokeWidth={2.2} strokeLinecap="round" />);
  }
  return (
    <g opacity={opacity} filter="url(#wobble)">
      <clipPath id={`hatch-${x}-${y}`}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#hatch-${x}-${y})`}>{lines}</g>
    </g>
  );
};
