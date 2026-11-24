/**
 * Pitah, emotional verse: TYPE + MOTION only (no pictures, no people).
 * Refs: giant tone-on-tone word behind a small front word, ring tunnels, corner petals (pink-heart reel);
 * glowing diagonal word stacks with motion-blur entrances, a 3D slab (glow-text reel).
 * Father palette: cream-gold light scenes alternate with deep umber dark scenes; saffron glow is the accent.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {ease as ease0, EASE, flareAt, H, SceneSlot, springIn, W} from '../lib';

/** ease that tolerates a collapsed range (short scenes) */
const ease: typeof ease0 = (f, [a, b], out, e) => ease0(f, [a, Math.max(a + 1, b)], out, e);
import {wordFrame} from './World';

const KEY = '"Yatra One", "Mukta", sans-serif';
const BODY = '"Noto Serif Devanagari", "Tiro Devanagari Hindi", serif';
const SAFFRON = '#FFB935';
const UMBER = '#3A1608';
const CREAM = '#FFF3DC';

/* ------------------------------------------------------------------ backgrounds */

const Bg: React.FC<{dark?: boolean; black?: boolean}> = ({dark, black}) => (
  <AbsoluteFill
    style={{
      background: black
        ? 'radial-gradient(circle at 50% 72%, #2A140A 0%, #0C0503 55%, #050201 100%)'
        : dark
          ? 'radial-gradient(circle at 50% 50%, #4A1D0E 0%, #220C05 55%, #110503 100%)'
          : 'radial-gradient(circle at 50% 50%, #FFF4DE 0%, #F7DDAE 55%, #E9B977 100%)',
    }}
  />
);

/** Concentric discs that keep flowing outward (a halo tunnel). grow 0..1 = opening from a dot. */
const Rings: React.FC<{cx?: number; cy?: number; colors: [string, string]; step?: number; speed?: number; grow?: number; opacity?: number}> = ({
  cx = W / 2, cy = H / 2, colors, step = 110, speed = 0.6, grow = 1, opacity = 1,
}) => {
  const f = useCurrentFrame();
  const phase = ((f * speed) / step) % 1;
  const n = Math.ceil(1500 / step) + 2;
  const rings = [];
  for (let k = n; k >= 0; k--) {
    const r = (k + phase) * step * grow;
    if (r <= 0) continue;
    rings.push(<circle key={k} cx={cx} cy={cy} r={r} fill={colors[k % 2]} />);
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity}}>
      {rings}
    </svg>
  );
};

/** Corner lotus petals, slowly turning (ref: corner flowers). */
const Petals: React.FC<{color: string; opacity?: number}> = ({color, opacity = 0.35}) => {
  const f = useCurrentFrame();
  const flower = (x: number, y: number, r: number, rot: number, key: string) => (
    <g key={key} transform={`translate(${x} ${y}) rotate(${rot + f * 0.15})`}>
      {Array.from({length: 8}, (_, i) => (
        <path key={i} transform={`rotate(${i * 45})`} d={`M0 0 C ${r * 0.35} ${-r * 0.35}, ${r * 0.3} ${-r * 0.85}, 0 ${-r} C ${-r * 0.3} ${-r * 0.85}, ${-r * 0.35} ${-r * 0.35}, 0 0 Z`} fill={color} />
      ))}
    </g>
  );
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0, opacity}}>
      {flower(1010, 300, 230, 10, 'a')}
      {flower(60, 1620, 260, 30, 'b')}
      {flower(980, 1780, 150, 0, 'c')}
    </svg>
  );
};

