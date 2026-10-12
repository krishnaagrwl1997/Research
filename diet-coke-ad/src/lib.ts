import { Easing, interpolate, random } from 'remotion';

// 150 BPM at 30fps: one beat is exactly 12 frames, one bar is 48.
export const FPS = 30;
export const BEAT = 12;
export const BAR = 48;
export const DURATION = 720; // 24s
export const W = 1920;
export const H = 1080;

export const C = {
  red: '#E8112D',
  deep: '#8E0716',
  silver: '#D9DDE2',
  steel: '#8A9099',
  ink: '#0A0A0B',
  white: '#FFFFFF',
  cyan: '#19E6FF',
  paper: '#EDEBE7',
  inkRed: '#B5121B',
  yellow: '#FFD21F',
  pink: '#F6A9C1',
  hot: '#D2153F',
  cola: '#2A0F06',
  amber: '#C2621F',
  foam: '#EAD9BF',
};

export const DISPLAY = 'Anton, Impact, sans-serif';
export const BODY = 'Inter, Helvetica, Arial, sans-serif';
export const SERIF = '"Playfair Display", Georgia, serif';
export const SCRIPT = 'Yellowtail, cursive';

// Scene boundaries (global frames). Each scene is a whole number of bars.
export const S = {
  drip: [0, 48],
  eyes: [48, 96],
  cola: [96, 192],
  pack: [192, 288],
  glam: [288, 384],
  marquee: [384, 480],
  strobe: [480, 576],
  clink: [576, 624],
  finale: [624, 720],
} as const;

// Big hits: drive camera shake and white flashes.
export const IMPACTS = [48, 96, 192, 288, 336, 384, 480, 624];

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const map = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = (t) => t,
) => interpolate(f, input, output, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing });

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);
export const easeInOut = Easing.bezier(0.83, 0, 0.17, 1);
export const backOut = Easing.back(2.2);

// 1 on the beat, decaying to 0 before the next one.
export const beatPulse = (f: number, decay = 3, every = BEAT) => Math.exp(-((((f % every) + every) % every) / decay));

// Seeded, frame-locked noise in [-1, 1].
export const jitter = (seed: string | number) => random(seed) * 2 - 1;

// Shake amplitude at a global frame: decaying kicks after every impact plus a small groove shake in the drop.
export const shakeAmp = (f: number) => {
  let a = 0;
  for (const i of IMPACTS) if (f >= i) a = Math.max(a, 46 * Math.exp(-(f - i) / 5));
  if (f >= 48 && f < 576) a = Math.max(a, 9 * beatPulse(f, 2.5));
  if (f >= 540 && f < 576) a = Math.max(a, map(f, [540, 576], [6, 30]));
  return a;
};
