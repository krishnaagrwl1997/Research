import {spring, interpolate, Easing} from 'remotion';

export const FPS = 30;
export const SIZE = 1080;
export const DURATION = 600; // 20s, 10 bars at 120 BPM (one beat = 15 frames)

export const C = {
	ink: '#141210',
	ink2: '#221F1B',
	ink3: '#35302A',
	cream: '#F4EEE3',
	paper: '#FFFBF4',
	coral: '#EE6A43',
	coralD: '#C94E2C',
	mint: '#8FE3BF',
	yellow: '#FFCF3F',
	red: '#FF4436',
	silver1: '#F2F2F0',
	silver2: '#B9BBBE',
	silver3: '#7E8186',
};

export const DISPLAY = '"Bricolage Grotesque", Inter, sans-serif';
export const UI = 'Inter, sans-serif';
export const MONO = '"JetBrains Mono", monospace';

// Scene cut points, all on the beat.
export const CUTS = {
	hook: 0,
	promise: 30,
	reveal: 90,
	meter: 165,
	alerts: 285,
	toolkit: 345,
	how: 435,
	cta: 510,
	end: 600,
};

export const sp = (
	frame: number,
	delay = 0,
	config: Partial<{damping: number; stiffness: number; mass: number}> = {},
) =>
	spring({
		frame: frame - delay,
		fps: FPS,
		config: {damping: 14, stiffness: 170, mass: 0.8, ...config},
	});

export const ease = Easing.bezier(0.7, 0, 0.2, 1);
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);

export const lerp = (
	frame: number,
	input: [number, number],
	output: [number, number],
	easing: (t: number) => number = outExpo,
) =>
	interpolate(frame, input, output, {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing,
	});