/** Soft drifting light circles (dark scenes). */
const Bokeh: React.FC<{n?: number; color?: string; seed?: string}> = ({n = 26, color = '#FFC872', seed = 'b'}) => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id={`bk${seed}`}>
          <stop offset="0%" stopColor={color} stopOpacity={0.55} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      {Array.from({length: n}, (_, i) => {
        const x = ((noise2D(seed + 'x', i * 3.1, 0) + 1) / 2) * W + 40 * noise2D(seed, i, f / 160);
        const y = (((noise2D(seed + 'y', i * 1.7, 0) + 1) / 2) * H - f * (0.4 + (i % 5) * 0.12) + H * 2) % (H + 200) - 100;
        const r = 30 + (i % 6) * 22;
        const tw = 0.5 + 0.5 * Math.sin(f / 20 + i);
        return <circle key={i} cx={x} cy={y} r={r} fill={`url(#bk${seed})`} opacity={0.35 + 0.5 * tw} />;
      })}
    </svg>
  );
};

/** Little 4-point star that twinkles at the top (ref detail). */
const Twinkle: React.FC<{x?: number; y?: number; color?: string}> = ({x = 540, y = 330, color = CREAM}) => {
  const f = useCurrentFrame();
  const s = 1 + 0.25 * Math.sin(f / 8);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <path transform={`translate(${x} ${y}) scale(${s})`} d="M0 -22 L5 -5 L22 0 L5 5 L0 22 L-5 5 L-22 0 L-5 -5 Z" fill={color} style={{filter: `drop-shadow(0 0 10px ${color})`}} />
    </svg>
  );
};

/* ------------------------------------------------------------------ type */

type From = 'blur' | 'right' | 'up' | 'slam';
const Pop: React.FC<{
  text: string;
  at: number;
  y: number;
  x?: number; // centre x (default middle)
  size: number;
  font?: 'key' | 'body';
  color: string;
  glow?: string;
  stroke?: string;
  from?: From;
  rotate?: number;
  defocusAt?: number; // goes out of focus from this frame
  opacity?: number;
}> = ({text, at, y, x = W / 2, size, font = 'body', color, glow, stroke, from = 'blur', rotate = 0, defocusAt, opacity = 1}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cfg = from === 'slam' ? {damping: 12, stiffness: 140} : {damping: 20, stiffness: 55};
  const s = springIn(f, fps, {delay: at, config: cfg});
  const p = Math.min(1, s);
  if (f < at - 1) return null;
  const tr =
    from === 'right' ? `translateX(${(1 - p) * 260}px) scaleX(${1 + (1 - p) * 0.4})`
      : from === 'up' ? `translateY(${(1 - p) * 60}px)`
        : from === 'slam' ? `scale(${2.2 - 1.2 * s})`
          : `scale(${1 + (1 - p) * 0.25})`;
  const defocus = defocusAt !== undefined ? ease(f, [defocusAt, defocusAt + 40], [0, 1], EASE.inOut) : 0;
  const blur = (1 - p) * (from === 'right' ? 26 : 18) + defocus * 14;
  return (
    <div
      style={{
        position: 'absolute', left: x - 1000, width: 2000, top: y - size * 0.62, textAlign: 'center',
        fontFamily: font === 'key' ? KEY : BODY, fontWeight: font === 'key' ? 400 : 800, fontSize: size, lineHeight: 1.2,
        color, opacity: Math.min(1, s * 1.5) * (1 - defocus * 0.55) * opacity,
        transform: `rotate(${rotate}deg) ${tr}`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        WebkitTextStroke: stroke, paintOrder: 'stroke fill',
        textShadow: glow ? `0 0 ${size * 0.12}px ${glow}, 0 0 ${size * 0.35}px ${glow}` : undefined,
      }}
    >
      {text}
    </div>
  );
};

