import phrasesJson from '../../phrases.json';
import beatsJson from '../../beats.json';
import projectJson from '../../project.json';

export type Word = {w: string; s: number; e: number; key: boolean};
export type Phrase = {i: number; text: string; start: number; end: number; words: Word[]};
export type Project = {title: string; fps: number; width: number; height: number; durationInSeconds: number; audio: string | null; theme?: string | import('./theme').ThemeT};

export const project = projectJson as Project;
export const phrases = phrasesJson as Phrase[];
export const beats = beatsJson as {bpm: number; beats: number[]; downbeats: number[]; onsets: number[]};

/** Word with frames relative to the SCENE start. */
export type SceneWord = Word & {sf: number; ef: number};
export type SceneLine = Phrase & {sceneWords: SceneWord[]; lineFrom: number; lineTo: number};

export type SceneSlot = {
  index: number;
  line: SceneLine;
  from: number; // absolute frame the scene starts (its transition-in begins here)
  dur: number; // frames incl. the outgoing overlap
  beats: number[]; // beat frames relative to scene start
  downbeats: number[];
};

export const TRANSITION_FRAMES = 14; // overlap where the next scene transitions in over this one
const LEAD = 0.5; // seconds a scene may start before its first word

export const buildTimeline = (fps: number, totalFrames: number): SceneSlot[] => {
  const f = (s: number) => Math.round(s * fps);
  const bounds = phrases.map((p, i) => (i === 0 ? 0 : f(Math.max(phrases[i - 1].end, p.start - LEAD))));
  return phrases.map((p, i) => {
    const from = bounds[i];
    const to = i + 1 < phrases.length ? bounds[i + 1] + TRANSITION_FRAMES : totalFrames;
    const rel = (s: number) => f(s) - from;
    return {
      index: i,
      from,
      dur: Math.max(1, Math.min(totalFrames, to) - from),
      line: {
        ...p,
        lineFrom: rel(p.start),
        lineTo: rel(p.end),
        sceneWords: p.words.map((w) => ({...w, sf: rel(w.s), ef: rel(w.e)})),
      },
      beats: beats.beats.map(rel).filter((b) => b > -60 && b < to - from + 60),
      downbeats: beats.downbeats.map(rel).filter((b) => b > -60 && b < to - from + 60),
    };
  });
};
