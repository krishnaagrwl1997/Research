import { Easing, interpolate } from 'remotion';
import { SECTIONS } from '../data';
import { LOOK } from '../theme';

// Diagonal colour bands sweep across at every section change; the new look swaps in underneath at full cover.
export const Wipe: React.FC<{ t: number }> = ({ t }) => {
  const s = SECTIONS.find((x, i) => i > 0 && Math.abs(t - x.start) < 0.32);
  if (!s) return null;
  const p = interpolate(t, [s.start - 0.32, s.start + 0.32], [0, 1], { easing: Easing.inOut(Easing.cubic) });
  const [a, b, c] = LOOK[s.kind].bg;
  const colors = [c, LOOK[s.kind].accent, b, a, b, c];
  const left = -3300 + p * (3300 + 2200);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', top: -200, bottom: -200, left, display: 'flex', transform: 'skewX(-16deg)' }}>
        {colors.map((col, i) => (
          <div key={i} style={{ width: 540, height: '100%', background: col }} />
        ))}
      </div>
    </div>
  );
};