/** Huge tone-on-tone word behind everything (ref: KAALI). Slowly settles. */
const Giant: React.FC<{text: string; at: number; y?: number; size?: number; color: string; outline?: boolean}> = ({text, at, y = 960, size = 520, color, outline}) => {
  const f = useCurrentFrame();
  const t = ease(f, [at - 4, at + 40], [0, 1], EASE.out);
  if (t <= 0) return null;
  return (
    <div
      style={{
        position: 'absolute', left: -600, width: W + 1200, top: y - size * 0.62, textAlign: 'center',
        fontFamily: KEY, fontSize: size, lineHeight: 1.2, opacity: t,
        color: outline ? 'transparent' : color, WebkitTextStroke: outline ? `4px ${color}` : undefined,
        transform: `scale(${1.25 - 0.25 * t + 0.03 * ease(f, [at, at + 200], [0, 1], EASE.soft)})`,
        filter: t < 0.98 ? `blur(${(1 - t) * 20}px)` : undefined,
      }}
    >
      {text}
    </div>
  );
};

const w = (p: SceneSlot, prefix: string, fb: number) => wordFrame(p.line, prefix, fb);

/* ------------------------------------------------------------------ scenes */

/* 1 — पिता का मोल है क्या: a dot opens into a halo tunnel; मोल huge behind, saffron in front */
export const T01: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const grow = ease(f, [0, 70], [0.02, 1], EASE.out);
  const K = w(p, 'मो', 30);
  return (
    <AbsoluteFill>
      <Bg />
      <Rings colors={['#F9D9A0', '#FBE6BF']} grow={grow} speed={0.5} />
      <Petals color="#E39A4A" opacity={ease(f, [20, 70], [0, 0.32], EASE.soft)} />
      <Twinkle color="#C9762A" />
      <Giant text="मोल" at={K} color="rgba(150,70,20,0.13)" size={640} />
      <Pop text="पिता का" at={w(p, 'पि', 10)} y={800} size={92} color={UMBER} />
      <Pop text="मोल" at={K} y={980} size={250} font="key" color={SAFFRON} stroke={`6px ${UMBER}`} glow="rgba(255,170,40,0.55)" from="slam" />
      <Pop text="है क्या ?" at={w(p, 'है', 60)} y={1180} size={92} color={UMBER} from="up" />
    </AbsoluteFill>
  );
};

/* 2 — पास रह के जाना नहीं: dark, warm bokeh; a diagonal glow stack; नहीं slips out of focus (never understood) */
export const T02: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const drift = ease(f, [0, p.dur], [0, 1], EASE.soft);
  const N = w(p, 'नह', 90);
  return (
    <AbsoluteFill>
      <Bg dark />
      <Bokeh seed="b2" />
      <AbsoluteFill style={{transform: `perspective(1400px) rotateY(${-10 + 14 * drift}deg) rotateZ(-8deg) translateY(${-30 * drift}px)`}}>
        <Pop text="पास" at={w(p, 'पा', 6)} y={650} x={420} size={150} color={CREAM} glow="rgba(255,235,200,0.6)" from="right" />
        <Pop text="रह के" at={w(p, 'रह', 26)} y={820} x={560} size={130} color="#FFC46B" glow="rgba(255,170,60,0.6)" from="right" />
        <Pop text="जाना" at={w(p, 'जा', 40)} y={1040} x={560} size={290} font="key" color={SAFFRON} glow="rgba(255,160,30,0.75)" from="right" />
        <Pop text="नहीं" at={N} y={1290} x={660} size={170} color="#F6B9A0" glow="rgba(255,150,120,0.6)" from="right" defocusAt={N + 20} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* 3 — प्यार पिता से करूँ: a saffron mandala blooms and turns behind प्यार; sparks rise */
export const T03: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const bloom = ease(f, [0, 50], [0.2, 1], EASE.out);
  const layer = (n: number, r: number, color: string, dir: number, op: number) => (
    <g transform={`translate(540 940) rotate(${dir * f * 0.25}) scale(${bloom})`} opacity={op}>
      {Array.from({length: n}, (_, i) => (
        <path key={i} transform={`rotate(${(i * 360) / n})`} d={`M0 0 C ${r * 0.3} ${-r * 0.3}, ${r * 0.24} ${-r * 0.82}, 0 ${-r} C ${-r * 0.24} ${-r * 0.82}, ${-r * 0.3} ${-r * 0.3}, 0 0 Z`} fill={color} />
      ))}
    </g>
  );
  return (
    <AbsoluteFill>
      <Bg />
      <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
        {layer(16, 620, '#F6C98A', 1, 0.55)}
        {layer(12, 470, '#F2AE5E', -1, 0.6)}
        {layer(8, 300, '#EE9440', 1, 0.6)}
        <circle cx={540} cy={940} r={120 * bloom} fill="#FFF1D2" opacity={0.85} />
      </svg>
      <Sparks />
      <Giant text="प्यार" at={w(p, 'प्', 4)} color="rgba(150,70,20,0.12)" size={600} y={600} />
      <Pop text="प्यार" at={w(p, 'प्', 4)} y={930} size={300} font="key" color={SAFFRON} stroke={`7px ${UMBER}`} glow="rgba(255,170,40,0.6)" from="slam" />
      <Pop text="पिता से करूँ" at={w(p, 'पि', 34)} y={1200} size={96} color={UMBER} from="up" />
    </AbsoluteFill>
  );
};

