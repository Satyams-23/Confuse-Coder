/**
 * DEMO scene (reference implementation) — literal metaphor: "5 rupaye" → a hand, a coin drops,
 * bounces on the palm, settles. Shows: drawStroke hand, dropBounce with anticipation/squash,
 * follow-through (hand dips on impact), motion hit snapped to a beat, camera drift + parallax,
 * kinetic line with key word, and an end push into the coin that match-cuts into the next scene.
 */
import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {
  C, Camera, cameraDrift, drawProgress, drawStroke, dropBounce, ease, EASE, HandNote, Hatch, keys,
  KineticLine, Layer, SceneSlot, SketchPath, snapToBeat, wobblyCircle,
} from '../../lib';

export const COIN: [number, number] = [600, 1184];
const COIN_R = 80;

// palm-up hand seen from the side, wrist on the left, fingers curling up on the right
const HAND = {
  top: 'M 120 1150 C 260 1150 380 1190 520 1200 C 640 1208 740 1196 820 1160 C 870 1138 905 1100 915 1062',
  tip: 'M 915 1062 C 920 1040 950 1040 952 1066 C 955 1110 925 1160 880 1196',
  under: 'M 880 1196 C 800 1262 680 1300 540 1306 C 400 1312 260 1290 120 1288',
  thumb: 'M 330 1170 C 318 1090 340 1030 384 1012 C 420 1000 444 1026 440 1060 C 436 1100 420 1140 430 1185',
  cuff: 'M 120 1120 C 140 1190 142 1260 120 1320',
  sleeve: 'M 120 1120 L -40 1108 M 120 1320 L -40 1334',
  f1: 'M 822 1186 C 866 1166 898 1132 910 1104',
  f2: 'M 806 1216 C 862 1200 900 1170 918 1140',
  nail: 'M 930 1052 C 938 1050 944 1058 942 1068 M 392 1022 C 410 1016 428 1026 430 1040',
  crease: 'M 470 1238 C 540 1254 620 1252 690 1236',
  body: 'M 120 1150 C 260 1150 380 1190 520 1200 C 640 1208 740 1196 820 1160 C 870 1138 905 1100 915 1062 C 920 1040 950 1040 952 1066 C 955 1110 925 1160 880 1196 C 800 1262 680 1300 540 1306 C 400 1312 260 1290 120 1288 Z',
};

