import React from 'react';
import { C, SCRIPT, SERIF } from './lib';

// Serif "Coke" with a script "Diet" tucked over its shoulder, set in stock fonts (not the real logo artwork).
// `size` is the font size of "Coke"; the lockup is roughly 2.3×size wide and 1.1×size tall.
export const Wordmark: React.FC<{
  size: number;
  coke?: string;
  diet?: string;
  paglu?: string | false;
  style?: React.CSSProperties;
}> = ({ size, coke = C.red, diet = C.ink, paglu = false, style }) => (
  <div style={{ position: 'relative', display: 'inline-block', lineHeight: 1, paddingTop: size * 0.3, ...style }}>
    <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, letterSpacing: -size * 0.035, color: coke, lineHeight: 0.9 }}>Coke</div>
    <div
      style={{
        position: 'absolute',
        right: -size * 0.02,
        top: size * 0.04,
        fontFamily: SCRIPT,
        fontSize: size * 0.5,
        color: diet,
        transform: 'rotate(-7deg)',
      }}
    >
      Diet
    </div>
    {paglu && (
      <div style={{ fontFamily: SCRIPT, fontSize: size * 0.5, color: paglu, marginTop: -size * 0.05, marginLeft: size * 0.1, transform: 'rotate(-7deg)' }}>
        Paglu
      </div>
    )}
  </div>
);

