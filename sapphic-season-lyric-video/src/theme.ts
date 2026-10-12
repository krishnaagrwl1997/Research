import { Kind } from './data';

// Sunset stripes (the orange-to-pink flag palette) carry the choruses; verses stay in October rust.
export const SUNSET = ['#D52D00', '#EF7627', '#FF9A56', '#FFF4EA', '#D162A4', '#B55690', '#A30262'];
export const LEAF = ['#E4572E', '#F3A712', '#A8201A', '#D1495B', '#FF9F1C', '#C2410C'];
export const CREAM = '#FFF4EA';

export const LOOK: Record<Kind, { bg: [string, string, string]; accent: string; leaves: number; hearts: boolean }> = {
  intro: { bg: ['#140A1F', '#2A1236', '#4A1B3C'], accent: '#FF9A56', leaves: 10, hearts: false },
  verse: { bg: ['#1F0A0E', '#5A1A14', '#9A3B12'], accent: '#FFB347', leaves: 34, hearts: false },
  pre: { bg: ['#2A0A22', '#7A1E3A', '#C2410C'], accent: '#FF9ACB', leaves: 30, hearts: false },
  chorus: { bg: ['#A30262', '#D52D00', '#EF7627'], accent: '#FFF4EA', leaves: 46, hearts: true },
  post: { bg: ['#B55690', '#D162A4', '#FF9A56'], accent: '#FFF4EA', leaves: 30, hearts: true },
  bridge: { bg: ['#16122B', '#2E2350', '#5B3B6E'], accent: '#FFC9E3', leaves: 12, hearts: false },
  final: { bg: ['#A30262', '#D52D00', '#EF7627'], accent: '#FFF4EA', leaves: 60, hearts: true },
  outro: { bg: ['#140A1F', '#2A1236', '#4A1B3C'], accent: '#FF9A56', leaves: 8, hearts: false },
};
