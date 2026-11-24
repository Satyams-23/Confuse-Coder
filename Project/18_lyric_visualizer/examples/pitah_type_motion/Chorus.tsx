/**
 * Pitah chorus (after the emotional verse): ईश्वर अल्लाह जितने भी रब हैं / नूर तेरा तुझ में ही सब है, sung twice.
 * Same type + motion language as TypeScenes.tsx (no pictures).
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {ease as ease0, EASE, flareAt, H, SceneSlot, springIn, W} from '../lib';
import {wordFrame} from './World';

const ease: typeof ease0 = (f, [a, b], out, e) => ease0(f, [a, Math.max(a + 1, b)], out, e);
const KEY = '"Yatra One", "Mukta", sans-serif';
const BODY = '"Noto Serif Devanagari", "Tiro Devanagari Hindi", serif';
const SAFFRON = '#FFB935';
const UMBER = '#3A1608';
const CREAM = '#FFF3DC';
const w = (p: SceneSlot, prefix: string, fb: number) => wordFrame(p.line, prefix, fb);

/* ------------------------------------------------------------------ shared bits */

const Bg: React.FC<{kind: 'light' | 'dark' | 'night'}> = ({kind}) => (
  <AbsoluteFill
    style={{
      background:
        kind === 'night'
          ? 'radial-gradient(circle at 50% 50%, #3A2244 0%, #1A0F24 50%, #08050C 100%)'
          : kind === 'dark'
            ? 'radial-gradient(circle at 50% 50%, #4A1D0E 0%, #220C05 55%, #110503 100%)'
            : 'radial-gradient(circle at 50% 50%, #FFF4DE 0%, #F7DDAE 55%, #E9B977 100%)',
    }}
  />
);

const Rings: React.FC<{cy?: number; colors: [string, string]; step?: number; speed?: number; grow?: number}> = ({cy = H / 2, colors, step = 110, speed = 0.5, grow = 1}) => {
  const f = useCurrentFrame();
  const phase = ((f * speed) / step) % 1;
  const n = Math.ceil(1500 / step) + 2;
  const out = [];
  for (let k = n; k >= 0; k--) {
    const r = (k + phase) * step * grow;
    if (r > 0) out.push(<circle key={k} cx={W / 2} cy={cy} r={r} fill={colors[k % 2]} />);
  }
  return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>{out}</svg>;
};

const Petals: React.FC<{opacity: number}> = ({opacity}) => {
  const f = useCurrentFrame();
  const flower = (x: number, y: number, r: number, rot: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot + f * 0.15})`}>
      {Array.from({length: 8}, (_, i) => (
        <path key={i} transform={`rotate(${i * 45})`} d={`M0 0 C ${r * 0.35} ${-r * 0.35}, ${r * 0.3} ${-r * 0.85}, 0 ${-r} C ${-r * 0.3} ${-r * 0.85}, ${-r * 0.35} ${-r * 0.35}, 0 0 Z`} fill="#E39A4A" />
      ))}
    </g>
  );
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity}}>
      {flower(1010, 300, 230, 10)}
      {flower(60, 1620, 260, 30)}
      {flower(980, 1780, 150, 0)}
    </svg>
  );
};

const Stars: React.FC<{n?: number}> = ({n = 90}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: n}, (_, i) => {
        const x = ((noise2D('stx', i * 2.3, 0) + 1) / 2) * W;
        const y = ((noise2D('sty', i * 1.9, 0) + 1) / 2) * H;
        const tw = 0.4 + 0.6 * Math.abs(Math.sin(f / (14 + (i % 7) * 3) + i));
        return <circle key={i} cx={x} cy={y} r={1.5 + (i % 3)} fill="#FFF1D6" opacity={tw} />;
      })}
    </svg>
  );
};

const Bokeh: React.FC<{n?: number; seed: string}> = ({n = 20, seed}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={`bk${seed}`}>
          <stop offset="0%" stopColor="#FFC872" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#FFC872" stopOpacity={0} />
        </radialGradient>
      </defs>
      {Array.from({length: n}, (_, i) => {
        const x = ((noise2D(seed + 'x', i * 3.1, 0) + 1) / 2) * W + 40 * noise2D(seed, i, f / 160);
        const y = ((((noise2D(seed + 'y', i * 1.7, 0) + 1) / 2) * H - f * (0.4 + (i % 5) * 0.12) + H * 2) % (H + 200)) - 100;
        return <circle key={i} cx={x} cy={y} r={30 + (i % 6) * 22} fill={`url(#bk${seed})`} opacity={0.35 + 0.5 * (0.5 + 0.5 * Math.sin(f / 20 + i))} />;
      })}
    </svg>
  );
};