const Sparks: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      {Array.from({length: 30}, (_, i) => {
        const x = 540 + noise2D('sx', i, f / 90) * 420;
        const y = H - ((f * (2 + (i % 4)) + i * 97) % (H + 100));
        return <circle key={i} cx={x} cy={y} r={3 + (i % 3) * 2} fill="#FFF6E0" opacity={0.7} style={{filter: 'drop-shadow(0 0 6px #FFD38A)'}} />;
      })}
    </svg>
  );
};

/** A small clay diya with a breathing flame. */
const Diya: React.FC<{x?: number; y?: number; flame?: number}> = ({x = 540, y = 1420, flame = 1}) => {
  const f = useCurrentFrame();
  const fl = flame * (1 + 0.12 * noise2D('fl', f / 6, 0));
  const sway = 6 * noise2D('fs', 0, f / 10);
  return (
    <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
      <defs>
        <radialGradient id="dg">
          <stop offset="0%" stopColor="#FFC870" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#FF9A30" stopOpacity={0} />
        </radialGradient>
        <linearGradient id="fl" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FF7A1A" />
          <stop offset="55%" stopColor="#FFD050" />
          <stop offset="100%" stopColor="#FFF6D0" />
        </linearGradient>
      </defs>
      <circle cx={x} cy={y - 60} r={420 * fl} fill="url(#dg)" />
      <path d={`M${x - 120} ${y} Q ${x} ${y + 110} ${x + 120} ${y} Q ${x + 60} ${y + 20} ${x} ${y + 18} Q ${x - 60} ${y + 20} ${x - 120} ${y} Z`} fill="#8A3E18" />
      <ellipse cx={x} cy={y} rx={120} ry={18} fill="#5A240C" />
      <path
        transform={`translate(${x} ${y - 6}) scale(${fl})`}
        d={`M0 0 C -26 -30, -18 -70, ${sway} -130 C 18 -70, 26 -30, 0 0 Z`}
        fill="url(#fl)"
        style={{filter: 'drop-shadow(0 0 18px #FFB040)'}}
      />
    </svg>
  );
};

