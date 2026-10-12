import React from 'react';
import {Composition} from 'remotion';
import {DietClaude} from './Video';
import {DURATION, FPS, SIZE} from './theme';

export const RemotionRoot: React.FC = () => (
	<Composition
		id="DietClaude"
		component={DietClaude}
		durationInFrames={DURATION}
		fps={FPS}
		width={SIZE}
		height={SIZE}
	/>
);