const Pop: React.FC<{
  text: string; at: number; y: number; x?: number; size: number; font?: 'key' | 'body'; color: string; glow?: string; stroke?: string;
  from?: 'blur' | 'up' | 'slam'; opacity?: number;
}> = ({text, at, y, x = W / 2, size, font = 'body', color, glow, stroke, from = 'blur', opacity = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = springIn(f, fps, {delay: at, config: from === 'slam' ? {damping: 12, stiffness: 140} : {damping: 20, stiffness: 55}});
  const p = Math.min(1, s);
  if (f < at - 1) return null;
  const tr = from === 'up' ? `translateY(${(1 - p) * 60}px)` : from === 'slam' ? `scale(${2.2 - 1.2 * s})` : `scale(${1 + (1 - p) * 0.25})`;
  const blur = (1 - p) * 18;
  return (
    <div
      style={{
        position: 'absolute', left: x - 1000, width: 2000, top: y - size * 0.62, textAlign: 'center',
        fontFamily: font === 'key' ? KEY : BODY, fontWeight: font === 'key' ? 400 : 800, fontSize: size, lineHeight: 1.2,
        color, opacity: Math.min(1, s * 1.5) * opacity, transform: tr, filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        WebkitTextStroke: stroke, paintOrder: 'stroke fill',
        textShadow: glow ? `0 0 ${size * 0.12}px ${glow}, 0 0 ${size * 0.35}px ${glow}` : undefined,
      }}
    >
      {text}
    </div>
  );
};

const Giant: React.FC<{text: string; at: number; y: number; size: number; color: string}> = ({text, at, y, size, color}) => {
  const f = useCurrentFrame();
  const t = ease(f, [at - 4, at + 40], [0, 1], EASE.out);
  if (t <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute', left: -600, width: W + 1200, top: y - size * 0.62, textAlign: 'center', fontFamily: KEY, fontSize: size, lineHeight: 1.2,
        color, opacity: t, transform: `scale(${1.25 - 0.25 * t})`, filter: t < 0.98 ? `blur(${(1 - t) * 20}px)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

const Flash: React.FC<{at: number; peak?: number}> = ({at, peak = 0.45}) => {
  const f = useCurrentFrame();
  const a = flareAt(f, at, peak, 26);
  return a > 0.01 ? <AbsoluteFill style={{background: `rgba(255,214,150,${a})`, mixBlendMode: 'screen'}} /> : null;
};

/** The names of god in one ring, slowly orbiting. */
const NAMES = ['रब', 'ईश्वर', 'अल्लाह', 'वाहेगुरु', 'प्रभु', 'ख़ुदा', 'भगवान', 'मौला'];
const Orbit: React.FC<{at: number; r: number; cy: number; ry?: number}> = ({at, r, cy, ry = r}) => {
  const f = useCurrentFrame();
  const t = ease(f, [at, at + 40], [0, 1], EASE.out);
  if (t <= 0) return null;
  return (
    <>
      {NAMES.map((nm, i) => {
        const a = (i / NAMES.length) * Math.PI * 2 + f * 0.006;
        const rr = r * (0.6 + 0.4 * t);
        return (
          <div
            key={i}
            style={{
              position: 'absolute', left: 540 + Math.cos(a) * rr - 200, top: cy + Math.sin(a) * rr * (ry / r) - 32, width: 400, textAlign: 'center',
              fontFamily: BODY, fontWeight: 800, fontSize: 54, color: 'rgba(255,220,160,0.6)', opacity: t, textShadow: '0 0 18px rgba(255,180,80,0.5)',
            }}
          >
            {nm}
          </div>
        );
      })}
    </>
  );
};

const Slab: React.FC<{text: string; x: number; y: number; at: number; turn: number}> = ({text, x, y, at, turn}) => {
  const f = useCurrentFrame();
  const t = ease(f, [at - 4, at + 26], [0, 1], EASE.out);
  if (t <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute', left: x - 230, top: y - 100, width: 460, height: 200, borderRadius: 16,
        background: 'linear-gradient(135deg, #F7D58A 0%, #C8913E 45%, #F2CC7C 60%, #A8722C 100%)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 0 0 5px rgba(120,70,20,0.5)',
        transform: `perspective(1100px) rotateY(${turn}deg) scale(${0.8 + 0.2 * t})`, opacity: Math.min(1, t * 1.4),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{fontFamily: KEY, fontSize: 120, color: '#5A3410', textShadow: '0 2px 0 rgba(255,235,180,0.7)', marginTop: 8}}>{text}</div>
    </div>
  );
};

/* ------------------------------------------------------------------ scenes */

/* 6 — ईश्वर अल्लाह जितने भी रब हैं: night sky; the two names glow left and right; रब in a halo, names orbiting */
export const C01: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const R = w(p, 'रब', 120);
  return (
    <AbsoluteFill>
      <Bg kind="night" />
      <Stars />
      <Rings cy={1090} colors={['rgba(255,190,90,0.12)', 'rgba(255,190,90,0.03)']} step={90} speed={0.4} grow={ease(f, [R - 10, R + 50], [0, 1], EASE.out)} />
      <Pop text="ईश्वर" at={w(p, 'ई', 4)} y={600} x={320} size={150} color={CREAM} glow="rgba(255,230,190,0.6)" />
      <Pop text="अल्लाह" at={w(p, 'अल', 30)} y={600} x={770} size={150} color="#FFD27A" glow="rgba(255,190,90,0.6)" />
      <Pop text="जितने भी" at={w(p, 'जि', 60)} y={740} size={92} color="#E8D6F0" from="up" />
      <Orbit at={R} r={400} ry={230} cy={1090} />
      <Pop text="रब" at={R} y={1090} x={500} size={300} font="key" color={SAFFRON} glow="rgba(255,170,40,0.75)" stroke={`7px ${UMBER}`} from="slam" />
      <Pop text="हैं" at={w(p, 'हैं', R + 12)} y={1120} x={720} size={110} color={CREAM} glow="rgba(255,220,170,0.5)" from="up" />
    </AbsoluteFill>
  );
};

/* 7 — नूर तेरा तुझ में ही सब है: a burst of light that gathers into one small glowing point (in you) */
export const C02: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const N = w(p, 'नू', 10);
  const T = w(p, 'तु', 60);
  const burst = ease(f, [N - 4, N + 30], [0, 1], EASE.out);
  const gather = ease(f, [T, T + 50], [0, 1], EASE.inOut);
  const r = 900 * burst * (1 - 0.88 * gather);
  return (
    <AbsoluteFill>
      <Bg kind="light" />
      <AbsoluteFill style={{background: `repeating-conic-gradient(from ${-f * 0.25}deg at 50% 52%, rgba(255,200,110,${0.4 * (1 - gather)}) 0deg 5deg, rgba(255,240,210,0) 5deg 14deg)`}} />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="noor">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
            <stop offset="35%" stopColor="#FFE6A8" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#FFB040" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={540} cy={1040} r={Math.max(1, r)} fill="url(#noor)" />
        <circle cx={540} cy={1040} r={60 + 10 * Math.sin(f / 9)} fill="none" stroke="#B5651D" strokeWidth={4} opacity={gather} />
        <circle cx={540} cy={1040} r={110 + 14 * Math.sin(f / 11)} fill="none" stroke="#B5651D" strokeWidth={2} opacity={gather * 0.6} />
      </svg>
      <Giant text="नूर" at={N} color="rgba(150,70,20,0.12)" size={640} y={640} />
      <Pop text="नूर" at={N} y={620} size={300} font="key" color="#FFFFFF" stroke="7px #B5651D" glow="rgba(255,200,90,0.9)" from="slam" />
      <Pop text="तेरा" at={w(p, 'ते', 20)} y={820} size={100} color={UMBER} from="up" />
      <Pop text="तुझ में ही" at={T} y={1260} size={100} color={UMBER} from="up" />
      <Pop text="सब है" at={w(p, 'सब', T + 40)} y={1400} size={120} color="#C4601A" from="up" />
    </AbsoluteFill>
  );
};

/* 8 — (repeat) ईश्वर अल्लाह जितने भी रब हैं: two brass slabs turn to face each other and merge into one रब */
export const C03: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const R = w(p, 'रब', 120);
  const merge = ease(f, [R - 24, R + 6], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill>
      <Bg kind="dark" />
      <Bokeh seed="c3" />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - merge, transform: `translateY(${merge * 40}px)`}}>
        <Slab text="ईश्वर" x={300 + 240 * merge} y={720} at={w(p, 'ई', 4)} turn={34 - 20 * merge} />
        <Slab text="अल्लाह" x={780 - 240 * merge} y={990} at={w(p, 'अल', 30)} turn={-34 + 20 * merge} />
      </div>
      <Pop text="जितने भी" at={w(p, 'जि', 60)} y={1230} size={96} color={CREAM} glow="rgba(255,220,170,0.4)" from="up" opacity={1 - merge * 0.7} />
      <Slab text="रब" x={540} y={880} at={R} turn={8 * Math.sin(f / 40)} />
      <Flash at={R} />
      <Pop text="हैं" at={w(p, 'हैं', R + 12)} y={1090} size={100} color={CREAM} from="up" />
    </AbsoluteFill>
  );
};

/* 9 — (repeat) नूर तेरा तुझ में ही सब है: the halo rings return; सब lands; the rings close into the dot of frame 1 (loop) */
export const C04: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const S = w(p, 'सब', 120);
  const end = p.dur;
  const close = ease(f, [end - 50, end - 4], [0, 1], EASE.in);
  const fadeText = ease(f, [end - 60, end - 30], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill>
      <Bg kind="light" />
      <Petals opacity={0.3 * (1 - close)} />
      <Rings colors={['#F9D9A0', '#FBE6BF']} grow={ease(f, [0, 50], [0.2, 1], EASE.out) * (1 - 0.98 * close)} />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - fadeText, filter: fadeText > 0.02 ? `blur(${fadeText * 14}px)` : undefined}}>
        <Pop text="नूर तेरा" at={w(p, 'नू', 6)} y={740} size={100} color={UMBER} from="up" />
        <Pop text="तुझ में ही" at={w(p, 'तु', 40)} y={880} size={100} color={UMBER} from="up" />
        <Giant text="सब" at={S} color="rgba(150,70,20,0.13)" size={700} y={1110} />
        <Pop text="सब" at={S} y={1100} size={330} font="key" color={SAFFRON} stroke={`8px ${UMBER}`} glow="rgba(255,170,40,0.7)" from="slam" />
        <Pop text="है" at={w(p, 'है', S + 12)} y={1330} size={110} color={UMBER} from="up" />
      </div>
      <Flash at={S} peak={0.35} />
    </AbsoluteFill>
  );
};
