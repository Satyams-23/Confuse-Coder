/**
 * Painted-shot kit (AI / illustrated stills as story scenes): the picture is cover-fitted to 1080x1920 and a
 * camera moves toward what the lyric names. Children are drawn in IMAGE pixel coordinates, inside the same
 * transform, so overlays (a carved nameplate, a flare on the sun, stars in the sky) stick to the picture.
 */
import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {ease, EASE, springIn, SPRINGS} from './anim';
import {H, W} from './palette';

type Pt = [number, number];

export type ShotCam = {
  z: [number, number]; // zoom start → end
  at: [Pt, Pt]; // focus point (IMAGE px) start → end: kept at screen `anchor`
  anchor?: Pt; // where on screen the focus sits (default centre)
  easing?: (t: number) => number;
  span?: [number, number]; // frames of the move (default whole scene)
};

/** Screen position of an image point for a given cover-fit + camera. */
export const PaintedShot: React.FC<{
  src: string;
  size: [number, number]; // image px
  dur: number;
  cam: ShotCam;
  grade?: string; // CSS filter (colour grade per shot)
  handheld?: number; // px of gentle drift
  children?: React.ReactNode; // in image px
  over?: React.ReactNode; // in screen px, above the picture (not moved by the camera)
  /** 2.5D: background (foreground filled in) + foreground cut-out (alpha) from a depth map. */
  layers?: {bg: string; fg: string; k?: number; drift?: [number, number]};
  fgChildren?: React.ReactNode; // image px overlays drawn ABOVE the foreground layer
}> = ({src, size, dur, cam, grade, handheld = 5, children, over, layers, fgChildren}) => {
  const frame = useCurrentFrame();
  const [iw, ih] = size;
  const cover = Math.max(W / iw, H / ih);
  const [s0, s1] = cam.span ?? [0, dur];
  const t = ease(frame, [s0, s1], [0, 1], cam.easing ?? EASE.soft);
  const z = cam.z[0] + (cam.z[1] - cam.z[0]) * t;
  const fx = cam.at[0][0] + (cam.at[1][0] - cam.at[0][0]) * t;
  const fy = cam.at[0][1] + (cam.at[1][1] - cam.at[0][1]) * t;
  const [ax, ay] = cam.anchor ?? [W / 2, H / 2];
  const S = cover * z;
  // keep the focus at the anchor, but never show past the picture's edges
  let tx = ax - fx * S;
  let ty = ay - fy * S;
  tx = Math.min(0, Math.max(W - iw * S, tx));
  ty = Math.min(0, Math.max(H - ih * S, ty));
  const hx = handheld * noise2D('hx', frame / 70, 0);
  const hy = handheld * noise2D('hy', 0, frame / 80);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#1a0f08'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: iw, height: ih, transformOrigin: '0 0', transform: `translate(${tx + hx}px, ${ty + hy}px) scale(${S})`}}>
        {layers ? (
          <>
            {/* background: slightly less zoom than the camera (it is far away) */}
            <div style={{position: 'absolute', inset: 0, transformOrigin: `${fx}px ${fy}px`, transform: `scale(${1 - 0.025 * (layers.k ?? 1) * t})`}}>
              <Img src={staticFile(layers.bg)} style={{width: iw, height: ih, display: 'block', filter: grade}} />
            </div>
            {children ? (
              <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{children}</svg>
            ) : null}
            {/* foreground: zooms more and drifts against the background = depth */}
            <div
              style={{
                position: 'absolute', inset: 0, transformOrigin: `${fx}px ${fy}px`,
                transform: `translate(${(layers.drift?.[0] ?? 22) * (layers.k ?? 1) * (t - 0.5) * 2}px, ${(layers.drift?.[1] ?? -10) * (layers.k ?? 1) * (t - 0.5) * 2}px) scale(${1 + 0.05 * (layers.k ?? 1) * t})`,
              }}
            >
              <Img src={staticFile(layers.fg)} style={{width: iw, height: ih, display: 'block', filter: grade}} />
              {fgChildren ? (
                <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>{fgChildren}</svg>
              ) : null}
            </div>
          </>
        ) : (
          <Img src={staticFile(src)} style={{width: iw, height: ih, display: 'block', filter: grade}} />
        )}
        {!layers && children ? (
          <svg width={iw} height={ih} viewBox={`0 0 ${iw} ${ih}`} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
            {children}
          </svg>
        ) : null}
      </div>
      {over}
    </AbsoluteFill>
  );
};

