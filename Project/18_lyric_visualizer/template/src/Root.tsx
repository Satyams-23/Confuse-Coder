import React from 'react';
import {Composition} from 'remotion';
import {LyricVideo} from './Video';
import {project} from './lib/data';

export const Root: React.FC = () => (
  <Composition
    id="lyric-video"
    component={LyricVideo}
    fps={project.fps}
    width={project.width}
    height={project.height}
    durationInFrames={Math.max(1, Math.round(project.durationInSeconds * project.fps))}
  />
);
