/**
 * .dev showcase reel (ref: laptop-recording "Claude / Free Prompt" reels): the user's phone recording of the
 * Pitah lyric video playing on the laptop, clean song audio synced in (song starts 2.19 s into the raw clip,
 * the proxy public/showcase/rec.mp4 is already trimmed to that point). Top: blurred clean render as backdrop,
 * a song card + a Claude tile, handle line. Bottom: "Comment SKILL" chip at the screen's lower edge.
 */
import React from 'react';
import {AbsoluteFill, Audio, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import './lib/fonts';
import './lib/Lyric'; // loads Yatra One

const KEY = '"Yatra One", "Mukta", sans-serif';
const UI = '"Mukta", "Segoe UI", sans-serif';
const REC_SCALE = 0.92;
const REC_TOP = 300;

// video rect on the laptop screen in rec.mp4 (1080x1920 px), measured from bright-area bboxes
const RECT_IN = {x: 318, y: 119, w: 649}; // at ~2.8 s, right after you hit play
const RECT_OUT = {x: 155, y: 93, w: 721}; // at ~59.4 s
const ZIN: [number, number] = [66, 98]; // frames: zoom into the screen (2.2 s -> 3.27 s)
const ZOUT_LEN = 75; // pull back out over the last ~2.5 s
type Cam = {x: number; y: number; s: number};
const FRAMED: Cam = {x: (1080 - 1080 * REC_SCALE) / 2, y: REC_TOP, s: REC_SCALE};
const fill = (r: {x: number; y: number; w: number}): Cam => {
  const s = 1080 / r.w;
  return {x: -r.x * s, y: -r.y * s, s};
};
const mix = (a: Cam, b: Cam, t: number): Cam => ({x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t});
const camAt = (f: number, dur: number): Cam => {
  const io = Easing.inOut(Easing.cubic);
  const tin = interpolate(f, ZIN, [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  const outA = dur - ZOUT_LEN - 20;
  const tout = interpolate(f, [outA, outA + ZOUT_LEN - 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: io});
  if (f < outA - 20) return mix(FRAMED, fill(RECT_IN), tin); // swap rects while the clean video fully covers
  return mix(fill(RECT_OUT), FRAMED, tout);
};

const pop = (frame: number, fps: number, delay: number) => spring({frame: frame - delay, fps, config: {damping: 13, stiffness: 120}});

/** Tile with a soft shadow + a gentle float. */
const Tile: React.FC<{x: number; delay: number; children: React.ReactNode; bg: string}> = ({x, delay, children, bg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = pop(f, fps, delay);
  const fl = Math.sin((f + delay * 7) / 38) * 6;
  return (
    <div
      style={{
        position: 'absolute', left: x, top: 92 + fl, width: 236, height: 236, borderRadius: 40, background: bg, overflow: 'hidden',
        boxShadow: '0 18px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.25)',
        transform: `scale(${s}) rotate(${(1 - s) * -8}deg)`, opacity: Math.min(1, s * 1.5),
      }}
    >
      {children}
    </div>
  );
};

/** Song card: mini halo rings + पिता, like the reel's own first frame. */
const SongCard: React.FC = () => {
  const f = useCurrentFrame();
  const phase = (f * 0.5) % 26;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle, #FFF4DE 0%, #F7DDAE 60%, #E9B977 100%)'}}>
      <svg width={236} height={236} style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 7}, (_, k) => 6 - k).map((k) => (
          <circle key={k} cx={118} cy={104} r={k * 26 + phase} fill={k % 2 ? '#F9D9A0' : '#FBE6BF'} />
        ))}
      </svg>
      <div style={{position: 'absolute', top: 44, width: '100%', textAlign: 'center', fontFamily: KEY, fontSize: 88, color: '#FFB935', WebkitTextStroke: '3px #3A1608', paintOrder: 'stroke fill'}}>पिता</div>
      <div style={{position: 'absolute', bottom: 18, width: '100%', textAlign: 'center', fontFamily: UI, fontWeight: 800, fontSize: 21, color: '#3A1608', letterSpacing: 0.3}}>
        Pitah Se Hai Naam Tera
      </div>
    </AbsoluteFill>
  );
};