/* ---------------------------------------------------------------- overlays (image px, inside PaintedShot) */

/** Warm light bloom at a point (the sun, a lamp): breathes, flares on hits. */
export const LightBloom: React.FC<{at: Pt; r: number; color?: string; flare?: number; base?: number}> = ({at, r, color = '#FFE3A8', flare = 0, base = 0.35}) => {
  const frame = useCurrentFrame();
  const b = base + 0.05 * noise2D('bloom', frame / 40, 0) + flare;
  const id = `lb${Math.round(at[0])}_${Math.round(at[1])}`;
  return (
    <>
      <defs>
        <radialGradient id={id}>
          <stop offset="0%" stopColor={color} stopOpacity={Math.min(1, b)} />
          <stop offset="45%" stopColor={color} stopOpacity={Math.min(1, b * 0.35)} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={at[0]} cy={at[1]} r={r * (1 + flare * 0.5)} fill={`url(#${id})`} style={{mixBlendMode: 'screen'}} />
    </>
  );
};

/** Floating dust / pollen drifting up, glowing (image px box). */
export const Motes: React.FC<{box: [number, number, number, number]; n?: number; color?: string; boost?: number; seed?: string; size?: number}> = ({
  box, n = 40, color = '#FFE7B0', boost = 1, seed = 'm', size = 1,
}) => {
  const frame = useCurrentFrame();
  const [x0, y0, w, h] = box;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      {Array.from({length: n}, (_, k) => {
        const bx = x0 + random(`${seed}x${k}`) * w;
        const by = y0 + random(`${seed}y${k}`) * h;
        const x = bx + 30 * noise2D(`${seed}n${k}`, frame / 120, 0);
        const y = y0 + ((by - y0 - frame * (0.4 + random(`${seed}v${k}`) * 0.8) + h * 20) % h);
        const a = (0.25 + 0.75 * random(`${seed}a${k}`)) * boost * (0.6 + 0.4 * noise2D(`${seed}t${k}`, frame / 15, 0));
        return <circle key={k} cx={x} cy={y} r={(1.4 + random(`${seed}r${k}`) * 3) * size} fill={color} opacity={Math.max(0, Math.min(1, a))} />;
      })}
    </g>
  );
};

