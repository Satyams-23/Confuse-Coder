/**
 * DEMO scene (reference implementation) — symbolic metaphor: "waqt rukta nahi" → a clock.
 * Enters by MATCH-CUT from the coin: the coin's rim grows into the clock face (iris from the coin
 * position + rim spring from coin size/colour to clock size/colour). The minute hand ticks on every
 * beat with anticipation + overshoot; on the key word it tries to stop (trembles), then on the next
 * word it jumps ahead — time doesn't stop. Rings ripple out on downbeats.
 */
import React from 'react';
import {interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  C, Camera, cameraDrift, drawProgress, ease, EASE, KineticLine, Layer, overshootRotate, SceneSlot,
  SketchPath, springIn, TransitionSpec, wobblyCircle,
} from '../../lib';
import {COIN} from './CoinScene';

const CL: [number, number] = [540, 830];
const R = 290;
export const CLOCK_ENTRY: TransitionSpec = {kind: 'iris', at: COIN, to: CL, r0: 175};

export const ClockScene: React.FC<SceneSlot> = ({line, dur, beats, downbeats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const keyIdx = Math.max(0, line.sceneWords.findIndex((w) => w.key));
  const stopAt = line.sceneWords[keyIdx].sf;
  const goAt = (line.sceneWords[keyIdx + 1] ?? line.sceneWords[keyIdx]).sf;

  const cam = cameraDrift(frame, dur, {zoom: [1.07, 1.0], rot: [-1.2, 1.0]});

  // match-cut morph: coin rim → clock rim (size, position, colour) with overshoot
  const m = springIn(frame, fps, {config: {damping: 12, stiffness: 120}});
  const r = 118 + (R - 118) * m;
  const cx = COIN[0] + (CL[0] - COIN[0]) * m;
  const cy = COIN[1] + (CL[1] - COIN[1]) * m;
  const rimColor = interpolateColors(ease(frame, [4, 18], [0, 1], EASE.inOut), [0, 1], [C.red, C.ink]);

  // minute hand: one tick per beat (anticipation + overshoot), none while "rukta", big jump on the next word
  let minute = -60;
  for (const b of beats) {
    if (b < 12 || b > dur) continue;
    if (b >= stopAt - 2 && b < goAt) continue;
    minute += overshootRotate(frame, fps, b, 0, 30);
  }
  minute += overshootRotate(frame, fps, goAt, 0, 120, {damping: 8, stiffness: 140});
  const struggle = frame >= stopAt && frame < goAt ? 2.4 * Math.sin(frame * 2.1) * ease(frame, [stopAt, stopAt + 6], [0, 1], EASE.out) : 0;
  const handsP = drawProgress(frame, 10, 14, EASE.out);

  // ripples on downbeats
  const ripples = downbeats.filter((d) => d <= frame && frame - d < 26);

  return (
    <Camera cam={cam} origin={CL}>
      <Layer depth={0.3}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          {ripples.map((d) => {
            const t = ease(frame, [d, d + 26], [0, 1], EASE.out);
            return <path key={d} d={wobblyCircle(CL[0], CL[1], R + 40 + 220 * t, d)} fill="none" stroke={C.ink} strokeWidth={4} opacity={0.22 * (1 - t)} filter="url(#wobble)" />;
          })}
          <ellipse cx={CL[0] + 20} cy={CL[1] + R + 70} rx={R * 0.9} ry={34} fill={C.ink} opacity={0.08 * m} filter="url(#wobble)" />
        </svg>
      </Layer>

      <Layer depth={1}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
          <path d={wobblyCircle(cx, cy, r, 7)} fill={C.paper} stroke={rimColor} strokeWidth={11} filter="url(#wobble)" />
          <SketchPath d={wobblyCircle(CL[0], CL[1], R - 26, 8)} progress={drawProgress(frame, 8, 20, EASE.out)} width={4} color={C.inkSoft} double={false} />
          {Array.from({length: 12}, (_, k) => {
            const a = (k / 12) * Math.PI * 2;
            const big = k % 3 === 0;
            const r1 = R - (big ? 78 : 60), r2 = R - 40;
            const d = `M ${CL[0] + Math.cos(a) * r1} ${CL[1] + Math.sin(a) * r1} L ${CL[0] + Math.cos(a) * r2} ${CL[1] + Math.sin(a) * r2}`;
            return <SketchPath key={k} d={d} progress={drawProgress(frame, 10 + k * 1.2, 7, EASE.out)} width={big ? 10 : 6} seed={k + 20} double={false} />;
          })}
          {/* hour hand */}
          <g transform={`rotate(${-30 + struggle * 0.3} ${CL[0]} ${CL[1]})`}>
            <SketchPath d={`M ${CL[0]} ${CL[1] + 24} L ${CL[0]} ${CL[1] - 150}`} progress={handsP} width={16} seed={31} />
          </g>
          {/* minute hand */}
          <g transform={`rotate(${minute + struggle} ${CL[0]} ${CL[1]})`}>
            <SketchPath d={`M ${CL[0]} ${CL[1] + 36} L ${CL[0]} ${CL[1] - 232}`} progress={handsP} width={10} seed={32} />
          </g>
          <circle cx={CL[0]} cy={CL[1]} r={20 * ease(frame, [12, 20], [0, 1], EASE.back)} fill={C.red} filter="url(#wobble)" />
        </svg>
      </Layer>

      <Layer depth={0.7}>
        <KineticLine words={line.sceneWords} y={1420} />
      </Layer>
    </Camera>
  );
};