/* 4 — ये कह ना पाएं कभी: near black, one diya; कभी in hollow outline, then its pieces drift away; the flame dips */
export const T04: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const K = w(p, 'कभ', 100);
  const flame = 1 - 0.35 * ease(f, [K, K + 30], [0, 1], EASE.inOut) + 0.2 * ease(f, [p.dur - 40, p.dur], [0, 1], EASE.in);
  const scatter = ease(f, [K + 50, p.dur - 6], [0, 1], EASE.in);
  return (
    <AbsoluteFill>
      <Bg black />
      <Bokeh seed="b4" n={14} color="#C98A4A" />
      <Diya flame={flame} />
      <Pop text="ये कह ना पाएं" at={w(p, 'ये', 6)} y={720} size={100} color="#E9D6B8" opacity={0.85} from="up" />
      <div style={{position: 'absolute', inset: 0, opacity: 1 - scatter, filter: scatter > 0.02 ? `blur(${scatter * 18}px)` : undefined, transform: `translateY(${-scatter * 160}px) scale(${1 + scatter * 0.2})`}}>
        <Pop text="कभी" at={K} y={980} size={300} font="key" color="transparent" stroke="5px #FFD9A0" glow="rgba(255,190,110,0.45)" />
      </div>
    </AbsoluteFill>
  );
};

/* 5 — है पिता सब तेरा: sunrise rays; पिता engraved on a turning brass slab; सब slams in; the halo rings return (loop) */
export const T05: React.FC<SceneSlot> = (p) => {
  const f = useCurrentFrame();
  const P = w(p, 'पि', 20);
  const S = w(p, 'सब', 100);
  const slab = ease(f, [P - 6, P + 30], [0, 1], EASE.out);
  const rise = ease(f, [0, 60], [0, 1], EASE.out);
  const ringsIn = ease(f, [S + 40, S + 120], [0, 1], EASE.inOut);
  return (
    <AbsoluteFill>
      <Bg />
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${f * 0.3}deg at 50% 62%, rgba(255,190,90,0.45) 0deg 7deg, rgba(255,240,210,0) 7deg 18deg)`,
          opacity: rise,
        }}
      />
      <Rings colors={['#F9D9A0', '#FBE6BF']} grow={ringsIn} speed={0.5} opacity={ringsIn * 0.8} />
      <Pop text="है" at={w(p, 'है', 4)} y={560} size={90} color={UMBER} from="up" />
      {/* the brass slab */}
      <div
        style={{
          position: 'absolute', left: 190, top: 640, width: 700, height: 250, borderRadius: 18,
          background: 'linear-gradient(135deg, #F7D58A 0%, #C8913E 45%, #F2CC7C 60%, #A8722C 100%)',
          boxShadow: '0 30px 60px rgba(60,25,5,0.45), inset 0 0 0 6px rgba(120,70,20,0.5)',
          transform: `perspective(1200px) rotateY(${70 - 78 * slab + 4 * Math.sin(f / 30)}deg) rotateX(8deg)`,
          opacity: Math.min(1, slab * 1.5),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <div style={{fontFamily: KEY, fontSize: 170, color: '#5A3410', textShadow: '0 2px 0 rgba(255,235,180,0.7), 0 -2px 0 rgba(60,30,5,0.6)', marginTop: 10}}>पिता</div>
        <div
          style={{
            position: 'absolute', inset: 0, borderRadius: 18,
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${-20 + 140 * ease(f, [P + 20, P + 60], [0, 1], EASE.inOut)}%, rgba(255,250,230,0.7) ${-10 + 140 * ease(f, [P + 20, P + 60], [0, 1], EASE.inOut)}%, rgba(255,255,255,0) ${0 + 140 * ease(f, [P + 20, P + 60], [0, 1], EASE.inOut)}%)`,
          }}
        />
      </div>
      <Giant text="सब" at={S} color="rgba(150,70,20,0.14)" size={700} y={1170} />
      <Pop text="सब" at={S} y={1140} size={330} font="key" color={SAFFRON} stroke={`8px ${UMBER}`} glow="rgba(255,170,40,0.7)" from="slam" />
      <Pop text="तेरा" at={w(p, 'ते', 120)} y={1380} size={110} color={UMBER} from="up" />
      {flareAt(f, S, 0.5, 26) > 0.01 ? <AbsoluteFill style={{background: `rgba(255,220,150,${flareAt(f, S, 0.5, 26)})`, mixBlendMode: 'screen'}} /> : null}
    </AbsoluteFill>
  );
};
