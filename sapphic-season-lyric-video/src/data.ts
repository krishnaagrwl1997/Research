// Lyric timing (from audio/align.py) and the loudness envelope (from audio/energy.py).
import lyricsJson from './lyrics.json';
import energyJson from './energy.json';

export type Word = { w: string; s: number; e: number };
export type Line = { section: string; text: string; words: Word[]; start: number; end: number };
export type Kind = 'intro' | 'verse' | 'pre' | 'chorus' | 'post' | 'bridge' | 'final' | 'outro';
export type Section = { name: string; kind: Kind; start: number; end: number; lines: number[] };

export const FPS = 30;
export const DURATION: number = lyricsJson.duration;
export const LINES: Line[] = lyricsJson.lines;

const kindOf = (name: string): Kind => {
  const n = name.toLowerCase();
  if (n.startsWith('intro')) return 'intro';
  if (n.startsWith('outro')) return 'outro';
  if (n.startsWith('pre')) return 'pre';
  if (n.startsWith('post')) return 'post';
  if (n.startsWith('final')) return 'final';
  if (n.startsWith('chorus')) return 'chorus';
  if (n.startsWith('bridge')) return 'bridge';
  return 'verse';
};

// Sections switch a little before their first sung word so the new look lands with the downbeat.
export const SECTIONS: Section[] = [];
LINES.forEach((l, i) => {
  const last = SECTIONS[SECTIONS.length - 1];
  if (last && last.name === l.section) last.lines.push(i);
  else SECTIONS.push({ name: l.section, kind: kindOf(l.section), start: i === 0 ? 0 : Math.max(LINES[i - 1].end, l.start - 0.7), end: DURATION, lines: [i] });
});
SECTIONS.forEach((s, i) => { if (SECTIONS[i + 1]) s.end = SECTIONS[i + 1].start; });

export const sectionAt = (t: number) => SECTIONS.find((s) => t >= s.start && t < s.end) ?? SECTIONS[SECTIONS.length - 1];

const full: number[] = energyJson.full;
const kick: number[] = energyJson.kick;
const at = (a: number[], t: number) => a[Math.max(0, Math.min(a.length - 1, Math.floor(t * FPS)))] ?? 0;
export const loudness = (t: number) => at(full, t);
// Decaying kick: the largest recent hit, fading over ~0.25s, so pulses read as bounces rather than flicker.
export const pulse = (t: number) => {
  let p = 0;
  for (let k = 0; k < 8; k++) p = Math.max(p, at(kick, t - k / FPS) * Math.pow(0.72, k));
  return p;
};

// Words wrapped in (...) are backing-vocal ad-libs and get their own style.
export const adlibFlags = (words: Word[]) => {
  let depth = 0;
  return words.map(({ w }) => {
    if (w.startsWith('(')) depth++;
    const inside = depth > 0;
    if (w.endsWith(')') || w.endsWith(').') || w.endsWith(')!')) depth = Math.max(0, depth - 1);
    return inside;
  });
};