/** Claude tile: orange burst + wordmark. */
const ClaudeTile: React.FC = () => {
  const f = useCurrentFrame();
  const rays = 12;
  return (
    <AbsoluteFill style={{background: '#FFFFFF', alignItems: 'center'}}>
      <svg width={150} height={150} style={{marginTop: 22}} viewBox="-75 -75 150 150">
        <g transform={`rotate(${f * 0.2})`}>
          {Array.from({length: rays}, (_, i) => (
            <line key={i} x1={0} y1={-10} x2={0} y2={i % 2 ? -52 : -64} stroke="#D97757" strokeWidth={13} strokeLinecap="round" transform={`rotate(${(i * 360) / rays})`} />
          ))}
        </g>
      </svg>
      <div style={{fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 40, color: '#1F1F1F', marginTop: -6}}>Claude</div>
    </AbsoluteFill>
  );
};

const IgIcon: React.FC<{size?: number}> = ({size = 34}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth={2}>
    <rect x={3} y={3} width={18} height={18} rx={5} />
    <circle cx={12} cy={12} r={4.2} />
    <circle cx={17.4} cy={6.6} r={1} fill="#FFFFFF" />
  </svg>
);

export const Showcase: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const chip = pop(f, fps, 24);
  const bob = Math.sin(f / 9) * 6;
  const fadeIn = interpolate(f, [0, 8], [0, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.quad)});
  const cam = camAt(f, durationInFrames);
  const clean = interpolate(f, [ZIN[1] - 14, ZIN[1], durationInFrames - ZOUT_LEN - 30, durationInFrames - ZOUT_LEN - 14], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad),
  });
  return (
    <AbsoluteFill style={{background: '#000', opacity: fadeIn}}>
      {/* backdrop: the clean render, big + blurred, so the top glows in the reel's own colours */}
      <AbsoluteFill style={{transform: 'scale(1.35)', filter: 'blur(38px) brightness(0.75) saturate(1.3)'}}>
        <OffthreadVideo src={staticFile('showcase/clean.mp4')} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 30%)'}} />

      {/* the phone recording of the laptop: framed below the tiles, then the camera dives into the laptop screen
          and the clean video file takes over (sharp, no moire); at the end it pulls back out to the laptop */}
      <AbsoluteFill style={{transformOrigin: '0 0', transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`}}>
        <div style={{position: 'absolute', inset: 0, borderRadius: 28 / cam.s, overflow: 'hidden', boxShadow: '0 -10px 50px rgba(0,0,0,0.55)'}}>
          <OffthreadVideo src={staticFile('showcase/rec.mp4')} muted style={{width: '100%', height: '100%', filter: 'contrast(1.06) saturate(1.08)'}} />
        </div>
      </AbsoluteFill>
      {clean > 0.001 ? (
        <AbsoluteFill style={{opacity: clean}}>
          <OffthreadVideo src={staticFile('showcase/clean.mp4')} muted style={{width: '100%', height: '100%'}} />
        </AbsoluteFill>
      ) : null}

      {/* top: song card + Claude tile */}
      <Tile x={250} delay={4} bg="#F7DDAE">
        <SongCard />
      </Tile>
      <Tile x={594} delay={10} bg="#FFFFFF">
        <ClaudeTile />
      </Tile>
      <div
        style={{
          position: 'absolute', left: 0, width: 1080, top: 344, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12,
          fontFamily: UI, fontWeight: 700, fontSize: 30, color: '#FFFFFF', textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          opacity: interpolate(f, [16, 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        <IgIcon />
        <span>@confuse__coder.dev</span>
        <span style={{opacity: 0.8, fontWeight: 500}}>• Pitah Se Hai Naam Tera (Boss)</span>
      </div>

      {/* bottom: CTA chip on the keyboard, just under the screen */}
      <div
        style={{
          position: 'absolute', left: 0, width: 1080, top: 1585 + bob, display: 'flex', justifyContent: 'center',
          transform: `scale(${chip})`, opacity: Math.min(1, chip * 1.4),
        }}
      >
        <div
          style={{
            padding: '14px 34px', borderRadius: 999, background: 'rgba(20,12,8,0.82)', border: '2px solid rgba(255,190,90,0.7)',
            fontFamily: UI, fontWeight: 800, fontSize: 46, color: '#FFFFFF', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', gap: 14, alignItems: 'center',
          }}
        >
          <span>👇</span>
          <span>Comment</span>
          <span style={{color: '#FFB935'}}>SKILL</span>
        </div>
      </div>

      <Audio src={staticFile('song.mp3')} volume={(fr) => interpolate(fr, [0, 6, durationInFrames - 20, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
    </AbsoluteFill>
  );
};
