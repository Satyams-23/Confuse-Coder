/**
 * Theme = the song's palette + mood. Chosen per SONG from the lyrics (creative_direction.md), and a line may
 * switch to another theme of the same song (e.g. a paper verse, a night chorus). Rule: 2 neutrals (bg, ink) +
 * ONE accent for key words / the key object + an optional LIGHT colour (used only as light: glow, beams, dust).
 */
import {createContext, useContext} from 'react';

export type ThemeT = {
  name: string;
  mode: 'light' | 'dark';
  bg: string; // background
  bg2: string; // second tone (paper blotches / stage floor)
  ink: string; // lines + normal words
  accent: string; // key word + key object only
  light: string; // glow / beams / dust (dark themes) or warm paper light (light themes)
};

export const THEMES: Record<string, ThemeT> = {
  // warm ink sketch on paper: nostalgia, simple life, everyday words
  inkPaper: {name: 'inkPaper', mode: 'light', bg: '#F3EAD7', bg2: '#E6D8BC', ink: '#2A2724', accent: '#C8352B', light: '#FFF2D6'},
  // dark stage + warm spotlight: love, longing, night, devotion
  nightGold: {name: 'nightGold', mode: 'dark', bg: '#100C09', bg2: '#1F1712', ink: '#F2E7D2', accent: '#E0352B', light: '#EBA54A'},
  // cold blue night + amber accent: rain, separation, memories
  monsoon: {name: 'monsoon', mode: 'dark', bg: '#0A1216', bg2: '#13232A', ink: '#E2EDEF', accent: '#F0B34A', light: '#7EB9CC'},
  // plum dusk + coral: heartbreak, dreamy, filmy
  dusk: {name: 'dusk', mode: 'dark', bg: '#150C18', bg2: '#25142A', ink: '#F5E5EE', accent: '#FF5A6A', light: '#C58BFF'},
  // bright paper + ink blue: happy, school, friendship
  notebook: {name: 'notebook', mode: 'light', bg: '#F6F3EA', bg2: '#E4E9EE', ink: '#1F2A44', accent: '#E8452C', light: '#FFFFFF'},
};

/** rgba() from a hex colour. */
export const alpha = (hex: string, a: number) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
export const soft = (t: ThemeT) => alpha(t.ink, 0.6);
export const faint = (t: ThemeT) => alpha(t.ink, 0.16);

export const resolveTheme = (t: string | ThemeT | undefined | null): ThemeT =>
  !t ? THEMES.inkPaper : typeof t === 'string' ? THEMES[t] ?? THEMES.inkPaper : t;

export const ThemeCtx = createContext<ThemeT>(THEMES.inkPaper);
export const useTheme = () => useContext(ThemeCtx);
