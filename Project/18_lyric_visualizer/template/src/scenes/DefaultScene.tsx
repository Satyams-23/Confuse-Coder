import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Camera, cameraDrift, drawProgress, EASE, KineticLine, Layer, SceneSlot, SketchPath, wobblyCircle} from '../lib';
import {C} from '../lib/palette';

/** Fallback for lines without a custom scene: drifting camera, faint sketched ring, kinetic words. */
export const DefaultScene: React.FC<SceneSlot> = ({line, dur, index}) => {
  const frame = useCurrentFrame();
  const cam = cameraDrift(frame, dur, {zoom: [1.0, 1.08], y: [10, -10]});
  return (
    <Camera cam={cam}>
      <Layer depth={0.35}>
        <svg width={1080} height={1920} viewBox="0 0 1080 1920">
          <SketchPath d={wobblyCircle(540, 900, 380, index + 3)} progress={drawProgress(frame, 0, 26, EASE.out)} color={C.inkFaint} width={5} />
        </svg>
      </Layer>
      <Layer depth={0.8}>
        <KineticLine words={line.sceneWords} y={900} />
      </Layer>
    </Camera>
  );
};
