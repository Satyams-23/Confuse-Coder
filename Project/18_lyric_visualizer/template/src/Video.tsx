import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig} from 'remotion';
import './lib/fonts';
import {buildTimeline, project} from './lib/data';
import {FilmGrain, FilterDefs, Vignette} from './lib/Texture';
import {Stage} from './lib/Stage';
import {resolveTheme, ThemeCtx} from './lib/theme';
import {OutPush, Transition, TransitionSpec} from './lib/Transition';
import {LINE_THEMES, SCENES, TRANSITIONS} from './scenes';
import {DefaultScene} from './scenes/DefaultScene';

export const LyricVideo: React.FC = () => {
  const {fps, durationInFrames} = useVideoConfig();
  const slots = useMemo(() => buildTimeline(fps, durationInFrames), [fps, durationInFrames]);
  const songTheme = resolveTheme(project.theme);
  return (
    <ThemeCtx.Provider value={songTheme}>
      <AbsoluteFill style={{background: songTheme.bg}}>
        <FilterDefs />
        <Stage />
        {slots.map((slot, i) => {
          const Scene = SCENES[i] ?? DefaultScene;
          const theme = resolveTheme(LINE_THEMES[i] ?? project.theme);
          const spec: TransitionSpec = i === 0 ? {kind: 'cut'} : TRANSITIONS[i] ?? {kind: 'wipe', dir: i % 2 ? 'right' : 'left'};
          return (
            <Sequence key={i} from={slot.from} durationInFrames={slot.dur} name={`L${i} ${slot.line.text.slice(0, 24)}`}>
              <ThemeCtx.Provider value={theme}>
                <Transition spec={spec}>
                  <OutPush dur={slot.dur} amount={i === slots.length - 1 ? 0 : 0.05}>
                    <Stage />
                    <Scene {...slot} />
                  </OutPush>
                </Transition>
              </ThemeCtx.Provider>
            </Sequence>
          );
        })}
        <FilmGrain />
        <Vignette />
        {project.audio ? <Audio src={staticFile(project.audio)} /> : null}
      </AbsoluteFill>
    </ThemeCtx.Provider>
  );
};
