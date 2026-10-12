import { AbsoluteFill, random } from 'remotion';
import { pulse, Section } from '../data';
import { LEAF, LOOK, SUNSET } from '../theme';

const LEAF_PATH = 'M0,-26 C10,-20 18,-8 16,4 C14,14 6,22 0,28 C-6,22 -14,14 -16,4 C-18,-8 -10,-20 0,-26 Z';
const HEART_PATH = 'M0,9 C-16,-3 -12,-17 0,-9 C12,-17 16,-3 0,9 Z';
const MAX = 64;

// Every leaf has a fixed seed and loops down the screen; sections show more or fewer of them.
export const Leaves: React.FC<{ t: number; section: Section }> = ({ t, section }) => {
  const count = LOOK[section.kind].leaves;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        {Array.from({ length: MAX }).map((_, i) => {
          const r = (k: string) => random(`leaf-${i}-${k}`);
          const visible = i < count;
          const speed = 70 + r('v') * 110;
          const size = 0.7 + r('s') * 1.4;
          const span = 1080 + 160;
          const y = ((r('y') * span + t * speed) % span) - 80;
          const x = r('x') * 1920 + Math.sin(t * (0.6 + r('f')) + r('p') * 6) * (40 + 60 * r('a'));
          const rot = r('r') * 360 + t * (r('d') > 0.5 ? 1 : -1) * (30 + 70 * r('w'));
          const flip = Math.cos(t * (1 + r('k') * 2) + i);
          return (
            <g
              key={i}
              opacity={visible ? 0.55 + 0.4 * r('o') : 0}
              transform={`translate(${x} ${y}) rotate(${rot}) scale(${size * flip} ${size})`}
            >
              <path d={LEAF_PATH} fill={LEAF[i % LEAF.length]} />
              <path d="M0,-22 L0,34" stroke="rgba(60,10,0,0.45)" strokeWidth={1.6} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Hearts rise from the bottom in chorus sections; a bass hit gives them a squash-and-stretch pop.
export const Hearts: React.FC<{ t: number; section: Section }> = ({ t, section }) => {
  if (!LOOK[section.kind].hearts) return null;
  const p = pulse(t);
  const local = t - section.start;
  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: 'absolute' }}>
        {Array.from({ length: section.kind === 'final' ? 30 : 18 }).map((_, i) => {
          const r = (k: string) => random(`heart-${i}-${k}`);
          const speed = 90 + r('v') * 120;
          const born = r('b') * 6;
          if (local < born) return null;
          const span = 1300;
          const y = 1140 - (((local - born) * speed + r('y') * span) % span);
          const x = r('x') * 1920 + Math.sin(local * 1.4 + i) * 30;
          const s = (1.2 + r('s') * 2.2) * (1 + 0.25 * p);
          return (
            <path
              key={i}
              d={HEART_PATH}
              fill={SUNSET[[0, 1, 4, 6, 3][i % 5]]}
              opacity={0.85}
              transform={`translate(${x} ${y}) rotate(${(r('r') - 0.5) * 40}) scale(${s})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
