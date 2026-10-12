import React from 'react';
import { BODY, C } from './lib';
import { Wordmark } from './Wordmark';

// Standard 12oz can proportions (width / height).
export const CAN_RATIO = 0.55;

// One wrap of the printed label: chrome silver, the big wordmark across the front, small red claims.
// L is the wrap length; the front of the can shows x ∈ [0, w].
const Label: React.FC<{ w: number; h: number; L: number }> = ({ w, h, L }) => (
  <div
    style={{
      position: 'relative',
      width: L,
      height: h,
      flexShrink: 0,
      background: 'linear-gradient(180deg, #f4f5f7 0%, #d4d8dd 18%, #f7f8f9 40%, #c9ced4 62%, #eceef1 80%, #b9bfc6 100%)',
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', left: w * 0.03, width: w * 0.94, top: h * 0.22, display: 'flex', justifyContent: 'center' }}>
      <Wordmark size={w * 0.335} coke={C.red} diet={C.ink} style={{ transform: 'rotate(-4deg)' }} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: w * 0.3,
        width: w * 0.62,
        top: h * 0.74,
        textAlign: 'right',
        fontFamily: BODY,
        fontWeight: 800,
        fontSize: w * 0.065,
        lineHeight: 1.1,
        letterSpacing: w * 0.004,
        color: C.red,
      }}
    >
      NO SUGAR
      <br />
      NO CALORIES
    </div>
    {/* back of the can: a second, smaller lockup so the spin never shows a blank side */}
    <div style={{ position: 'absolute', left: w * 1.25, width: w * 0.9, top: h * 0.3, display: 'flex', justifyContent: 'center', opacity: 0.95 }}>
      <Wordmark size={w * 0.3} coke={C.red} diet={C.ink} />
    </div>
    <div style={{ position: 'absolute', left: w * 1.4, top: h * 0.62, width: w * 0.6, display: 'flex', flexDirection: 'column', gap: h * 0.012 }}>
      {[1, 0.8, 0.9, 0.6, 0.85].map((k, i) => (
        <div key={i} style={{ height: h * 0.008, width: `${k * 100}%`, background: 'rgba(30,30,30,.45)' }} />
      ))}
    </div>
  </div>
);

export const Can: React.FC<{ h: number; spin?: number; style?: React.CSSProperties }> = ({ h, spin = 0, style }) => {
  const w = h * CAN_RATIO;
  const e = w * 0.1; // half-height of the lid ellipse
  const L = w * 2.6;
  const off = -((((spin % 1) + 1) % 1) * L);
  // silhouette: tapered neck at the top, rounded base at the bottom
  const body = `path('M ${w * 0.1} ${e} L ${w * 0.9} ${e} C ${w * 0.93} ${e + h * 0.03} ${w} ${h * 0.075} ${w} ${h * 0.11} L ${w} ${h * 0.94} C ${w} ${h * 0.975} ${w * 0.95} ${h * 0.99} ${w * 0.88} ${h * 0.995} Q ${w * 0.5} ${h * 1.01} ${w * 0.12} ${h * 0.995} C ${w * 0.05} ${h * 0.99} 0 ${h * 0.975} 0 ${h * 0.94} L 0 ${h * 0.11} C 0 ${h * 0.075} ${w * 0.07} ${e + h * 0.03} ${w * 0.1} ${e} Z')`;
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      <div style={{ position: 'absolute', inset: 0, clipPath: body, background: '#c9ced4' }}>
        <div style={{ position: 'absolute', left: off, top: 0, display: 'flex' }}>
          <Label w={w} h={h} L={L} />
          <Label w={w} h={h} L={L} />
        </div>
        {/* neck and base are bare aluminium */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.12, background: 'linear-gradient(180deg, #8d949c 0%, #e9ecef 45%, #f8f9fa 70%, #aeb4bb 100%)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.118, height: h * 0.006, background: 'rgba(0,0,0,.25)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.055, background: 'linear-gradient(180deg, #aeb4bb, #f4f5f7 35%, #7d848b 100%)' }} />
        {/* chrome shading: hard specular bands, dark edges */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'multiply',
            background:
              'linear-gradient(90deg, #4a4f55 0%, #9aa0a7 7%, #ffffff 16%, #ffffff 22%, #b5bbc2 30%, #e8ebee 44%, #ffffff 52%, #c2c7cd 64%, #8d939a 78%, #d9dde1 87%, #6a7077 95%, #3c4045 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            mixBlendMode: 'screen',
            background:
              'linear-gradient(90deg, rgba(255,255,255,0) 12%, rgba(255,255,255,.85) 18%, rgba(255,255,255,0) 24%, rgba(255,255,255,0) 84%, rgba(255,255,255,.55) 88%, rgba(255,255,255,0) 92%)',
          }}
        />
      </div>
      {/* lid: rim, recessed panel, pull tab */}
      <svg width={w} height={e * 2.4} viewBox={`0 0 ${w} ${e * 2.4}`} style={{ position: 'absolute', left: 0, top: -e * 0.1, overflow: 'visible' }}>
        <defs>
          <linearGradient id="lidRim" x1="0" x2="1">
            <stop offset="0" stopColor="#7d848b" />
            <stop offset="0.3" stopColor="#ffffff" />
            <stop offset="0.6" stopColor="#c9ced4" />
            <stop offset="1" stopColor="#6d737a" />
          </linearGradient>
          <linearGradient id="lidIn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#9aa1a8" />
            <stop offset="1" stopColor="#e6e9ec" />
          </linearGradient>
        </defs>
        <ellipse cx={w / 2} cy={e * 1.1} rx={w * 0.41} ry={e} fill="url(#lidRim)" />
        <ellipse cx={w / 2} cy={e * 1.17} rx={w * 0.36} ry={e * 0.8} fill="url(#lidIn)" />
        <ellipse cx={w / 2} cy={e * 1.17} rx={w * 0.36} ry={e * 0.8} fill="none" stroke="#7d848b" strokeWidth={Math.max(1, w * 0.008)} />
        {/* tab */}
        <rect x={w * 0.4} y={e * 0.7} width={w * 0.22} height={e * 0.75} rx={e * 0.35} fill="#d5d9de" stroke="#80878e" strokeWidth={Math.max(1, w * 0.007)} />
        <rect x={w * 0.455} y={e * 0.86} width={w * 0.11} height={e * 0.38} rx={e * 0.18} fill="#8d949b" />
        <circle cx={w * 0.43} cy={e * 1.08} r={e * 0.13} fill="#aab0b7" stroke="#7d848b" strokeWidth={Math.max(0.5, w * 0.004)} />
        <path d={`M ${w * 0.36} ${e * 1.45} Q ${w * 0.5} ${e * 1.75} ${w * 0.66} ${e * 1.45}`} fill="none" stroke="#8d949b" strokeWidth={Math.max(1, w * 0.006)} />
      </svg>
    </div>
  );
};
