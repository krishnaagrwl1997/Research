import React from 'react';
import { C, BODY } from './lib';
import { Wordmark } from './Wordmark';

// A silver can drawn with CSS. `spin` scrolls the label round the body (1 = one full turn),
// and a fixed shading layer on top sells the cylinder.
const Label: React.FC<{ w: number; h: number; L: number }> = ({ h, L }) => (
  <div
    style={{
      position: 'relative',
      width: L,
      height: h,
      flexShrink: 0,
      background: `linear-gradient(180deg, #f2f3f5 0%, #c4c9cf 45%, #eef0f2 70%, #b8bec5 100%)`,
      overflow: 'hidden',
    }}
  >
    <div style={{ position: 'absolute', left: 0, right: 0, top: h * 0.06, height: h * 0.012, background: C.red }} />
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: h * 0.06, height: h * 0.012, background: C.red }} />
    {/* wordmark runs up the can */}
    <div
      style={{
        position: 'absolute',
        left: L * 0.27 - h * 0.45,
        top: h / 2 - L * 0.2,
        width: h * 0.9,
        height: L * 0.4,
        transform: 'rotate(-90deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Wordmark size={L * 0.24} />
    </div>
    <div
      style={{
        position: 'absolute',
        left: L * 0.62,
        top: 0,
        height: h,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          fontFamily: BODY,
          fontWeight: 800,
          fontSize: h * 0.04,
          color: C.red,
          letterSpacing: h * 0.004,
          whiteSpace: 'nowrap',
        }}
      >
        NO SUGAR · NO CALORIES
      </div>
    </div>
  </div>
);

export const Can: React.FC<{ h: number; spin?: number; style?: React.CSSProperties }> = ({ h, spin = 0, style }) => {
  const w = h * 0.42;
  const top = h * 0.05;
  const bodyH = h - top;
  const L = w * 2.4;
  const off = -((((spin % 1) + 1) % 1) * L);
  const rad = `${w * 0.1}px ${w * 0.1}px ${w * 0.16}px ${w * 0.16}px / ${w * 0.08}px ${w * 0.08}px ${w * 0.1}px ${w * 0.1}px`;
  return (
    <div style={{ position: 'relative', width: w, height: h, ...style }}>
      <div style={{ position: 'absolute', top, left: 0, width: w, height: bodyH, borderRadius: rad, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: off, top: 0, display: 'flex' }}>
          <Label w={w} h={bodyH} L={L} />
          <Label w={w} h={bodyH} L={L} />
        </div>
        {/* shoulder + base metal */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: bodyH * 0.07,
            background: 'linear-gradient(180deg, #9aa1a9, #e8ebee 60%, #b9bfc6)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: bodyH * 0.06,
            background: 'linear-gradient(180deg, #b9bfc6, #f3f4f6 40%, #6d737a)',
          }}
        />
        {/* cylinder shading */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(90deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.12) 14%, rgba(255,255,255,.65) 27%, rgba(255,255,255,0) 40%, rgba(0,0,0,0) 62%, rgba(0,0,0,.22) 82%, rgba(0,0,0,.7) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: w * 0.84,
            width: w * 0.05,
            background: 'rgba(255,255,255,.28)',
            filter: `blur(${w * 0.02}px)`,
          }}
        />
      </div>
      {/* lid */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: w * 0.07,
          width: w * 0.86,
          height: top * 2,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at 40% 40%, #f6f7f8, #a9b0b8 60%, #6b7178)',
          border: `${Math.max(1, w * 0.012)}px solid #c9ced4`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '36%',
            top: '22%',
            width: '30%',
            height: '50%',
            borderRadius: '40%',
            border: `${Math.max(1, w * 0.012)}px solid #7d848b`,
            background: 'linear-gradient(90deg, #cfd4d9, #eef0f2)',
          }}
        />
      </div>
    </div>
  );
};