/** Stars that twinkle, extra ones pop in around `at`, a shooting star crosses on the hit. */
export const StarField: React.FC<{box: [number, number, number, number]; at: number; n?: number; shoot?: [Pt, Pt]}> = ({box, at, n = 60, shoot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const [x0, y0, w, h] = box;
  const sh = shoot ? ease(frame, [at - 2, at + 14], [0, 1], EASE.out) : 0;
  return (
    <g style={{mixBlendMode: 'screen'}}>
      {Array.from({length: n}, (_, k) => {
        const s = springIn(frame, fps, {delay: at - 12 + random(`sd${k}`) * 24, config: SPRINGS.pop});
        const tw = 0.55 + 0.45 * noise2D(`st${k}`, frame / 9, k);
        const r = (1.5 + random(`sr${k}`) * 3.5) * s;
        if (r < 0.05) return null;
        const x = x0 + random(`sx${k}`) * w, y = y0 + random(`sy${k}`) * h;
        return (
          <g key={k} opacity={tw}>
            <circle cx={x} cy={y} r={r * 2.6} fill="#FFF3D0" opacity={0.25} />
            <circle cx={x} cy={y} r={r} fill="#FFFBEA" />
          </g>
        );
      })}
      {shoot && sh > 0 && sh < 1 ? (
        <line
          x1={shoot[0][0] + (shoot[1][0] - shoot[0][0]) * Math.max(0, sh - 0.25)}
          y1={shoot[0][1] + (shoot[1][1] - shoot[0][1]) * Math.max(0, sh - 0.25)}
          x2={shoot[0][0] + (shoot[1][0] - shoot[0][0]) * sh}
          y2={shoot[0][1] + (shoot[1][1] - shoot[0][1]) * sh}
          stroke="#FFFBEA"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={1 - sh}
        />
      ) : null}
    </g>
  );
};

/** Drifting mist bands (image px). */
export const Mist: React.FC<{y: number; h: number; w: number; opacity?: number; color?: string}> = ({y, h, w, opacity = 0.35, color = '#E8E2E6'}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <defs>
        <filter id="mistF" x="-20%" y="-50%" width="140%" height="200%">
          <feTurbulence type="fractalNoise" baseFrequency="0.004 0.012" numOctaves={3} seed={4} />
          <feColorMatrix values={`0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -0.45`} />
          <feGaussianBlur stdDeviation={6} />
        </filter>
      </defs>
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${((frame * (0.6 + k * 0.5)) % w) - w * (k ? 0.3 : 0.6)} 0)`} opacity={opacity * (k ? 0.7 : 1)}>
          <rect x={-w} y={y + k * h * 0.3} width={w * 3} height={h} filter="url(#mistF)" fill={color} />
        </g>
      ))}
    </>
  );
};

/** Text carved onto a plate (image px): chars reveal left→right with a glint, engraved shading. */
export const PlateText: React.FC<{text: string; x: number; y: number; size: number; at: number; dur?: number; color?: string}> = ({text, x, y, size, at, dur = 12, color = '#5A3A10'}) => {
  const frame = useCurrentFrame();
  const p = ease(frame, [at, at + dur], [0, 1], EASE.out);
  if (p <= 0) return null;
  const glint = ease(frame, [at + dur - 2, at + dur + 14], [0, 1], EASE.inOut);
  const id = `pt${Math.round(x)}${Math.round(y)}`;
  return (
    <>
      <defs>
        <clipPath id={id}>
          <rect x={x - size * 2.2} y={y - size} width={size * 4.4 * p} height={size * 2} />
        </clipPath>
        <linearGradient id={`${id}g`} x1="0" x2="1">
          <stop offset={`${Math.max(0, glint * 100 - 12)}%`} stopColor="#fff" stopOpacity={0} />
          <stop offset={`${glint * 100}%`} stopColor="#fff" stopOpacity={0.85} />
          <stop offset={`${Math.min(100, glint * 100 + 12)}%`} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
      </defs>
      <g clipPath={`url(#${id})`} fontFamily='"Noto Serif Devanagari", "Tiro Devanagari Hindi", serif' fontWeight={700} fontSize={size} textAnchor="middle" dominantBaseline="middle">
        <text x={x} y={y + 2} fill="#FFF2C8" opacity={0.55}>{text}</text>
        <text x={x} y={y} fill={color}>{text}</text>
        {glint > 0 && glint < 1 ? <text x={x} y={y} fill={`url(#${id}g)`}>{text}</text> : null}
      </g>
    </>
  );
};

/** A dark shadow sweeping across (screen px, use in `over`). progress 0..1. */
export const ShadeSweep: React.FC<{p: number; strength?: number}> = ({p, strength = 0.38}) =>
  p <= 0 ? null : (
    <AbsoluteFill
      style={{
        background: `linear-gradient(100deg, rgba(25,12,5,${strength}) ${p * 120 - 40}%, rgba(25,12,5,0) ${p * 120}%)`,
        mixBlendMode: 'multiply',
      }}
    />
  );

/** Soft dark gradient at the bottom so cream lyrics read on any picture (screen px). */
export const LyricScrim: React.FC<{strength?: number}> = ({strength = 0.55}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(0,0,0,0) 58%, rgba(20,10,4,${strength}) 82%, rgba(20,10,4,${strength * 0.8}) 100%)`}} />
);

/** Warm light-leak wash on a hit (screen px). */
export const LightLeak: React.FC<{amount: number; x?: number; y?: number}> = ({amount, x = 70, y = 20}) =>
  amount <= 0.01 ? null : (
    <AbsoluteFill style={{background: `radial-gradient(circle at ${x}% ${y}%, rgba(255,214,140,${0.55 * amount}), rgba(255,170,80,${0.18 * amount}) 40%, rgba(0,0,0,0) 70%)`, mixBlendMode: 'screen'}} />
  );
