import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, H, W} from './palette';

/** Global SVG filter defs: #wobble (boiling hand-drawn lines), #wobble2 (second outline), #ink (rough ink edge). */
export const FilterDefs: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 3); // lines "boil" every 3 frames like hand animation
  return (
    <svg width={0} height={0} style={{position: 'absolute'}}>
      <defs>
        <filter id="wobble" filterUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={seed % 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="wobble2" filterUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={(seed + 3) % 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="ink" filterUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={1} seed={2} result="g" />
          <feDisplacementMap in="SourceGraphic" in2="g" scale={2.2} />
        </filter>
        {/* glowing line (neon/light trail) and glowing + boiling line */}
        <filter id="glow" filterUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={7} result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation={18} result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="wobbleGlow" filterUnits="userSpaceOnUse" x={-400} y={-400} width={1880} height={2720}>
          <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves={2} seed={seed % 7} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" result="w" />
          <feGaussianBlur in="w" stdDeviation={6} result="b1" />
          <feGaussianBlur in="w" stdDeviation={16} result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="w" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
};

/** Warm paper: base colour, large soft blotches, fine fibre grain. Static (paper doesn't move). */
export const Paper: React.FC = () => (
  <AbsoluteFill>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <defs>
        <filter id="paperBlotch">
          <feTurbulence type="fractalNoise" baseFrequency="0.0035" numOctaves={3} seed={11} />
          <feColorMatrix values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.25  0 0 0 0.9 -0.32" />
        </filter>
        <filter id="paperFibre">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={5} />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.55 -0.18" />
        </filter>
      </defs>
      <rect width={W} height={H} fill={C.paper} />
      <rect width={W} height={H} filter="url(#paperBlotch)" opacity={0.55} />
      <rect width={W} height={H} filter="url(#paperFibre)" opacity={0.5} />
    </svg>
  </AbsoluteFill>
);

/** Moving film grain on top of everything (subtle). */
export const FilmGrain: React.FC<{opacity?: number}> = ({opacity = 0.32}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{mixBlendMode: 'soft-light', opacity, pointerEvents: 'none'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={1} seed={frame % 24} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number}> = ({strength = 0.42}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 75% 62% at 50% 46%, rgba(0,0,0,0) 55%, rgba(40,26,12,${strength}) 100%)`,
    }}
  />
);
