// Cut list for the film-style version: hard cuts on lyric lines, paced by section,
// with a few scenes picked from what the line is about (coffee, texting, leaves).
import { DURATION, LINES, SECTIONS } from '../data';

export type Scene = 'up' | 'walk' | 'skyline' | 'floor' | 'branches' | 'figures' | 'cafe' | 'phone' | 'gelRed' | 'gelBlue' | 'haze';
export type Shot = { scene: Scene; start: number; end: number; seed: number };

const POOLS: Record<string, Scene[]> = {
  verse: ['walk', 'skyline', 'branches', 'figures', 'floor', 'up'],
  pre: ['branches', 'up', 'walk', 'gelBlue'],
  chorus: ['up', 'figures', 'walk', 'branches', 'skyline', 'floor', 'figures', 'up'],
  post: ['gelRed', 'gelBlue'],
  bridge: ['gelBlue', 'figures', 'branches', 'gelRed'],
};

const byWords = (text: string): Scene | null => {
  const t = text.toLowerCase();
  if (t.includes('coffee')) return 'cafe';
  if (/\b(phone|text|texts|texted|sent a heart)\b/.test(t)) return 'phone';
  if (t.includes('leaves fall')) return 'floor';
  return null;
};

const cuts: { t: number; scene: Scene }[] = [];
let n = 0;
for (const s of SECTIONS) {
  const kind = s.kind === 'final' ? 'chorus' : s.kind;
  if (s.kind === 'intro') {
    cuts.push({ t: 0, scene: 'gelRed' }, { t: LINES[s.lines[2]].start - 0.15, scene: 'phone' });
    continue;
  }
  if (s.kind === 'outro') {
    cuts.push({ t: s.start, scene: 'phone' }, { t: DURATION - 2.4, scene: 'haze' });
    continue;
  }
  const every = kind === 'chorus' || kind === 'post' ? 1 : 2;
  s.lines.forEach((li, k) => {
    if (k % every) return;
    const pool = POOLS[kind];
    const scene = byWords(LINES[li].text) ?? pool[n++ % pool.length];
    cuts.push({ t: k === 0 ? s.start : LINES[li].start - 0.15, scene });
  });
}

// Never cut to the same scene twice in a row.
for (let i = 1; i < cuts.length; i++) {
  if (cuts[i].scene === cuts[i - 1].scene && cuts[i].scene !== 'phone') cuts[i].scene = cuts[i].scene === 'up' ? 'walk' : 'up';
}

export const SHOTS: Shot[] = cuts.map((c, i) => ({ scene: c.scene, start: c.t, end: cuts[i + 1]?.t ?? DURATION, seed: i }));
export const shotAt = (t: number) => SHOTS.find((s) => t >= s.start && t < s.end) ?? SHOTS[SHOTS.length - 1];
