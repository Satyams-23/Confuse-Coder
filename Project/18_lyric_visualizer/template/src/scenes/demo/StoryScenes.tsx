/**
 * Story-mode reference (not registered by default). Lyric "तेरे लिए घर / नीले रंग की दीवार":
 *  L0 a paper house, bougainvillea grows over the roof, small blue words in a corner
 *  → zoom THROUGH the window →
 *  L1 a wall gets painted blue with brush strokes, a sparkle trail flies to a heart.
 * Register: SCENES {0: StoryHouse, 1: StoryWall}, TRANSITIONS {1: HOUSE_TO_WALL}.
 */
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bloom, Camera, cameraDrift, CornerLyric, ease, EASE, Layer, PaintReveal, SceneSlot, SparkTrail, springIn, SPRINGS, TransitionSpec} from '../../lib';

const BLUE = '#2F64C9';
const BLUE_D = '#214A9C';
const WINDOW: [number, number] = [470, 1085];

const Sky: React.FC = () => (
  <svg width={1080} height={1920} style={{position: 'absolute'}}>
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F7EFE0" />
        <stop offset="1" stopColor="#EBDDC2" />
      </linearGradient>
    </defs>
    <rect width={1080} height={1920} fill="url(#sky)" />
    <path d="M0 1330 Q270 1250 540 1310 T1080 1290 L1080 1920 L0 1920Z" fill="#DCCBA6" />
    <path d="M0 1400 Q300 1360 600 1400 T1080 1390 L1080 1920 L0 1920Z" fill="#CDB98F" opacity={0.7} />
  </svg>
);

export const StoryHouse: React.FC<SceneSlot> = ({line, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = cameraDrift(frame, dur, {zoom: [1, 1.1], y: [0, -20]});
  const pop = springIn(frame, fps, {delay: 2, config: SPRINGS.pop});
  return (
    <AbsoluteFill>
      <Sky />
      <Camera cam={cam}>
        <Layer depth={0.9}>
          <svg width={1080} height={1920}>
            <g transform={`translate(540 1330) scale(${pop}) translate(-540 -1330)`} filter="url(#ink)">
              {/* walls + roof (flat painted planes, side darker = light from the left) */}
              <path d="M300 930 L780 930 L780 1330 L300 1330Z" fill={BLUE} />
              <path d="M780 930 L880 880 L880 1270 L780 1330Z" fill={BLUE_D} />
              <path d="M250 950 L540 690 L830 950Z" fill="#3A73D8" />
              <path d="M540 690 L640 640 L930 900 L830 950Z" fill="#285AB6" />
              {/* window (zoom-through target) + door */}
              <rect x={WINDOW[0] - 70} y={WINDOW[1] - 80} width={140} height={160} fill="#9DBBEA" />
              <path d={`M${WINDOW[0]} ${WINDOW[1] - 80} V${WINDOW[1] + 80} M${WINDOW[0] - 70} ${WINDOW[1]} H${WINDOW[0] + 70}`} stroke={BLUE_D} strokeWidth={10} />
              <rect x={600} y={1110} width={110} height={220} fill="#1D3F86" />
            </g>
            <Bloom
              points={[[270, 1320], [280, 1100], [300, 960], [420, 840], [540, 720], [660, 820], [800, 950], [850, 1150]]}
              start={10}
              dur={Math.min(70, dur - 20)}
              flowers={14}
              size={44}
            />
          </svg>
        </Layer>
      </Camera>
      <CornerLyric words={line.sceneWords} corner="tl" color={BLUE_D} size={78} />
    </AbsoluteFill>
  );
};

export const HOUSE_TO_WALL: TransitionSpec = {kind: 'zoom', at: WINDOW, r0: 60};

export const StoryWall: React.FC<SceneSlot> = ({line, dur}) => {
  const frame = useCurrentFrame();
  const cam = cameraDrift(frame, dur, {zoom: [1.06, 1], x: [10, -10]});
  const heart = ease(frame, [60, 80], [0, 1], EASE.back);
  return (
    <AbsoluteFill style={{background: '#EFE3CB'}}>
      <Camera cam={cam}>
        <Layer depth={0.6}>
          <PaintReveal start={-8} dur={Math.min(56, dur - 30)} strokes={6} box={[60, 380, 960, 1080]} seed={3}>
            <AbsoluteFill style={{background: `linear-gradient(160deg, #3C76DA, ${BLUE_D})`}} />
          </PaintReveal>
        </Layer>
        <Layer depth={1}>
          <svg width={1080} height={1920}>
            <SparkTrail from={[200, 1300]} to={[760, 760]} start={44} dur={22} />
            <g transform={`translate(760 760) scale(${heart})`}>
              <path d="M0 40 C-90 -20 -60 -100 0 -55 C60 -100 90 -20 0 40Z" fill="#F4E3B5" />
            </g>
          </svg>
        </Layer>
      </Camera>
      <CornerLyric words={line.sceneWords} corner="br" color="#F7EEDC" accent="#FFD36B" size={78} />
    </AbsoluteFill>
  );
};
