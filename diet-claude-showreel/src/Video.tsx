import React from 'react';
import {AbsoluteFill, Audio, continueRender, delayRender, Sequence, staticFile} from 'remotion';
import '@fontsource/bricolage-grotesque/600.css';
import '@fontsource/bricolage-grotesque/800.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import {Grain, Reveal} from './components';
import {Alerts, Cta, Hook, HowTo, Meter, PromiseScene, Reveal3, Toolkit} from './scenes';
import {C, CUTS} from './theme';

const fontHandle = delayRender('Loading fonts');
Promise.all([
	document.fonts.load('800 100px "Bricolage Grotesque"'),
	document.fonts.load('600 100px "Bricolage Grotesque"'),
	document.fonts.load('400 20px "JetBrains Mono"'),
	document.fonts.load('700 20px "JetBrains Mono"'),
]).then(() => continueRender(fontHandle));

// Outgoing scenes linger under the incoming wipe.
const TAIL = 14;

type S = {from: number; to: number; el: React.ReactNode};

const scenes: S[] = [
	{from: CUTS.hook, to: CUTS.promise, el: <Hook />},
	{
		from: CUTS.promise,
		to: CUTS.reveal,
		el: (
			<Reveal type="circle" origin={[50, 72]} dur={9}>
				<PromiseScene />
			</Reveal>
		),
	},
	{
		from: CUTS.reveal,
		to: CUTS.meter,
		el: (
			<Reveal type="up" dur={10} edge={C.ink}>
				<Reveal3 />
			</Reveal>
		),
	},
	{
		from: CUTS.meter,
		to: CUTS.alerts,
		el: (
			<Reveal type="diag" dur={11} edge={C.coral}>
				<Meter />
			</Reveal>
		),
	},
	{
		from: CUTS.alerts,
		to: CUTS.toolkit,
		el: (
			<Reveal type="right" dur={10} edge={C.yellow}>
				<Alerts />
			</Reveal>
		),
	},
	{
		from: CUTS.toolkit,
		to: CUTS.how,
		el: (
			<Reveal type="circle" origin={[50, 50]} dur={10}>
				<Toolkit />
			</Reveal>
		),
	},
	{
		from: CUTS.how,
		to: CUTS.cta,
		el: (
			<Reveal type="up" dur={10} edge={C.paper}>
				<HowTo />
			</Reveal>
		),
	},
	{
		from: CUTS.cta,
		to: CUTS.end,
		el: (
			<Reveal type="circle" origin={[50, 45]} dur={10}>
				<Cta />
			</Reveal>
		),
	},
];

export const DietClaude: React.FC = () => (
	<AbsoluteFill style={{background: C.ink}}>
		{scenes.map((s, i) => (
			<Sequence
				key={i}
				from={s.from}
				durationInFrames={Math.min(s.to + TAIL, CUTS.end) - s.from}
				name={`scene-${i + 1}`}
			>
				{s.el}
			</Sequence>
		))}
		<Grain />
		<Audio src={staticFile('soundtrack.wav')} />
	</AbsoluteFill>
);
