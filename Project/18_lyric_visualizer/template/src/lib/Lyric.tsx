/**
 * Big two-tone stacked lyric (reference: illustrated-story reels). Words pop in on their sung time with a
 * motion-blur streak; the key word sits on its own row in a chunky saffron display face with a dark edge
 * and a warm glow, the rest are cream bold serif. Rows are staggered (each row indents a bit more).
 */
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {loadFont as loadYatra} from '@remotion/google-fonts/YatraOne';
import {ease, EASE, springIn, SPRINGS} from './anim';
import {SceneWord, TRANSITION_FRAMES} from './data';
import {SAFE, W} from './palette';

loadYatra('normal', {weights: ['400'], subsets: ['devanagari', 'latin']});

const KEY_FONT = '"Yatra One", "Mukta", sans-serif';
const BODY_FONT = '"Noto Serif Devanagari", "Tiro Devanagari Hindi", serif';

export type LyricPos = 'tl' | 'tr' | 'bl' | 'br';

/** rows: words before the key / key alone / words after the key */
const rowsOf = (words: SceneWord[]) => {
  const k = words.findIndex((w) => w.key);
  if (k < 0) {
    const half = Math.ceil(words.length / 2);
    return [words.slice(0, half), words.slice(half)].filter((r) => r.length);
  }
  return [words.slice(0, k), [words[k]], words.slice(k + 1)].filter((r) => r.length);
};

export const StackLyric: React.FC<{
  words: SceneWord[];
  dur: number; // scene length: the stack blurs away before the next scene takes over
  pos?: LyricPos;
  y?: number; // top (t*) or bottom (b*) offset in px
  size?: number;
  keyColor?: string;
  bodyColor?: string;
  hold?: boolean; // last scene: never exit
  soft?: boolean; // slow emotional entrance: no streak, long blur-in
}> = ({words, dur, pos = 'tl', y, size = 84, keyColor = '#FFC53D', bodyColor = '#FFF4E0', hold, soft}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const top = pos[0] === 't';
  const left = pos[1] === 'l';
  const rows = rowsOf(words);
  const exitAt = dur - TRANSITION_FRAMES - 2;
  const out = hold ? 0 : ease(frame, [exitAt - 4, exitAt + 8], [0, 1], EASE.in);

  return (
    <div
      style={{
        position: 'absolute',
        [top ? 'top' : 'bottom']: y ?? (top ? SAFE.top + 40 : SAFE.bottom + 40),
        [left ? 'left' : 'right']: SAFE.side,
        width: W - SAFE.side * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: left ? 'flex-start' : 'flex-end',
        opacity: 1 - out,
        filter: out > 0.02 ? `blur(${out * 16}px)` : undefined,
        transform: `translateY(${-out * 40}px) scale(${1 + out * 0.06})`,
        transformOrigin: left ? 'left center' : 'right center',
      }}
    >
      {rows.map((row, r) => {
        const isKey = row.length === 1 && row[0].key;
        const indent = r * size * 0.55;
        return (
          <div
            key={r}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: `0 ${size * 0.26}px`,
              [left ? 'marginLeft' : 'marginRight']: indent,
              marginTop: r === 0 ? 0 : isKey ? -size * 0.12 : -size * 0.05,
              lineHeight: isKey ? 1.18 : 1.3,
            }}
          >
            {row.map((w, k) => {
              const s = springIn(frame, fps, {delay: w.sf - 2, config: soft ? {damping: 22, stiffness: 40} : isKey ? SPRINGS.pop : SPRINGS.firm});
              const p = Math.min(1, s);
              const blur = (1 - p) * (isKey ? 22 : 14);
              const streak = soft ? 0 : (1 - p) * (isKey ? 160 : 70) * (left ? 1 : -1);
              const singing = frame >= w.sf && frame <= w.ef + 4;
              const glow = isKey ? 0.55 + 0.45 * Math.exp(-Math.max(0, frame - w.sf) / 14) : singing ? 1 : 0;
              const fs = isKey ? size * 2.2 : size;
              return (
                <span
                  key={k}
                  style={{
                    display: 'inline-block',
                    fontFamily: isKey ? KEY_FONT : BODY_FONT,
                    fontWeight: isKey ? 400 : 800,
                    fontSize: fs,
                    color: isKey ? keyColor : bodyColor,
                    opacity: Math.min(1, s * 1.6),
                    transform: soft ? `translateY(${(1 - p) * 30}px) scale(${1 + (1 - p) * (isKey ? 0.18 : 0.08)})` : `translateX(${streak}px) scale(${(isKey ? 1.5 : 1.25) - (isKey ? 0.5 : 0.25) * s}, ${(isKey ? 1.5 : 1.25) - (isKey ? 0.5 : 0.25) * s})`,
                    transformOrigin: left ? 'left bottom' : 'right bottom',
                    filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
                    WebkitTextStroke: isKey ? `${size * 0.05}px #4A1E05` : undefined,
                    paintOrder: 'stroke fill',
                    textShadow: isKey
                      ? `0 ${size * 0.07}px 0 #3A1604, 0 0 ${30 + 40 * glow}px rgba(255,170,40,${0.35 + 0.45 * glow}), 0 8px 30px rgba(0,0,0,0.55)`
                      : `0 3px 0 rgba(40,18,6,0.85), 0 0 ${18 + 14 * glow}px rgba(${glow ? '255,225,170' : '0,0,0'},${glow ? 0.55 : 0.55})`,
                  }}
                >
                  {w.w}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
