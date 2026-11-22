import React, {createContext, useContext} from 'react';
import {AbsoluteFill} from 'remotion';

type Cam = {z: number; x: number; y: number; rot: number; ox: number; oy: number};
const CamCtx = createContext<Cam>({z: 1, x: 0, y: 0, rot: 0, ox: 540, oy: 960});

/**
 * Wrap a scene. Pass the result of cameraDrift(). Children <Layer depth> get parallax:
 * depth 0 = locked to screen (far paper), 1 = full camera move (subject), >1 = foreground (moves more).
 */
export const Camera: React.FC<{cam: {z: number; x: number; y: number; rot?: number}; origin?: [number, number]; children: React.ReactNode}> = ({
  cam,
  origin = [540, 960],
  children,
}) => (
  <CamCtx.Provider value={{z: cam.z, x: cam.x, y: cam.y, rot: cam.rot ?? 0, ox: origin[0], oy: origin[1]}}>
    <AbsoluteFill>{children}</AbsoluteFill>
  </CamCtx.Provider>
);

export const Layer: React.FC<{depth?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({depth = 1, children, style}) => {
  const c = useContext(CamCtx);
  const z = 1 + (c.z - 1) * depth;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: `${c.ox}px ${c.oy}px`,
        transform: `translate(${c.x * depth}px, ${c.y * depth}px) scale(${z}) rotate(${c.rot * depth}deg)`,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
