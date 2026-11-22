import type React from 'react';
import type {SceneSlot} from '../lib/data';
import type {TransitionSpec} from '../lib/Transition';
import {CoinScene} from './demo/CoinScene';
import {ClockScene, CLOCK_ENTRY} from './demo/ClockScene';

// line index -> scene component. Lines without an entry use DefaultScene.
export const SCENES: Record<number, React.FC<SceneSlot>> = {
  0: CoinScene,
  1: ClockScene,
};

// line index -> theme for that line (default: project.json 'theme'), e.g. {3: 'nightGold'}
export const LINE_THEMES: Record<number, string> = {};

// line index -> how that line's scene ENTERS (over the previous one). Default: alternating wipes.
export const TRANSITIONS: Record<number, TransitionSpec> = {
  1: CLOCK_ENTRY, // match-cut: the coin becomes the clock face
};
