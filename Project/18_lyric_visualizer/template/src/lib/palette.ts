// ONE palette for the whole video: cream paper, charcoal ink, one red accent.
export const C = {
  paper: '#F3EAD7',
  paperDeep: '#E6D8BC',
  ink: '#2A2724',
  inkSoft: 'rgba(42,39,36,0.55)',
  inkFaint: 'rgba(42,39,36,0.16)',
  red: '#C8352B',
  // night theme (dark stage + warm light). Glow is LIGHT, not a colour of objects.
  night: '#120E0B',
  nightInk: '#F1E6D0',
  nightSoft: 'rgba(241,230,208,0.6)',
  nightFaint: 'rgba(241,230,208,0.16)',
  glow: '#E9A84C',
} as const;

/** Per-scene theme: 'paper' = cream bg + charcoal ink; 'night' = dark bg + cream ink + warm spotlight. Red accent in both. */
export type Theme = 'paper' | 'night';
export const ink = (t: Theme) => (t === 'night' ? C.nightInk : C.ink);
export const inkSoft = (t: Theme) => (t === 'night' ? C.nightSoft : C.inkSoft);
export const inkFaint = (t: Theme) => (t === 'night' ? C.nightFaint : C.inkFaint);

export const W = 1080;
export const H = 1920;

// Instagram UI safe zone: no key text in the top 250px or bottom 380px.
export const SAFE = {top: 250, bottom: 380, side: 70} as const;
export const SAFE_BOX = {x: SAFE.side, y: SAFE.top, w: W - SAFE.side * 2, h: H - SAFE.top - SAFE.bottom};

export const FONT = {
  word: '"Mukta", "Noto Sans Devanagari", sans-serif',
  hand: '"Kalam", "Mukta", cursive',
  serif: '"Tiro Devanagari Hindi", "Noto Serif Devanagari", serif', // literary lines
  serifBold: '"Noto Serif Devanagari", "Tiro Devanagari Hindi", serif', // giant key words
};