export const CoinScene: React.FC<SceneSlot> = ({line, dur, beats}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const key = line.sceneWords.find((w) => w.key) ?? line.sceneWords[0];
  const after = line.sceneWords[line.sceneWords.indexOf(key) + 1] ?? key;
  const impact = snapToBeat(after.sf, beats, 5); // coin lands on the word after the key word, snapped to the beat

  // camera: slow push toward the coin, extra push at the end = match-cut into the next scene
  const base = cameraDrift(frame, dur, {zoom: [1.0, 1.1], y: [0, -24]});
  const cam = {...base, z: base.z + ease(frame, [dur - 22, dur], [0, 0.28], EASE.in)};

  // hand draws in, then dips on impact (follow-through)
  const handP = drawProgress(frame, 0, 26, EASE.out);
  const dip = frame >= impact ? keys(frame, [impact, impact + 4, impact + 16], [0, 18, 0], EASE.soft) : 0;

  // coin: anticipation → fall → bounce → settle; tumbles while falling, wobbles after landing
  const drop = dropBounce(frame, fps, impact, {height: 540, fall: 13});
  const spin = ease(frame, [impact - 22, impact], [0, Math.PI * 2 + 1.32], EASE.out);
  const wob = frame >= impact ? 1 - spring({frame: frame - impact, fps, config: {damping: 6, stiffness: 140}}) : 0;
  const ry = frame >= impact ? 22 + 14 * Math.abs(Math.sin((frame - impact) * 0.9)) * wob : COIN_R * Math.max(0.12, Math.abs(Math.cos(spin)));
  const coinVisible = frame >= impact - 22;
  const cy = COIN[1] + drop.y + dip;

  // shadow grows as the coin approaches the palm
  const near = Math.max(0, 1 + drop.y / 540);
  const marks = frame >= impact ? drawProgress(frame, impact, 7, EASE.out) : 0;
  const marksOut = ease(frame, [impact + 8, impact + 16], [1, 0], EASE.in);

  return (
    <Camera cam={cam} origin={COIN}>
      {/* far layer: loose sketch of a sun + ground hatching (parallax 0.3) */}
      <Layer depth={0.3}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <SketchPath d={wobblyCircle(830, 470, 120, 4)} progress={drawProgress(frame, 4, 30, EASE.out)} color={C.inkFaint} width={5} />
          <Hatch x={60} y={1360} w={960} h={170} progress={ease(frame, [6, 36], [0, 1], EASE.out)} opacity={0.12} />
        </svg>
      </Layer>

      {/* subject layer: hand + coin */}
      <Layer depth={1}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920" style={{overflow: 'visible'}}>
          <g transform={`translate(0 ${dip})`}>
            <SketchPath d={HAND.body} progress={handP} color="none" width={0} fill={C.paperDeep} fillOpacity={0.85} double={false} />
            {(['under', 'top', 'tip', 'thumb', 'cuff', 'sleeve'] as const).map((k, n) => (
              <SketchPath key={k} d={HAND[k]} progress={drawProgress(frame, n * 2, 24, EASE.out)} width={9} seed={n + 2} />
            ))}
            <SketchPath d={HAND.f1} progress={drawProgress(frame, 14, 14, EASE.out)} width={5} seed={9} />
            <SketchPath d={HAND.f2} progress={drawProgress(frame, 16, 14, EASE.out)} width={5} seed={10} />
            <SketchPath d={HAND.nail} progress={drawProgress(frame, 20, 10, EASE.out)} width={4} seed={11} double={false} />
            <SketchPath d={HAND.crease} progress={drawProgress(frame, 22, 10, EASE.out)} width={4} color={C.inkSoft} seed={12} double={false} />
          </g>

          {/* coin shadow on the palm */}
          {coinVisible ? (
            <ellipse cx={COIN[0]} cy={COIN[1] + 16 + dip} rx={26 + 58 * near} ry={7 + 6 * near} fill={C.ink} opacity={0.1 + 0.18 * near} filter="url(#wobble)" />
          ) : null}

          {/* impact marks */}
          <g opacity={marksOut} stroke={C.ink} strokeWidth={6} strokeLinecap="round" filter="url(#wobble)">
            {[
              'M 498 1160 L 452 1128',
              'M 702 1160 L 748 1128',
              'M 600 1118 L 600 1068',
            ].map((d, n) => (
              <path key={n} d={d} style={drawStroke(marks, 60)} />
            ))}
          </g>

          {/* the coin */}
          {coinVisible ? (
            <g transform={`translate(${COIN[0]} ${cy}) scale(1 ${drop.squash}) translate(${-COIN[0]} ${-cy})`}>
              <ellipse cx={COIN[0]} cy={cy} rx={COIN_R} ry={ry} fill={C.paper} stroke={C.red} strokeWidth={9} filter="url(#wobble)" />
              <ellipse cx={COIN[0]} cy={cy} rx={COIN_R * 0.78} ry={ry * 0.78} fill="none" stroke={C.red} strokeWidth={3.5} opacity={0.7} filter="url(#wobble2)" />
              {ry > 34 ? (
                <text
                  x={COIN[0]}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="Mukta"
                  fontWeight={800}
                  fontSize={92}
                  fill={C.red}
                  transform={`translate(0 ${cy}) scale(1 ${ry / COIN_R}) translate(0 ${-cy})`}
                >
                  ₹
                </text>
              ) : null}
            </g>
          ) : null}

          {/* hand-drawn arrow to the coin after it settles */}
          <SketchPath d="M 820 990 C 790 1060 730 1110 668 1150" progress={drawProgress(frame, impact + 18, 12, EASE.out)} width={5} color={C.inkSoft} />
          <SketchPath d="M 668 1150 L 700 1150 M 668 1150 L 676 1120" progress={drawProgress(frame, impact + 28, 6, EASE.out)} width={5} color={C.inkSoft} />
        </svg>
        <HandNote text="₹5 only" x={760} y={900} at={impact + 20} rot={-6} />
      </Layer>

      {/* text layer: mid parallax */}
      <Layer depth={0.6}>
        <KineticLine words={line.sceneWords} y={560} />
      </Layer>
    </Camera>
  );
};
