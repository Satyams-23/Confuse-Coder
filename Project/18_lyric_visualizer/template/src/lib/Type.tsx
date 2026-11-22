/**
 * Typography AS the visual (not a caption): one giant key word, a spiral tunnel of the line, a word that
 * floods the screen. All theme-aware, all spring/eased, whole words only (Devanagari-safe).
 */
import React from 'react';
import {random, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, H, W} from './palette';
import {alpha, useTheme} from './theme';
import {beatPulse, drawProgress, drawStroke, ease, EASE, springIn} from './anim';

/** Giant key word: scales down from big + blurred + wide letter-spacing into place, glow flares on the hit, underline draws. */
export const BigWord: React.FC<{
  word: string;
  at: number; // frame the word hits (its timestamp)
  y: number; // vertical centre
  x?: number;
  size?: number;
  color?: string;
  font?: string;
  weight?: number;
  underline?: boolean;
  glow?: boolean;
  beats?: number[];
  exitAt?: number;
  rot?: number; // degrees (e.g. a shrug made with overshootRotate)
}> = ({word, at, y, x = 540, size = 220, color, font = FONT.serifBold, weight = 700, underline = true, glow = true, beats = [], exitAt, rot = 0}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = at - 4;
  if (frame < start) return null;
  const c = color ?? t.accent;
  const p = springIn(frame, fps, {delay: start, config: {damping: 11, stiffness: 120}});
  const blur = ease(frame, [start, start + 9], [18, 0], EASE.out);
  const spacing = ease(frame, [start, start + 14], [0.22, 0.01], EASE.out);
  const op = ease(frame, [start, start + 6], [0, 1], EASE.out);
  const flare = 1 - ease(frame, [at, at + 24], [0, 1], EASE.out);
  const pulse = beatPulse(frame, beats, 0.02, 10);
  const ex = exitAt !== undefined ? ease(frame, [exitAt, exitAt + 10], [0, 1], EASE.in) : 0;
  const ul = drawProgress(frame, at + 5, 14, EASE.out);
  return (
    <div
      style={{
        position: 'absolute', left: x - 520, width: 1040, top: y, transform: `translateY(-50%) rotate(${rot}deg) scale(${(1.35 - 0.35 * p) * pulse * (1 + 0.1 * ex)})`,
        textAlign: 'center', fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.05, color: c,
        letterSpacing: `${spacing}em`, opacity: op * (1 - ex), filter: blur > 0.3 ? `blur(${blur + ex * 10}px)` : undefined,
        textShadow: glow ? `0 0 ${20 + 40 * flare}px ${alpha(c, 0.35 + 0.4 * flare)}, 0 0 ${70 + 80 * flare}px ${alpha(c, 0.18 + 0.25 * flare)}` : undefined,
      }}
    >
      <span style={{position: 'relative', display: 'inline-block'}}>
        {word}
        {underline ? (
          <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{position: 'absolute', left: '-3%', width: '106%', bottom: -size * 0.04, height: size * 0.16, overflow: 'visible'}}>
            <path d="M4 15 C 40 7, 80 19, 120 11 S 180 9, 196 13" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" filter="url(#wobble)" style={drawStroke(ul, 215)} />
          </svg>
        ) : null}
      </span>
    </div>
  );
};

/** Archimedean spiral path from the outside in (so text read along it travels into the centre). */
export const spiralPath = (cx: number, cy: number, r0: number, r1: number, turns: number, steps = 420) => {
  let d = '';
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    const th = -Math.PI / 2 + u * turns * Math.PI * 2;
    const r = r1 + (r0 - r1) * u;
    d += `${k ? 'L' : 'M'} ${(cx + Math.cos(th) * r).toFixed(1)} ${(cy + Math.sin(th) * r).toFixed(1)} `;
  }
  return d;
};

/**
 * Spiral tunnel: the line repeated along a spiral, slides inward (startOffset eased), the spiral turns and
 * the camera falls into it. `highlight` words get the accent colour.
 */
