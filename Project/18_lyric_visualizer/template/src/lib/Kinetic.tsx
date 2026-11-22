import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT, H, SAFE} from './palette';
import {alpha, useTheme} from './theme';
import {drawProgress, drawStroke, ease, EASE, punchWord, springIn} from './anim';
import type {SceneWord} from './data';

/**
 * Word-synced kinetic line. Each word appears exactly on its timestamp (sf) with scale + blur + slide.
 * Key word: red accent + self-drawing underline + small punch-in. Whole words only (Devanagari-safe).
 * y = vertical centre of the text block; clamped into the Instagram safe zone.
 */
export const KineticLine: React.FC<{
  words: SceneWord[];
  y?: number;
  size?: number;
  maxWidth?: number;
  align?: 'center' | 'left';
  from?: 'below' | 'left' | 'right' | 'above';
  lead?: number; // frames before the timestamp the entrance starts (so the word is readable ON the beat)
  exitAt?: number; // scene frame when words should leave (optional)
  font?: 'sans' | 'serif';
  weight?: number;
  accentKey?: boolean; // colour the key word with the theme accent (default true)
}> = ({words, y = 520, size, maxWidth = 900, align = 'center', from = 'below', lead = 3, exitAt, font = 'sans', weight, accentKey = true}) => {
  const t = useTheme();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const chars = words.reduce((n, w) => n + w.w.length, 0);
  const fontSize = size ?? Math.max(96, Math.min(165, 2600 / Math.max(8, chars)));
  // keep inside safe zone
  const blockH = fontSize * 2.6;
  const cy = Math.min(Math.max(y, SAFE.top + blockH / 2), H - SAFE.bottom - blockH / 2);
  const dir = {below: [0, 1], above: [0, -1], left: [-1, 0], right: [1, 0]}[from];

  return (
    <div
      style={{
        position: 'absolute',
        left: (1080 - maxWidth) / 2,
        width: maxWidth,
        top: cy,
        transform: 'translateY(-50%)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: 'baseline',
        columnGap: fontSize * 0.42,
        rowGap: fontSize * 0.05,
        fontFamily: font === 'serif' ? FONT.serif : FONT.word,
        fontWeight: weight ?? (font === 'serif' ? 400 : 800),
        fontSize,
        lineHeight: 1.18,
        color: t.ink,
      }}
    >
      {words.map((w, k) => {
        const start = w.sf - lead;
        const p = springIn(frame, fps, {delay: start, config: {damping: 12, stiffness: 190, mass: 0.8}});
        const vis = frame >= start;
        const blur = ease(frame, [start, start + 7], [14, 0], EASE.out);
        const op = ease(frame, [start, start + 5], [0, 1], EASE.out);
        const slide = (1 - p) * 70;
        const scale = (0.55 + 0.45 * p) * (w.key ? punchWord(frame, fps, w.sf + 2, 0.16) : 1);
        const exit = exitAt !== undefined ? ease(frame, [exitAt + k * 1.5, exitAt + 10 + k * 1.5], [0, 1], EASE.in) : 0;
        const ul = w.key ? drawProgress(frame, w.sf + 3, 12, EASE.out) : 0;
        return (
          <span
            key={k}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity: vis ? op * (1 - exit) : 0,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
              transform: `translate(${dir[0] * slide}px, ${dir[1] * slide - exit * 60}px) scale(${scale})`,
              transformOrigin: '50% 60%',
              color: w.key && accentKey ? t.accent : t.ink,
              textShadow: t.mode === 'dark' ? `0 0 24px ${alpha(t.light, 0.25)}` : undefined,
              whiteSpace: 'nowrap',
            }}
          >
            {w.w}
            {w.key && accentKey ? (
              <svg
                viewBox="0 0 200 24"
                preserveAspectRatio="none"
                style={{position: 'absolute', left: '-4%', width: '108%', bottom: -fontSize * 0.06, height: fontSize * 0.2, overflow: 'visible'}}
              >
                <path
                  d="M4 15 C 40 7, 80 19, 120 11 S 180 9, 196 13"
                  fill="none"
                  stroke={t.accent}
                  strokeWidth={7}
                  strokeLinecap="round"
                  filter="url(#wobble)"
                  style={drawStroke(ul, 215)}
                />
              </svg>
            ) : null}
          </span>
        );
      })}
    </div>
  );
};

/** Small hand-written annotation (Kalam), draws in with a slight rotation spring. */
export const HandNote: React.FC<{text: string; x: number; y: number; at: number; rot?: number; size?: number; color?: string}> = ({
  text, x, y, at, rot = -4, size = 54, color,
}) => {
  const t = useTheme();
  color = color ?? alpha(t.ink, 0.6);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = springIn(frame, fps, {delay: at});
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, fontFamily: FONT.hand, fontWeight: 700, fontSize: size, color,
        opacity: frame >= at ? Math.min(1, p * 1.4) : 0,
        transform: `rotate(${rot * p}deg) scale(${0.8 + 0.2 * p})`, transformOrigin: 'left center', whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
