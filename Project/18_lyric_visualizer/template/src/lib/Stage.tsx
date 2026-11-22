/**
 * Theme-aware backgrounds and light. Light themes: tinted paper. Dark themes: a stage with a warm spotlight
 * that breathes on the beats, optional light beams, and floating dust that glows inside the light.
 */
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {noise2D} from '@remotion/noise';
import {H, W} from './palette';
import {alpha, useTheme} from './theme';
import {beatPulse, ease, EASE} from './anim';

export const PaperBg: React.FC = () => {
  const t = useTheme();
  return (
    <AbsoluteFill>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="pBlotch">
            <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={3} seed={11} />
            <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.9 -0.32" />
          </filter>
          <filter id="pFibre">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={5} />
            <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.55 -0.18" />
          </filter>
          <radialGradient id="pLight" cx="50%" cy="38%" r="70%">
            <stop offset="0%" stopColor={t.light} stopOpacity={0.55} />
            <stop offset="100%" stopColor={t.light} stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect width={W} height={H} fill={t.bg} />
        <rect width={W} height={H} filter="url(#pBlotch)" opacity={0.5} />
        <rect width={W} height={H} filter="url(#pFibre)" opacity={0.45} />
        <rect width={W} height={H} fill="url(#pLight)" />
      </svg>
    </AbsoluteFill>
  );
};

export type StageProps = {
  spot?: [number, number]; // spotlight centre
  radius?: number;
  intensity?: number; // 0..1.5
  beats?: number[]; // scene-relative beat frames → the light breathes
  beams?: boolean | {from: [number, number][]; to: [number, number]; width?: number};
  dust?: number; // particle count
  flare?: number; // extra intensity (spring it on a hit)
};

export const NightStage: React.FC<StageProps> = ({spot = [540, 1000], radius = 760, intensity = 1, beats = [], beams = false, dust = 60, flare = 0}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const breathe = beatPulse(frame, beats, 0.06, 14) + 0.03 * noise2D('breathe', frame / 90, 0);
  const I = Math.max(0, intensity * breathe + flare);
  const beamCfg = beams === true ? {from: [[300, -80], [780, -80]] as [number, number][], to: spot, width: 170} : beams || null;
  return (
    <AbsoluteFill style={{background: t.bg}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="nsSpot" cx={spot[0]} cy={spot[1]} r={radius} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={t.light} stopOpacity={0.42 * I} />
            <stop offset="35%" stopColor={t.light} stopOpacity={0.16 * I} />
            <stop offset="100%" stopColor={t.light} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="nsFloor" cx={spot[0]} cy={spot[1] + 260} r={radius * 0.9} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={t.bg2} stopOpacity={0.9} />
            <stop offset="100%" stopColor={t.bg} stopOpacity={0} />
          </radialGradient>
          <filter id="nsBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={28} />
          </filter>
          <filter id="nsDustBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation={1.4} />
          </filter>
        </defs>
        <rect width={W} height={H} fill="url(#nsFloor)" />
        <rect width={W} height={H} fill="url(#nsSpot)" />
        {beamCfg
          ? beamCfg.from.map(([x, y], k) => {
              const [tx, ty] = beamCfg.to;
              const w = beamCfg.width ?? 170;
              const sway = 18 * noise2D('beam' + k, frame / 120, k);
              return (
                <polygon
                  key={k}
                  points={`${x - 10},${y} ${x + 10},${y} ${tx + w / 2 + sway},${ty} ${tx - w / 2 + sway},${ty}`}
                  fill={t.light}
                  opacity={0.1 * I}
                  filter="url(#nsBlur)"
                />
              );
            })
          : null}
        {/* dust: organic drift (noise), brighter inside the light */}
        <g filter="url(#nsDustBlur)">
          {Array.from({length: dust}, (_, k) => {
            const bx = random(`dx${k}`) * W, by = random(`dy${k}`) * H;
            const x = bx + 60 * noise2D(`nx${k}`, frame / 160, 0);
            const y = ((by - frame * (0.25 + random(`v${k}`) * 0.5) + H * 10) % H) + 40 * noise2D(`ny${k}`, 0, frame / 140);
            const d = Math.hypot(x - spot[0], y - spot[1]) / radius;
            const a = Math.max(0, 1 - d) * (0.25 + 0.75 * random(`a${k}`)) * Math.min(1.2, I);
            const r = 1.2 + random(`r${k}`) * 2.6;
            return <circle key={k} cx={x} cy={y} r={r} fill={t.light} opacity={a} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Background chosen by the current theme. Scenes can pass stage props (ignored on paper). */
export const Stage: React.FC<StageProps> = (p) => {
  const t = useTheme();
  return t.mode === 'dark' ? <NightStage {...p} /> : <PaperBg />;
};

/** Short light flare value for a hit (0 → peak → 0), to pass as Stage flare / multiply glows. */
export const flareAt = (frame: number, at: number, peak = 0.6, len = 22) =>
  frame < at ? 0 : peak * (1 - ease(frame, [at, at + len], [0, 1], EASE.out));

export const glowShadow = (color: string, k = 1) => `0 0 ${18 * k}px ${alpha(color, 0.55)}, 0 0 ${48 * k}px ${alpha(color, 0.3)}`;