export const SpiralText: React.FC<{
  text: string;
  highlight?: string[];
  start: number;
  dur: number;
  center?: [number, number];
  rOuter?: number;
  turns?: number;
  size?: number;
  id?: string;
  zoom?: [number, number];
  hole?: number; // empty radius in the middle (room for a BigWord)
}> = ({text, highlight = [], start, dur, center = [540, 900], rOuter = 760, turns = 6, size = 50, id = 'spiral', zoom: zr = [0.92, 1.12], hole}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const inner = hole ?? size * 2.2;
  const d = spiralPath(center[0], center[1], inner, rOuter, turns);
  const slide = ease(frame, [start, start + dur], [0, 9], EASE.inOut); // % offset grows → words travel along the spiral INTO the centre
  const rot = ease(frame, [start, start + dur], [-25, 35], EASE.soft);
  const zoom = ease(frame, [start, start + dur], zr, EASE.inOut);
  const op = ease(frame, [start, start + 8], [0, 1], EASE.out);
  const words = Array.from({length: 40}, () => text.split(' ')).flat();
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, opacity: op}}>
      <defs>
        <path id={id} d={d} />
        <radialGradient id={`${id}-fade`} cx={center[0]} cy={center[1]} r={rOuter} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#000" />
          <stop offset={`${Math.min(55, (inner / rOuter) * 100 - 2)}%`} stopColor="#000" />
          <stop offset={`${Math.min(60, (inner / rOuter) * 100 + 6)}%`} stopColor="#fff" />
          <stop offset="100%" stopColor="#fff" stopOpacity={0.5} />
        </radialGradient>
        <mask id={`${id}-m`}>
          <rect width={W} height={H} fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <g transform={`rotate(${rot} ${center[0]} ${center[1]}) translate(${center[0]} ${center[1]}) scale(${zoom}) translate(${-center[0]} ${-center[1]})`} mask={`url(#${id}-m)`}>
        <text fontFamily={FONT.serif} fontSize={size} fill={alpha(t.ink, 0.85)} letterSpacing={1}>
          <textPath href={`#${id}`} startOffset={`${slide}%`}>
            {words.map((w, k) => (
              <tspan key={k} fill={highlight.includes(w) ? t.accent : undefined}>
                {w + ' '}
              </tspan>
            ))}
          </textPath>
        </text>
      </g>
    </svg>
  );
};

/**
 * Word flood: the word repeats and pops in faster and faster until it fills the screen (overwhelm, echo,
 * "everyone is saying it"). Ends with one big accent copy at the centre on `heroAt`.
 */
export const WordFlood: React.FC<{word: string; start: number; end: number; count?: number; heroAt?: number; seed?: string; yMin?: number; yMax?: number}> = ({
  word, start, end, count = 34, heroAt, seed = 'flood', yMin = 300, yMax = 1540,
}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      {Array.from({length: count}, (_, k) => {
        const at = start + (end - start) * Math.pow(k / count, 0.62);
        if (frame < at) return null;
        const p = springIn(frame, fps, {delay: at, config: {damping: 12, stiffness: 200}});
        const size = 44 + random(`${seed}s${k}`) ** 2 * 170;
        const x = 70 + random(`${seed}x${k}`) * 940, y = yMin + random(`${seed}y${k}`) * (yMax - yMin);
        const rot = (random(`${seed}r${k}`) - 0.5) * 16;
        const dim = 0.35 + 0.65 * random(`${seed}o${k}`);
        return (
          <div key={k} style={{
            position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`,
            fontFamily: FONT.serifBold, fontWeight: 700, fontSize: size, color: alpha(t.ink, dim), whiteSpace: 'nowrap',
          }}>{word}</div>
        );
      })}
      {heroAt !== undefined ? <BigWord word={word} at={heroAt} y={960} size={260} /> : null}
    </>
  );
};
